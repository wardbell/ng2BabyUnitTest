import {Hero} from './hero';
import {HeroService} from './hero-service';
import {HEROES} from './mock-heroes';
import {Backend} from './backend';

describe('HeroService', () => {
  let service: HeroService;
  let mockBackend:Backend = <Backend>{};
  let heroData: Hero[];
  let testError ='fetchAllHeroesAsync failed on purpose';

  let existingHero:Hero;

  beforeEach(() => {
    heroData = HEROES.map(h => h.clone());
    existingHero = heroData[0];
    mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
    service = new HeroService(mockBackend);
  });

  // fetchAllHeroes mock variations
  function fetchAllHeroesAsyncHappyPath () {
    return new Promise<Hero[]>((resolve, reject) => {
      resolve(heroData.slice());
    });
  }

  function fetchAllHeroesAsyncFail () {
    return new Promise<Hero[]>((resolve, reject) => {
      reject(testError);
    });
  }

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

    it('fails with expected error when backend fails', done => {
      mockBackend.fetchAllHeroesAsync =  fetchAllHeroesAsyncFail;

      service.getAllHeroes()
        .then( _ => fail('getAllHeroes should have failed') )
        .catch(err => expect(err).toBe(testError) )
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