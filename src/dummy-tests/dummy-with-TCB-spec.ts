import {
  AsyncTestCompleter, inject, TestComponentBuilder,
  // Jasmine overrides
  describe, expect, iit, it, xit,
} from 'angular2/test';

type TCB = typeof TestComponentBuilder;
type ATC = typeof AsyncTestCompleter;

console.log('Before dummyWithTCB describe');
describe('dummy TCB tests:', () => {
  console.log('Inside dummyWithTCB describe');

  it('sync test works', () => expect(true).toBe(true));

  it('async test2 works', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TCB, async: ATC) => {
    setTimeout(() => {
      expect(false).toBe(false);
      async.done();
    }, 50);
  }));

  it('another async test', inject([TestComponentBuilder, AsyncTestCompleter], (tcb: TCB, async: ATC) => {
    expect(false).toBe(false);
    async.done();
  }));

  // DON'T TRY TO USE STANDARD JASMINE ASYNC PATTERN W/ NG2 JASMINE OVERRIDES !
  // Doesn't actually work because Ng Test framework  overwrites Jasmine methods.
  // The Jasmine `it` gets a function with NO args so, despite what appears to
  // be a Jasmine async test function, it is actually synchronous and this
  // test test passes synchronously when it is supposed to fail in the timeout.
  xit('async test seems to work (but actually does not)', (done: Function) => {
    // done is undefined at this point
    setTimeout(() => {
      expect(false).toBe(true); // this assertion should fail
      done(); // uncaught exception (if gets here) because done is not defined.
    }, 500);
    // test completes before timeout callback runs
  });
});

