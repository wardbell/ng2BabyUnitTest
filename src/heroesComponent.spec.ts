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

type RTC = typeof RootTestComponent; // convenience type

// Recommended by Igor based on
// https://github.com/angular/angular/blob/master/test-main.js
// TODO: BrowserDomAdapter should be exposed through 'angular2/test' instead
import { BrowserDomAdapter } from 'angular2/src/dom/browser_adapter';
BrowserDomAdapter.makeCurrent(); // or else `tcb.createAsync` bombs because `DOM` is undefined

///// Testing this particular component ////

import {Hero} from 'hero';
import {HeroDataService} from 'heroDataService';
import {HEROES} from 'mockHeroes';

import {HeroesComponent} from 'heroesComponent';

describe('HeroesComponent (w/ sync dataservice)', () => {

  // Set up DI bindings required by component (and its nested components?)
  // else hangs silently forever
  beforeEachBindings( () => [HeroDataService]);

  it('can instantiate HeroesComponent', injectIt((tcb, done) => {
    let template = '<h1>Nuts</h1>';
    tcb.overrideTemplate(HeroesComponent, template)
       .createAsync(HeroesComponent)
       .then((rootTC:RTC) => {
          expect(true).toBe(true);
          done();
       })
  }));

  it('binds view to serviceName', injectIt((tcb, done) => {
    let template = '<h1>Heroes ({{serviceName}})</h1>';
    tcb.overrideTemplate(HeroesComponent, template)
       .createAsync(HeroesComponent)
       .then((rootTC:RTC) => {
          let hc:HeroesComponent = rootTC.componentInstance;
          rootTC.detectChanges(); // trigger component property binding
          expectViewChildHtmlToMatch(rootTC, hc.serviceName);
          done();
       })
  }));
});

////// Helpers //////


// convenience types
type ATC = {done: ()=>void};
type TCB = typeof TestComponentBuilder;

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
// https://github.com/angular/angular/blob/master/modules/angular2/test/core/directives/ng_class_spec.ts
function detectChangesAndCheckClassName(rootTC: RTC, classes: string, elIndex: number = 0) {
  rootTC.detectChanges();
  expect(rootTC.componentViewChildren[elIndex].nativeElement.className).toEqual(classes);
}