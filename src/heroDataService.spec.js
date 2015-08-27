var heroDataService_1 = require('heroDataService');
var mockHeroes_1 = require('mockHeroes');
describe('heroDataService', function () {
    var service;
    beforeEach(function () {
        service = new heroDataService_1.HeroDataService();
    });
    describe('#getAllHeroes', function () {
        it('returns expected # of heroes', function () {
            var heroes = service.getAllHeroes();
            expect(heroes.length).toEqual(mockHeroes_1.HEROES.length);
        });
    });
    describe('#getHero(name)', function () {
        it('returns an existing hero when a hero with that name exists', function () {
            var hero = mockHeroes_1.HEROES[0];
            var hero2 = service.getHero(hero.name);
            expect(hero).toBe(hero2);
        });
        it('returns undefined if name not found', function () {
            var hero = service.getHero('Foo');
            expect(hero).not.toBeDefined;
        });
        it('returns undefined when name is empty string', function () {
            var hero = service.getHero('');
            expect(hero).not.toBeDefined;
        });
        it('returns undefined  when name is null', function () {
            var hero = service.getHero(null);
            expect(hero).toBe(null);
        });
        it('returns undefined when name is undefined', function () {
            var hero = service.getHero();
            expect(hero).not.toBeDefined;
        });
    });
    it('#getAllHeroes returns expected # of heroes (x-test pollution guard)', function () {
        expect(service.getAllHeroes().length).toEqual(mockHeroes_1.HEROES.length);
    });
});
//# sourceMappingURL=heroDataService.spec.js.map