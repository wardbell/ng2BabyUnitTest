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
var heroDataService_1 = require('heroDataService');
var heroesComponent_1 = require('heroesComponent');
var user_1 = require('user');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'my-app',
            // Injectables needed by this component or its children
            bindings: [
                backend_1.Backend, heroDataService_1.HeroDataService,
                angular2_1.bind(user_1.User).toValue(new user_1.User('Ward'))
            ]
        }),
        angular2_1.View({
            template: '<heroes></heroes>',
            directives: [heroesComponent_1.HeroesComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
angular2_1.bootstrap(AppComponent);
//# sourceMappingURL=app.js.map