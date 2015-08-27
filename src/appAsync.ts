import {bind, bootstrap, Component, View} from 'angular2/angular2';
import {Backend} from 'backend';
import {HeroDataService} from 'heroDataService';
import {HeroDataServiceAsync} from 'heroDataServiceAsync';
import {HeroesComponent} from 'heroesComponent';

@Component({
  selector: 'my-app',
  bindings: [bind(HeroDataService).toClass(HeroDataServiceAsync), Backend]
})
@View({
    template:'<heroes></heroes>',
    directives: [HeroesComponent]
})
export class AppAsyncComponent {}

bootstrap(AppAsyncComponent);
