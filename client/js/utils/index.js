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
        console.log('meow')
        if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
            console.log('meow')
            var elements = document.querySelectorAll('button');
            var emptyFunction = function() {};
            for(var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('touchstart', emptyFunction, false);
            }
        }
    }

};


export default utils;
