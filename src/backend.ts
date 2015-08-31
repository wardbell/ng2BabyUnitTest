// import {Http} from 'http/http';
import {Injectable} from 'angular2/angular2';
import {Hero} from 'hero';
import {HEROES} from 'mockHeroes';

@Injectable()
export class Backend {
	fetchAllHeroesAsync() : Promise<Hero[]> {
		return new Promise<Hero[]>((resolve, reject) => {
			setTimeout(() => {
				resolve(HEROES.map(h => h.clone()));
			}, 1000);
		});
	}

	// constructor(private http: Http) {
	// 	this.http = http;
	// }

	// fetchAllHeroesAsync(): Promise<Hero[]> {
	// 	return this.http.get('heroes.json').then((heroes: any[]) => {
	// 		return heroes.map(hero => new Hero(hero.name, hero.id))
	// 	});
	// }
}