var test_1 = require('angular2/test');
// Recommended by Igor based on
// https://github.com/angular/angular/blob/master/test-main.js
// TODO: BrowserDomAdapter should be exposed through 'angular2/test' instead
var browser_adapter_1 = require('angular2/src/dom/browser_adapter');
browser_adapter_1.BrowserDomAdapter.makeCurrent(); // or else `tcb.createAsync` bombs because `DOM` is undefined
var heroDataService_1 = require('heroDataService');
var heroesComponent_1 = require('heroesComponent');
test_1.describe('HeroesComponent (w/ sync dataservice)', function () {
    // Set up DI bindings required by component (and its nested components?)
    // else hangs silently forever
    test_1.beforeEachBindings(function () { return [heroDataService_1.HeroDataService]; });
    test_1.it('can instantiate HeroesComponent', injectIt(function (tcb, done) {
        var template = '<h1>Nuts</h1>';
        tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
            .createAsync(heroesComponent_1.HeroesComponent)
            .then(function (rootTC) {
            expect(true).toBe(true);
            done();
        });
    }));
    test_1.it('binds view to serviceName', injectIt(function (tcb, done) {
        var template = '<h1>Heroes ({{serviceName}})</h1>';
        tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
            .createAsync(heroesComponent_1.HeroesComponent)
            .then(function (rootTC) {
            var hc = rootTC.componentInstance;
            rootTC.detectChanges(); // trigger component property binding
            expectViewChildHtmlToMatch(rootTC, hc.serviceName);
            done();
        });
    }));
});
function injectIt(testFn) {
    return test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function injectWrapper(tcb, async) {
        testFn(tcb, async.done.bind(async));
    });
}
function getViewChildHtml(rootTC, elIndex) {
    if (elIndex === void 0) { elIndex = 0; }
    return rootTC.componentViewChildren[elIndex].nativeElement.innerHTML;
}
function expectViewChildHtmlToMatch(rootTC, value, elIndex) {
    if (elIndex === void 0) { elIndex = 0; }
    var elHtml = getViewChildHtml(rootTC, elIndex);
    var rx = typeof value === 'string' ? new RegExp(value) : value;
    (rx.test(elHtml)) ? expect(true).toBeTruthy : fail("\"" + elHtml + "\" doesn't match " + rx);
}
// borrowed for instructional value from
// https://github.com/angular/angular/blob/master/modules/angular2/test/core/directives/ng_class_spec.ts
function detectChangesAndCheckClassName(rootTC, classes, elIndex) {
    if (elIndex === void 0) { elIndex = 0; }
    rootTC.detectChanges();
    expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}
//# sourceMappingURL=heroesComponent.spec.js.map