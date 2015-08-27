import {Component, NgFor, NgIf, View} from 'angular2/angular2';
import {HeroDataService} from 'heroDataService';
import {Hero} from 'hero';

@Component({
  selector: 'heroes'
})
@View({
    template: `
      <div id="output">
        <h1>Heroes ({{serviceName}})</h1>
        <ul class="heroes">
          <li *ng-for="#h of heroes" (click)="onHeroSelected(h)">({{h.id}}) {{h.name}}</li>
        </ul>
        <div *ng-if="currentHero">
          <hr/>
          <h2 >{{currentHero.name}} is my current hero!</h2>
          <ul class="heroes">
            <li>id: {{currentHero.id}}</li>
            <li>name: {{currentHero.name}}</li>
          </ul>
        </div>
      </div>
    `,
    directives: [NgFor, NgIf],
    styles: ['.heroes {list-style-type: none; margin-left: 1em; padding: 0}']
})
export class HeroesComponent {
  private _currentHero:Hero;

  constructor(private _heroDataService: HeroDataService) {  }

	get currentHero() {
     return this._currentHero ||
           (this._currentHero = this._heroDataService.getHero('Misko'));
	}

	set currentHero(value) {
    this._currentHero = value;
	}

  get heroes() {
    return this._heroDataService.getAllHeroes();
  }

  get serviceName() {return this._heroDataService.serviceName}

  onHeroSelected(hero:Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }
}
