//import {Injectable} from 'angular2/angular2'; // Don't get it from Angular
import {Injectable} from './decorators'; // Use the app's version
import {Hero} from './hero';
import {Backend} from './backend';

@Injectable()
export class HeroService implements IHeroService {

	heroes: Hero[] = []; // cache of heroes

	constructor(private _backend: Backend) { }

	refresh() {
		this.heroes.length = 0;
		this._logger.error('test error');
		return this._backend.fetchAllHeroesAsync()
				.then(heroes => {
					this.heroes.push(...heroes);
					return this.heroes;
				})
			.catch(this._fetchFailed);
	}

	private _fetchFailed(error:any) {
		this._logger.error(error);
	}

	// TODO: inject a logger
  private _logger = {
    log : (message:any) => console.log(message),
		error: (error:any) => console.error(error)
  }
}

interface IHeroService {
	heroes : Hero[];
	refresh() : Promise<Hero[]>;
}
