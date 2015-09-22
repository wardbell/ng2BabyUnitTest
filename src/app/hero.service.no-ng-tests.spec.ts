// Test a service without using any Angular (no Angular DI)
import {HeroService} from './hero.service';
import {BackendService} from './backend.service';
import {Hero} from './hero';

///////// test helpers /////////
var heroData: Hero[];

function happyBackendFactory() {
  return {
    // return a promise for fake heroes that resolves as quickly as possible
    fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData.map(h => h.clone()))
  };
}

var testError = 'BackendService.fetchAllHeroesAsync failed on purpose';

function throwingBackendFactory() {
  return {
    // return a promise that fails as quickly as possible
    fetchAllHeroesAsync: () => Promise.reject(testError)
  };
}

//////  tests ////////////

describe('HeroService (no-angular)', () => {

  let service: HeroService;

  describe('creation', () => {
    it('can instantiate the service', () => {
      let service = new HeroService(null);
      expect(service).toBeDefined();
    });

    it('heroes is empty', () => {
      let service = new HeroService(null);
      expect(service.heroes.length).toEqual(0);
    });
  });

  describe('#refresh', () => {

    describe('when backend provides data', () => {

      beforeEach(() => {
        heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];
        service = new HeroService(happyBackendFactory());
      });

      it('returns expected # of heroes when fulfilled', done => {
        service.refresh()
          .then(heroes =>
            expect(heroes.length).toEqual(heroData.length)
          )
          .catch(fail).then(done);
      });

      // the paranoid will verify not only that the array lengths are the same
      // but also that the contents are the same.
      it('returns the expected heroes when fulfilled (paranoia)', done => {
        service.refresh()
          .then(heroes => {
            expect(heroes.length).toEqual(heroData.length);
            heroes.forEach(h =>
              expect(heroData.some(
                // hero instances are not the same objects but
                // each hero in result matches an original hero by value
                hd => hd.name === h.name && hd.id === h.id)
              )
            );
          })
          .catch(fail).then(done);
      });

      it('heroes array is empty until fulfilled', done => {
        service.refresh()
          .catch(fail).then(done);

        // this test executed before refresh completes
        expect(service.heroes.length).toEqual(0);
      });

      it('heroes array is populated when fulfilled', done => {
        service.refresh()
          .then(() =>
            expect(service.heroes.length).toEqual(heroData.length)
          )
          .catch(fail).then(done);
      });

      it('returns no heroes when source data are empty', done => {
        heroData = []; // simulate no heroes from the backend

        service.refresh()
          .then(heroes =>
            expect(heroes.length).toEqual(0)
          )
          .catch(fail).then(done);
      });

      it('resets existing heroes array w/ original data when re-refresh', done => {
        let firstHeroes: Hero[];
        let changedName = 'Gerry Mander';

        service.refresh()
          .then(heroes => {
            firstHeroes = heroes;
            // Changes to cache!  Should disappear after refresh
            firstHeroes[0].name = changedName;
            firstHeroes.push(new Hero('Hercules'));
            return service.refresh()
          })
          .then(secondHeroes => {
            expect(firstHeroes).toBe(secondHeroes); // same object
            expect(firstHeroes.length).toEqual(heroData.length); // no Hercules
            expect(firstHeroes[0].name).not.toEqual(changedName); // reverted name change
          })
          .catch(fail).then(done);
      });

    });

    describe('when backend throws an error', () => {

      beforeEach(() => {
        service = new HeroService(throwingBackendFactory());
      });

      it('returns failed promise with the server error', done => {
        service.refresh()
          .then(_ => fail('refresh should have failed'))
          .catch(err => expect(err).toEqual(testError))
          .catch(fail).then(done);
      });

      it('resets heroes array to empty', done => {
        service.refresh()
          .then(_ => fail('refresh should have failed'))
          .catch(err => expect(service.heroes.length).toEqual(0))
          .catch(fail).then(done);
      });

    });
  });
});