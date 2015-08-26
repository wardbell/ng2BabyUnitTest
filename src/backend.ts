import {Hero} from 'hero';
import {HEROS} from 'mockHeros';

export class Backend {
	fetchAllHerosAsync() {
		return new Promise<Hero[]>((resolve, reject) =>{
			setTimeout(() => {
				resolve(HEROS.slice());
			}, 500);
		});
	}
}