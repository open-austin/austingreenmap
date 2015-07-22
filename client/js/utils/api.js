// FIXME: One day replace when with something like prfun, since we have ES6 Promise
import when from 'when';
import ajax from './ajax';
import cache from './cache';

var wrap = (url) => () => {
    const data = cache.get(url);
    if (data) return when.resolve(data);

    return ajax({url: url})
        .tap((body) => cache.set(url, body))
        .catch((err) => console.error(url, err));
}

var api = {
    getAllParks: wrap('data/parks.json'),
    getFeatureGeoJson: (parkID, featureType) => wrap(`data/${featureType}/park_${parkID}.geojson`)(),
    getLookup: (lookupType) => wrap(`data/${lookupType}_lookup.json`)(),
    getAllParksTopo: wrap('data/city_of_austin_parks.topo.json'),
    getAllTrailsTopo: wrap('data/pard_trails_nrpa.topo.json')
};

export default api;
