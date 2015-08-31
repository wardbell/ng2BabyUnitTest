//TODO: rename core to core.injectables.ts

// import {ConnectionBackend, Http, RequestOptions} from 'http/http';
// import {Http} from 'angular2/http';
import {Backend} from 'backend';
import {HeroDataservice} from 'hero.dataservice';
import {User} from 'user';

export var CORE_BINDINGS = [Backend, HeroDataservice, User];