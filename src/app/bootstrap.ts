import {bootstrap} from 'angular2/angular2';

// Application root component
import {HeroesComponent} from './heroes.component';

// Application-wide "injectables""
import {BackendService} from './backend.service';
import {HeroService} from './hero.service';
import {User} from './user';

bootstrap(HeroesComponent, [BackendService, HeroService, User]);
