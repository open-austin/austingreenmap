import request from 'request';
import when from 'when';


export default function ajax(options) {
    var deferred = when.defer();

    options.baseUrl = location.origin || location.protocol + "//" + location.host;
    options.json = true;

    request(options, function(err, res, body) {
        if (err) {
            console.error(err);
            return deferred.reject(err);
        }

        return deferred.resolve(body);
    });

    return deferred.promise;
}
