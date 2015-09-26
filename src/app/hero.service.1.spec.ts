// The phase of hero-service-spec
// when we're outlining what we want to test

describe('HeroService (test plan)', () => {

	describe('creation', () => {
		xit('can instantiate the service');
		xit('heroes array is empty');
	});

  describe('#refresh', () => {

		describe('when server provides heroes', () => {
			xit('returns expected # of heroes when fulfilled');
			xit('heroes array is empty until fulfilled');
			xit('heroes array is populated when fulfilled');
			xit('returns no heroes when source data are empty');
			xit('resets existing heroes array w/ original data when re-refresh');
			xit('resets heroes array to empty while waiting for re-refresh');
		});

		describe('when the server fails', () => {
			xit('returns failed promise with the server error');
			xit('resets heroes array to empty');
		});

	});

});

import {HeroService} from './hero.service';
import {BackendService} from './backend.service';
import {Hero} from './hero';

let heroData:Hero[];

describe('HeroService (intermediate tests)', () => {

	describe('creation', () => {
		it('can instantiate the service', () => {
			let service = new HeroService(null);
			expect(service).toBeDefined();
		});

		it('heroes is empty', () => {
			let service = new HeroService(null);
			expect(service.heroes.length).toEqual(0);
		});
	});

	xdescribe('dont run', () => {

		// No good!
		it('returns expected # of heroes when fulfilled', () => {
			let backend = <BackendService>{};
			let service = new HeroService(backend);
			service.refresh()
				.then(heroes => {
					expect(heroes.length).toBeGreaterThan(0); // don’t know how many to expect yet
				});
		});

		// better ... but not async!
		it('returns expected # of heroes when fulfilled', () => {

			heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];

			let backend = <BackendService>{
				// return a promise for fake heroes that resolves as quickly as possible
				fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
			};

			let service = new HeroService(backend);
			service.refresh()
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

		heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];

    let backend = <BackendService>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.refresh()
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

		heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];    heroData = [new Hero('Foo'), new Hero('Bar'), new Hero('Baz')];

    let backend = <BackendService>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.refresh()
      .then(heroes => {
        expect(heroes.length).toEqual(heroData.length);
			})
			.then(done);
  });

	// Final before beforeEach refactoring
	it('returns expected # of heroes when fulfilled', done => {

		heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];

    let backend = <BackendService>{
			// return a promise for fake heroes that resolves as quickly as possible
      fetchAllHeroesAsync: () => Promise.resolve<Hero[]>(heroData)
    };

    let service = new HeroService(backend);
    service.refresh()
      .then(heroes => {
        expect(heroes.length).toEqual(heroData.length);
			})
			.catch(fail).then(done);
  });
});
