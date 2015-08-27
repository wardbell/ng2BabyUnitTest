import {bootstrap, Component, View} from 'angular2/angular2';
import {HeroDataService} from 'heroDataService';
import {HeroesComponent} from 'heroesComponent';

@Component({
  selector: 'my-app',
  bindings: [HeroDataService]
})
@View({
    template:'<heroes></heroes>',
    directives: [HeroesComponent]
})
export class AppComponent {}

bootstrap(AppComponent);
