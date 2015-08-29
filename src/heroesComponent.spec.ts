///// Boiler Plate ////
import {bind, bootstrap, Directive, Component, Injectable, View, ViewMetadata} from 'angular2/angular2';

import {
  AsyncTestCompleter,
  beforeEachBindings,
  inject,
  RootTestComponent,
  SpyObject,
  TestComponentBuilder,
  // Jasmine overrides
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  el,
  //expect,
  iit,
  it,
  xit
} from 'angular2/test';

// convenience types
type ATC = {done: ()=>void};
type TCB = typeof TestComponentBuilder;
type RTC = typeof RootTestComponent; // convenience type

///// Testing this particular component ////

import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROES} from 'mockHeroes';
import {User} from 'user';

import {HeroesComponent} from 'heroesComponent';

let mockHeroData:Hero[];
let mockHero:Hero;
let mockUser = new User('Johnny');

describe('HeroesComponent', () => {

  describe('(No DOM)', () => {

    let mockService:any; // too hard to maintain type safety on this mock

    beforeEach(() => {
      mockHeroData = HEROES.slice();
      mockHero = mockHeroData[0];
      mockService = MockDataServiceFactory();
    });

    it('can be created', () => {
      let hc = new HeroesComponent(mockService, mockUser)
      expect(hc instanceof HeroesComponent).toEqual(true); // proof of life
    });

    it('has expected userName', () => {
      let hc = new HeroesComponent(mockService, mockUser)
      expect(hc instanceof HeroesComponent).toEqual(true); // proof of life
    });

    describe('#heroes', () => {

      it('lacks heroes when created', () => {
        let hc = new HeroesComponent(mockService, mockUser )
        let heroes = hc.heroes; // trigger service
        expect(typeof heroes).toBe('undefined');  // not filled yet
      });

      it('has heroes after a while', inject([AsyncTestCompleter],  (async:ATC) => {
        var done = async.done.bind(async);
        let hc = new HeroesComponent(mockService, mockUser)
        let heroes = hc.heroes; // trigger service
        expect(typeof heroes).toBe('undefined'); // not filled yet

        // Wait for them ...
        mockService.getAllHeroesPromise(0)
          .then(() => {
            heroes = hc.heroes; // now the component has heroes to show
            expect(heroes.length).toEqual(mockHeroData.length);
          })
          .catch(fail).then(done,done);
      }));
    });
  });

  describe('(DOM)', () => {
    // Set up DI bindings required by component (and its nested components?)
    // else hangs silently forever
    beforeEachBindings( () => [
      bind(HeroDataService).toFactory(MockDataServiceFactory),
      bind(User).toValue(mockUser)
    ]);

    it('can be created', injectIt((tcb, done) => {
      let template = '<h1>Nuts</h1>';
      tcb.overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC:RTC) => expect(true).toBe(true)) // proof of life
        .catch(fail).then(done,done);
    }));

    it('binds view to userName', injectIt((tcb, done) => {
      let template = `<h1>{{userName}}'s Heroes</h1>`;
      tcb.overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC:RTC) => {
            let hc:HeroesComponent = rootTC.componentInstance;
            rootTC.detectChanges(); // trigger component property binding
            expectViewChildHtmlToMatch(rootTC, hc.userName);
        })
        .catch(fail).then(done,done);
    }));
  });
});

////// Helpers //////

function injectIt(testFn: (tcb: TCB, done: ()=>void) => void) {
  return inject([TestComponentBuilder, AsyncTestCompleter], function injectWrapper(tcb: TCB, async: ATC) {
    testFn(tcb, async.done.bind(async));
  });
}

function getViewChildHtml(rootTC: RTC, elIndex: number = 0){
  let child = rootTC.componentViewChildren[elIndex];
  return child && child.nativeElement.innerHTML
}

function expectViewChildHtmlToMatch(rootTC: RTC, value: string | RegExp, elIndex: number = 0){
  let elHtml = getViewChildHtml(rootTC, elIndex);
  let rx = typeof value === 'string' ? new RegExp(value) : value;
  (rx.test(elHtml)) ? expect(true).toBeTruthy : fail(`"${elHtml}" doesn't match ${rx}`)
}

// borrowed for instructional value from
// https://github.com/angular/angular/blob/master/modules/angular2/test/core/directives/ng_class_spec.ts
function detectChangesAndCheckClassName(rootTC: RTC, classes: string, elIndex: number = 0) {
  rootTC.detectChanges();
  expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}

function MockDataServiceFactory() {

  // Mock the HeroDataService members we think will matter
  let mock = jasmine.createSpyObj('HeroDataService',
    ['getAllHeroes', 'getHero', 'removeHero']);

  mock.getAllHeroes.and.callFake((force:boolean) => {
    return Promise.resolve<Hero[]>(mockHeroData);
  });

  mock.getHero.and.callFake(() => {
    return Promise.resolve<Hero>(mockHero);
  });

  mock.removeHero.and.callFake((hero:Hero) => {
    let ix = mockHeroData.indexOf(hero);
    if (ix > -1) {
      mockHeroData.splice(ix, 1);
      return true;
    } else {
      return false;
    }
  });

  // make it easy to wait on a promise from any of these calls

  mock.getAllHeroesPromise = (callNum = 0) => {
    var call = mock.getAllHeroes.calls.all()[callNum];
    return <Promise<Hero[]>>call && call.returnValue;
  }

  mock.getHeroPromise = (callNum = 0) => {
    var call = mock.getHero.calls.all()[callNum];
    return <Promise<Hero>>call && call.returnValue;
  }

  return mock;
}
