// Test a service when Angular DI is in play

// Angular 2 Test Bed
import {
  AsyncTestCompleter, beforeEachBindings, inject,
  beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/test';

import {bind} from 'angular2/angular2';
import {DoneFn, injectAsync} from 'test-helpers/test-helpers';

// Service related imports
import {Hero} from './hero';
import {HeroService} from './hero-service';
import {HEROES} from './mock-heroes';
import {Backend} from './backend';

///////// helpers /////////

function happyBackendFactory() {
  return {
    fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData.slice())
  };
}

function throwingBackendFactory() {
  testError ='backend.fetchAllHeroesAsync failed on purpose';
  return {
    fetchAllHeroesAsync: () => Promise.reject(testError)
 };
}

//////  tests ////////////

var heroData: Hero[]; // fresh heroes for each test
var testError ='test error';

describe('HeroService (with angular DI)', () => {

  let existingHero:Hero;

  beforeEachBindings(() =>{
    return [HeroService];
  });

  beforeEach(() => {
    heroData = HEROES.map(h => h.clone()); // Clean copy of the mock HEROES
    existingHero = heroData[0];
  });

  describe('when backend provides data', () => {

    beforeEachBindings(() =>{
      return [bind(Backend).toFactory(happyBackendFactory)];
    });

    describe('#getAllHeroes', () => {

      it('returns expected # of heroes when ready',
        inject([AsyncTestCompleter, HeroService], (async: AsyncTestCompleter, service: HeroService) => {

        var done = async.done.bind(async);

        service.getAllHeroes()
          .then( heroes =>  expect(heroes.length).toEqual(heroData.length) )
          .catch(fail)
          .then(done, done);
      }));

      it('returns no heroes when source data are empty',
        injectAsync([HeroService], (done: DoneFn, service: HeroService) => {
        // Replaces:
        //   inject([AsyncTestCompleter, HeroService], (async: AsyncTestCompleter, service: HeroService) => {
        //     var done = async.done.bind(async);

        heroData = []; // simulate no heroes from the backend

        service.getAllHeroes()
          .then( heroes => expect(heroes.length).toEqual(0) )
          .catch(fail)
          .then(done, done);
      }));


      it('re-execution preserves existing data in same cached array',
        injectAsync([HeroService], (done: DoneFn, service: HeroService) => {

        let firstHeroes:Hero[];

        service.getAllHeroes()
          .then( heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Perseus'));
            return service.getAllHeroes();
          })
          .then(secondHeroes => {
            expect(firstHeroes).toBe(secondHeroes);
            expect (secondHeroes.length).toEqual(heroData.length + 1);
          })
          .catch(fail)
          .then(done, done);
      }));

      it('re-execution w/ force=true returns new array w/ original data',
        injectAsync([HeroService], (done: DoneFn, service: HeroService) => {

        let firstHeroes:Hero[];

        service.getAllHeroes()
          .then( heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Hercules'));
            return service.getAllHeroes(true /*force*/)
          })
          .then( secondHeroes => {
            expect(firstHeroes).not.toBe(secondHeroes);
            expect(firstHeroes.length).toEqual(heroData.length + 1);
            expect(secondHeroes.length).toEqual(heroData.length);
          })
          .catch(fail)
          .then(done, done);
      }));
    });

    describe('#removeHero(hero)', () => {

      it('returns "true" after removing an existing hero from the cache',
        injectAsync([HeroService], (done:DoneFn, service: HeroService) => {
        service.getAllHeroes()
          .then(heroes => {
            let wasRemoved = service.removeHero(existingHero);
            expect(wasRemoved).toEqual(true)
          })
          .catch(fail).then(done);
      }));

      it('actually removed an existing hero from the cache',
        injectAsync([HeroService], (done:DoneFn, service: HeroService) => {
        service.getAllHeroes()
          .then(heroes => {
            service.removeHero(existingHero);
            expect(heroes).not.toContain(existingHero);
          })
          .catch(fail).then(done);

      }));

    });

/////////// BETTER VERSION WHEN #4035 IS FIXED /////////////////
//     describe('#removeHero(hero)', () => {
//       let service: HeroService;
//       let cachedHeroes:Hero[];
//
//       // prime the HeroService's cache asynchronously
//       // notice we can use `injectAsync` in a `beforeEach` too!
//       // Well we COULD do this after fix to issue #4035
//       // https://github.com/angular/angular/issues/4035
//       beforeEach(
//         inject([AsyncTestCompleter, HeroService], (async: AsyncTestCompleter, hs:HeroService) => {
//         var done = async.done.bind(async);
//
//         //injectAsync([HeroService],  (done:DoneFn, hs:HeroService) => {
//         service = hs;
//         service.getAllHeroes()
//         .then(heroes => cachedHeroes = heroes)
//         .catch(fail).then(done)
//       }));
//
//       // the following tests can be synchronous because the tested `remove` method is synchronous
//       // it presupposes that the cache of heroes has been filled by a previous `getAllHeroes` async call
//
//       it('returns "true" after removing an existing hero from the cache', () => {
//         expect(service.removeHero(existingHero)).toBe(true);
//       });
//
//       it('actually removed an existing hero from the cache', () => {
//         service.removeHero(existingHero);
//         expect(cachedHeroes).not.toContain(existingHero);
//       });
//     });

  });

  describe('when backend throws an error', () => {

    beforeEachBindings(() =>{
      return [bind(Backend).toFactory(throwingBackendFactory)];
    });

    it('#fetchAllHeroesAsync fails with expected error',
      injectAsync([HeroService], (done:DoneFn, service: HeroService) => {

      service.getAllHeroes()
        .then( _ => fail('getAllHeroes should have failed') )
        .catch(err => expect(err).toBe(testError) )
        .then(done, done);
      }));
  });

});

//// mock spy versions
function HappyBackendSpy(){
  var mock = new Backend();
  spyOn(mock, 'fetchAllHeroesAsync').and.callFake(() => {
    return Promise.resolve<Hero[]>(heroData);
  });
  return mock;
}

function ThrowingBackendSpy(){
  var mock = new Backend();
  testError ='backend.fetchAllHeroesAsync failed on purpose';
  spyOn(mock, 'fetchAllHeroesAsync').and.callFake(() => {
    return Promise.reject(testError);
  });
  return mock;
}