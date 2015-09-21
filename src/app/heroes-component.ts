import {Component, NgClass, NgFor, NgIf, View} from 'angular2/angular2';
import {HeroDetailComponent} from './hero-detail-component';
import {HeroService} from './hero-service';
import {Hero} from './hero';
import {User} from './user';

@Component({
  selector: 'my-heroes'
})
@View({
  templateUrl: 'app/heroes-component.html',
  directives: [HeroDetailComponent, NgClass, NgFor, NgIf],
  styleUrls: ['app/heroes-component.css']
})
export class HeroesComponent {
  private _heroes: Hero[];
  private _currentHero: Hero;

  constructor(private _heroService: HeroService, private _user: User) { }

  get currentHero() {
    return this._currentHero || this._heroes[0];
  };

  set currentHero(hero) {
    this._currentHero = hero;
  }

  get heroes() {
    return this._heroes || this._refreshHeroes();
  }


  getSelectedClass(hero: Hero) {
    return { 'selected': hero === this.currentHero };
  }

  get userName() {
    return this._user.name || 'someone';
  }

  onDelete(hero: Hero) {
    hero = hero || this.currentHero;
    let ix = this._heroes.indexOf(hero);
    if (ix > -1) {
      this._heroes.splice(ix, 1);
    }
    this.currentHero = this._heroes[ix] || this._heroes[ix - 1];
  }

  onRefresh() {
    this._refreshHeroes();
  }

  onSelect(hero: Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ` + JSON.stringify(hero));
  }

  /////////////
  private _refreshHeroes() {
    console.log('Refreshing heroes');
    this.currentHero = undefined;
    this._heroService.refresh();
    this._heroes = this._heroService.heroes;
    return this._heroes;
  }

}
