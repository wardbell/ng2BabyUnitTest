var hero_1 = require('hero');
var heroDataServiceAsync_1 = require('heroDataServiceAsync');
var mockHeroes_1 = require('mockHeroes');
describe('heroDataServiceAsync', function () {
    var service;
    var mockBackend = {};
    var heroData;
    var testError = 'fetchAllHeroesAsync failed on purpose';
    beforeEach(function () {
        heroData = mockHeroes_1.HEROES.slice();
        mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
        service = new heroDataServiceAsync_1.HeroDataServiceAsync(mockBackend);
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
        it('re-execution preserves existing cache', function (done) {
            var heroes = service.getAllHeroes();
            heroes.ready
                .then(function (_) {
                heroes.push(new hero_1.Hero('Perseus'));
                return service.getAllHeroes().ready;
            })
                .then(function (_) {
                expect(heroes.length).toEqual(heroData.length + 1);
            })
                .catch(fail)
                .then(done, done);
        });
        it('re-execution w/ force=true restores cache', function (done) {
            var heroes = service.getAllHeroes();
            heroes.ready
                .then(function (_) {
                heroes.push(new hero_1.Hero('Hercules'));
                return service.getAllHeroes(true).ready; // re-execution with force
            })
                .then(function (_) {
                expect(heroes.length).toEqual(heroData.length);
            })
                .catch(fail)
                .then(done, done);
        });
    });
    describe('#getHero(name)', function () {
        var existingHero = mockHeroes_1.HEROES[0];
        var nonHeroName = 'Not ' + existingHero.name;
        describe('before cache is ready', function () {
            it('returns undefined', function (done) {
                var hero = service.getHero(existingHero.name);
                expect(hero).toEqual(undefined);
                done();
            });
        });
        describe('after cache is ready', function () {
            // make the cache ready before testing #getHero
            // async `beforeEach` enables sync `it` tests
            beforeEach(function (done) {
                service.getAllHeroes().ready
                    .catch(fail)
                    .then(done, done);
            });
            // same tests as for sync dataservice
            it('returns an existing hero when a hero with that name exists', function () {
                var hero = service.getHero(existingHero.name);
                expect(hero).toBe(existingHero);
            });
            it('returns null if name not found', function () {
                var hero = service.getHero('Foo');
                expect(hero).toEqual(null);
            });
            it('returns null when name is empty string', function () {
                var hero = service.getHero('');
                expect(hero).toEqual(null);
            });
            it('returns null  when name is null', function () {
                var hero = service.getHero(null);
                expect(hero).toEqual(null);
            });
            it('returns null when name is undefined', function () {
                var hero = service.getHero();
                expect(hero).toEqual(null);
            });
        });
    });
});
//# sourceMappingURL=heroDataServiceAsync.spec.js.map