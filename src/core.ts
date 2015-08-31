// import {bind} from 'angular2/angular2';
import {Backend} from 'backend';
import {HeroDataservice} from 'hero.dataservice';
import {User} from 'user';

export var CORE_BINDINGS = [Backend, HeroDataservice, User];