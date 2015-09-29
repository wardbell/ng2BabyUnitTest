// Test a service when Angular DI is in play

// Angular 2 Test Bed
import {
AsyncTestCompleter, beforeEachBindings, inject,
beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/test';

import {bind} from 'angular2/angular2';
import {injectAsync} from '../test-helpers/test-helpers';

// Service related imports
import {Hero} from './hero';
import {HeroService} from './hero.service';
import {BackendService} from './backend.service';

//////  tests ////////////

describe('HeroService (with angular DI)', () => {

  beforeEachBindings(() => {
    return [HeroService];
  });

  describe('creation', () => {

    beforeEachBindings(() => {
      // The backend doesn't matter but we need it because HeroService expects it
      return [bind(BackendService).toFactory(() => { })];
    });

    it('can instantiate the service',
      inject([HeroService], (service: HeroService) => {
        expect(service).toBeDefined();
      }));

    it('heroes is empty',
      inject([HeroService], (service: HeroService) => {
        expect(service.heroes.length).toEqual(0);
      }));
  });

  describe('#refresh', () => {

    describe('when backend provides data', () => {

      beforeEach(() => {
        heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3,'Baz')];
      });

      beforeEachBindings(() =>
        [bind(BackendService).toClass(HappyBackendService)]
      );

      it('heroes array is empty until fulfilled',
        inject([HeroService], (service: HeroService) => {

        service.refresh();

        // executed before refresh completes
        expect(service.heroes.length).toEqual(0);
      }));

      it('returns expected # of heroes when fulfilled',
        inject([AsyncTestCompleter, HeroService],
          (async: AsyncTestCompleter, service: HeroService) => {

          service.refresh().then(heroes =>
              expect(heroes.length).toEqual(heroData.length)
            )
            .catch(fail).then(() => async.done());
        }));

      it('returns expected # of heroes when fulfilled (using injectAsync)',
        injectAsync([HeroService], (service: HeroService) => {

          return service.refresh().then(heroes =>
              expect(heroes.length).toEqual(heroData.length)
            );
        }));

      it('heroes array is populated when fulfilled',
        injectAsync([HeroService], (service: HeroService) => {

        return service.refresh().then(() =>
            expect(service.heroes.length).toEqual(heroData.length)
          );
      }));

      it('returns no heroes when when source data are empty',
        injectAsync([HeroService], (service: HeroService) => {

        heroData = []; // simulate no heroes from the backend

        return service.refresh()
          .then(heroes =>
            expect(heroes.length).toEqual(0)
          );
      }));

      it('resets existing heroes array w/ original data when re-refresh',
        injectAsync([HeroService], (service: HeroService) => {

        let firstHeroes: Hero[];
        let changedName = 'Gerry Mander';

        return service.refresh().then(heroes => {
            firstHeroes = heroes;
            // Changes to cache!  Should disappear after refresh
            firstHeroes[0].name = changedName;
            firstHeroes.push(new Hero(42, 'Hercules'));
            return service.refresh()
          })
          .then(secondHeroes => {
            expect(firstHeroes).toBe(secondHeroes); // same object
            expect(firstHeroes.length).toEqual(heroData.length); // no Hercules
            expect(firstHeroes[0].name).not.toEqual(changedName); // reverted name change
          });
      }));

    });

    describe('when backend throws an error', () => {

      beforeEachBindings(() =>
        [bind(BackendService).toClass(FailingBackendService)]
      );

      it('returns failed promise with the server error',
        injectAsync([HeroService], (service: HeroService) => {

        return service.refresh()
          .then(() => fail('refresh should have failed'))
          .catch(err => expect(err).toBe(testError));
      }));

      it('resets heroes array to empty',
        injectAsync([HeroService], (service: HeroService) => {

        return service.refresh()
          .then(() => fail('refresh should have failed'))
          .catch(err => expect(service.heroes.length).toEqual(0))
      }));
    });

     describe('when backend throws an error (spy version)', () => {

      beforeEachBindings(() => [BackendService]);

      beforeEach(inject([BackendService], (backend: BackendService) =>
        spyOn(backend, 'fetchAllHeroesAsync').and.callFake(() => Promise.reject(testError)
      )));

      it('returns failed promise with the server error',
        injectAsync([HeroService], (service: HeroService) => {

        return service.refresh()
          .then(() => fail('refresh should have failed'))
          .catch(err => expect(err).toBe(testError));
      }));

      it('resets heroes array to empty',
        injectAsync([HeroService], (service: HeroService) => {

        return service.refresh()
          .then(() => fail('refresh should have failed'))
          .catch(err => expect(service.heroes.length).toEqual(0))
      }));
    });

  });
});
///////// test helpers /////////
var service: HeroService;
var heroData: Hero[];

class HappyBackendService {
  // return a promise for fake heroes that resolves as quickly as possible
  fetchAllHeroesAsync = () =>
    Promise.resolve<Hero[]>(heroData.map(h => h.clone()));
}

var testError = 'BackendService.fetchAllHeroesAsync failed on purpose';

class FailingBackendService {
  // return a promise that fails as quickly as possible
  fetchAllHeroesAsync = () =>
    Promise.reject(testError);
}
