var hero_1 = require('hero');
var heroDataService_1 = require('heroDataService');
var mockHeros_1 = require('mockHeros');
describe('heroDataService', function () {
    var service;
    var heroNullo = hero_1.Hero.nullo;
    beforeEach(function () {
        service = new heroDataService_1.HeroDataService();
    });
    describe('#getAllHeros', function () {
        it('returns expected # of heros', function () {
            var heros = service.getAllHeros();
            expect(heros.length).toEqual(mockHeros_1.HEROS.length);
        });
        it('"Hero.nullo" is a nullo', function () {
            expect(heroNullo.isNullo).toEqual(true);
        });
        it('the nullo is not among the heros', function () {
            expect(service.getAllHeros()).not.toContain(heroNullo);
        });
    });
    describe('#getOrCreateHero', function () {
        it('adds a new hero when name is new', function () {
            var hero = service.getOrCreateHero('Foo');
            expect(service.getAllHeros()).toContain(hero);
        });
        it('returns an existing hero when a hero with that name exists', function () {
            var hero = service.getOrCreateHero('Foo');
            var hero2 = service.getOrCreateHero('Foo');
            expect(hero).toBe(hero2);
        });
        it('returns the nullo when name parm is empty string', function () {
            var hero = service.getOrCreateHero('');
            expect(hero).toBe(heroNullo);
        });
        it('returns the nullo when name parm is null', function () {
            var hero = service.getOrCreateHero(null);
            expect(hero).toBe(heroNullo);
        });
        it('returns the nullo when name parm is undefined', function () {
            var hero = service.getOrCreateHero();
            expect(service.getAllHeros()).not.toContain(hero);
        });
        it('the nullo returned when name parm is undefined is not among heros', function () {
            var hero = service.getOrCreateHero();
            expect(hero).toBe(heroNullo);
        });
    });
    it('#getAllHeros returns expected # of heros (x-test pollution guard)', function () {
        expect(service.getAllHeros().length).toEqual(mockHeros_1.HEROS.length);
    });
});
//# sourceMappingURL=heroDataService.spec.js.map