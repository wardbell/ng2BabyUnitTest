import {Component, Inject, NgFor, NgIf, View} from 'angular2/angular2';
import {HeroDataService} from 'heroDataService';
import {Hero} from 'hero';
import {User} from 'user';

@Component({
  selector: 'heroes'
})
@View({
    template: `
      <div id="output">
        <h1>{{userName}}'s Heroes</h1>
        <button (click)="refresh(h)">refresh</button>
        <ul class="heroes">
          <li *ng-for="#h of heroes" (click)="heroSelected(h)">
            ({{h.id}}) {{h.name}}
          </li>
        </ul>
        <div *ng-if="currentHero">
          <hr/>
          <h2 >{{currentHero.name}} is {{userName}}'s current hero!</h2>
          <button (click)="removeHero()"
                  [disabled]="!currentHero">Remove</button>
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
  private _heroes: Hero[];

  constructor(private _heroDataService: HeroDataService, private _user:User) {  }

  currentHero:Hero;

  get heroes() {
    if (!this._heroes) { this._getAllHeroes(); }
    return this._heroes;
  }

  heroSelected(hero:Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }

  removeHero(hero:Hero){
    hero = hero || this.currentHero;
    let ix = this._heroes.indexOf(hero);
    this._heroDataService.removeHero(hero);
    this.currentHero = this._heroes[ix] || this._heroes[ix-1];
  }

  refresh() {
    this._getAllHeroes(true /*force*/);
    console.log('refreshed heroes');
  }

  get userName() { return this._user.name || 'someone'; }

  /////////////
  private _getAllHeroes(force:boolean = false) {
    this._heroDataService.getAllHeroes(force).then(heroes => {
      this._heroes = heroes;
      if (!this.currentHero) { this.currentHero = heroes[0]; }
    });
  }
}
