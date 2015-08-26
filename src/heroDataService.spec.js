var heroDataService_1 = require('heroDataService');
// TODO: I don't think I need angular2/test when testing this service
//       because no real interaction w/ Angular.
//       The worry is about Promise/Timeout/Zone interaction.
var test_1 = require('angular2/test');
test_1.describe('heroDataService', function () {
    var num_heros;
    var service;
    var heroNullo = heroDataService_1.Hero.nullo;
    beforeAll(function () {
        num_heros = heroDataService_1.HeroDataService.reset();
    });
    beforeEach(function () {
        service = new heroDataService_1.HeroDataService();
    });
    afterEach(function () {
        heroDataService_1.HeroDataService.reset();
    });
    test_1.it('a created service has expected # of heros', test_1.inject([test_1.AsyncTestCompleter], function (async) {
        expect(service.getAllHeros().length).toEqual(num_heros);
        async.done();
    }));
    test_1.it('a cleared service has no heros', test_1.inject([test_1.AsyncTestCompleter], function (async) {
        heroDataService_1.HeroDataService.clear();
        expect(service.getAllHeros().length).toEqual(0);
        async.done();
    }));
    test_1.it('"Hero.nullo" is a nullo', function () {
        expect(heroNullo.isNullo).toEqual(true);
    });
    test_1.it('the nullo is not among the heros', test_1.inject([test_1.AsyncTestCompleter], function (async) {
        expect(service.getAllHeros()).not.toContain(heroNullo);
        async.done();
    }));
    test_1.describe('#getOrCreateHero', function () {
        beforeEach(function () {
            heroDataService_1.HeroDataService.clear(); // ensure none to start
        });
        test_1.it('adds a new hero when name is new', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero('Foo');
            expect(service.getAllHeros()[0]).toBe(hero);
            async.done();
        }));
        test_1.it('returns an existing hero when a hero with that name exists', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero('Foo');
            var hero2 = service.getOrCreateHero('Foo');
            expect(hero).toBe(hero2);
            async.done();
        }));
        test_1.it('returns the nullo when name parm is empty string', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero('');
            expect(hero).toBe(heroNullo);
            async.done();
        }));
        test_1.it('returns the nullo when name parm is null', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero(null);
            expect(hero).toBe(heroNullo);
            async.done();
        }));
        test_1.it('returns the nullo when name parm is undefined', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero();
            expect(service.getAllHeros()).not.toContain(hero);
            async.done();
        }));
        test_1.it('the nullo returned when name parm is undefined is not among heros', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var hero = service.getOrCreateHero();
            expect(hero).toBe(heroNullo);
            async.done();
        }));
    });
    test_1.it('a created service has expected # of heros (x-test pollution guard)', test_1.inject([test_1.AsyncTestCompleter], function (async) {
        expect(service.getAllHeros().length).toEqual(num_heros);
        async.done();
    }));
});
//# sourceMappingURL=heroDataService.spec.js.map