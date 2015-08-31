import {Component, EventEmitter, FORM_DIRECTIVES, View} from 'angular2/angular2';
import {Hero} from 'hero';

@Component({
  selector: 'hero', properties: ['hero', 'userName'], events: ['delete']
})
@View({
  templateUrl: 'hero.component.html',
  directives: [FORM_DIRECTIVES]
})
export class HeroComponent {
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
