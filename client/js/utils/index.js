import turf from 'turf';  // FIXME: replace with turf-extent
import when from 'when';


var utils = {

    getUserLocation() {
        var deferred = when.defer();

        navigator.geolocation.getCurrentPosition(
            (position) => deferred.resolve([position.coords.latitude, position.coords.longitude]),
            (err) => deferred.reject(err),
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );

        return deferred.promise;
    },

    boundsForFeature(geoJson) {
        var extent = turf.extent(geoJson);
        return [
            [extent[1], extent[0]],
            [extent[3], extent[2]],
        ];
    },

};


export default utils;
