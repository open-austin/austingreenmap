// FIXME: One day replace when with something like prfun, since we have ES6 Promise
import when from 'when';
import ajax from './ajax';
import cache from './cache';

var generateApiFn = (url) => () => {
    const data = cache.get(url);
    if (data) return when.resolve(data);

    return ajax({url: url})
        .tap((body) => cache.set(url, body))
        .catch((err) => console.error(url, err));
}

var api = {
    getAllParks: generateApiFn('data/parks.json'),
    getFeatureGeoJson: (parkID, featureType) => generateApiFn(`data/${featureType}/park_${parkID}.geojson`)(),
    getLookup: (lookupType) => generateApiFn(`data/${lookupType}_lookup.json`)(),
    getAllParksTopo: generateApiFn('data/city_of_austin_parks.topo.json'),
    getAllTrailsTopo: generateApiFn('data/pard_trails_nrpa.topo.json')
};

export default api;
