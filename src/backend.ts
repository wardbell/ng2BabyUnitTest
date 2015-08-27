import {Hero} from 'hero';
import {HEROES} from 'mockHeroes';

export class Backend {
	fetchAllHeroesAsync() {
		return new Promise<Hero[]>((resolve, reject) =>{
			setTimeout(() => {
				resolve(HEROES.slice());
			}, 1000);
		});
	}
}