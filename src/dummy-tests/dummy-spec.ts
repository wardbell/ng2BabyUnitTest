console.log('Before dummy describe');
describe('dummy tests:', () => {
  console.log('Inside dummy describe');

  describe('async tests', () => {

    it('sync test works', () => expect(true).toBe(true));

    it('null is not the same thing as undefined', () => expect(null).not.toEqual(undefined));

  })


  describe('async tests', () => {
    it('setTimeout delay test passes', (done: Function) => {
      setTimeout(() => {
        expect(false).toBe(false);
        done();
      }, 50);
    });

    it('resolved promise succeeds as expected', done => {
      Promise.resolve(true)
        .then(result => {
          expect(result).toEqual(true);
        })
        .catch(fail).then(done);
    });

    ////// Demonstrate the `.catch(fail).then(done)` pattern /////
    // If something goes wrong, we want to see the real error
    // not get an obscuring "async timeout" error
    //
    // Testing dilemma: to see it work we have to let the error through
    // but then it looks like our tests are failing.
    // Can't use Jasmine's expectToThrow because its `fail` function
    // doesn't actually throw.
    //
    // Our solution is to let you see how it works by COMMENTING OUT
    // ".catch(()=>{}) // eat the failure.""

    it('rejected promise fails as expected', done => {
      Promise.reject('reject on purpose')
        .then(result => {
          fail('should not get here');
        })
        // DON'T PUT THE NEXT LINE IN YOUR CODE!
        .catch(()=>{}) // eat the failure. Comment out to see how catch-fail-done idiom works
        .catch(fail).then(done);
    });

    it('exception in promise handler fails as expected', done => {
      Promise.resolve(true)
        .then(result => {
          throw new Error('intentional exception')
          fail('should not get here');
        })
        // DON'T PUT THE NEXT LINE IN YOUR CODE!
        .catch(()=>{}) // eat the failure. Comment out to see how catch-fail-done idiom works
        .catch(fail).then(done);
    });
  })

});

