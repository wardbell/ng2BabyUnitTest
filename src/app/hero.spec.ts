import {Hero} from './hero';

describe('Hero', () => {

  it('has name given in the constructor', () => {
    let hero = new Hero(1, 'Super Cat');
    expect(hero.name).toEqual('Super Cat');
  });

  it('has id given in the constructor', () => {
    let hero = new Hero(1, 'Super Cat');
    expect(hero.id).toEqual(1);
  });

  /* more tests we could run
  
  it('has expected generated id when id not given in the constructor', () => {
    Hero.setNextId(100); // reset the `nextId` seed
    let hero = new Hero(null, 'Cool Kitty');
    expect(hero.id).toEqual(100);
  });

  it('has expected generated id when id=0 in the constructor', () => {
    Hero.setNextId(100);
    let hero = new Hero(0, 'Cool Kitty');
    expect(hero.id).toEqual(100);
  })

  it('increments generated id for each new Hero w/o an id', () => {
    Hero.setNextId(100);
    let hero1 = new Hero(0, 'Cool Kitty');
    let hero2 = new Hero(null, 'Hip Cat');
    expect(hero2.id).toEqual(101);
  });

  */
});