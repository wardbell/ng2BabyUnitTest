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
var initialHeroName = 'Igor';
var AppComponent = (function () {
    function AppComponent(_heroDataService) {
        this._heroDataService = _heroDataService;
    }
    Object.defineProperty(AppComponent.prototype, "currentHero", {
        get: function () {
            return this._currentHero || (this._currentHero = this._getOrCreateHero(initialHeroName));
        },
        set: function (value) {
            this._currentHero = value;
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
    AppComponent.prototype.onHeroSelected = function (hero) {
        this.currentHero = hero;
        console.log("Hero selected: " + hero.name);
    };
    AppComponent.prototype._getOrCreateHero = function (name) {
        return this._heroDataService.getOrCreateHero(name);
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'my-app'
        }),
        angular2_1.View({
            template: "<div id=\"output\">\n      <h1>Heros</h1>\n        <ul class=\"heros\">\n          <li *ng-for=\"#h of heros\" (click)=\"onHeroSelected(h)\">({{h.id}}) {{h.name}}</li>\n        </ul>\n      <hr/>\n      <h2>{{currentHero.name}} is my current hero!</h2>\n        <ul>\n          <li>id: {{currentHero.id}}</li>\n          <li>name: {{currentHero.name}}</li>\n          <li>isNullo: {{currentHero.isNullo}}</li>\n        </ul>\n     </div>\n    ",
            directives: [angular2_1.NgFor],
            styles: ['.heros {list-style-type: none; margin-left: 1em; padding: 0}']
        }), 
        __metadata('design:paramtypes', [heroDataService_1.HeroDataService])
    ], AppComponent);
    return AppComponent;
})();
// bootstrap(AppComponent); // works if using component DI registration
angular2_1.bootstrap(AppComponent, [heroDataService_1.HeroDataService]); // global DI registration
//# sourceMappingURL=app.js.map