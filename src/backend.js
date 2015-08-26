var mockHeros_1 = require('mockHeros');
var Backend = (function () {
    function Backend() {
    }
    Backend.prototype.fetchAllHerosAsync = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(mockHeros_1.HEROS.slice());
            }, 500);
        });
    };
    return Backend;
})();
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map