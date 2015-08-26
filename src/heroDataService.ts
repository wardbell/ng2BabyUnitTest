import {Hero}  from 'hero';
export {Hero};

const _heros: Hero[] = [];

export class HeroDataService {

	private _heros: Hero[] = [];

	getAllHeros() {
		return _heros.slice();
	}

  getOrCreateHero(name?: string) {

		if (!name) {
			return Hero.nullo;
		}

		let matches = _heros.filter(hero => {
			return hero.name === name;
		});

		if (matches.length) {
			return matches[0];
		} else {
			let hero = new Hero(name);
			_heros.push(hero);
      return hero;
		}
	}


  /* Test support methods */

	static clear() {
		_heros.splice(0, _heros.length);
	}

	static reset() {
		_heros.splice(0, _heros.length,
			new Hero('Naomi'),
			new Hero('Brad'),
			new Hero('Mahatma Ghandhi'),
			new Hero('Julie')
		);
		return _heros.length;
	}
}

HeroDataService.reset();
