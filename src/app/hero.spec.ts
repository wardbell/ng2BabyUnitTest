import {Hero} from './hero';

describe('Hero', () => {
  let hero:Hero;

  beforeEach(() => {
    // reset the `nextId` seed before every test
    Hero.setNextId(1);
    hero = new Hero('Super Cat');
  });

  it('has name given in the ctor', () => {
    expect(hero.name).toEqual('Super Cat');
  });

  it('has expected generated id when id not given in ctor', () => {
    expect(hero.id).toEqual(1);
  });

  it('increments generated id for each new Hero', () => {
    hero = new Hero('Cool Kitty'); // 2nd Hero created
    expect(hero.id).toEqual(2);
  });

  it('has id given in the ctor', () => {
    hero = new Hero('Cool Kitty', 42);
    expect(hero.id).toEqual(42);
  });
});