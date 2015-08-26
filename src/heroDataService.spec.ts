import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROS} from 'mockHeros';

describe('heroDataService', () => {
    let service: HeroDataService;
    let heroNullo = Hero.nullo;

    beforeEach(()=>{
      service = new HeroDataService();
    });


    describe('#getAllHeros', () => {
      it('returns expected # of heros', () =>{
          let heros = service.getAllHeros();
          expect(heros.length).toEqual(HEROS.length);
      });

      it('"Hero.nullo" is a nullo', () =>{
          expect(heroNullo.isNullo).toEqual(true);
      });

      it('the nullo is not among the heros', () =>{
          expect(service.getAllHeros()).not.toContain(heroNullo);
      });
    });

    describe('#getOrCreateHero', () => {

      it('adds a new hero when name is new', () =>{
          var hero = service.getOrCreateHero('Foo');
          expect(service.getAllHeros()).toContain(hero);
      });

      it('returns an existing hero when a hero with that name exists', () =>{
          var hero = service.getOrCreateHero('Foo');
          var hero2 = service.getOrCreateHero('Foo');
          expect(hero).toBe(hero2);
      });

      it('returns the nullo when name parm is empty string', () =>{
          var hero = service.getOrCreateHero('');
          expect(hero).toBe(heroNullo);
      });

      it('returns the nullo when name parm is null', () =>{
          var hero = service.getOrCreateHero(null);
          expect(hero).toBe(heroNullo);
      });

      it('returns the nullo when name parm is undefined', () =>{
          var hero = service.getOrCreateHero();
          expect(service.getAllHeros()).not.toContain(hero);
      });

      it('the nullo returned when name parm is undefined is not among heros', () =>{
          var hero = service.getOrCreateHero();
          expect(hero).toBe(heroNullo);
      });
    });

    it('#getAllHeros returns expected # of heros (x-test pollution guard)', () =>{
        expect(service.getAllHeros().length).toEqual(HEROS.length);
    });
});

