import {Component, View, bootstrap} from 'angular2/angular2';

import {Hero} from 'hero';

import {HeroDataService} from 'heroDataService';

@Component({
  selector: 'my-app'
  //, viewBindings:[HeroDataService]
})
@View({
    template: '<h1 id="output">{{currentHero.name}} is my hero!</h1>'
})
class AppComponent {
   constructor(private _heroDataService: HeroDataService) { }
    // private _heroDataService: HeroDataService;
    // constructor(){
    //     this._heroDataService = new HeroDataService();
    // }

	currentHeroName = 'Igor';
	get currentHero() {
		return this._heroDataService.getHeroByName(this.currentHeroName);
	}
}


// bootstrap(AppComponent);
bootstrap(AppComponent, [HeroDataService]);
