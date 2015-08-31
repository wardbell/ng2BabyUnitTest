// import {bind} from 'angular2/angular2';
import {Backend} from 'backend';
import {HeroDataService} from 'heroDataService';
import {User} from 'user';

export var CORE_BINDINGS = [Backend, HeroDataService, User];