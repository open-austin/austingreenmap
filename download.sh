#!/usr/bin/env bash

# http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services

mkdir -p raw
mkdir -p data
mkdir -p data/park
mkdir -p data/amenity
mkdir -p data/facility
mkdir -p data/trail

city_of_austin_parks="http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/city_of_austin_parks/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token="
curl $city_of_austin_parks | jq '' - > raw/city_of_austin_parks.json

pard_amenity_points="https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/STRUCTURE_pard_amenity_points/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token="
curl $pard_amenity_points | jq '' - > raw/pard_amenity_points.json

pard_facility_points="https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/STRUCTURE_pard_facility_points/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token="
curl $pard_facility_points | jq '' - > raw/pard_facility_points.json

pard_trails_nrpa="http://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/pard_trails_nrpa/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&f=pgeojson&token="
curl $pard_trails_nrpa | jq '' - > raw/pard_trails_nrpa.json

python generate_parks.py

topojson --out data/city_of_austin_parks.topo.json -- data/city_of_austin_parks.geojson
