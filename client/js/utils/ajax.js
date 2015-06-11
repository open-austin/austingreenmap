import request from 'request';
import when from 'when';


// FIXME: replace with XMLHTTPRequest

export default function ajax(options) {
    var deferred = when.defer();

    options.baseUrl = location.href;
    options.json = true;

    request(options, function(err, res, body) {
        if (err || res.statusCode !== 200) {
            console.error(res.statusCode, err);
            return deferred.reject(new Error(err));
        }

        return deferred.resolve(body);
    });

    return deferred.promise;
}
