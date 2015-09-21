//import {Injectable} from 'angular2/angular2'; // Don't get it from Angular
import {Injectable} from './decorators'; // Use the app's version
import {Hero} from './hero';
import {Backend} from './backend.service';

@Injectable()
export class HeroService implements IHeroService {

	heroes: Hero[] = []; // cache of heroes

	constructor(private _backend: Backend) { }

	refresh() {
		this.heroes.length = 0;
		return this._backend.fetchAllHeroesAsync()
			.then(heroes => {
				this.heroes.push(...heroes);
				return this.heroes;
			})
			//.catch(e => this._fetchFailed(e)) // want we want to say
			// baroque way to ensure promise stays Promise<Hero[]>
			.then<Hero[]>(_ => _, e => this._fetchFailed(e));
	}

	private _fetchFailed(error:any) {
		console.error(error);
		return Promise.reject(error);
	}
}

interface IHeroService {
	heroes : Hero[];
	refresh() : Promise<Hero[]>;
}
