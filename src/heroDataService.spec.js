var heroDataService_1 = require('heroDataService');
describe('heroDataService', function () {
    var num_heros = heroDataService_1.HEROS.length;
    var service;
    var heroNullo = heroDataService_1.Hero.nullo;
    beforeEach(function () {
        service = new heroDataService_1.HeroDataService();
    });
    it('a created service has expected # of heros', function () {
        var heros = service.getAllHeros();
        expect(heros.length).toEqual(num_heros);
    });
    it('"Hero.nullo" is a nullo', function () {
        expect(heroNullo.isNullo).toEqual(true);
    });
    it('the nullo is not among the heros', function () {
        expect(service.getAllHeros()).not.toContain(heroNullo);
    });
    describe('#getOrCreateHero', function () {
        it('adds a new hero when name is new', function () {
            var hero = service.getOrCreateHero('Foo').hero;
            expect(service.getAllHeros()).toContain(hero);
        });
        it('returns an existing hero when a hero with that name exists', function () {
            var hero = service.getOrCreateHero('Foo').hero;
            var hero2 = service.getOrCreateHero('Foo').hero;
            expect(hero).toBe(hero2);
        });
        it('returns the nullo when name parm is empty string', function () {
            var hero = service.getOrCreateHero('').hero;
            expect(hero).toBe(heroNullo);
        });
        it('returns the nullo when name parm is null', function () {
            var hero = service.getOrCreateHero(null).hero;
            expect(hero).toBe(heroNullo);
        });
        it('returns the nullo when name parm is undefined', function () {
            var hero = service.getOrCreateHero().hero;
            expect(service.getAllHeros()).not.toContain(hero);
        });
        it('the nullo returned when name parm is undefined is not among heros', function () {
            var hero = service.getOrCreateHero().hero;
            expect(hero).toBe(heroNullo);
        });
    });
    it('a created service has expected # of heros (x-test pollution guard)', function () {
        expect(service.getAllHeros().length).toEqual(num_heros);
    });
});
//# sourceMappingURL=heroDataService.spec.js.map