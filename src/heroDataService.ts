import {Hero} from 'hero';
export {Hero};

export const HEROS =	 [
						new Hero('Naomi'),
						new Hero('Brad'),
						new Hero('Mahatma Ghandhi'),
						new Hero('Julie')
					];

interface Heros extends Array<Hero>{
	fetched: boolean;
}

export class HeroDataService {

  protected _heros = <Heros>[];

	getAllHeros(force:boolean = false) {
		// fetch if haven't fetched or fetch is forced
		if (!this._heros.fetched || force){
		  this._heros = <Heros>HEROS.slice();
			this._heros.fetched = true;
		}
		return this._heros;
	}

  getOrCreateHero(name?: string)  {
		this.getAllHeros(); // make sure we have heros before we add one
		return {haveHero: true, hero: this._getOrCreateHeroImpl(name)};
	}

  protected _getOrCreateHeroImpl(name?: string) {

		if (!name) {
			return Hero.nullo;
		}

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
