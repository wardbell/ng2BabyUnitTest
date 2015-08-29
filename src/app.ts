import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {Backend} from 'backend';
import {HeroDataService} from 'heroDataService';
import {HeroesComponent} from 'heroesComponent';
import {User} from 'user';

@Component({
  selector: 'my-app',
  // Injectables needed by this component or its children
  bindings: [
    Backend, HeroDataService,
    bind(User).toValue(new User('Ward'))
  ]
})
@View({
    template:'<heroes></heroes>',
    directives: [HeroesComponent]
})
export class AppComponent { }


bootstrap(AppComponent);
