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
        var _this = this;
        if (force === void 0) { force = false; }
        // (re)set the heroes array if not set or forced
        if (!this._heroes) {
            this._heroes = mockHeroes_1.HEROES.slice();
        }
        else if (force) {
            this._heroes.length = 0;
            mockHeroes_1.HEROES.map(function (h) { return _this._heroes.push(h); });
        }
        return this._heroes;
    };
    HeroDataService.prototype.getHero = function (name) {
        this.getAllHeroes(); // ensure we have heroes before we add one
        return this._getHeroInCache(name);
    };
    // get hero from cache or return null if not found
    HeroDataService.prototype._getHeroInCache = function (name) {
        if (!name) {
            return null;
        }
        var matches = this._heroes.filter(function (hero) { return hero.name === name; });
        return matches[0] || null;
    };
    return HeroDataService;
})();
exports.HeroDataService = HeroDataService;
//# sourceMappingURL=heroDataService.js.map