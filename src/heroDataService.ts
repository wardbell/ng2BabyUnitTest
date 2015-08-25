import {Hero}  from 'hero';

export class HeroDataService {

	private _heros: Hero[] = [];

  getOrCreateHero(name: string) {

		let matches = this._heros.filter(hero => {
			return hero.name === name;
		});

		if (matches.length) {
			return matches[0];
		} else {
			let hero = new Hero(name);
			this._heros.push(hero);
      return hero;
		}
	}
}