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
var HeroesComponent = (function () {
    function HeroesComponent(_heroDataService) {
        this._heroDataService = _heroDataService;
    }
    Object.defineProperty(HeroesComponent.prototype, "currentHero", {
        get: function () {
            return this._currentHero ||
                (this._currentHero = this._heroDataService.getHero('Misko'));
        },
        set: function (value) {
            this._currentHero = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeroesComponent.prototype, "heroes", {
        get: function () {
            return this._heroDataService.getAllHeroes();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HeroesComponent.prototype, "serviceName", {
        get: function () { return this._heroDataService.serviceName; },
        enumerable: true,
        configurable: true
    });
    HeroesComponent.prototype.onHeroSelected = function (hero) {
        this.currentHero = hero;
        console.log("Hero selected: " + hero.name);
    };
    HeroesComponent = __decorate([
        angular2_1.Component({
            selector: 'heroes'
        }),
        angular2_1.View({
            template: "\n      <div id=\"output\">\n        <h1>Heroes ({{serviceName}})</h1>\n        <ul class=\"heroes\">\n          <li *ng-for=\"#h of heroes\" (click)=\"onHeroSelected(h)\">({{h.id}}) {{h.name}}</li>\n        </ul>\n        <div *ng-if=\"currentHero\">\n          <hr/>\n          <h2 >{{currentHero.name}} is my current hero!</h2>\n          <ul class=\"heroes\">\n            <li>id: {{currentHero.id}}</li>\n            <li>name: {{currentHero.name}}</li>\n          </ul>\n        </div>\n      </div>\n    ",
            directives: [angular2_1.NgFor, angular2_1.NgIf],
            styles: ['.heroes {list-style-type: none; margin-left: 1em; padding: 0}']
        }), 
        __metadata('design:paramtypes', [heroDataService_1.HeroDataService])
    ], HeroesComponent);
    return HeroesComponent;
})();
exports.HeroesComponent = HeroesComponent;
//# sourceMappingURL=heroesComponent.js.map