import {Inject, Injectable} from 'angular2/angular2';
import {Hero} from 'hero';
import {Backend} from 'backend';

@Injectable()
export class HeroDataService {

	constructor(private _backend: Backend){ }
  private _heroes: Hero[] = []; // cache of heroes
	private _getAllHeroesPromise: Promise<Hero[]>;

	get serviceName() {return 'async';}

	getAllHeroes(force : boolean = false) {
		// getAll if force==true OR this is the first time through
		force = force || !this._getAllHeroesPromise
		if (!force) {
			return this._getAllHeroesPromise;
		}

		this._getAllHeroesPromise =  this._backend.fetchAllHeroesAsync()
			.then( heroes =>  this._heroes = heroes);

		return this._getAllHeroesPromise;
	}

  // when cache is ready, return hero with that name or null if not found
  getHero(name?: string)  {
	  return this.getAllHeroes()
			.then(heroes => heroes.filter(h => h.name === name)[0] || null);
	}

	removeHero(hero:Hero) {
    let ix = this._heroes.indexOf(hero);
		if (ix > -1) {
			this._heroes.splice(ix, 1);
			return true;
		} else {
			return false;
		}
	}
}
