import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROES} from 'mockHeroes';
import {Backend} from 'backend';

describe('heroDataService', () => {
  let service: HeroDataService;
  let mockBackend:Backend = <Backend>{};
  let heroData: Hero[];
  let testError ='fetchAllHeroesAsync failed on purpose';

  let existingHero = HEROES[0];
  let nonHeroName = 'Not ' + existingHero.name;

  beforeEach(() => {
    heroData = HEROES.slice();
    mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
    service = new HeroDataService(mockBackend);
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

  describe('#getHero(name)', () => {

    it('returns an existing hero when a hero with that name exists', done => {
      service.getHero(existingHero.name).then(
        hero => expect(hero).toBe(existingHero)
      ).catch(fail).then(done,done);
    });

    it('returns null if name not found', done => {
      service.getHero(nonHeroName).then(
        hero => expect(hero).toEqual(null)
      ).catch(fail).then(done,done);
    });

    it('returns null when name is empty string', done => {
      service.getHero('').then(
        hero => expect(hero).toEqual(null)
      ).catch(fail).then(done,done);
    });

    it('returns null  when name is null', done => {
      service.getHero(null).then(
        hero => expect(hero).toEqual(null)
      ).catch(fail).then(done,done);
    });

    it('returns null when name is undefined', done => {
      service.getHero().then(
        hero => expect(hero).toEqual(null)
      ).catch(fail).then(done,done);
    });

  });

  describe('#removeHero(hero)', () => {

    let cachedHeroes:Hero[];

    // prime the HeroDataService's cache asynchronously
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