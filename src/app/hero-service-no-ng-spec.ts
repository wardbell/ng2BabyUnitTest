// Test a service without using any Angular (no Angular DI)
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

describe('HeroService (no-angular)', () => {

  let existingHero:Hero;
  let service: HeroService;

  beforeEach(() => {
    heroData = HEROES.map(h => h.clone()); // Clean copy of the mock HEROES
    existingHero = heroData[0];
  });

  describe('when backend provides data', () => {

    beforeEach(() => {
      service = new HeroService(happyBackendFactory());
    });

    describe('#getAllHeroes', () => {

      it('returns expected # of heroes when ready', done => {
        service.getAllHeroes()
          .then( heroes => {
            expect(heroes.length).toEqual(heroData.length);
          })
          .catch(fail)
          .then(done, done);
      });

      it('returns no heroes when source data are empty', done => {
        heroData = []; // simulate no heroes from the backend

        service.getAllHeroes()
          .then( heroes => {
            expect(heroes.length).toEqual(0);
          })
          .catch(fail)
          .then(done, done);
      });

      it('re-execution preserves existing data in same cached array', done => {
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
      });

      it('re-execution w/ force=true returns new array w/ original data', done => {
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
      });
    });

    describe('#removeHero(hero)', () => {

        let cachedHeroes:Hero[];

        // prime the HeroService's cache asynchronously
        beforeEach(done => {
          service.getAllHeroes()
            .then(heroes => cachedHeroes = heroes)
            .catch(fail).then(done,done);
        })

        // these tests can be synchronous because the method is synchronous

        it('returns "true" after removing an existing hero from the cache', () => {
          expect(service.removeHero(existingHero)).toBe(true);
        });

        it('actually removed an existing hero from the cache', () => {
          service.removeHero(existingHero);
          expect(cachedHeroes).not.toContain(existingHero);
        });

    });

  });

  describe('when backend throws an error', () => {

    beforeEach(() => {
      service = new HeroService(throwingBackendFactory());
    });

    it('#fetchAllHeroesAsync fails with expected error', done => {
      service.getAllHeroes()
        .then( _ => fail('getAllHeroes should have failed') )
        .catch(err => expect(err).toBe(testError) )
        .then(done, done);
    });

  });

});