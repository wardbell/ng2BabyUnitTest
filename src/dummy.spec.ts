import {
    AsyncTestCompleter,
    inject,
    TestComponentBuilder,
    // Jasmine overrides
    describe,
    expect,
    iit,
    it,
    xit,
    } from 'angular2/test';

type TCB = typeof TestComponentBuilder;
type ATC = typeof AsyncTestCompleter;

console.log('Before describe');
describe('dummy tests:', () => {
    console.log('Inside describe');

    it('sync test works', () => expect(true).toBe(true) );

    // Doesn't actually work because Ng Test framework  overwrites Jasmine methods
    // althought test passes synchronously
    it('async test works', (done:Function) => {
        // done is undefined at this point
        setTimeout(() => {
            expect(false).toBe(false); // this assertion passes
            done(); // uncaught exception (if gets here) because done is not defined.
        }, 500);
        // test completes before timeout callback runs
    });

    it('async test2 works',inject([TestComponentBuilder,  AsyncTestCompleter], (tcb:TCB, async:ATC) => {
        setTimeout(() => {
            expect(false).toBe(false);
            async.done();
        }, 50);
    }));

    it('another async test', inject([TestComponentBuilder,  AsyncTestCompleter], (tcb:TCB, async:ATC) =>{
        expect(false).toBe(false);
        async.done();
    }));
});

