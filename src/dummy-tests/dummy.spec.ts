console.log('Before dummy describe');
describe('dummy tests:', () => {
    console.log('Inside dummy describe');

    it('sync test works', () => expect(true).toBe(true) );

    it('null is not the same thing as undefined', () => expect(null).not.toEqual(undefined) );

    it('async test works', (done:Function) => {
        setTimeout(() => {
            expect(false).toBe(false);
            done();
        }, 50);
    });
});

