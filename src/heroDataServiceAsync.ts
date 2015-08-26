import {Hero, HeroDataService, HEROS} from 'heroDataService';
export {Hero, HEROS};

interface Heros extends Array<Hero>{
	ready: Promise<Hero[]>;
	fetched: boolean;
}

export class HeroDataServiceAsync extends HeroDataService {

  protected _heros = <Heros>[];

	getAllHeros(force : boolean = false) {
		this._getAllHerosAsync();
		return this._heros;
	}

  getOrCreateHero(name?: string)  {
		let result = {haveHero: false, hero: Hero.nullo};
    this._getOrCreateHeroAsync(name)
			  .then(h => {result.haveHero = true; result.hero = h;});
		return result;
	}

  // ASYNC IMPLEMENTATION

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
		this._heros.fetched = false;
		this._heros.length = 0;

		this._heros.ready = this._getAllHerosAsyncImpl()
			.then(heros => {
				this._heros.fetched = true;
				heros.forEach(h => this._heros.push(h));
				return this._heros;
			})
			.catch(err => {
				this._heros.fetched = true;
				console.log(`getAllHerosAsync failed w/ message:"${err}"`);
				return Promise.reject(err);
			});

	  return this._heros.ready;
	}

  private _getOrCreateHeroAsync(name?: string) {
		return new Promise<Hero>((resolve, reject) =>{

			let hero: Hero;

			if (this._heros.fetched) {
				hero = this._getOrCreateHeroImpl(name);
				resolve(hero);
			} else {

				this._getAllHerosAsync()
					.then(heros => {
				    hero = this._getOrCreateHeroImpl(name);
						resolve(hero);
					})
					.catch(err => {
						console.log(`getOrCreateHeroAsync failed w/ message:"${err}"`);
						resolve(Hero.nullo);
					})
			}

		})
	}

	// Test support: can be replaced w/ mocks in tests
	public _getAllHerosAsyncImpl = function() {
			return new Promise<Hero[]>((resolve, reject) =>{
				setTimeout(() => {
					resolve(HEROS.slice());
				}, 500);
			});
	}
}
