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
var user_1 = require('user');
var HeroesComponent = (function () {
    function HeroesComponent(_heroDataService, _user) {
        this._heroDataService = _heroDataService;
        this._user = _user;
    }
    Object.defineProperty(HeroesComponent.prototype, "heroes", {
        get: function () {
            if (!this._heroes) {
                this._getAllHeroes();
            }
            return this._heroes;
        },
        enumerable: true,
        configurable: true
    });
    HeroesComponent.prototype.heroSelected = function (hero) {
        this.currentHero = hero;
        console.log("Hero selected: " + hero.name);
    };
    HeroesComponent.prototype.removeHero = function (hero) {
        hero = hero || this.currentHero;
        var ix = this._heroes.indexOf(hero);
        this._heroDataService.removeHero(hero);
        this.currentHero = this._heroes[ix] || this._heroes[ix - 1];
    };
    HeroesComponent.prototype.refresh = function () {
        this._getAllHeroes(true /*force*/);
        console.log('refreshed heroes');
    };
    Object.defineProperty(HeroesComponent.prototype, "userName", {
        get: function () { return this._user.name || 'someone'; },
        enumerable: true,
        configurable: true
    });
    /////////////
    HeroesComponent.prototype._getAllHeroes = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        this._heroDataService.getAllHeroes(force).then(function (heroes) {
            _this._heroes = heroes;
            if (!_this.currentHero) {
                _this.currentHero = heroes[0];
            }
        });
    };
    HeroesComponent = __decorate([
        angular2_1.Component({
            selector: 'heroes'
        }),
        angular2_1.View({
            template: "\n      <div id=\"output\">\n        <h1>{{userName}}'s Heroes</h1>\n        <button (click)=\"refresh(h)\">refresh</button>\n        <ul class=\"heroes\">\n          <li *ng-for=\"#h of heroes\" (click)=\"heroSelected(h)\">\n            ({{h.id}}) {{h.name}}\n          </li>\n        </ul>\n        <div *ng-if=\"currentHero\">\n          <hr/>\n          <h2 >{{currentHero.name}} is {{userName}}'s current hero!</h2>\n          <button (click)=\"removeHero()\"\n                  [disabled]=\"!currentHero\">Remove</button>\n          <ul class=\"heroes\">\n            <li>id: {{currentHero.id}}</li>\n            <li>name: {{currentHero.name}}</li>\n          </ul>\n        </div>\n      </div>\n    ",
            directives: [angular2_1.NgFor, angular2_1.NgIf],
            styles: ['.heroes {list-style-type: none; margin-left: 1em; padding: 0}']
        }), 
        __metadata('design:paramtypes', [heroDataService_1.HeroDataService, user_1.User])
    ], HeroesComponent);
    return HeroesComponent;
})();
exports.HeroesComponent = HeroesComponent;
//# sourceMappingURL=heroesComponent.js.map