var hero_1 = require('hero');
var heroDataService_1 = require('heroDataService');
var mockHeroes_1 = require('mockHeroes');
describe('heroDataService', function () {
    var service;
    var mockBackend = {};
    var heroData;
    var testError = 'fetchAllHeroesAsync failed on purpose';
    var existingHero = mockHeroes_1.HEROES[0];
    var nonHeroName = 'Not ' + existingHero.name;
    beforeEach(function () {
        heroData = mockHeroes_1.HEROES.slice();
        mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
        service = new heroDataService_1.HeroDataService(mockBackend);
    });
    // fetchAllHeroes mock variations
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
    describe('#getAllHeroes', function () {
        it('returns expected # of heroes when ready', function (done) {
            service.getAllHeroes()
                .then(function (heroes) {
                expect(heroes.length).toEqual(heroData.length);
            })
                .catch(fail)
                .then(done, done);
        });
        it('returns no heroes when source data are empty', function (done) {
            heroData = []; // simulate no heroes from the backend
            service.getAllHeroes()
                .then(function (heroes) {
                expect(heroes.length).toEqual(0);
            })
                .catch(fail)
                .then(done, done);
        });
        it('fails with expected error when backend fails', function (done) {
            mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncFail;
            service.getAllHeroes()
                .then(function (_) { return fail('getAllHeroes should have failed'); })
                .catch(function (err) { return expect(err).toBe(testError); })
                .then(done, done);
        });
        it('re-execution preserves existing cache', function (done) {
            var cachedHeroes;
            service.getAllHeroes()
                .then(function (heroes) {
                cachedHeroes = heroes;
                cachedHeroes.push(new hero_1.Hero('Perseus'));
                return service.getAllHeroes();
            })
                .then(function (_) {
                expect(cachedHeroes.length).toEqual(heroData.length + 1);
            })
                .catch(fail)
                .then(done, done);
        });
        it('re-execution w/ force=true restores cache w/ original data', function (done) {
            var cachedHeroes;
            service.getAllHeroes()
                .then(function (heroes) {
                cachedHeroes = heroes;
                cachedHeroes.push(new hero_1.Hero('Hercules'));
                return service.getAllHeroes(true /*force*/)
                    .then(function (_) {
                    expect(heroes.length).toEqual(heroData.length);
                })
                    .catch(fail)
                    .then(done, done);
            });
        });
        describe('#getHero(name)', function () {
            it('returns an existing hero when a hero with that name exists', function (done) {
                service.getHero(existingHero.name).then(function (hero) { return expect(hero).toBe(existingHero); }).catch(fail).then(done, done);
                it('returns null if name not found', function (done) {
                    service.getHero(existingHero.name).then(function (hero) { return expect(hero).toEqual(null); }).catch(fail).then(done, done);
                });
                it('returns null when name is empty string', function (done) {
                    service.getHero('').then(function (hero) { return expect(hero).toEqual(null); }).catch(fail).then(done, done);
                });
                it('returns null  when name is null', function (done) {
                    service.getHero(null).then(function (hero) { return expect(hero).toEqual(null); }).catch(fail).then(done, done);
                });
                it('returns null when name is undefined', function (done) {
                    service.getHero().then(function (hero) { return expect(hero).toEqual(null); }).catch(fail).then(done, done);
                });
            });
            describe('#removeHero(hero)', function () {
                var cachedHeroes;
                // prime the HeroDataService's cache asynchronously
                beforeEach(function (done) {
                    service.getAllHeroes()
                        .then(function (heroes) { return cachedHeroes = heroes; })
                        .catch(fail).then(done, done);
                });
                // these tests can be synchronous because the method is synchronous
                it('returns "true" after removing an existing hero from the cache', function () {
                    expect(service.removeHero(existingHero)).toBe(true);
                });
                it('actually removed an existing hero from the cache', function () {
                    service.removeHero(existingHero);
                    expect(cachedHeroes).not.toContain(existingHero);
                });
            });
        });
    });
});
//# sourceMappingURL=heroDataService.spec.js.map