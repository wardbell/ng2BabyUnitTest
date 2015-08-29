var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var backend_1 = require('backend');
var HeroDataService = (function () {
    function HeroDataService(_backend) {
        this._backend = _backend;
        this._heroes = []; // cache of heroes
    }
    Object.defineProperty(HeroDataService.prototype, "serviceName", {
        get: function () { return 'async'; },
        enumerable: true,
        configurable: true
    });
    HeroDataService.prototype.getAllHeroes = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // getAll if force==true OR this is the first time through
        force = force || !this._getAllHeroesPromise;
        if (!force) {
            return this._getAllHeroesPromise;
        }
        this._getAllHeroesPromise = this._backend.fetchAllHeroesAsync()
            .then(function (heroes) {
            _this._heroes.length = 0;
            heroes.forEach(function (h) { return _this._heroes.push(h); });
            return _this._heroes;
        })
            .catch(function (err) {
            console.log("getAllHeroes failed w/ message:\"" + err + "\"");
            return Promise.reject(err);
        });
        return this._getAllHeroesPromise;
    };
    // when cache is ready, return hero with that name or null if not found
    HeroDataService.prototype.getHero = function (name) {
        return this.getAllHeroes()
            .then(function (heroes) { return heroes.filter(function (h) { return h.name === name; })[0] || null; });
    };
    HeroDataService.prototype.removeHero = function (hero) {
        var ix = this._heroes.indexOf(hero);
        if (ix > -1) {
            this._heroes.splice(ix, 1);
            return true;
        }
        else {
            return false;
        }
    };
    HeroDataService = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [backend_1.Backend])
    ], HeroDataService);
    return HeroDataService;
})();
exports.HeroDataService = HeroDataService;
//# sourceMappingURL=heroDataService.js.map