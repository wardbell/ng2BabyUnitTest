// Test a service without using any Angular (no Angular DI)
import {HeroService} from './hero-service';
import {Backend} from './backend';
import {Hero} from './hero';

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

describe('HeroService (no-angular)', () => {

  let existingHero: Hero;
  let service: HeroService;

  describe('when backend provides data', () => {

    beforeEach(() => {
      heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];
      service = new HeroService(happyBackendFactory());
    });

    describe('#getAllHeroes', () => {

      it('returns expected # of heroes when fulfilled', done => {
        service.getAllHeroes()
          .then(heroes => {
            expect(heroes.length).toEqual(heroData.length);
          })
          .catch(fail).then(done);
      });

      // the paranoid will verify not only that the array lengths are the same
      // but also that the contents are the same.
      it('returns the expected heroes when fulfilled', done => {
        service.getAllHeroes()
          .then(heroes => {
            expect(heroes.length).toEqual(heroData.length);
            heroData.forEach(h => expect(heroes).toContain(h));
          })
          .catch(fail).then(done);
      });

      it('returns no heroes when source data are empty', done => {
        heroData = []; // simulate no heroes from the backend

        service.getAllHeroes()
          .then(heroes => {
            expect(heroes.length).toEqual(0);
          })
          .catch(fail).then(done);
      });

      it('re-execution preserves existing data in same cached array', done => {
        let firstHeroes: Hero[];

        service.getAllHeroes()
          .then(heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Perseus'));
            return service.getAllHeroes();
          })
          .then(secondHeroes => {
            expect(firstHeroes).toBe(secondHeroes);
            expect(secondHeroes.length).toEqual(heroData.length + 1);
          })
          .catch(fail).then(done);
      });

      it('re-execution w/ force=true returns new array w/ original data', done => {
        let firstHeroes: Hero[];

        service.getAllHeroes()
          .then(heroes => {
            firstHeroes = heroes;
            firstHeroes.push(new Hero('Hercules'));
            return service.getAllHeroes(true /*force*/)
          })
          .then(secondHeroes => {
            expect(firstHeroes).not.toBe(secondHeroes);
            expect(firstHeroes.length).toEqual(heroData.length + 1);
            expect(secondHeroes.length).toEqual(heroData.length);
          })
          .catch(fail).then(done);
      });
    });
  });
  describe('when backend throws an error', () => {

    beforeEach(() => {
      service = new HeroService(throwingBackendFactory());
    });

    it('fails with expected error', done => {
      service.getAllHeroes()
        .then(_ => fail('getAllHeroes should have failed'))
        .catch(err => expect(err).toBe(testError))
        .catch(fail).then(done);
    });

  });

});