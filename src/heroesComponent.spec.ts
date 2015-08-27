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
  expect,
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

function detectChangesAndCheck(rootTC: RTC, classes: string, elIndex: number = 0) {
  rootTC.detectChanges();
  expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}

function injectIt(testFn: (tcb: TCB, done: ()=>void) => void) {
  return inject([TestComponentBuilder, AsyncTestCompleter], function injectWrapper(tcb: TCB, async: ATC) {
    testFn(tcb, async.done.bind(async));
  });
}
bootstrap(null); // else `tcb.createAsync` bombs because `DOM` is undefined (a bug)
describe('HeroesComponent', () => {

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

  it('can trigger binding', injectIt((tcb, done) => {
    let template = '<h1>Heroes</h1>';
    tcb.overrideTemplate(CUT, template)
       .createAsync(CUT)
       .then((rootTC:RTC) => {
          let cut:CUT = rootTC.componentInstance;
          rootTC.detectChanges();
          expect(true).toBe(true);
          done();
       })
  }));
});