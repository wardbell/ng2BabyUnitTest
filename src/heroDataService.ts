import {Hero} from 'hero';
import {HEROES} from 'mockHeroes';

export class HeroDataService {

	get serviceName() {return 'sync';}

	getAllHeroes(force:boolean = false) {
		// (re)set the heroes array if not set or forced
		if (!this._heroes) {
			this._heroes = HEROES.slice();
		} else if (force) {
			this._heroes.length = 0;
			HEROES.map(h => this._heroes.push(h));
		}
		return this._heroes;
	}

  getHero(name?: string)  {
		this.getAllHeroes(); // ensure we have heroes before we add one
		return this._getHeroInCache(name);
	}

	///////////////////
  protected _heroes:Hero[];

  // get hero from cache or return null if not found
  protected _getHeroInCache(name?: string) {
		if (!name) { return null; }
		let matches = this._heroes.filter(hero => hero.name === name);
		return matches[0] || null;
	}
}
