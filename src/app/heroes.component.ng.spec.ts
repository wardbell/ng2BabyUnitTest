///// Angular 2 Test Bed  ////
import {bind, By} from 'angular2/angular2';

import {
  beforeEach, xdescribe, describe, it, xit, // Jasmine wrappers
  beforeEachProviders,
  injectAsync,
  RootTestComponent as RTC,
  TestComponentBuilder as TCB
} from 'angular2/testing';

import {
  expectSelectedHtml,
  expectViewChildHtml,
  expectViewChildClass,
  injectTcb, tick} from '../test-helpers/test-helpers';

///// Testing this component ////
import {HeroesComponent} from './heroes.component';
import {Hero} from './hero';
import {HeroService} from './hero.service';
import {User} from './user';

let hc: HeroesComponent;
let heroData: Hero[]; // fresh heroes for each test
let mockUser: User;
let service: HeroService;

// get the promise from the refresh spy;
// casting required because of inadequate d.ts for Jasmine
let refreshPromise = () => (<any>service.refresh).calls.mostRecent().returnValue;

describe('HeroesComponent (with Angular)', () => {

  beforeEach(() => {
    heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];
    mockUser = new User();
  });

  // Set up DI bindings required by component (and its nested components?)
  // else hangs silently forever
  beforeEachProviders(() => [
    bind(HeroService).toClass(HappyHeroService),
    bind(User).toValue(mockUser)
  ]);

  // test-lib bug? first test fails unless this no-op test runs first
  it('ignore this test', () =>  expect(true).toEqual(true)); // hack

  it('can be created and has userName', injectTcb((tcb:TCB) => {
    let template = '';
    return  tcb
      .overrideTemplate(HeroesComponent, template)
      .createAsync(HeroesComponent)
      .then((rootTC: RTC) => {
        hc = rootTC.debugElement.componentInstance;
        expect(hc).toBeDefined();// proof of life
        expect(hc.userName).toEqual(mockUser.name);
      });
  }));

  it('binds view to userName', injectTcb((tcb:TCB) => {
    let template = `<h1>{{userName}}'s Heroes</h1>`;
    return tcb
      .overrideTemplate(HeroesComponent, template)
      .createAsync(HeroesComponent)
      .then((rootTC: RTC) => {
        hc = rootTC.debugElement.componentInstance;

        rootTC.detectChanges(); // trigger component property binding
        expectSelectedHtml(rootTC, 'h1').toMatch(hc.userName);
        expectViewChildHtml(rootTC).toMatch(hc.userName);
      });
  }));

  describe('#onInit', () => {
    let template = '';

    it('HeroService.refresh not called immediately',
      injectTcb([HeroService], (tcb:TCB, heroService:HeroService) => {

      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then(() => {
          let spy = <jasmine.Spy><any> heroService.refresh;
          expect(spy.calls.count()).toEqual(0);
        });
    }));

    it('onInit calls HeroService.refresh',
      injectTcb([HeroService], (tcb:TCB, heroService:HeroService) => {

      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          hc = rootTC.debugElement.componentInstance;
          let spy = <jasmine.Spy><any> heroService.refresh;
          hc.onInit(); // Angular framework calls when it creates the component
          expect(spy.calls.count()).toEqual(1);
        });
    }));

    it('onInit is called after the test calls detectChanges', injectTcb((tcb:TCB) => {

      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          hc = rootTC.debugElement.componentInstance;
          let spy = spyOn(hc, 'onInit').and.callThrough();

          expect(spy.calls.count()).toEqual(0);
          rootTC.detectChanges();
          expect(spy.calls.count()).toEqual(1);
        });
    }));
  })

  describe('#heroes', () => {
    // focus on the part of the template that displays heroe names
    let template =
      '<ul><li *ng-for="#h of heroes">{{h.name}}</li></ul>';

    it('binds view to heroes', injectTcb((tcb:TCB) => {
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
          hc = rootTC.debugElement.componentInstance;
          // now heroes are available for binding
          expect(hc.heroes.length).toEqual(heroData.length);

          rootTC.detectChanges(); // trigger component property binding

          // confirm hero list is displayed by looking for a known hero
          expect(rootTC.debugElement.nativeElement.innerHTML).toMatch(heroData[0].name);
        });
    }));

    // ... add more tests of component behavior affecting the heroes list

  });

  describe('#onSelected', () => {

    it('no hero is selected by default', injectHC(hc => {
      expect(hc.currentHero).not.toBeDefined();
    }));

    it('sets the "currentHero"', injectHC(hc => {
      hc.onSelect(heroData[1]); // select the second hero
      expect(hc.currentHero).toEqual(heroData[1]);
    }));

    it('no hero is selected after onRefresh() called', injectHC(hc => {
      hc.onSelect(heroData[1]); // select the second hero
      hc.onRefresh();
      expect(hc.currentHero).not.toBeDefined();
    }));

    // TODO: Remove `withNgClass=true` ONCE BUG IS FIXED
    xit('the view of the "currentHero" has the "selected" class (NG2 BUG)', injectHC((hc, rootTC) => {
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

  });

  // Most #onDelete tests not re-implemented because
  // writing those tests w/in Angular adds little value and
  // is far more painful than writing them to run outside Angular
  // Only bother with the one test that checks the DOM
  describe('#onDeleted', () => {
    let template =
      '<ul><li *ng-for="#h of heroes">{{h.name}}</li></ul>';

    it('the list view does not contain the "deleted" currentHero', injectTcb((tcb:TCB) => {
      return tcb
        .overrideTemplate(HeroesComponent, template)
        .createAsync(HeroesComponent)
        .then((rootTC: RTC) => {
          hc = rootTC.debugElement.componentInstance;
          // trigger {{heroes}} binding
          rootTC.detectChanges();
          return rootTC; // wait for heroes to arrive
        })
        .then((rootTC: RTC) => {
          hc.currentHero = heroData[1];
          hc.onDelete()
          rootTC.detectChanges(); // trigger component property binding

          // confirm hero list is not displayed by looking for removed hero
          expect(rootTC.debugElement.nativeElement.innerHTML).not.toMatch(heroData[1].name);
        });
    }));
  });
});

////// Helpers //////

class HappyHeroService {

  constructor() {
    spyOn(this, 'refresh').and.callThrough();
  }

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


// The same setup for every test in the #onSelected suite
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

  return injectTcb((tcb:TCB) => {
    let hc: HeroesComponent;

    return tcb
    .overrideTemplate(HeroesComponent, template)
    .createAsync(HeroesComponent)
    .then((rootTC:RTC) => {
      hc = rootTC.debugElement.componentInstance;
      rootTC.detectChanges();// trigger {{heroes}} binding
      return rootTC;
    })
    .then((rootTC:RTC) => { // wait a tick until heroes are fetched
console.error("WAS THIS FIXED??");
    // CRASHING HERE IF TEMPLATE HAS '[ng-class]="getSelectedClass(hero)"'
    // WITH EXCEPTION:
    //   "Expression 'getSelectedClass(hero) in null' has changed after it was checked."

      rootTC.detectChanges(); // show the list
      testFn(hc, rootTC);
    });
  })
}
