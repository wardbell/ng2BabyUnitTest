import {Component, EventEmitter, View} from 'angular2/angular2';
import {COMMON_DIRECTIVES} from './constants';
import {Hero} from './hero';
import {InitCapsPipe} from './init-caps-pipe';

@Component({
  selector: 'my-hero-detail', properties: ['hero', 'userName'], events: ['delete']
})
@View({
  templateUrl: 'app/hero-detail.component.html',
  directives: [COMMON_DIRECTIVES],
  styleUrls: ['app/hero-detail.component.css'],
  pipes: [InitCapsPipe]
})
export class HeroDetailComponent {
  hero: Hero;

  delete = new EventEmitter();

  onDelete() { this.delete.next(this.hero) }

  onUpdate() {
    if (this.hero) {
      this.hero.name += 'x';
    }
  }
  userName: string;
}
