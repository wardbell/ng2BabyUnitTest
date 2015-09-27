///// Boiler Plate ////
import {bind} from 'angular2/angular2';

// Angular 2 Test Bed
import {
  beforeEachBindings, By, DebugElement, RootTestComponent as RTC, TestComponentBuilder,
  beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/test';

import {
  expectSelectedHtml,
  expectViewChildHtml,
  expectViewChildClass,
  injectAsync, injectTcb, tick} from '../test-helpers/test-helpers';

///// Testing this component ////
import {HeroesComponent} from './heroes.component';
import {Hero} from './hero';
import {HeroService} from './hero.service';
import {User} from './user';

let heroData: Hero[]; // fresh heroes for each test
let mockUser: User;

describe('HeroesComponent', () => {

  beforeEach(() => {
    heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];
    mockUser = new User();
  });

  /////////// Component Tests without DOM interaction /////////////
  describe('(No DOM)', () => {
    let hc:HeroesComponent;

    beforeEach(()=> {
      hc = new HeroesComponent(<any>new HappyHeroService(), mockUser)
    });

    it('can be created', () => {
      expect(hc instanceof HeroesComponent).toEqual(true); // proof of life
    });

    it('has expected userName', () => {
      expect(hc.userName).toEqual(mockUser.name);
    });

    describe('#heroes', () => {

      it('lacks heroes when created', () => {
        hc.onInit(); // component initialization triggers service
        let heroes = hc.heroes;
        expect(heroes.length).toEqual(0); // not filled yet
      });

      it('has heroes after cache loaded', injectAsync(() => {
        hc.onInit(); // component initialization triggers service
        let heroes = hc.heroes;

        return tick() // Wait for heroes to arrive
          .then(() => {
            heroes = hc.heroes; // now the component has heroes to show
            expect(heroes.length).toEqual(heroData.length);
          });
      }));

      it('restores heroes after refresh called', injectAsync(() => {
        hc.onInit(); // component initialization triggers service
        let heroes = hc.heroes;

        return tick() // Wait for heroes to arrive
          .then(() => {
            heroes = hc.heroes; // now the component has heroes to show
            heroes[0].name = 'Wotan';
            heroes.push(new Hero(33, 'Thor'));
            hc.onRefresh();
          })
          .then(() => {
            heroes = hc.heroes; // get it again (don't reuse old array!)
            expect(heroes[0]).not.toEqual('Wotan'); // change reversed
            expect(heroes.length).toEqual(heroData.length); // orig num of heroes
          });
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
      bind(HeroService).toClass(HappyHeroService),
      bind(User).toValue(mockUser)
    ]);

    it('can be created', injectTcb(tcb => {
      let template = '<h1>Nuts</h1>';
      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          let hc: HeroesComponent = rootTC.componentInstance;
          expect(hc).toBeDefined();// proof of life
        });
    }));

    it('onInit called after the test calls detectChanges', injectTcb(tcb => {
      let template = '<h1></h1>';
      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          let hc: HeroesComponent = rootTC.componentInstance;
          let spy = spyOn(hc, 'onInit').and.callThrough();

          expect(spy.calls.count()).toEqual(0);
          rootTC.detectChanges();
          expect(spy.calls.count()).toEqual(1);
        });
    }));

    it('binds view to userName', injectTcb(tcb => {
      let template = `<h1>{{userName}}'s Heroes</h1>`;
      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          let hc: HeroesComponent = rootTC.componentInstance;

          rootTC.detectChanges(); // trigger component property binding
          expectSelectedHtml(rootTC, 'h1').toMatch(hc.userName);
          expectViewChildHtml(rootTC).toMatch(hc.userName);
        });
    }));


    describe('#heroes', () => {

      it('binds view to heroes', injectTcb(tcb => {

        // focus on the part of the template that displays heroes
        let template =
          `<ul>
            <li *ng-for="#h of heroes">({{h.id}}) {{h.name}}</li>
          </ul>`;
        return tcb
          .overrideTemplate(HeroesComponent, template)
          .createAsync(HeroesComponent)
          .then((rootTC: RTC) => {
            // trigger {{heroes}} binding
            rootTC.detectChanges();

            // hc.heroes is still empty; need a JS cycle to get the data
            return rootTC;
          })
          .then((rootTC: RTC) => {
            let hc: HeroesComponent = rootTC.componentInstance;
            // now heroes are available for binding
            expect(hc.heroes.length).toEqual(heroData.length);

            rootTC.detectChanges(); // trigger component property binding

            // confirm hero list is displayed by looking for a known hero
            expect(rootTC.nativeElement.innerHTML).toMatch(heroData[0].name);
          });
      }));

    });

    describe('#onSelected (TBD)', () => {

      it('no hero is selected by default', injectHC(hc => {
        expect(hc.currentHero).not.toBeDefined();
      }));

      it('sets the "currentHero"', injectHC(hc => {
        hc.onSelect(heroData[1]); // select the second hero
        expect(hc.currentHero).toEqual(heroData[1]);
      }));

      // TODO: Remove `withNgClass=true` ONCE BUG IS FIXED
      it('the view of the "currentHero" has the "selected" class (NG2 BUG)', injectHC((hc, rootTC) => {
        hc.onSelect(heroData[1]); // select the second hero

        rootTC.detectChanges();

        // The 3rd ViewChild is 2nd hero; the 1st is for the template
        expectViewChildClass(rootTC, 2).toMatch('selected');
      }, true /* true == include ngClass */));

      it('the view of a non-selected hero does NOT have the "selected" class', injectHC((hc, rootTC)  => {
        hc.onSelect(heroData[1]); // select the second hero
        rootTC.detectChanges();
        // The 4th ViewChild is 3rd hero; the 1st is for the template
        expectViewChildClass(rootTC, 4).not.toMatch('selected');
      }));

      it('no hero is selected after onRefresh() called', injectHC(hc => {
        hc.onSelect(heroData[1]); // select the second hero
        hc.onRefresh();
        expect(hc.currentHero).not.toBeDefined();
      }));
    });

  });

});

////// Helpers //////

class HappyHeroService {

  heroes: Hero[];

  refresh() {
    this.heroes = [];
    // updates cached heroes after one JavaScript cycle
    return new Promise((resolve, reject) => {
      this.heroes.push(...heroData);
      resolve(this.heroes);
    });
  }
}


// The same setup for every test in this suite
// TODO: Remove `withNgClass` and always include in template ONCE BUG IS FIXED
function injectHC(testFn: (hc: HeroesComponent, rootTC?: RTC) => void, withNgClass:boolean = false) {

  // This is the bad boy:   [ng-class]="getSelectedClass(hero)"
  let ngClass = withNgClass ? '[ng-class]="getSelectedClass(hero)"' : '';

  // focus on the part of the template that displays heroes
  let template =
    `<ul><li *ng-for="#hero of heroes"
      ${ngClass}
      (click)="onSelect(hero)">
      ({{hero.id}}) {{hero.name}}
      </li></ul>`;

  return injectTcb(tcb => {
    let hc: HeroesComponent;

    return tcb
    .overrideTemplate(HeroesComponent, template)
    .createAsync(HeroesComponent)
    .then((rootTC:RTC) => {
      hc = rootTC.componentInstance;
      rootTC.detectChanges();// trigger {{heroes}} binding
      return rootTC;
    })
    .then((rootTC:RTC) => { // wait a tick until heroes are fetched

    // CRASHING HERE IF TEMPLATE HAS '[ng-class]="getSelectedClass(hero)"'
    // WITH EXCEPTION:
    //   "Expression 'getSelectedClass(hero) in null' has changed after it was checked."

      rootTC.detectChanges(); // show the list
      testFn(hc, rootTC);
    });
  })
}
