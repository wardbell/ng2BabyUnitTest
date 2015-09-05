import {
AsyncTestCompleter,
inject,
RootTestComponent,
TestComponentBuilder,
} from 'angular2/test';

export function injectAsync(testFn: (done: () => void) => void) {
  return inject([AsyncTestCompleter], function injectWrapper(async: AsyncTestCompleter) {
    testFn(async.done.bind(async));
  });
}
export function injectTcb(testFn: (tcb: TestComponentBuilder, done: () => void) => void) {
  return inject([TestComponentBuilder, AsyncTestCompleter], function injectWrapper(tcb: TestComponentBuilder, async: AsyncTestCompleter) {
    testFn(tcb, async.done.bind(async));
  });
}

export function getViewChildHtml(rootTC: RootTestComponent, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  return child && child.nativeElement.innerHTML
}

export function expectViewChildHtmlToMatch(rootTC: RootTestComponent, value: string | RegExp, elIndex: number = 0) {
  let elHtml = getViewChildHtml(rootTC, elIndex);
  expect(elHtml).toMatch(value);
}

export function expectViewChildClassToMatch(rootTC: RootTestComponent, value: string | RegExp, elIndex: number = 0) {
  let child = rootTC.componentViewChildren[elIndex];
  let classes = child && child.nativeElement.className;
  expect(classes).toMatch(value);
}