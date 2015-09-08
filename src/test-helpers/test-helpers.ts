import {
AsyncTestCompleter,
By,
DebugElement,
inject,
RootTestComponent,
TestComponentBuilder,
} from 'angular2/test';

import {DOM} from 'angular2/src/dom/dom_adapter';

export type DoneFn = (done?:any) => void;

// Run an async test within the Angular test bed
// Example
//    it('async test', (done:DoneFn) => {/* your test here */});
//
// May precede the test fn with some injectables which will be passed as args AFTER the done
// Example:
//    it('async test w/ injectables', [HeroService], (done:DoneFn, service:HeroService) => {
//      /* your test here */
//    });
export function injectAsync(
  dependencies: any[] | DoneFn,
  testFn?: (done: DoneFn, ...args:any[]) => void) {

  if (typeof dependencies === 'function' ){
    testFn = <DoneFn>dependencies;
    dependencies = [];
  }

  return inject([AsyncTestCompleter, ...(<[]><any>dependencies)], function injectWrapper(async: AsyncTestCompleter, ...args:any[]) {
    testFn(async.done.bind(async), ...args);
  });
}

type TCBFn = (done:DoneFn, tcb: TestComponentBuilder) => void;

// Run an async component test within Angular test bed using TestComponentBuilder
// Example
//    it('async Component test', (done:DoneFn, tcb: TestComponentBuilder) => {/* your test here */});
//
// May precede the test fn with some injectables which will be passed as args AFTER the TestComponentBuilder
// Example:
//    it('async Component test w/ injectables', [HeroService], (done:DoneFn, tcb:TestComponentBuilder. service:HeroService) => {
//      /* your test here */
//    });
export function injectTcb(
  dependencies: any[] | TCBFn,
  testFn?: (done: DoneFn, tcb: TestComponentBuilder, ...args:any[]) => void) {

  if (typeof dependencies === 'function' ){
    testFn = <TCBFn>dependencies;
    dependencies = [];
  }
  return injectAsync([TestComponentBuilder, ...(<[]><any>dependencies)], testFn);
}

export function getViewChildHtml(rootTC: RootTestComponent, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  return child && child.nativeElement && child.nativeElement.innerHTML
}

export function expectViewChildHtml(rootTC: RootTestComponent, elIndex: number = 0) {
  return expect(getViewChildHtml(rootTC, elIndex));
}

export function expectViewChildClass(rootTC: RootTestComponent, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  return expect(child && child.nativeElement && child.nativeElement.className);
}

export function getSelectedHtml(rootTC: RootTestComponent, selector: string) {
  var debugElement = rootTC.query(By.css(selector));
  return debugElement && debugElement.nativeElement && debugElement.nativeElement.innerHTML;
}

export function expectSelectedHtml(rootTC: RootTestComponent, selector: string) {
  return expect(getSelectedHtml(rootTC, selector));
}

///////// Coming in alpha-37 //////////

// src/test_lib/utils.ts
export function dispatchEvent(element: Element, eventType: string) {
  DOM.dispatchEvent(element, DOM.createEvent(eventType));
}

// Let time pass so that DOM or Ng can react
// returns a promise that returns ("passes through")
// the value resolved in the previous `then` (if any)
// after delaying for [millis] which is zero by default.
// Example (passing along the rootTC w/ no delay):
//     ...
//     return rootTC;  // optional
//   })
//   .then(tick)
//   .then(rootTC:RTC => { .. do something ..});
//
// Example (passing along nothing in particular w/ 10ms delay):
//     ...
//     // don't care if it returns something or not
//   })
//   .then(_ => tick(_, 10)) // ten milliseconds pass
//   .then(() => { .. do something ..});
//
export function tick(passThru?: any, millis: number = 0){
  return new Promise((resolve, reject) =>{
    setTimeout(() => resolve(passThru), millis);
  });
}