// The phase of hero-service-spec
// when we're outlining what we want to test
import {HeroService} from './hero-service';
import {Backend} from './backend';

describe('HeroService (test plan)', () => {

  it('we can instantiate the service', () => {
		let backend = <Backend>{};
		let service = new HeroService(backend);
		expect(service).toBeDefined();
	});

  describe('#getAllHeroes', () => {

		describe('when server provides heroes', () => {
			xit('returns expected # of heroes when fulfilled');
			xit('returns no heroes when source data are empty');
			xit('re-execution preserves existing data in same cached array');
			xit('re-execution w/ force=true returns new array w/ original data');
			xit('when the server fails, returns failed promise with the server error');
		});

		describe('when the server fails', () => {
			xit('returns failed promise with the server error');
		});

	});

});

import {Hero} from './hero';

let heroData:Hero[];

describe('HeroService (intermediate tests)', () => {

	xdescribe('dont run', () => {

		// No good!
		it('returns expected # of heroes when fulfilled', () => {
			let backend = <Backend>{};
			let service = new HeroService(backend);
			service.getAllHeroes()
				.then(heroes => {
					expect(heroes.length).toBeGreaterThan(0); // don’t know how many to expect yet
				});
		});

		// better ... but not async!
		it('returns expected # of heroes when fulfilled', () => {

			heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];

			let backend = <Backend>{
				// return a promise for fake heroes that resolves as quickly as possible
				fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
			};

			let service = new HeroService(backend);
			service.getAllHeroes()
				.then(heroes => {
					expect(heroes.length).toEqual(heroData.length); // is it?
					expect(heroes.length).not.toEqual(heroData.length); // or is it not?
					console.log('** inside callback **');
			});

			console.log('** end of test **');
		});
	});
	
  // Now it's async!
	it('returns expected # of heroes when fulfilled', done => {

    heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];

    let backend = <Backend>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.getAllHeroes()
      .then(heroes => {
        expect(heroes.length).toEqual(heroData.length); // is it?
        //expect(heroes.length).not.toEqual(heroData.length); // or is it not?
				console.log('** inside callback **');
				done();
		});

		console.log('** end of test **');
  });

  // Final before catch
	it('returns expected # of heroes when fulfilled', done => {

    heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];

    let backend = <Backend>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.getAllHeroes()
      .then(heroes => {
        expect(heroes.length).toEqual(heroData.length);
			})
			.then(done);
  });

	// Final before beforeEach refactoring
	it('returns expected # of heroes when fulfilled', done => {

    heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];

    let backend = <Backend>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.getAllHeroes()
      .then(heroes => {
        expect(heroes.length).toEqual(heroData.length);
			})
			.catch(fail).then(done);
  });
});
