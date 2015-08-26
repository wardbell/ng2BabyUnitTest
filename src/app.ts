import {bind, bootstrap, Component, NgFor, View } from 'angular2/angular2';
import {Backend} from 'backend';
import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HeroDataServiceAsync} from 'heroDataServiceAsync';

const goAsync = true;

const diBindings = goAsync ?
  [bind(HeroDataService).toClass(HeroDataServiceAsync), Backend] :
  [HeroDataService];

const initialHeroName = goAsync ? 'Igor' : 'Misko';

@Component({
  selector: 'my-app'
  //, viewBindings: diBinding // component DI registration
})
@View({
    template:
    `<div id="output">
      <h1>Heros {{asyncLabel}}</h1>
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
  private _currentHero =  Hero.nullo;

  constructor(private _heroDataService: HeroDataService) {  }

	get currentHero() {
    if (this._currentHero.isNullo) {
      this._currentHero = this._heroDataService.getOrCreateHero(initialHeroName);
    }
		return this._currentHero;
	}
	set currentHero(value) {
    this._currentHero = value;
	}

  get heros() {
    return this._heroDataService.getAllHeros();
  }

  get asyncLabel() {
    return goAsync ? '(async)' : '(sync)';
  }

  onHeroSelected(hero:Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }
}

// bootstrap(AppComponent); // works if using component DI registration

// global DI registration ... either sync or async


bootstrap(AppComponent, diBindings);
