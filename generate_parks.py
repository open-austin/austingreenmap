import json

import psycopg2


def less_shitty_geometry(cursor, geometry, crs):
    geometry['crs'] = crs
    cursor.execute('SELECT ST_AsGeoJSON(ST_Transform(ST_GeomFromGeoJson(%s), 4326));', (json.dumps(geometry), ))
    return cursor.fetchone()[0]


def main(cursor):
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


if __name__ == '__main__':
    conn = psycopg2.connect("dbname='bostongreenmap' user='django' host='localhost' password='django'")
    cursor = conn.cursor()

    main(cursor)

    cursor.close()
    conn.close()
