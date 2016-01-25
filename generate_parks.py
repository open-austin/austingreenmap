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
            fh.write(json.dumps(feature, sort_keys=True))


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
            fh.write(json.dumps(feature_collection, sort_keys=True))


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
            fh.write(json.dumps(feature_collection, sort_keys=True))


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
            fh.write(json.dumps(feature_collection, sort_keys=True))


def _center_for_geometry(cursor, geometry, crs):
    geometry['crs'] = crs
    cursor.execute('SELECT ST_AsGeoJSON(ST_Centroid(ST_Transform(ST_GeomFromGeoJson(%s), 4326)));', (json.dumps(geometry), ))
    center = json.loads(cursor.fetchone()[0])['coordinates']
    center = [center[1], center[0]]
    return center


def unshit_parks_topo(cursor):
    with open('./raw/city_of_austin_parks.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']

    for feature in data['features']:
        center = _center_for_geometry(cursor, feature['geometry'], crs)
        feature['properties']['center'] = center
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)
        feature['geometry'] = geometry

    with open('data/city_of_austin_parks.geojson', 'w+') as fh:
        fh.write(json.dumps(data, sort_keys=True))


def unshit_trails_topo(cursor):
    with open('./raw/pard_trails_nrpa.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    crs = data['crs']

    for feature in data['features']:
        geometry = less_shitty_geometry(cursor, feature['geometry'], crs)
        feature['geometry'] = geometry

    with open('data/pard_trails_nrpa.geojson', 'w+') as fh:
        fh.write(json.dumps(data, sort_keys=True))


def generate_facility_lookup():
    with open('./raw/pard_facility_points.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    lookup = defaultdict(set)

    for feature in data['features']:
        key = feature['properties']['FACILITY_TYPE']
        if key.strip():
            park_id = feature['properties']['PARK_ID']
            if not park_id:
                continue
            park_id = int(park_id)
            lookup[key].add(park_id)

    for k, v in lookup.items():
        lookup[k] = list(v)

    with open('data/facility_lookup_v2.json', 'w+') as fh:
        fh.write(json.dumps(lookup, sort_keys=True))


def generate_amenity_lookup():
    with open('./raw/pard_amenity_points.json', 'r') as fh:
        data = fh.read()
    data = json.loads(data)

    lookup = defaultdict(set)

    for feature in data['features']:
        key = feature['properties']['AMENITY_TYPE']
        if key.strip():
            park_id = feature['properties']['PARK_ID']
            if not park_id:
                continue
            park_id = int(park_id)
            lookup[key].add(park_id)

    for k, v in lookup.items():
        lookup[k] = list(v)

    with open('data/amenity_lookup_v2.json', 'w+') as fh:
        fh.write(json.dumps(lookup, sort_keys=True))


if __name__ == '__main__':
    # FIXME: really we only use this so we can transform the SRID/CRS from 2277 to 4326
    # Should get rid of the postgis dependency, I'm sure there is good standalone stuff
    conn = psycopg2.connect("dbname='bostongreenmap' user='django' host='localhost' password='django'")
    cursor = conn.cursor()

    # FIXME: Convert PARK_ID to number
    # FIXME: Convert "<Null>" to None

    # generate_park(cursor)
    # generate_amenity(cursor)
    # generate_facility(cursor)
    # generate_trails(cursor)
    #
    # unshit_parks_topo(cursor)
    # unshit_trails_topo(cursor)

    generate_facility_lookup()
    generate_amenity_lookup()

    cursor.close()
    conn.close()
