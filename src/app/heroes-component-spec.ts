///// Boiler Plate ////
import {bind} from 'angular2/angular2';

import {
beforeEachBindings, By, DebugElement, RootTestComponent as RTC,
// Jasmine overrides
beforeEach, ddescribe, xdescribe, describe, iit, it, xit //expect,
} from 'angular2/test';

import {expectSelectedHtml, expectViewChildHtml, injectAsync, injectTcb} from 'test-helpers/test-helpers';

///// Testing this component ////
import {HeroesComponent} from './heroes-component';
import {Hero} from './hero';
import {HeroService} from './hero-service';
import {HEROES} from './mock-heroes';
import {User} from './user';

describe('HeroesComponent', () => {

  let mockHeroData: Hero[];
  let mockHero: Hero;
  let mockService: any; // too hard to maintain type safety on this mock
  let mockUser: User;

  beforeEach(() => {
    mockHeroData = HEROES.map(h => h.clone());
    mockHero = mockHeroData[0];
    mockService = MockDataserviceFactory();
    mockUser = new User();
  });

  /////////// Component Tests without DOM interaction /////////////
  describe('(No DOM)', () => {

    it('can be created', () => {
      let hc = new HeroesComponent(mockService, mockUser)
      expect(hc instanceof HeroesComponent).toEqual(true); // proof of life
    });

    it('has expected userName', () => {
      let hc = new HeroesComponent(mockService, mockUser)
      expect(hc.userName).toEqual(mockUser.name);
    });

    describe('#heroes', () => {

      it('lacks heroes when created', () => {
        let hc = new HeroesComponent(mockService, mockUser)
        let heroes = hc.heroes; // trigger service
        expect(heroes.length).toEqual(0); // not filled yet
      });

      it('has heroes after cache loaded', injectAsync(done => {
        let hc = new HeroesComponent(mockService, mockUser)
        let heroes = hc.heroes; // trigger service

        // Wait for them ...
        mockService.getAllHeroesPromise(0)
          .then(() => {
            heroes = hc.heroes; // now the component has heroes to show
            expect(heroes.length).toEqual(mockHeroData.length);
          })
          .catch(fail).then(done, done);
      }));

      it('restores heroes after refresh called', injectAsync(done => {
        let hc = new HeroesComponent(mockService, mockUser)
        let heroes = hc.heroes; // trigger service

        // Wait for them ...
        mockService.getAllHeroesPromise(0)
          .then(() => {
            heroes = hc.heroes; // now the component has heroes to show
            heroes[0].name = 'Wotan';
            heroes.push(new Hero('Thor'));
            hc.onRefresh();
          })
          .then(() => {
            heroes = hc.heroes; // get it again (don't reuse old array!)
            expect(heroes[0]).not.toEqual('Wotan'); // change reversed
            expect(heroes.length).toEqual(mockHeroData.length); // orig num of heroes
          })
          .catch(fail).then(done, done);
      }));
    });
  });

  /////////// Component tests that check the DOM /////////////
  describe('(DOM)', () => {

    beforeEach(() => {
      mockUser.name = 'Johnny'; // for fun
    });

    // Set up DI bindings required by component (and its nested components?)
    // else hangs silently forever
    beforeEachBindings(() => [
      bind(HeroService).toFactory(MockDataserviceFactory),
      bind(User).toValue(mockUser)
    ]);

    it('can be created', injectTcb((tcb, done) => {
      let template = '<h1>Nuts</h1>';
      tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => expect(true).toBe(true)) // proof of life
        .catch(fail).then(done, done);
    }));

    it('binds view to userName', injectTcb((tcb, done) => {
      let template = `<h1>{{userName}}'s Heroes</h1>`;
      tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          let hc: HeroesComponent = rootTC.componentInstance;


          rootTC.detectChanges(); // trigger component property binding
          expectSelectedHtml(rootTC, 'h1').toMatch(hc.userName);
          expectViewChildHtml(rootTC).toMatch(hc.userName);
        })
        .catch(fail).then(done, done);
    }));


    describe('#heroes', () => {

      it('binds view to heroes', injectTcb((tcb, done) => {
        mockHeroData.length = 3; // only need a few

        // focus on the part of the template that displays heroes
        let template =
          `<ul>
            <li *ng-for="#h of heroes">({{h.id}}) {{h.name}}</li>
          </ul>`;
        tcb
          .overrideTemplate(HeroesComponent, template)
          .createAsync(HeroesComponent)
          .then((rootTC: RTC) => {
            // trigger {{heroes}} binding which triggers async getAllHeroes
            rootTC.detectChanges();

            // hc.heroes is still undefined; need a JS cycle to get the data
            return rootTC;
          })
          .then((rootTC: RTC) => {
            let hc: HeroesComponent = rootTC.componentInstance;
            // now heroes are available for binding
            expect(hc.heroes.length).toEqual(mockHeroData.length);

            rootTC.detectChanges(); // trigger component property binding

            // confirm hero list is displayed by looking for a known hero
            expect(rootTC.nativeElement.innerHTML).toMatch(mockHero.name);
          })
          .catch(fail).then(done, done);
      }));

    });

  });

  ////// Helpers //////

  function MockDataserviceFactory() {

    // Mock the HeroService members we think will matter
    let mock = jasmine.createSpyObj('HeroService',
      ['getAllHeroes', 'removeHero']);

    mock.getAllHeroes.and.callFake((force: boolean) => {
      return Promise.resolve<Hero[]>(mockHeroData.map(h => h.clone()));
    });

    mock.removeHero.and.callFake((hero: Hero) => {
      let ix = mockHeroData.indexOf(hero);
      if (ix > -1) {
        mockHeroData.splice(ix, 1);
        return true;
      } else {
        return false;
      }
    });

    // make it easy to wait on a promise from any of these calls

    mock.getAllHeroesPromise = (callNum = 0) => {
      var call = mock.getAllHeroes.calls.all()[callNum];
      return <Promise<Hero[]>>call && call.returnValue;
    }

    return mock;
  }

});
