import {Inject} from 'angular2/angular2';
import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {Backend} from 'backend';

interface Heros extends Array<Hero>{
	ready: Promise<Hero[]>;
	fetching: boolean;
	fetched: boolean;
}

export class HeroDataServiceAsync extends HeroDataService {

	constructor(@Inject(Backend) private _backend: Backend){
		super();
	}

	getAllHeros(force : boolean = false) {
		this._getAllHerosAsync(force);
		return this._heros;
	}

  getOrCreateHero(name?: string)  {
		let hero = Hero.nullo;

		if (this._heros.fetched) {
			hero = this._getOrCreateHeroImpl(name);
		} else if (!this._heros.fetching) {
			this._getAllHerosAsync()
				.then(_ => 	hero = this._getOrCreateHeroImpl(name))
		}
		return hero;
	}

	///////////////////
  protected _heros = <Heros>[];

	private _getAllHerosAsync(force?: boolean) {
		if (force) {
			this._heros.fetched = false;
			this._heros.ready = null;
		}

		// if already fetched (or not forcing fetch)
		// return existing heros via promise
		if (this._heros.fetched){
			this._heros.ready = Promise.resolve(this._heros);
		}

		// if getAll in progress or completed (indicated by existence of promise)
		if (this._heros.ready) {
			return this._heros.ready
		}

    // clear heros and initiate new fetch, returning its promise
		this._heros.fetching = true;
		this._heros.fetched = false;
		this._heros.length = 0;

		this._heros.ready = this._backend.fetchAllHerosAsync()
			.then(heros => {
				this._heros.fetching = false;
				this._heros.fetched = true;
				heros.forEach(h => this._heros.push(h));
				return this._heros;
			})
			.catch(err => {
				this._heros.fetching = false;
				this._heros.fetched = false;
				this._heros.ready = null;
				console.log(`getAllHerosAsync failed w/ message:"${err}"`);
				return Promise.reject(err);
			});

	  return this._heros.ready;
	}

}
