// FIXME: One day replace when with something like prfun, since we have ES6 Promise
import when from 'when';
import ajax from './ajax';
import cache from './cache';

const generateApiFn = (url) => () => {
    const data = cache.get(url);
    if (data) return when.resolve(data);

    return ajax({url: url, dataType: 'json'})
        .tap((body) => cache.set(url, body))
        .catch((err) => console.error(url, err));
}

const api = {
    getAllParks: generateApiFn('data/parks.json'),
    getFeatureGeoJson: (parkID, featureType) => generateApiFn(`data/${featureType}/park_${parkID}.geojson`)(),
    getLookup: (lookupType) => generateApiFn(`data/${lookupType}_lookup_v2.json`)(),
    getAllParksTopo: generateApiFn('data/city_of_austin_parks.topo.json'),
    getAllTrailsTopo: generateApiFn('data/pard_trails_nrpa.topo.json')
};

export default api;
