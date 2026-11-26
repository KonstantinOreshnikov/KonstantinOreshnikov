"""Build standalone local ZIPs. Optional real NASA PDS MOLA ingestion occurs only at build time."""
from pathlib import Path
import array, base64, hashlib, json, math, os, re, struct, sys, urllib.request, zipfile, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"packages"
OUT.mkdir(exist_ok=True)
SOURCE=ROOT/"play/MarsPrototype_v0.1.html"
BASE="https://pds-geosciences.wustl.edu/mgs/urn-nasa-pds-mgs_mola_topography_derived/meg004/"
STEM="megt90n000cb"
def sha(b): return hashlib.sha256(b).hexdigest()
def get(name):
    with urllib.request.urlopen(BASE+name,timeout=45) as f:
        b=f.read(8_000_001)
    if len(b)>8_000_000: raise ValueError("unexpected file size")
    return b
def local(tag): return tag.split("}")[-1]
def children(node,tag): return [e for e in node.iter() if local(e.tag)==tag]
def value(node,tag,default=None):
    x=children(node,tag)
    if not x:
        if default is not None:return default
        raise ValueError("missing "+tag)
    return x[0].text.strip()
def build_mola():
    label=get(STEM+".xml")
    root=ET.fromstring(label)
    areas=children(root,"File_Area_Observational")
    pairs=[(a,q) for a in areas for q in a if local(q.tag) in ("Array_2D_Image","Array_2D_Map","Array_2D")]
    if len(pairs)!=1: raise ValueError("unexpected image array layout")
    area,q=pairs[0]
    if value(area,"file_name").lower()!=STEM+".img":raise ValueError("unexpected source file")
    axes={value(x,"axis_name").lower(): (int(value(x,"elements")),int(value(x,"sequence_number"))) for x in children(q,"Axis_Array")}
    if axes!={"line":(720,1),"sample":(1440,2)}:raise ValueError(f"unexpected axes {axes}")
    if value(q,"axis_index_order")!="Last Index Fastest":raise ValueError("axis order")
    dtype=value(q,"data_type")
    if dtype!="SignedMSB2":raise ValueError("unexpected datatype "+dtype)
    offset=int(value(q,"offset","0"))
    scale=float(value(q,"scaling_factor","1"))
    bias=float(value(q,"value_offset","0"))
    unit=value(q,"unit","m").lower()
    if unit not in ("m","meter","meters","metre","metres") or scale!=1 or bias!=0:raise ValueError(f"unexpected elevation calibration {unit} {scale} {bias}")
    raw=get(STEM+".img")
    if offset!=0 or len(raw)!=1440*720*2:raise ValueError("unexpected binary size or offset")
    a=array.array("h");a.frombytes(raw)
    if sys.byteorder=="little":a.byteswap()
    if min(a)<-10000 or max(a)>25000 or min(a)>-5000 or max(a)<10000:raise ValueError(f"unexpected elevation range {min(a)} {max(a)}")
    # 4x4 cell mean from 4 pixels/degree to 1 pixel/degree; latitude cell area weighting.
    rows=[]
    for j in range(180):
        weights=[math.cos(math.radians(90-(4*j+k+.5)/4)) for k in range(4)]
        for i in range(360):
            rows.append(round(sum(weights[k]*sum(a[(4*j+k)*1440+4*i:(4*j+k)*1440+4*i+4]) for k in range(4))/(4*sum(weights))))
    if min(rows)>-5000 or max(rows)<10000:raise ValueError("derived range")
    # Orientation sanity checks against distinct observed regions, not a precise landmark altitude.
    def at(lat,lon):return rows[max(0,min(179,int(90-lat)))*360+int(lon)%360]
    if not at(-42,70)<at(18,226):raise ValueError("Hellas/Tharsis orientation check failed")
    grid=struct.pack("<"+"h"*len(rows),*rows)
    prov={"source":BASE+STEM+".img","label":BASE+STEM+".xml","bundle":"urn:nasa:pds:mgs_mola_topography_derived::1.0","credit":"NASA / Mars Global Surveyor MOLA Science Team / PDS Geosciences Node","data_source_sha256":sha(raw),"label_sha256":sha(label),"derived_sha256":sha(grid),"source_shape":[720,1440],"source_range_m":[min(a),max(a)],"derived_shape":[180,360],"derived_range_m":[min(rows),max(rows)],"method":"4x4 latitude-area-weighted mean, signed int16 little endian metres, north to south, east 0–360, cell centers","orientation_check":{"Hellas":at(-42,70),"Tharsis":at(18,226)}}
    (OUT/"MOLA_PROVENANCE.json").write_text(json.dumps(prov,indent=2),encoding="utf8")
    (OUT/"MOLA_SOURCE.xml").write_bytes(label)
    print(json.dumps(prov,indent=2))
    return grid,prov
def package(real):
    html=SOURCE.read_text(encoding="utf8")
    name="GenesisOfWorlds_v0.1_"+("MOLA" if real else "Offline")
    extra={}
    if real:
        grid,prov=build_mola()
        data=base64.b64encode(grid).decode("ascii")
        injection='const molaBytes=Uint8Array.from(atob("'+data+'"),c=>c.charCodeAt(0));const molaView=new DataView(molaBytes.buffer);installMola(Int16Array.from({length:64800},(_,i)=>molaView.getInt16(i*2,true)));'
        if html.count("/* GOW_MOLA_DATA */")!=1:raise ValueError("injection marker")
        html=html.replace("/* GOW_MOLA_DATA */",injection)
        extra={"MOLA_PROVENANCE.json":(OUT/"MOLA_PROVENANCE.json").read_bytes(),"MOLA_SOURCE.xml":(OUT/"MOLA_SOURCE.xml").read_bytes()}
    target=OUT/(name+".html")
    target.write_text(html,encoding="utf8")
    instructions=("Extract the ZIP, open GenesisOfWorlds.html in a modern browser. No server, registration, database or runtime Internet needed. Local browser storage may depend on file location and profile. Export JSON before moving or updating; import on the new copy. This is a development prototype, not a release. "+("MOLA measured terrain, fictional climate/sea-level." if real else "Procedural terrain; not MOLA.")+"\n")
    zip_path=OUT/(name+".zip")
    with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        z.writestr("GenesisOfWorlds.html",html.encode("utf8"))
        z.writestr("START_HERE.txt",instructions)
        for n,v in extra.items():z.writestr(n,v)
    digest=sha(zip_path.read_bytes())
    (OUT/(name+".zip.sha256")).write_text(digest+"  "+zip_path.name+"\n")
    print("PACKAGE",zip_path.name,"SHA256",digest,"HTML SHA256",sha(target.read_bytes()))
if __name__=="__main__": package("--mola" in sys.argv)
