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
    });

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

    });

    it('#getAllHeroes returns expected # of heroes (x-test pollution guard)', () =>{
        expect(service.getAllHeroes().length).toEqual(HEROES.length);
    });
});

