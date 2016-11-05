import Ajax from 'simple-ajax';
import when from 'when';


export default function ajax(options) {
    var deferred = when.defer();

    var _ajax = new Ajax(options);

    _ajax.on('success', function(event) {
        deferred.resolve(event.target.response);
    });

    _ajax.on('error', function(event) {
        deferred.reject(event.target.status);
    });

    return deferred.promise;
}
