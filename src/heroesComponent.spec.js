///// Boiler Plate ////
var angular2_1 = require('angular2/angular2');
var test_1 = require('angular2/test');
var heroDataService_1 = require('heroDataService');
var mockHeroes_1 = require('mockHeroes');
var user_1 = require('user');
var heroesComponent_1 = require('heroesComponent');
var mockHeroData;
var mockHero;
var mockUser = new user_1.User('Johnny');
test_1.describe('HeroesComponent', function () {
    test_1.describe('(No DOM)', function () {
        var mockService; // too hard to maintain type safety on this mock
        test_1.beforeEach(function () {
            mockHeroData = mockHeroes_1.HEROES.slice();
            mockHero = mockHeroData[0];
            mockService = MockDataServiceFactory();
        });
        test_1.it('can be created', function () {
            var hc = new heroesComponent_1.HeroesComponent(mockService, mockUser);
            expect(hc instanceof heroesComponent_1.HeroesComponent).toEqual(true); // proof of life
        });
        test_1.it('has expected userName', function () {
            var hc = new heroesComponent_1.HeroesComponent(mockService, mockUser);
            expect(hc instanceof heroesComponent_1.HeroesComponent).toEqual(true); // proof of life
        });
        test_1.describe('#heroes', function () {
            test_1.it('lacks heroes when created', function () {
                var hc = new heroesComponent_1.HeroesComponent(mockService, mockUser);
                var heroes = hc.heroes; // trigger service
                expect(typeof heroes).toBe('undefined'); // not filled yet
            });
            test_1.it('has heroes after a while', test_1.inject([test_1.AsyncTestCompleter], function (async) {
                var done = async.done.bind(async);
                var hc = new heroesComponent_1.HeroesComponent(mockService, mockUser);
                var heroes = hc.heroes; // trigger service
                expect(typeof heroes).toBe('undefined'); // not filled yet
                // Wait for them ...
                mockService.getAllHeroesPromise(0)
                    .then(function () {
                    heroes = hc.heroes; // now the component has heroes to show
                    expect(heroes.length).toEqual(mockHeroData.length);
                })
                    .catch(fail).then(done, done);
            }));
        });
    });
    test_1.describe('(DOM)', function () {
        // Set up DI bindings required by component (and its nested components?)
        // else hangs silently forever
        test_1.beforeEachBindings(function () { return [
            angular2_1.bind(heroDataService_1.HeroDataService).toFactory(MockDataServiceFactory),
            angular2_1.bind(user_1.User).toValue(mockUser)
        ]; });
        test_1.it('can be created', injectIt(function (tcb, done) {
            var template = '<h1>Nuts</h1>';
            tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
                .createAsync(heroesComponent_1.HeroesComponent)
                .then(function (rootTC) { return expect(true).toBe(true); }) // proof of life
                .catch(fail).then(done, done);
        }));
        test_1.it('binds view to userName', injectIt(function (tcb, done) {
            var template = "<h1>{{userName}}'s Heroes</h1>";
            tcb.overrideTemplate(heroesComponent_1.HeroesComponent, template)
                .createAsync(heroesComponent_1.HeroesComponent)
                .then(function (rootTC) {
                var hc = rootTC.componentInstance;
                rootTC.detectChanges(); // trigger component property binding
                expectViewChildHtmlToMatch(rootTC, hc.userName);
            })
                .catch(fail).then(done, done);
        }));
    });
});
////// Helpers //////
function injectIt(testFn) {
    return test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function injectWrapper(tcb, async) {
        testFn(tcb, async.done.bind(async));
    });
}
function getViewChildHtml(rootTC, elIndex) {
    if (elIndex === void 0) { elIndex = 0; }
    var child = rootTC.componentViewChildren[elIndex];
    return child && child.nativeElement.innerHTML;
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
function MockDataServiceFactory() {
    // Mock the HeroDataService members we think will matter
    var mock = jasmine.createSpyObj('HeroDataService', ['getAllHeroes', 'getHero', 'removeHero']);
    mock.getAllHeroes.and.callFake(function (force) {
        return Promise.resolve(mockHeroData);
    });
    mock.getHero.and.callFake(function () {
        return Promise.resolve(mockHero);
    });
    mock.removeHero.and.callFake(function (hero) {
        var ix = mockHeroData.indexOf(hero);
        if (ix > -1) {
            mockHeroData.splice(ix, 1);
            return true;
        }
        else {
            return false;
        }
    });
    // make it easy to wait on a promise from any of these calls
    mock.getAllHeroesPromise = function (callNum) {
        if (callNum === void 0) { callNum = 0; }
        var call = mock.getAllHeroes.calls.all()[callNum];
        return call && call.returnValue;
    };
    mock.getHeroPromise = function (callNum) {
        if (callNum === void 0) { callNum = 0; }
        var call = mock.getHero.calls.all()[callNum];
        return call && call.returnValue;
    };
    return mock;
}
//# sourceMappingURL=heroesComponent.spec.js.map