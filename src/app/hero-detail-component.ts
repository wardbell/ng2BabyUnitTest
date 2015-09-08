import {Component, EventEmitter, FORM_DIRECTIVES, View} from 'angular2/angular2';
import {Hero} from './hero';

@Component({
  selector: 'my-hero-detail', properties: ['hero', 'userName'], events: ['delete']
})
@View({
  templateUrl: 'app/hero-detail-component.html',
  directives: [FORM_DIRECTIVES],
  styleUrls: ['app/hero-detail-component.css']
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
