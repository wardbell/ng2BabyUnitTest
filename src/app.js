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
var heroDataServiceAsync_1 = require('heroDataServiceAsync');
var goAsync = true;
var diBinding = goAsync ?
    angular2_1.bind(heroDataService_1.HeroDataService).toClass(heroDataServiceAsync_1.HeroDataServiceAsync) :
    heroDataService_1.HeroDataService;
var initialHeroName = goAsync ? 'Igor' : 'Misko';
var AppComponent = (function () {
    function AppComponent(_heroDataService) {
        this._heroDataService = _heroDataService;
        this._currentHeroHolder = { haveHero: false, hero: heroDataService_1.Hero.nullo };
    }
    Object.defineProperty(AppComponent.prototype, "currentHero", {
        get: function () {
            if (!this._currentHeroHolder.haveHero) {
                this._currentHeroHolder = this._heroDataService.getOrCreateHero(initialHeroName);
            }
            return this._currentHeroHolder.hero;
        },
        set: function (value) {
            this._currentHeroHolder = { haveHero: true, hero: value };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "heros", {
        get: function () {
            return this._heroDataService.getAllHeros();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "asyncLabel", {
        get: function () {
            return goAsync ? '(async)' : '(sync)';
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.onHeroSelected = function (hero) {
        this.currentHero = hero;
        console.log("Hero selected: " + hero.name);
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'my-app'
        }),
        angular2_1.View({
            template: "<div id=\"output\">\n      <h1>Heros {{asyncLabel}}</h1>\n        <ul class=\"heros\">\n          <li *ng-for=\"#h of heros\" (click)=\"onHeroSelected(h)\">({{h.id}}) {{h.name}}</li>\n        </ul>\n      <hr/>\n      <h2>{{currentHero.name}} is my current hero!</h2>\n        <ul>\n          <li>id: {{currentHero.id}}</li>\n          <li>name: {{currentHero.name}}</li>\n          <li>isNullo: {{currentHero.isNullo}}</li>\n        </ul>\n     </div>\n    ",
            directives: [angular2_1.NgFor],
            styles: ['.heros {list-style-type: none; margin-left: 1em; padding: 0}']
        }), 
        __metadata('design:paramtypes', [heroDataService_1.HeroDataService])
    ], AppComponent);
    return AppComponent;
})();
// bootstrap(AppComponent); // works if using component DI registration
// global DI registration ... either sync or async
angular2_1.bootstrap(AppComponent, [diBinding]);
//# sourceMappingURL=app.js.map