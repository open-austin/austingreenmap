import _ajax from 'component-ajax';
import when from 'when';


export default function ajax(options) {
    var deferred = when.defer();

    options.json = 'true';

    options.success = (data, status, xhr) => deferred.resolve(data);
    options.error = (xhr, status, error) => deferred.reject(error);

    _ajax(options);

    return deferred.promise;
}
