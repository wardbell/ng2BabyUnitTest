var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var heroDataService_1 = require('heroDataService');
exports.Hero = heroDataService_1.Hero;
exports.HEROS = heroDataService_1.HEROS;
var HeroDataServiceAsync = (function (_super) {
    __extends(HeroDataServiceAsync, _super);
    function HeroDataServiceAsync() {
        _super.apply(this, arguments);
        this._heros = [];
        // Test support: can be replaced w/ mocks in tests
        this._getAllHerosAsyncImpl = function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(heroDataService_1.HEROS.slice());
                }, 500);
            });
        };
    }
    HeroDataServiceAsync.prototype.getAllHeros = function (force) {
        if (force === void 0) { force = false; }
        this._getAllHerosAsync();
        return this._heros;
    };
    HeroDataServiceAsync.prototype.getOrCreateHero = function (name) {
        var result = { haveHero: false, hero: heroDataService_1.Hero.nullo };
        this._getOrCreateHeroAsync(name)
            .then(function (h) { result.haveHero = true; result.hero = h; });
        return result;
    };
    // ASYNC IMPLEMENTATION
    HeroDataServiceAsync.prototype._getAllHerosAsync = function (force) {
        var _this = this;
        if (force) {
            this._heros.fetched = false;
            this._heros.ready = null;
        }
        // if already fetched (or not forcing fetch)
        // return existing heros via promise
        if (this._heros.fetched) {
            this._heros.ready = Promise.resolve(this._heros);
        }
        // if getAll in progress or completed (indicated by existence of promise)
        if (this._heros.ready) {
            return this._heros.ready;
        }
        // clear heros and initiate new fetch, returning its promise
        this._heros.fetched = false;
        this._heros.length = 0;
        this._heros.ready = this._getAllHerosAsyncImpl()
            .then(function (heros) {
            _this._heros.fetched = true;
            heros.forEach(function (h) { return _this._heros.push(h); });
            return _this._heros;
        })
            .catch(function (err) {
            _this._heros.fetched = true;
            console.log("getAllHerosAsync failed w/ message:\"" + err + "\"");
            return Promise.reject(err);
        });
        return this._heros.ready;
    };
    HeroDataServiceAsync.prototype._getOrCreateHeroAsync = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var hero;
            if (_this._heros.fetched) {
                hero = _this._getOrCreateHeroImpl(name);
                resolve(hero);
            }
            else {
                _this._getAllHerosAsync()
                    .then(function (heros) {
                    hero = _this._getOrCreateHeroImpl(name);
                    resolve(hero);
                })
                    .catch(function (err) {
                    console.log("getOrCreateHeroAsync failed w/ message:\"" + err + "\"");
                    resolve(heroDataService_1.Hero.nullo);
                });
            }
        });
    };
    return HeroDataServiceAsync;
})(heroDataService_1.HeroDataService);
exports.HeroDataServiceAsync = HeroDataServiceAsync;
//# sourceMappingURL=heroDataServiceAsync.js.map