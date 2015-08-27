var angular2_1 = require('angular2/angular2');
var test_1 = require('angular2/test');
var heroDataService_1 = require('heroDataService');
var heroesComponent_1 = require('heroesComponent'); // cut = Component Under Test
function detectChangesAndCheck(rootTC, classes, elIndex) {
    if (elIndex === void 0) { elIndex = 0; }
    rootTC.detectChanges();
    test_1.expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}
function injectIt(testFn) {
    return test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function injectWrapper(tcb, async) {
        testFn(tcb, async.done.bind(async));
    });
}
angular2_1.bootstrap(null); // else `tcb.createAsync` bombs because `DOM` is undefined (a bug)
test_1.describe('HeroesComponent', function () {
    // Set up DI bindings required by component (and its nested components?)
    // else hangs silently forever
    test_1.beforeEachBindings(function () { return [heroDataService_1.HeroDataService]; });
    test_1.it('can instantiate component-under-test (cut)', injectIt(function (tcb, done) {
        var template = '<h1>Nuts</h1>';
        tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
            .createAsync(heroesComponent_1.HeroesComponent)
            .then(function (rootTC) {
            test_1.expect(true).toBe(true);
            done();
        });
    }));
    test_1.it('can trigger binding', injectIt(function (tcb, done) {
        var template = '<h1>Heroes</h1>';
        tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
            .createAsync(heroesComponent_1.HeroesComponent)
            .then(function (rootTC) {
            var cut = rootTC.componentInstance;
            rootTC.detectChanges();
            test_1.expect(true).toBe(true);
            done();
        });
    }));
});
//# sourceMappingURL=heroesComponent.spec.js.map