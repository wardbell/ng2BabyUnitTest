var hero_1 = require('hero');
var heroDataServiceAsync_1 = require('heroDataServiceAsync');
var mockHeros_1 = require('mockHeros');
// TODO: I don't think I need angular2/test when testing this service
//       because no real interaction w/ Angular.
//       The worry is about Promise/Timeout/Zone interaction.
var test_1 = require('angular2/test');
test_1.describe('heroDataServiceAsync', function () {
    var service;
    var heroNullo = hero_1.Hero.nullo;
    var mockBackend = {};
    var heroData;
    var testError = 'fetchAllHerosAsync failed on purpose';
    function fetchAllHerosAsyncHappyPath() {
        return new Promise(function (resolve, reject) {
            resolve(heroData);
        });
    }
    function fetchAllHerosAsyncFail() {
        return new Promise(function (resolve, reject) {
            reject(testError);
        });
    }
    beforeEach(function () {
        heroData = mockHeros_1.HEROS.slice();
        mockBackend.fetchAllHerosAsync = fetchAllHerosAsyncHappyPath;
        service = new heroDataServiceAsync_1.HeroDataServiceAsync(mockBackend);
    });
    test_1.describe('#getAllHeros', function () {
        test_1.it('returns no heros before ready', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var heros = service.getAllHeros();
            expect(heros.length).toEqual(0);
            async.done();
        }));
        test_1.it('returns expected # of heros when ready', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var done = async.done.bind(async);
            var heros = service.getAllHeros();
            heros.ready
                .then(function (_) {
                expect(heros.length).toEqual(heroData.length);
            })
                .catch(fail)
                .then(done, done);
        }));
        test_1.it('returns no heros when source data are empty', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var done = async.done.bind(async);
            heroData = [];
            var heros = service.getAllHeros();
            heros.ready
                .then(function (_) {
                expect(heros.length).toEqual(0);
            })
                .catch(fail)
                .then(done, done);
        }));
        test_1.it('the nullo is not among the heros', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var done = async.done.bind(async);
            var heros = service.getAllHeros();
            heros.ready
                .then(function (_) {
                expect(heros).not.toContain(hero_1.Hero.nullo);
            })
                .catch(fail)
                .then(done, done);
        }));
        test_1.it('fails with expected error when backend fails', test_1.inject([test_1.AsyncTestCompleter], function (async) {
            var done = async.done.bind(async);
            mockBackend.fetchAllHerosAsync = fetchAllHerosAsyncFail;
            var heros = service.getAllHeros();
            heros.ready
                .then(function (_) { return fail('getAllHeros should have failed'); })
                .catch(function (err) { return expect(err).toBe(testError); })
                .then(done, done);
        }));
    });
    /*
        it('a cleared service has no heros', inject( [AsyncTestCompleter], (async:ATC) =>{
            HeroDataServiceAsync._clear();
            expect(service.getAllHeros().length).toEqual(0);
            async.done();
        }));
    
        it('"Hero.nullo" is a nullo', () =>{
            expect(heroNullo.isNullo).toEqual(true);
        });
    
        it('the nullo is not among the heros', inject( [AsyncTestCompleter], (async:ATC) =>{
            expect(service.getAllHeros()).not.toContain(heroNullo);
            async.done();
        }));
    
        describe('#getOrCreateHero', () => {
    
          beforeEach(()=>{
            HeroDataServiceAsync._clear(); // ensure none to start
          });
    
          it('adds a new hero when name is new', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero('Foo');
              expect(service.getAllHeros()[0]).toBe(hero);
              async.done();
          }));
    
          it('returns an existing hero when a hero with that name exists', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero('Foo');
              var hero2 = service.getOrCreateHero('Foo');
              expect(hero).toBe(hero2);
              async.done();
          }));
    
          it('returns the nullo when name parm is empty string', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero('');
              expect(hero).toBe(heroNullo);
              async.done();
          }));
    
          it('returns the nullo when name parm is null', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero(null);
              expect(hero).toBe(heroNullo);
              async.done();
          }));
    
          it('returns the nullo when name parm is undefined', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero();
              expect(service.getAllHeros()).not.toContain(hero);
              async.done();
          }));
    
          it('the nullo returned when name parm is undefined is not among heros', inject( [AsyncTestCompleter], (async:ATC) =>{
              var hero = service.getOrCreateHero();
              expect(hero).toBe(heroNullo);
              async.done();
          }))
        });
    
        it('a created service has expected # of heros (x-test pollution guard)', inject( [AsyncTestCompleter], (async:ATC) =>{
            expect(service.getAllHeros().length).toEqual(num_heros);
            async.done();
        }));
        */
});
//# sourceMappingURL=heroDataServiceAsync.spec.js.map