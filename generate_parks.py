import json
from collections import defaultdict

import psycopg2


def less_shitty_geometry(cursor, geometry, crs):
    geometry['crs'] = crs
    cursor.execute('SELECT ST_AsGeoJSON(ST_Transform(ST_GeomFromGeoJson(%s), 4326));', (json.dumps(geometry), ))
    return json.loads(cursor.fetchone()[0])


def generate_park(cursor):
    with open('./raw/city_of_austin_parks.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)

        park_id = feature['properties']['PARK_ID']
        feature['geometry'] = geometry

        with open('data/park/park_{}.geojson'.format(park_id), 'w+') as fh:
            fh.write(json.dumps(feature))


def generate_amenity(cursor):
    with open('./raw/pard_amenity_points.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']
    features_by_park = defaultdict(list)

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)
        feature['geometry'] = geometry
        park_id = feature['properties']['PARK_ID']

        features_by_park[park_id].append(feature)

    for park_id, features in features_by_park.items():
        feature_collection = {
            'type': 'FeatureCollection',
            'features': features
        }
        with open('data/amenity/park_{}.geojson'.format(park_id), 'w+') as fh:
            fh.write(json.dumps(feature_collection))


def generate_facility(cursor):
    with open('./raw/pard_facility_points.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']
    features_by_park = defaultdict(list)

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)
        feature['geometry'] = geometry
        park_id = feature['properties']['PARK_ID']

        features_by_park[park_id].append(feature)

    for park_id, features in features_by_park.items():
        feature_collection = {
            'type': 'FeatureCollection',
            'features': features
        }
        with open('data/facility/park_{}.geojson'.format(park_id), 'w+') as fh:
            fh.write(json.dumps(feature_collection))


def generate_trails(cursor):
    with open('./raw/pard_trails_nrpa.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']
    features_by_park = defaultdict(list)

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)
        feature['geometry'] = geometry
        park_id = feature['properties']['PARK_ID']

        features_by_park[park_id].append(feature)

    for park_id, features in features_by_park.items():
        feature_collection = {
            'type': 'FeatureCollection',
            'features': features
        }
        with open('data/trail/park_{}.geojson'.format(park_id), 'w+') as fh:
            fh.write(json.dumps(feature_collection))



def unshit_parks_topo(cursor):
    with open('./raw/city_of_austin_parks.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)

        park_id = feature['properties']['PARK_ID']
        feature['geometry'] = geometry

    with open('data/city_of_austin_parks.geojson'.format(park_id), 'w+') as fh:
        fh.write(json.dumps(data))


if __name__ == '__main__':
    # FIXME: really we only use this so we can transform the SRID/CRS from 2277 to 4326
    # Should get rid of the postgis dependency, I'm sure there is good standalone stuff
    conn = psycopg2.connect("dbname='bostongreenmap' user='django' host='localhost' password='django'")
    cursor = conn.cursor()

    # generate_park(cursor)
    # generate_amenity(cursor)
    # generate_facility(cursor)
    generate_trails(cursor)

    # unshit_parks_topo(cursor)

    cursor.close()
    conn.close()
