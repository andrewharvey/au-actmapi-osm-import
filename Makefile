download:
	mkdir -p data
	wget -O data/ACT_data.zip http://actmapi.act.gov.au/datadownload/Geodatabase/MGA94_55/ACT_data.zip
	unzip -d data/ data/ACT_data.zip

geojson:
	mkdir -p geojson
	ogr2ogr -f 'GeoJSON' -t_srs 'EPSG:4326' -select 'BUILDING_TYPE' -where 'BUILDING_TYPE IS NOT NULL' geojson/building_footprints.geojson data/ACT_data.gdb Building_Footprints

transform:
	mkdir -p geojson-osm
	./transform/actmapi_building_footprints < geojson/building_footprints.geojson > geojson-osm/building_footprints.geojson
	./remove-duplicate/remove-duplicate < geojson-osm/building_footprints.geojson > geojson-osm/building_footprints_no_duplicates.geojson

au/act/statewide.csv:
	wget https://s3.amazonaws.com/data.openaddresses.io/runs/487061/au/act/statewide.zip
	unzip statewide.zip

statewide.uniq.csv: au/act/statewide.csv
	head -1 $< | csvcut -c 1-9 > $@
	tail -n+2 $< | csvcut -c 1-9 | sort | uniq >> $@

statewide.osm: statewide.uniq.csv
	./node_modules/.bin/oa2osm --title-case 'STREET,CITY' $< $@
