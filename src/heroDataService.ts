import {Hero}  from 'hero';

const _heros: Hero[] = [
	new Hero('Naomi'),
	new Hero('Brad'),
	new Hero('Mahatma Ghandhi'),
	new Hero('Julie'),
];

export class HeroDataService {

	private _heros: Hero[] = [];

	getAllHeros() {
		return _heros.slice();
	}

  getOrCreateHero(name: string) {

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

}