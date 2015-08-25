import {Component, NgFor, View, bootstrap} from 'angular2/angular2';

import {Hero} from 'hero';

import {HeroDataService} from 'heroDataService';

const initialHeroName = 'Igor';

@Component({
  selector: 'my-app'
  //, viewBindings:[HeroDataService] // component DI registration
})
@View({
    template:
    `<div id="output">
      <h1>Heros</h1>
        <ul class="heros">
          <li *ng-for="#h of heros" (click)="onHeroSelected(h)">({{h.id}}) {{h.name}}</li>
        </ul>
      <hr/>
      <h2>{{currentHero.name}} is my current hero!</h2>
        <ul>
          <li>id: {{currentHero.id}}</li>
          <li>name: {{currentHero.name}}</li>
          <li>isNullo: {{currentHero.isNullo}}</li>
        </ul>
     </div>
    `,
    directives: [NgFor],
    styles: ['.heros {list-style-type: none; margin-left: 1em; padding: 0}']
})
class AppComponent {
  private _currentHero: Hero;

  constructor(private _heroDataService: HeroDataService) { }

	get currentHero() {
		return this._currentHero || (this._currentHero = this._getOrCreateHero(initialHeroName));
	}
	set currentHero(value) {
    this._currentHero = value;
	}

  get heros() {
    return this._heroDataService.getAllHeros();
  }

  onHeroSelected(hero:Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }

  private _getOrCreateHero(name:string): Hero {
    return this._heroDataService.getOrCreateHero(name);
  }
}

// bootstrap(AppComponent); // works if using component DI registration
bootstrap(AppComponent, [HeroDataService]); // global DI registration