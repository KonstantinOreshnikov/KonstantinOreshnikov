"""Reuse verified v0.1 MOLA ingestion; build separate v0.9 archive with pinned source."""
from pathlib import Path
import importlib.util,sys,hashlib
p=Path(__file__).with_name("package-offline.py")
spec=importlib.util.spec_from_file_location("base_package",p)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
m.SOURCE=m.ROOT/"play/GenesisOfWorlds_v0.9.html"
# The shared builder's v0.1 archive naming is retained in its own file; adapt only the name in isolated function.
src=p.read_text(encoding="utf8")
start=src.index("def package(real):")
end=src.index('if __name__=="__main__":',start)
exec(src[start:end].replace("GenesisOfWorlds_v0.1_","GenesisOfWorlds_v0.9_").replace("This is a development prototype, not a release.","This is a development candidate, not a release."),m.__dict__)
if "--mola" in sys.argv:
    original=m.build_mola
    def pinned_mola():
        grid,prov=original()
        if prov["data_source_sha256"]!="25f16fb7aaf857898dcf98bc4f841341a24f8b9f7e98453ca083bc45d897ca2c" or prov["derived_sha256"]!="ca5e873a2a283cb717e9433ef3e06b2b4ee211c22eabb522965f5e865ace0e52":
            raise ValueError("MOLA baseline integrity mismatch")
        return grid,prov
    m.build_mola=pinned_mola
m.package("--mola" in sys.argv)
