console.log('Before dummy describe');
describe('dummy tests:', function () {
    console.log('Inside dummy describe');
    it('sync test works', function () { return expect(true).toBe(true); });
    it('async test works', function (done) {
        setTimeout(function () {
            expect(false).toBe(false);
            done();
        }, 50);
    });
});
//# sourceMappingURL=dummy.spec.js.map