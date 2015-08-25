var test_1 = require('angular2/test');
console.log('Before dummyWithTCB describe');
test_1.describe('dummy TCB tests:', function () {
    console.log('Inside dummyWithTCB describe');
    test_1.it('sync test works', function () { return test_1.expect(true).toBe(true); });
    // Doesn't actually work because Ng Test framework  overwrites Jasmine methods
    // althought test passes synchronously
    test_1.it('async test seems to work (but actually does not)', function (done) {
        // done is undefined at this point
        setTimeout(function () {
            test_1.expect(false).toBe(true); // this assertion should fail
            done(); // uncaught exception (if gets here) because done is not defined.
        }, 500);
        // test completes before timeout callback runs
    });
    test_1.it('async test2 works', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        setTimeout(function () {
            test_1.expect(false).toBe(false);
            async.done();
        }, 50);
    }));
    test_1.it('another async test', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        test_1.expect(false).toBe(false);
        async.done();
    }));
});
//# sourceMappingURL=dummyWithTCB.spec.js.map