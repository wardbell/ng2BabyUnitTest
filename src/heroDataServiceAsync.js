var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var heroDataService_1 = require('heroDataService');
var backend_1 = require('backend');
var HeroDataServiceAsync = (function (_super) {
    __extends(HeroDataServiceAsync, _super);
    function HeroDataServiceAsync(_backend) {
        _super.call(this);
        this._backend = _backend;
        ///////////////////
        this._heroes = [];
    }
    Object.defineProperty(HeroDataServiceAsync.prototype, "serviceName", {
        get: function () { return 'async'; },
        enumerable: true,
        configurable: true
    });
    HeroDataServiceAsync.prototype.getAllHeroes = function (force) {
        if (force === void 0) { force = false; }
        this._fetchAllHeroesAsync(force);
        return this._heroes;
    };
    HeroDataServiceAsync.prototype.getHero = function (name) {
        var hero;
        if (this._heroes.fetching) {
            return hero;
        }
        if (this._heroes.fetched) {
            return this._getHeroInCache(name);
        }
        this._fetchAllHeroesAsync();
        return hero;
    };
    HeroDataServiceAsync.prototype._fetchAllHeroesAsync = function (force) {
        var _this = this;
        // quit if still fetching OR fetched already and not forcing new fetch
        if (this._heroes.fetching || (this._heroes.fetched && !force)) {
            return;
        }
        // clear heroes and initiate new fetch
        // stash fetch-promise in heroes.ready
        this._heroes.length = 0;
        this._heroes.fetching = true;
        this._heroes.fetched = false;
        this._heroes.ready = this._backend.fetchAllHeroesAsync()
            .then(function (heroes) {
            _this._heroes.fetching = false;
            _this._heroes.fetched = true;
            heroes.forEach(function (h) { return _this._heroes.push(h); });
            return _this._heroes;
        })
            .catch(function (err) {
            _this._heroes.fetching = false;
            _this._heroes.fetched = false;
            console.log("getAllHeroesAsync failed w/ message:\"" + err + "\"");
            return Promise.reject(err);
        });
    };
    HeroDataServiceAsync = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [backend_1.Backend])
    ], HeroDataServiceAsync);
    return HeroDataServiceAsync;
})(heroDataService_1.HeroDataService);
exports.HeroDataServiceAsync = HeroDataServiceAsync;
//# sourceMappingURL=heroDataServiceAsync.js.map