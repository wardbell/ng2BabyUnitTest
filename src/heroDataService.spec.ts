import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROES} from 'mockHeroes';

describe('heroDataService', () => {
  let service: HeroDataService;

  beforeEach(()=>{
    service = new HeroDataService();
  });


  describe('#getAllHeroes', () => {
    it('returns expected # of heroes', () =>{
      let heroes = service.getAllHeroes();
      expect(heroes.length).toEqual(HEROES.length);
    });

    it('re-execution preserves existing cache', () =>{
      let heroes = service.getAllHeroes();
      heroes.push(new Hero('Perseus'));
      service.getAllHeroes(); // re-execution
      expect(heroes.length).toEqual(HEROES.length + 1);
    });

    it('re-execution w/ force=true restores cache', () =>{
      let heroes = service.getAllHeroes();
      heroes.push(new Hero('Perseus'));
      service.getAllHeroes(true); // re-execution with force
      expect(heroes.length).toEqual(HEROES.length);
    });

  });

  describe('#getHero(name)', () => {

    it('returns an existing hero when a hero with that name exists', () =>{
      var hero = HEROES[0];
      var hero2 = service.getHero(hero.name);
      expect(hero).toBe(hero2);
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

  it('#getAllHeroes returns expected # of heroes (x-test pollution guard)', () =>{
    expect(service.getAllHeroes().length).toEqual(HEROES.length);
  });
});

