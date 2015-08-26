import {Hero, HeroDataServiceAsync, HEROS} from 'heroDataServiceAsync';

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
    let num_heros:number = HEROS.length;
    let service: HeroDataServiceAsync;
    let heroNullo = Hero.nullo;

    function mockGetAllHerosHappyPath(){
      return new Promise<Hero[]>((resolve, reject) =>{
                resolve(HEROS.slice());
      });
    }

    beforeEach(()=>{
      service = new HeroDataServiceAsync();
      service._getAllHerosAsyncImpl = mockGetAllHerosHappyPath;
    });

    it('service.getAllHeros returns expected # of heros after resolution', inject( [AsyncTestCompleter], (async:ATC) =>{
        var done = async.done.bind(async);

        let heros = service.getAllHeros();

        heros.ready
          .then( _ => {
              expect(heros.length).toEqual(num_heros);
          })
          .then(done, done);
    }));
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

