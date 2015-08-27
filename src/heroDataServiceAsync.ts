import {Inject, Injectable} from 'angular2/angular2';
import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {Backend} from 'backend';

interface Heroes extends Array<Hero>{
	ready: Promise<Hero[]>; // promise that did or will fill the array
	fetching: boolean;      // in the process of fetching
	fetched: boolean;       // previously fetched
}

@Injectable()
export class HeroDataServiceAsync extends HeroDataService {

	constructor( private _backend: Backend){
		super();
	}

	get serviceName() {return 'async';}

	getAllHeroes(force : boolean = false) {
		this._fetchAllHeroesAsync(force);
		return this._heroes;
	}

  // if cache is ready, return hero with that name or null if not found
	// if cache not ready, fetch it and return undefined
  getHero(name?: string)  {
		if (this._heroes.fetched) {
			return this._getHeroInCache(name);
		}
		this._fetchAllHeroesAsync();
	}

	///////////////////
  protected _heroes = <Heroes>[];

	private _fetchAllHeroesAsync(force?: boolean) {

		// quit if still fetching OR fetched already and not forcing new fetch
		if (this._heroes.fetching || (this._heroes.fetched && !force)) {
			return;
		}

		// clear heroes and initiate new fetch
		// stash fetch-promise in heroes.ready
		this._heroes.length = 0;
		this._heroes.fetching = true;
		this._heroes.fetched = false;

		this._heroes.ready = this._backend.fetchAllHeroesAsync()

			.then(heroes => {
				this._heroes.fetching = false;
				this._heroes.fetched = true;
				heroes.forEach(h => this._heroes.push(h));
				return this._heroes;
			})

			.catch(err => {
				this._heroes.fetching = false;
				this._heroes.fetched = false;
				console.log(`getAllHeroesAsync failed w/ message:"${err}"`);
				return Promise.reject(err);
			});
	}
}
