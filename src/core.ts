// import {ConnectionBackend, Http, RequestOptions} from 'http/http';
// import {Http} from 'angular2/http';
import {Backend} from 'backend';
import {HeroDataservice} from 'hero.dataservice';
import {User} from 'user';

export var coreInjectables = [Backend, HeroDataservice, User];