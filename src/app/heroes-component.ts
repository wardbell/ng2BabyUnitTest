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

  constructor(private _heroService: HeroService, private _user: User) { }

  currentHero: Hero;

  get heroes() {
    return this._heroes || this._getAllHeroes();
  }

  onSelect(hero: Hero) {
    this.currentHero = hero;
    console.log(`Hero selected: ` + JSON.stringify(hero));
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
    this._getAllHeroes(true);
    console.log('Refreshing heroes');
  }

  getSelectedClass(hero: Hero) {
    return { 'selected': hero === this.currentHero };
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

    return this._heroes;
  }
}
