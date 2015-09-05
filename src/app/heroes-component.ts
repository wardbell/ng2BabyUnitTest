import {Component, NgFor, NgIf, View} from 'angular2/angular2';
import {HeroDetailComponent} from './hero-detail-component';
import {HeroService} from './hero-service';
import {Hero} from './hero';
import {User} from './user';

@Component({
  selector: 'my-heroes'
})
@View({
  templateUrl: 'app/heroes-component.html',
  directives: [HeroDetailComponent, NgFor, NgIf],
  styleUrls: ['app/heroes-component.css']
})
export class HeroesComponent {
  private _heroes: Hero[];

  constructor(private _heroService: HeroService, private _user: User) { }

  currentHero: Hero;

  get heroes() {
    if (!this._heroes) { this._getAllHeroes(); }
    return this._heroes;
  }

  onSelect(hero: Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ` + JSON.stringify(hero));
  }

  onDelete(hero: Hero) {
    hero = hero || this.currentHero;
    let ix = this._heroes.indexOf(hero);
    this._heroService.removeHero(hero);
    this.currentHero = this._heroes[ix] || this._heroes[ix - 1];
  }

  onRefresh() {
    this._getAllHeroes(true /*force*/);
    console.log('Refreshing heroes');
  }

  get userName() { return this._user.name || 'someone'; }

  /////////////
  private _getAllHeroes(force: boolean = false) {
    this._heroes = [];
    this.currentHero = undefined;
    this._heroService.getAllHeroes(force).then(heroes => {
      this._heroes = heroes;
      this.currentHero = heroes[0];
    });
  }
}
