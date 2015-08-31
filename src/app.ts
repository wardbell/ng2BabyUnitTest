import {bootstrap, Component, View} from 'angular2/angular2';
import {HeroesComponent} from 'heroesComponent';
import {CORE_BINDINGS} from 'core'

@Component({
  selector: 'app',
  // Injectables needed by this component or its children
  bindings: [CORE_BINDINGS]
})
@View({
  template: '<heroes></heroes>',
  directives: [HeroesComponent]
})
export class AppComponent { }

bootstrap(AppComponent);
