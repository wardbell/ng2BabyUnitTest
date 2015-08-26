import {Hero} from 'hero';
import {HeroDataServiceAsync} from 'heroDataServiceAsync';
import {HEROS} from 'mockHeros';
import {Backend} from 'backend';

// TODO: I don't think I need angular2/test when testing this service
//       because no real interaction w/ Angular.
//       The worry is about Promise/Timeout/Zone interaction.
import {
    AsyncTestCompleter,
    inject,
    SpyObject,
    // Jasmine overrides
    describe,
    iit,
    it,
    xit,
    } from 'angular2/test';

type ATC = typeof AsyncTestCompleter;

describe('heroDataServiceAsync', () => {
  let service: HeroDataServiceAsync;
  let heroNullo = Hero.nullo;
  let mockBackend:Backend = <Backend>{};
  let heroData: Hero[];
  let testError ='fetchAllHerosAsync failed on purpose';

  function fetchAllHerosAsyncHappyPath () {
    return new Promise<Hero[]>((resolve, reject) =>{
      resolve(heroData);
    });
  }

  function fetchAllHerosAsyncFail () {
    return new Promise<Hero[]>((resolve, reject) =>{
      reject(testError);
    });
  }

  beforeEach(() => {
    heroData = HEROS.slice();
    mockBackend.fetchAllHerosAsync = fetchAllHerosAsyncHappyPath;
    service = new HeroDataServiceAsync(mockBackend);
  });

  describe('#getAllHeros', () => {

    it('returns no heros before ready', inject( [AsyncTestCompleter], (async:ATC) =>{
        let heros = service.getAllHeros();
        expect(heros.length).toEqual(0);
        async.done();
    }));

    it('returns expected # of heros when ready', inject( [AsyncTestCompleter], (async:ATC) =>{
        var done = async.done.bind(async);

        let heros = service.getAllHeros();

        heros.ready
          .then( _ => {
              expect(heros.length).toEqual(heroData.length);
          })
          .catch(fail)
          .then(done, done);
    }));

    it('returns no heros when source data are empty', inject( [AsyncTestCompleter], (async:ATC) =>{
        var done = async.done.bind(async);
        heroData = [];

        let heros = service.getAllHeros();

        heros.ready
          .then( _ => {
              expect(heros.length).toEqual(0);
          })
          .catch(fail)
          .then(done, done);
    }));

    it('the nullo is not among the heros', inject( [AsyncTestCompleter], (async:ATC) =>{
        var done = async.done.bind(async);

        let heros = service.getAllHeros();
        heros.ready
          .then( _ => {
              expect(heros).not.toContain(Hero.nullo);
          })
          .catch(fail)
          .then(done, done);
    }));

    it('fails with expected error when backend fails', inject( [AsyncTestCompleter], (async:ATC) =>{
        var done = async.done.bind(async);
        mockBackend.fetchAllHerosAsync =  fetchAllHerosAsyncFail;
        let heros = service.getAllHeros();

        heros.ready
          .then( _ => fail('getAllHeros should have failed') )
          .catch(err => expect(err).toBe(testError) )
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

