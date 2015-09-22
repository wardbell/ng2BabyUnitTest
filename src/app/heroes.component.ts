import {Component, View} from 'angular2/angular2';
import {COMMON_DIRECTIVES} from './constants';
import {HeroDetailComponent} from './hero-detail.component';
import {HeroService} from './hero.service';
import {Hero} from './hero';
import {User} from './user';

@Component({
  selector: 'my-heroes'
})
@View({
  templateUrl: 'app/heroes.component.html',
  directives: [HeroDetailComponent, COMMON_DIRECTIVES],
  styleUrls: ['app/heroes.component.css']
})
export class HeroesComponent {
  private _heroes: Hero[];
  currentHero: Hero;

  constructor(private _heroService: HeroService, private _user: User) {   }

  get heroes() { return this._heroes || this.onRefresh(); }

  get userName() { return this._user.name || 'someone'; }

  getSelectedClass(hero: Hero) {return { selected: hero === this.currentHero }};

  onDelete(hero: Hero) {
    hero = hero || this.currentHero;
    let i = this._heroes.indexOf(hero);
    if (i > -1) {
      this._heroes.splice(i, 1);
    }
    this.currentHero = this._heroes[i] || this._heroes[i - 1];
  }

  onRefresh() {
    //console.log('Refreshing heroes');
    // clear the decks
    this.currentHero = undefined;
    this._heroes = [];

    this._heroService.refresh()
      .then(heroes => this._heroes = heroes);

    return this._heroes;
  }

  onSelect(hero: Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ` + JSON.stringify(hero));
  }
}
