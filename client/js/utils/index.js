import turf from 'turf';  // FIXME: replace with turf-extent
import when from 'when';
import memoize from 'lodash.memoize';


var utils = {

    getUserLocation() {
        var deferred = when.defer();

        navigator.geolocation.getCurrentPosition(
            (position) => deferred.resolve([position.coords.latitude, position.coords.longitude]),
            (err) => deferred.reject(err),
            {
                enableHighAccuracy: true,
                timeout: 60000,
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

    setupiOSTouchState() {
        if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
            var elements = document.querySelectorAll('button');
            var emptyFunction = function() {};
            for(var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('touchstart', emptyFunction, false);
            }
        }
    },

    // FIXME: memoize
    distanceBetweenCoords(fromlatLng, toLatLng) {
        var fromPoint = turf.point([fromlatLng[1], fromlatLng[0]]);
        var toPoint = turf.point([toLatLng[1], toLatLng[0]]);

        var distance = turf.distance(toPoint, fromPoint, 'miles');

        return distance;
    }

};


export default utils;
