import json


with open('./raw/city_of_austin_parks.json', 'r') as fh:
    data = fh.read()
data = json.loads(data)

crs = data['crs']

for feature in data['features']:
    geometry = feature['geometry']
    geometry['crs'] = crs

    park_id = feature['properties']['PARK_ID']

    with open('data/park/park_{}.geojson'.format(park_id), 'w+') as fh:
        fh.write(json.dumps(feature))
