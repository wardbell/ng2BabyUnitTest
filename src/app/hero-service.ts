import {Injectable} from 'angular2/angular2';
import {Hero} from './hero';
import {Backend} from './backend';

@Injectable()
export class HeroService implements IHeroService {

	private _heroes: Hero[]; // cache of heroes

	constructor(private _backend: Backend) { }

	getAllHeroes(force: boolean = false) {
		if (force || !this._heroes) {
			this._heroes = [];
			return this._backend.fetchAllHeroesAsync()
				.then(heroes => this._heroes = heroes);
		}
		return Promise.resolve(this._heroes);
	}
}

interface IHeroService {

  // Get all heroes from cache
	// unless the `force` is true or we haven't filled the cache yet
	// in which case fill the cache from the server.
	// Returns a promise with the cached heroes.
	getAllHeroes(force?: boolean) : Promise<Hero[]>;

}