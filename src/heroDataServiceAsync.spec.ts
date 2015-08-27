import {Hero} from 'hero';
import {HeroDataServiceAsync} from 'heroDataServiceAsync';
import {HEROES} from 'mockHeroes';
import {Backend} from 'backend';

describe('heroDataServiceAsync', () => {
  let service: HeroDataServiceAsync;
  let mockBackend:Backend = <Backend>{};
  let heroData: Hero[];
  let testError ='fetchAllHeroesAsync failed on purpose';

  beforeEach(() => {
    heroData = HEROES.slice();
    mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
    service = new HeroDataServiceAsync(mockBackend);
  });

  // fetchAllHeroes mock variations
  function fetchAllHeroesAsyncHappyPath () {
    return new Promise<Hero[]>((resolve, reject) => {
      resolve(heroData);
    });
  }

  function fetchAllHeroesAsyncFail () {
    return new Promise<Hero[]>((resolve, reject) => {
      reject(testError);
    });
  }

  describe('#getAllHeroes', () => {

    it('returns no heroes before ready', done => {
      let heroes = service.getAllHeroes();
      expect(heroes.length).toEqual(0);
      done();
    });

    it('returns expected # of heroes when ready', done => {

      let heroes = service.getAllHeroes();

      heroes.ready
        .then( _ => {
            expect(heroes.length).toEqual(heroData.length);
        })
        .catch(fail)
        .then(done, done);
    });

    it('returns no heroes when source data are empty', done => {
      heroData = [];

      let heroes = service.getAllHeroes();

      heroes.ready
        .then( _ => {
            expect(heroes.length).toEqual(0);
        })
        .catch(fail)
        .then(done, done);
    });

    it('fails with expected error when backend fails', done => {
      mockBackend.fetchAllHeroesAsync =  fetchAllHeroesAsyncFail;
      let heroes = service.getAllHeroes();

        heroes.ready
          .then( _ => fail('getAllHeroes should have failed') )
          .catch(err => expect(err).toBe(testError) )
          .then(done, done);
    });

    it('re-execution preserves existing cache', done => {
      let heroes = service.getAllHeroes();

      heroes.ready
        .then( _ => {
          heroes.push(new Hero('Perseus'));
          return service.getAllHeroes().ready;
        })
        .then(_ => {
          expect(heroes.length).toEqual(heroData.length + 1);
        })
        .catch(fail)
        .then(done, done);
    });

    it('re-execution w/ force=true restores cache', done => {
      let heroes = service.getAllHeroes();

      heroes.ready
        .then( _ => {
          heroes.push(new Hero('Hercules'));
          return service.getAllHeroes(true).ready; // re-execution with force
        })
        .then(_ => {
          expect(heroes.length).toEqual(heroData.length);
        })
        .catch(fail)
        .then(done, done);
    });
  });

  describe('#getHero(name)', () => {

    let existingHero = HEROES[0];
    let nonHeroName = 'Not '+existingHero.name;

    describe('before cache is ready', () => {

      it('returns undefined', done => {
        var hero = service.getHero(existingHero.name);
        expect(hero).toEqual(undefined);
        done();
      });

    });

    describe('after cache is ready', () => {

      // make the cache ready before testing #getHero
      // async `beforeEach` enables sync `it` tests
      beforeEach(done => {
        service.getAllHeroes().ready
          .catch(fail)
          .then(done, done);
      });

      // same tests as for sync dataservice
      it('returns an existing hero when a hero with that name exists', () =>{
        var hero = service.getHero(existingHero.name);
        expect(hero).toBe(existingHero);
      });

      it('returns null if name not found', () =>{
        var hero = service.getHero('Foo');
        expect(hero).toEqual(null);
      });

      it('returns null when name is empty string', () =>{
        var hero = service.getHero('');
        expect(hero).toEqual(null);
      });

      it('returns null  when name is null', () =>{
        var hero = service.getHero(null);
        expect(hero).toEqual(null);
      });

      it('returns null when name is undefined', () =>{
        var hero = service.getHero();
        expect(hero).toEqual(null);
      });

    });
  });
});

