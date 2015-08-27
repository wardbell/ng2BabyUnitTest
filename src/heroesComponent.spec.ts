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

type ATC = {done: ()=>void};
type TCB = typeof TestComponentBuilder;
type RTC = typeof RootTestComponent;

import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROES} from 'mockHeroes';

import {HeroesComponent as CUT} from 'heroesComponent'; // cut = Component Under Test

bootstrap(null); // else `tcb.createAsync` bombs because `DOM` is undefined (a bug)

describe('HeroesComponent (w/ sync dataservice)', () => {

  // Set up DI bindings required by component (and its nested components?)
  // else hangs silently forever
  beforeEachBindings( () => [HeroDataService]);

  it('can instantiate component-under-test (cut)', injectIt((tcb, done) => {
    let template = '<h1>Nuts</h1>';
    tcb.overrideTemplate(CUT, template)
       .createAsync(CUT)
       .then((rootTC:RTC) => {
          expect(true).toBe(true);
          done();
       })
  }));

  it('binds view to serviceName', injectIt((tcb, done) => {
    let template = '<h1>Heroes ({{serviceName}})</h1>';
    tcb.overrideTemplate(CUT, template)
       .createAsync(CUT)
       .then((rootTC:RTC) => {
          let cut:CUT = rootTC.componentInstance;
          rootTC.detectChanges(); // trigger component property binding
          expectViewChildHtmlToMatch(rootTC, cut.serviceName);
          done();
       })
  }));
});

////// Helpers //////

function injectIt(testFn: (tcb: TCB, done: ()=>void) => void) {
  return inject([TestComponentBuilder, AsyncTestCompleter], function injectWrapper(tcb: TCB, async: ATC) {
    testFn(tcb, async.done.bind(async));
  });
}

function getViewChildHtml(rootTC: RTC, elIndex: number = 0){
  return rootTC.componentViewChildren[elIndex].nativeElement.innerHTML
}

function expectViewChildHtmlToMatch(rootTC: RTC, value: string | RegExp, elIndex: number = 0){
  let elHtml = getViewChildHtml(rootTC, elIndex);
  let rx = typeof value === 'string' ? new RegExp(value) : value;
  (rx.test(elHtml)) ? expect(true).toBeTruthy : fail(`"${elHtml}" doesn't match ${rx}`)
}

// borrowed for instructional value from
function detectChangesAndCheckClassName(rootTC: RTC, classes: string, elIndex: number = 0) {
  rootTC.detectChanges();
  expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}