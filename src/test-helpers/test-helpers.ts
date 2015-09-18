import {
  AsyncTestCompleter,
  By,
  DebugElement,
  inject,
  RootTestComponent,
  TestComponentBuilder,
} from 'angular2/test';

///////// test-lib `inject` wrappers  /////////

export type DoneFn = (done?:any) => void;

type ThenableTestFn = (...args:any[]) => Thenable<any>;

// compensate for https://github.com/angular/angular.io/issues/204
function getAsyncTestCompleterDone(async: AsyncTestCompleter){
  var done = async.done.bind(async)
  done.fail = (reason:any) => {fail(reason); done();}
  return done;
}

// Run an async test within the Angular test bed
// Example
//    it('async test', () => {
//      // * your test here
//      return aPromise;
//    });
//
// May precede the test fn with some injectables which will be passed as args AFTER the done
// Example:
//    it('async test w/ injectables', [HeroService], (service:HeroService) => {
//      // your test here
//      return aPromise;
//    })
export function injectAsync(testFn: () => Thenable<any>): void;
export function injectAsync(dependencies: any[], testFn: ThenableTestFn): void;
export function injectAsync( dependencies: any[] | ThenableTestFn, testFn?: ThenableTestFn) {

  if (typeof dependencies === 'function' ){
    testFn = <ThenableTestFn>dependencies;
    dependencies = [];
  }

  return inject([AsyncTestCompleter, ...(<any[]>dependencies)],
    function injectWrapper(async: AsyncTestCompleter, ...args:any[]) {
      testFn(...args)
        .then(null, fail).then(async.done.bind(async));
  });
}

type ThenableTcbTestFn = (tcb: TestComponentBuilder, ...args:any[]) => Thenable<any>;

// Run an async component test within Angular test bed using TestComponentBuilder
// Example
//    it('async Component test', tcb => {
//      // * your test here
//      return aPromise;
//    });
//
// May precede the test fn with some injectables which will be passed as args AFTER the TestComponentBuilder
// Example:
//    it('async Component test w/ injectables', [HeroService], (tcb, service:HeroService) => {
//      // your test here
//      return aPromise;
//    });
export function injectTcb(testFn: (tcb: TestComponentBuilder) => Thenable<any>): void;
export function injectTcb(dependencies: any[], testFn: ThenableTcbTestFn): void;
export function injectTcb(dependencies: any[] | ThenableTcbTestFn, testFn?: ThenableTcbTestFn) {

  if (typeof dependencies === 'function' ){
    testFn = <ThenableTcbTestFn>dependencies;
    dependencies = [];
  }

  return injectAsync([TestComponentBuilder, ...(<any[]>dependencies)], testFn);
}

///////// inspectors and expectations /////////

export function getSelectedHtml(rootTC: RootTestComponent, selector: string) {
  var debugElement = rootTC.query(By.css(selector));
  return debugElement && debugElement.nativeElement && debugElement.nativeElement.innerHTML;
}

export function expectSelectedHtml(rootTC: RootTestComponent, selector: string) {
  return expect(getSelectedHtml(rootTC, selector));
}

export function getSelectedClassName(rootTC: RootTestComponent, selector: string) {
  var debugElement = rootTC.query(By.css(selector));
  return debugElement && debugElement.nativeElement && debugElement.nativeElement.className;
}

export function expectSelectedClassName(rootTC: RootTestComponent, selector: string) {
  return expect(getSelectedClassName(rootTC, selector));
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

///////// Coming in alpha-37 //////////

// src/test_lib/utils.ts
// export function dispatchEvent(element: Element, eventType: string) {
//   DOM.dispatchEvent(element, DOM.createEvent(eventType));
// }

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