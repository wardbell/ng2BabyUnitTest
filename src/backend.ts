import {Http} from 'http/http';
import {Injectable} from 'angular2/angular2';
import {Hero} from 'hero';

@Injectable()
export class Backend {
	constructor(public http: Http) {
		this.http = http;
	}

	fetchAllHeroesAsync(): Promise<Hero[]> {

		return new Promise<Hero[]>((resolve, reject) => {
			setTimeout(() => {
				var promise = this.http.get('heroes.json')
					.toRx().map((response: any) => response.json()).toPromise();
				resolve(promise);
			}, 1000);
		});

		//TODO: here is all you need. We don;t actually want a delay
		// return this.http.get('heroes.json')
		// 	.toRx().map((response: any) => response.json()).toPromise();
	}
}