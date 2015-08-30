import {Component, NgFor, NgIf, FORM_DIRECTIVES, View} from 'angular2/angular2';
import {HeroComponent} from 'heroComponent';
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
        <button (click)="onRefresh(h)">Refresh</button>
        <ul class="heroes">
          <li *ng-for="#hero of heroes" (click)="onSelect(hero)">
            ({{hero.id}}) {{hero.name}}
          </li>
        </ul>
        <div *ng-if="currentHero">
          <hr/>
          <hero [hero]="currentHero" [usernm]="userName" (delete)="onDelete()"></hero>
        </div>
      </div>
    `,
    directives: [FORM_DIRECTIVES, HeroComponent, NgFor, NgIf],
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

  onSelect(hero:Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }

  onDelete(hero:Hero){
    hero = hero || this.currentHero;
    let ix = this._heroes.indexOf(hero);
    this._heroDataService.removeHero(hero);
    this.currentHero = this._heroes[ix] || this._heroes[ix-1];
  }

  onRefresh() {
    this.currentHero = undefined;
    this._heroes = undefined;
    this._getAllHeroes(true /*force*/);
    console.log('onRefreshed heroes');
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
