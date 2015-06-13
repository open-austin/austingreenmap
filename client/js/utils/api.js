// FIXME: One day replace when with something like prfun, since we have ES6 Promise
import when from 'when';

import ajax from './ajax';

var _cache = {};

var api = {

    getAllParks() {
        var url = 'data/parks.json';

        if (_cache[url]) {
            return when.resolve(_cache[url]);
        }

        return ajax({url: url})
            .tap((body) => _cache[url] = body)
            .catch((err) => console.error(url, err));
    },

    getFeatureGeoJson(parkID, featureType) {
        var url = `data/${featureType}/park_${parkID}.geojson`;

        if (_cache[url]) {
            return when.resolve(_cache[url]);
        }

        return ajax({url: url, dataType: 'json'})
            .tap((body) => _cache[url] = body)
            .catch((err) => console.error(url, err));
    },

    getLookup(lookupType) {
        var url = `data/${lookupType}_lookup.json`;

        if (_cache[url]) {
            return when.resolve(_cache[url]);
        }

        return ajax({url: url, dataType: 'json'})
            .tap((body) => _cache[url] = body)
            .catch((err) => console.error(url, err));
    },

};

export default api;
