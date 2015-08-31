import {Component, EventEmitter, FORM_DIRECTIVES, View} from 'angular2/angular2';
import {Hero} from 'hero';

@Component({
  selector: 'hero', properties: ['hero', 'userName'], events: ['delete']
})
@View({
  template: `
    <div>
      <h2>{{hero.name}} is {{userName}}'s current hero!</h2>
      <div>
        <button (click)="onDelete()" [disabled]="!hero">Delete</button>
        <button (click)="onUpdate()" [disabled]="!hero">Update</button>
      </div>
      <div><label>id: </label>{{hero.id}}</div>
      <div><label>name: </label><input [(ng-model)]="hero.name" placeholder="name"></input></div>
    </div>
  `,
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
