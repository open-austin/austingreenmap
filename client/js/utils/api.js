// FIXME: One day replace when with something like prfun, since we have ES6 Promise
import when from 'when';

import ajax from './ajax';

var _cache = {};

var api = {

    getAllParks() {
        var url = '/data/parks.json';

        if (_cache[url]) {
            return when.resolve(_cache[url]);
        }

        return ajax({uri: url})
            .tap((body) => _cache[url] = body);
    },

    getFeatureGeoJson(parkID, featureType) {
        var url = `/data/${featureType}/park_${parkID}.geojson`;

        if (_cache[url]) {
            return when.resolve(_cache[url]);
        }

        return ajax({uri: url})
            .tap((body) => _cache[url] = body);
    }
};

export default api;
