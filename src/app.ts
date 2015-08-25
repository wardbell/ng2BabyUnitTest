import {Component, View, bootstrap} from 'angular2/angular2';

import {Hero} from 'hero';

import {HeroDataService} from 'heroDataService';

@Component({
  selector: 'my-app'
  //, viewBindings:[HeroDataService] // component DI registration
})
@View({
    template:
    `<h1 id="output">{{currentHero.name}} is my current hero!</h1>
     <ul>
       <li>id: {{currentHero.id}}</li>
       <li>name: {{currentHero.name}}</li>
     </ul>
    `
})
class AppComponent {
  constructor(private _heroDataService: HeroDataService) { }

	currentHeroName = 'Igor';
	get currentHero() {
		return this._heroDataService.getOrCreateHero(this.currentHeroName);
	}
}

// bootstrap(AppComponent); // works if using component DI registration
bootstrap(AppComponent, [HeroDataService]); // global DI registration