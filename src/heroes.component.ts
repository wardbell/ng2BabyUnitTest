import {Component, NgFor, NgIf, View} from 'angular2/angular2';
import {HeroComponent} from 'hero.component';
import {HeroDataservice} from 'hero.dataservice';
import {Hero} from 'hero';
import {User} from 'user';

@Component({
  selector: 'heroes'
})
@View({
  templateUrl: 'heroes.component.html',
  directives: [HeroComponent, NgFor, NgIf],
  styleUrls: ['heroes.component.css']
})
export class HeroesComponent {
  private _heroes: Hero[];

  constructor(private _heroDataService: HeroDataservice, private _user: User) { }

  currentHero: Hero;

  get heroes() {
    if (!this._heroes) { this._getAllHeroes(); }
    return this._heroes;
  }

  onSelect(hero: Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ${hero.name}`);
  }

  onDelete(hero: Hero) {
    hero = hero || this.currentHero;
    let ix = this._heroes.indexOf(hero);
    this._heroDataService.removeHero(hero);
    this.currentHero = this._heroes[ix] || this._heroes[ix - 1];
  }

  onRefresh() {
    this.currentHero = undefined;
    this._heroes = undefined;
    this._getAllHeroes(true /*force*/);
    console.log('onRefreshed heroes');
  }

  get userName() { return this._user.name || 'someone'; }

  /////////////
  private _getAllHeroes(force: boolean = false) {
    this._heroDataService.getAllHeroes(force).then(heroes => {
      this._heroes = heroes;
      if (!this.currentHero) { this.currentHero = heroes[0]; }
    });
  }
}
