var Dable = require('./dable');

module.exports = function (tableOrId) {
    var d = new Dable();
    d.BuildAll(tableOrId);
    return d;
};