// Test a service when Angular DI is in play

// Angular 2 Test Bed
import {
  AsyncTestCompleter, beforeEachBindings, inject,
  beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/test';

import {bind} from 'angular2/angular2';
import {injectAsync} from 'test-helpers/test-helpers';

// Service related imports
import {Hero} from './hero';
import {HeroService} from './hero-service';
import {HEROES} from './mock-heroes';
import {Backend} from './backend';

///////// test helpers /////////
var heroData: Hero[];

function happyBackendFactory() {
  return {
    // return a promise for fake heroes that resolves as quickly as possible
    fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData.slice())
  };
}

var testError = 'backend.fetchAllHeroesAsync failed on purpose';

function throwingBackendFactory() {
  return {
    // return a promise that failse as quickly as possible
    fetchAllHeroesAsync: () => Promise.reject(testError)
  };
}
//////  tests ////////////

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
        inject([AsyncTestCompleter, HeroService],
          (async: AsyncTestCompleter, service: HeroService) => {

        service.getAllHeroes()
          .then( heroes => expect(heroes.length).toEqual(heroData.length) )
          .catch(fail).then(() => async.done());
      }));

      it('returns expected # of heroes when ready (simpler)',
        injectAsync([HeroService], (service: HeroService) => {

        return service.getAllHeroes()
          .then( heroes => expect(heroes.length).toEqual(heroData.length) );
      }));

      it('returns no heroes when source data are empty',
        injectAsync([HeroService], (service: HeroService) => {

        heroData = []; // simulate no heroes from the backend

        return service.getAllHeroes()
          .then( heroes => expect(heroes.length).toEqual(0) );
      }));

      it('re-execution preserves existing data in same cached array',
        injectAsync([HeroService], (service: HeroService) => {

        let firstHeroes:Hero[];

        return service.getAllHeroes()
          .then( heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Perseus'));
            return service.getAllHeroes();
          })
          .then(secondHeroes => {
            expect(firstHeroes).toBe(secondHeroes);
            expect (secondHeroes.length).toEqual(heroData.length + 1);
          });
      }));

      it('re-execution w/ force=true returns new array w/ original data',
        injectAsync([HeroService], (service: HeroService) => {

        let firstHeroes:Hero[];

        return service.getAllHeroes()
          .then( heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Hercules'));
            return service.getAllHeroes(true)
          })
          .then( secondHeroes => {
            expect(firstHeroes).not.toBe(secondHeroes);
            expect(firstHeroes.length).toEqual(heroData.length + 1);
            expect(secondHeroes.length).toEqual(heroData.length);
          });
      }));

    });

  });

  describe('when backend throws an error', () => {

    beforeEachBindings(() =>{
      return [bind(Backend).toFactory(throwingBackendFactory)];
    });

    it('#fetchAllHeroesAsync fails with expected error',
      injectAsync([HeroService], (service: HeroService) => {

      return service.getAllHeroes()
        .then( _ => fail('getAllHeroes should have failed') )
        .catch(err => expect(err).toBe(testError) );
      })
    );

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