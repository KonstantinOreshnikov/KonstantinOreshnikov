# Map source provenance

The game's map image `physical_map.webp` is a crop and blend of the **bundled relief rasters in Basemap 2**:

* `mpl_toolkits/basemap_data/etopo1.jpg` — global topography and ocean bathymetry. Basemap's ETOPO source refers to NOAA/NGDC.
* `mpl_toolkits/basemap_data/shadedrelief.jpg` — shaded land elevation.

Both are global equirectangular maps. The crop uses longitude -99.5 to -56.5 and latitude 33.0 to 6.77, resized to 1800 × 1098 pixels. It is a non-navigational visualization.

Reference / attribution:
* NOAA ETOPO: https://www.ncei.noaa.gov/products/etopo-global-relief-model
* Basemap documentation: https://matplotlib.org/basemap/stable/api/basemap_api.html

The user's linked Dreamstime and Dergachev maps were used only as visual/geographic references, not copied into the game. No external network connection or map tiles are required to play.