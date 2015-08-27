var mockHeroes_1 = require('mockHeroes');
var HeroDataService = (function () {
    function HeroDataService() {
    }
    Object.defineProperty(HeroDataService.prototype, "serviceName", {
        get: function () { return 'sync'; },
        enumerable: true,
        configurable: true
    });
    HeroDataService.prototype.getAllHeroes = function (force) {
        if (force === void 0) { force = false; }
        // (re)set if not set or forced
        if (!this._heroes || force) {
            this._heroes = mockHeroes_1.HEROES.slice();
        }
        return this._heroes;
    };
    HeroDataService.prototype.getHero = function (name) {
        this.getAllHeroes(); // make sure we have heroes before we add one
        return this._getHeroInCache(name);
    };
    HeroDataService.prototype._getHeroInCache = function (name) {
        if (!name) {
            return null;
        }
        var matches = this._heroes.filter(function (hero) { return hero.name === name; });
        return matches[0];
    };
    return HeroDataService;
})();
exports.HeroDataService = HeroDataService;
//# sourceMappingURL=heroDataService.js.map