import when from 'when';


var utils = {

    getUserLocation() {
        var deferred = when.defer();

        navigator.geolocation.getCurrentPosition(
            (position) => deferred.resolve([position.coords.latitude, position.coords.longitude]),
            (err) => deferred.reject(err),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return deferred.promise;
    }


};


export default utils;
