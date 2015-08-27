var heroDataServiceAsync_1 = require('heroDataServiceAsync');
var mockHeroes_1 = require('mockHeroes');
describe('heroDataServiceAsync', function () {
    var service;
    var mockBackend = {};
    var heroData;
    var testError = 'fetchAllHeroesAsync failed on purpose';
    function fetchAllHeroesAsyncHappyPath() {
        return new Promise(function (resolve, reject) {
            resolve(heroData);
        });
    }
    function fetchAllHeroesAsyncFail() {
        return new Promise(function (resolve, reject) {
            reject(testError);
        });
    }
    beforeEach(function () {
        heroData = mockHeroes_1.HEROES.slice();
        mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
        service = new heroDataServiceAsync_1.HeroDataServiceAsync(mockBackend);
    });
    describe('#getAllHeroes', function () {
        it('returns no heroes before ready', function (done) {
            var heroes = service.getAllHeroes();
            expect(heroes.length).toEqual(0);
            done();
        });
        it('returns expected # of heroes when ready', function (done) {
            var heroes = service.getAllHeroes();
            heroes.ready
                .then(function (_) {
                expect(heroes.length).toEqual(heroData.length);
            })
                .catch(fail)
                .then(done, done);
        });
        it('returns no heroes when source data are empty', function (done) {
            heroData = [];
            var heroes = service.getAllHeroes();
            heroes.ready
                .then(function (_) {
                expect(heroes.length).toEqual(0);
            })
                .catch(fail)
                .then(done, done);
        });
        it('fails with expected error when backend fails', function (done) {
            mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncFail;
            var heroes = service.getAllHeroes();
            heroes.ready
                .then(function (_) { return fail('getAllHeroes should have failed'); })
                .catch(function (err) { return expect(err).toBe(testError); })
                .then(done, done);
        });
    });
    /*
      // TODO: recast for async versions
      //       test also the fail case and that is null before ready
      describe('#getHero(name)', () => {
    
        it('returns an existing hero when a hero with that name exists', () =>{
            var hero = HEROES[0];
            var hero2 = service.getHero(hero.name);
            expect(hero).toBe(hero2);
        });
    
        it('returns undefined if name not found', () =>{
            var hero = service.getHero('Foo');
            expect(hero).not.toBeDefined;
        });
    
        it('returns undefined when name is empty string', () =>{
            var hero = service.getHero('');
            expect(hero).not.toBeDefined;
        });
    
        it('returns undefined  when name is null', () =>{
            var hero = service.getHero(null);
            expect(hero).toBe(null);
        });
    
        it('returns undefined when name is undefined', () =>{
            var hero = service.getHero();
            expect(hero).not.toBeDefined;
        });
        */
});
//# sourceMappingURL=heroDataServiceAsync.spec.js.map