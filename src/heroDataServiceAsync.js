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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var angular2_1 = require('angular2/angular2');
var hero_1 = require('hero');
var heroDataService_1 = require('heroDataService');
var backend_1 = require('backend');
var HeroDataServiceAsync = (function (_super) {
    __extends(HeroDataServiceAsync, _super);
    function HeroDataServiceAsync(_backend) {
        _super.call(this);
        this._backend = _backend;
        ///////////////////
        this._heros = [];
    }
    HeroDataServiceAsync.prototype.getAllHeros = function (force) {
        if (force === void 0) { force = false; }
        this._getAllHerosAsync(force);
        return this._heros;
    };
    HeroDataServiceAsync.prototype.getOrCreateHero = function (name) {
        var _this = this;
        var hero = hero_1.Hero.nullo;
        if (this._heros.fetched) {
            hero = this._getOrCreateHeroImpl(name);
        }
        else if (!this._heros.fetching) {
            this._getAllHerosAsync()
                .then(function (_) { return hero = _this._getOrCreateHeroImpl(name); });
        }
        return hero;
    };
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
        this._heros.fetching = true;
        this._heros.fetched = false;
        this._heros.length = 0;
        this._heros.ready = this._backend.fetchAllHerosAsync()
            .then(function (heros) {
            _this._heros.fetching = false;
            _this._heros.fetched = true;
            heros.forEach(function (h) { return _this._heros.push(h); });
            return _this._heros;
        })
            .catch(function (err) {
            _this._heros.fetching = false;
            _this._heros.fetched = false;
            _this._heros.ready = null;
            console.log("getAllHerosAsync failed w/ message:\"" + err + "\"");
            return Promise.reject(err);
        });
        return this._heros.ready;
    };
    HeroDataServiceAsync = __decorate([
        __param(0, angular2_1.Inject(backend_1.Backend)), 
        __metadata('design:paramtypes', [backend_1.Backend])
    ], HeroDataServiceAsync);
    return HeroDataServiceAsync;
})(heroDataService_1.HeroDataService);
exports.HeroDataServiceAsync = HeroDataServiceAsync;
//# sourceMappingURL=heroDataServiceAsync.js.map