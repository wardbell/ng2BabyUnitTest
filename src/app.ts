import {bootstrap, Component, View} from 'angular2/angular2';
import {coreInjectables} from 'core'
import {HeroesComponent} from 'heroes.component';

@Component({
  selector: 'app',
  // Injectables needed by this component or its children
  bindings: [coreInjectables]
})
@View({
  template: '<heroes></heroes>',
  directives: [HeroesComponent]
})
export class AppComponent { }

bootstrap(AppComponent);
