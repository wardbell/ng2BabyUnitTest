var mockHeroes_1 = require('mockHeroes');
var Backend = (function () {
    function Backend() {
    }
    Backend.prototype.fetchAllHeroesAsync = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(mockHeroes_1.HEROES.slice());
            }, 1000);
        });
    };
    return Backend;
})();
exports.Backend = Backend;
//# sourceMappingURL=backend.js.map