//import {Injectable} from 'angular2/angular2'; // Don't get it from Angular
import {Injectable} from './decorators'; // Use the app's version
import {Hero} from './hero';
import {Backend} from './backend';
import {EventEmitter} from 'angular2/angular2'

@Injectable()
export class HeroServiceObservable  {

	private _heroes: Hero[]; // cache of heroes

  private _subject:EventEmitter;
	heroesObserver = <Rx.Observable<Hero[]>> this._subject.toRx();

	constructor(private _backend:Backend) {
		this._subject = new EventEmitter();
		this.refresh();
	}

	refresh() {
		this._backend.fetchAllHeroesAsync()
				.then(heroes => this._heroes = heroes);
	}
}

