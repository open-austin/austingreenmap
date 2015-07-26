let _cache = {};

if (localStorage) {
    _cache = localStorage;
}

const cache = {
    get: (key) => _cache[key] ? JSON.parse(_cache[key]) : null,
    set: (key, val) => _cache[key] = JSON.stringify(val)
};

export default cache;
