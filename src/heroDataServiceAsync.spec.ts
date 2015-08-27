import {Hero} from 'hero';
import {HeroDataServiceAsync} from 'heroDataServiceAsync';
import {HEROES} from 'mockHeroes';
import {Backend} from 'backend';

describe('heroDataServiceAsync', () => {
  let service: HeroDataServiceAsync;
  let mockBackend:Backend = <Backend>{};
  let heroData: Hero[];
  let testError ='fetchAllHeroesAsync failed on purpose';

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

  beforeEach(() => {
    heroData = HEROES.slice();
    mockBackend.fetchAllHeroesAsync = fetchAllHeroesAsyncHappyPath;
    service = new HeroDataServiceAsync(mockBackend);
  });

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
  });
/*
  // TODO: recast for async versions
  //       test also the fail case and that is null before ready
  describe('#getHero(name)', () => {

    it('returns an existing hero when a hero with that name exists', () =>{
        var hero = HEROES[0];
        var hero2 = service.getHero(hero.name);
        expect(hero).toBe(hero2);
    });

    it('returns undefined if name not found', () =>{
        var hero = service.getHero('Foo');
        expect(hero).not.toBeDefined;
    });

    it('returns undefined when name is empty string', () =>{
        var hero = service.getHero('');
        expect(hero).not.toBeDefined;
    });

    it('returns undefined  when name is null', () =>{
        var hero = service.getHero(null);
        expect(hero).toBe(null);
    });

    it('returns undefined when name is undefined', () =>{
        var hero = service.getHero();
        expect(hero).not.toBeDefined;
    });
    */
});

