import turf from 'turf';  // FIXME: replace with turf-extent
import when from 'when';
import memoize from 'lodash/memoize';


export function getUserLocation() {
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
}

export function boundsForFeature(geoJson) {
    var extent = turf.extent(geoJson);
    return [
        [extent[1], extent[0]],
        [extent[3], extent[2]],
    ];
}

export function setupiOSTouchState() {
    if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
        var elements = document.querySelectorAll('button');
        var emptyFunction = function() {};
        for(var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('touchstart', emptyFunction, false);
        }
    }
}

var _distanceBetweenCoordsCache = {};
export function distanceBetweenCoords(fromlatLng, toLatLng) {
    if (!fromlatLng || !toLatLng) { return 0; }

    var cacheKey = fromlatLng + ':' + toLatLng;
    if (_distanceBetweenCoordsCache[cacheKey]) {
        return _distanceBetweenCoordsCache[cacheKey];
    }

    var fromPoint = turf.point([fromlatLng[1], fromlatLng[0]]);
    var toPoint = turf.point([toLatLng[1], toLatLng[0]]);
    var distance = turf.distance(toPoint, fromPoint, 'miles');

    _distanceBetweenCoordsCache[cacheKey] = distance;
    return distance;
}

var _formatDistanceBetweenCoordsCache = {};
export function formatDistanceBetweenCoords(fromlatLng, toLatLng) {
    var cacheKey = fromlatLng + ':' + toLatLng;
    if (_formatDistanceBetweenCoordsCache[cacheKey]) {
        return _formatDistanceBetweenCoordsCache[cacheKey];
    }

    var distance = distanceBetweenCoords(fromlatLng, toLatLng);
    var result = (Math.round(distance * 100) / 100) + ' mi';

    _formatDistanceBetweenCoordsCache[cacheKey] = result;
    return result;
}
