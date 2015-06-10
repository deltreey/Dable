exports.mixin = function (obj, mixins) {
    var keys = Object.keys(mixins);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        obj[key] = mixins[key];
    }
};

exports.bind = function (fn, thisArg) {
    return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return fn.apply(thisArg, args);
    };
};