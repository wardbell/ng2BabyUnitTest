import {Hero} from './hero';

describe('Hero', () => {
  let hero:Hero;

  beforeEach(() => {
    // reset the `nextId` seed before every test
    Hero.setNextId(1);
    hero = new Hero(null, 'Super Cat');
  });

  it('has name given in the constructor', () => {
    expect(hero.name).toEqual('Super Cat');
  });

  it('has expected generated id when id not given in the constructor', () => {
    expect(hero.id).toEqual(1);
  });

  it('has expected generated id when id=0 in the constructor', () => {
    expect(hero.id).toEqual(1);
  })

  it('increments generated id for each new Hero', () => {
    hero = new Hero(null, 'Cool Kitty'); // 2nd Hero created
    expect(hero.id).toEqual(2);
  });

  it('has expected generated id when id=0 in the constructor', () => {
    hero = new Hero(null, 'Cool Kitty'); // 2nd Hero created
    expect(hero.id).toEqual(2);
  })

  it('has id given in the constructor', () => {
    hero = new Hero(42, 'Douglas Adams');
    expect(hero.id).toEqual(42);
  });
});