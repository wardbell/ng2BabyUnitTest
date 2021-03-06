///// Boiler Plate ////
import {bind, By, Component, Directive, EventEmitter, FORM_DIRECTIVES} from 'angular2/angular2';

// Angular 2 Test Bed
import {
beforeEachProviders, inject, injectAsync, RootTestComponent as RTC,
beforeEach, ddescribe, xdescribe, describe, expect, iit, it, xit // Jasmine wrappers
} from 'angular2/testing';

import {dispatchEvent, DoneFn, injectTcb, tick} from '../test-helpers/test-helpers';

///// Testing this component ////
import {HeroDetailComponent} from './hero-detail.component';
import {Hero} from './hero';

describe('HeroDetailComponent', () => {

  /////////// Component Tests without DOM interaction /////////////
  describe('(No DOM)', () => {
    it('can be created', () => {
      let hdc = new HeroDetailComponent();
      expect(hdc instanceof HeroDetailComponent).toEqual(true); // proof of life
    });

    it('onDelete method should raise delete event', (done: DoneFn) => {
      let hdc = new HeroDetailComponent();

      // Listen for the HeroComponent.delete EventEmitter's event
      hdc.delete.toRx().subscribe(() => {
        console.log('HeroComponent.delete event raised');
        done();  // it must have worked
      }, (error: any) => { fail(error); done() });

      hdc.onDelete();
    });

    // Disable until toPromise() works again
    xit('onDelete method should raise delete event (w/ promise)', (done: DoneFn) => {

      let hdc = new HeroDetailComponent();

      // Listen for the HeroComponent.delete EventEmitter's event
      let p = hdc.delete.toRx()
        .toPromise()
        .then(() => {
          console.log('HeroComponent.delete event raised in promise');
        })
        .then(done, done.fail);

      hdc.delete.toRx()
        .subscribe(() => {
          console.log('HeroComponent.delete event raised in subscription')
        });

      hdc.onDelete();

      // toPromise() does not fulfill until emitter is completed by `return()`
      hdc.delete.return();
    });

    it('onUpdate method should modify hero', () => {
      let hdc = new HeroDetailComponent();
      hdc.hero = new Hero(42, 'Cat Woman');
      let origNameLength = hdc.hero.name.length;

      hdc.onUpdate();
      expect(hdc.hero.name.length).toBeGreaterThan(origNameLength);
    });
  });


  /////////// Component tests that check the DOM /////////////
  describe('(DOM)', () => {
    // Disable until toPromise() works again
    xit('Delete button should raise delete event', injectTcb(tcb => {

      // We only care about the button
      let template = '<button (click)="onDelete()">Delete</button>';

      return tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {
          let hdc: HeroDetailComponent = rootTC.debugElement.componentInstance;

          // // USE PROMISE WRAPPING AN OBSERVABLE UNTIL can get `toPromise` working again
          // let p = new Promise<Hero>((resolve) => {
          //   // Listen for the HeroComponent.delete EventEmitter's event with observable
          //   hdc.delete.toRx().subscribe((hero: Hero) => {
          //     console.log('Observable heard HeroComponent.delete event raised');
          //     resolve(hero);
          //   });
          // })

          //Listen for the HeroComponent.delete EventEmitter's event with promise
          let p = <Promise<Hero>> hdc.delete.toRx().toPromise()
          .then((hero:Hero) => {
            console.log('Promise heard HeroComponent.delete event raised');
          });

          // trigger the 'click' event on the HeroDetailComponent delete button
          let el = rootTC.debugElement.query(By.css('button'));
          el.triggerEventHandler('click', null);

          // toPromise() does not fulfill until emitter is completed by `return()`
          hdc.delete.return();

          return p;
        });

    }));

    it('Update button should modify hero', injectTcb(tcb => {

      let template =
        `<div>
          <button id="update" (click)="onUpdate()" [disabled]="!hero">Update</button>
          <input [(ng-model)]="hero.name"/>
        </div>`

      return tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {

          let hdc: HeroDetailComponent = rootTC.debugElement.componentInstance;
          hdc.hero = new Hero(42, 'Cat Woman');
          let origNameLength = hdc.hero.name.length;

          // trigger the 'click' event on the HeroDetailComponent update button
          rootTC.debugElement.query(By.css('#update'))
            .triggerEventHandler('click', null);

          expect(hdc.hero.name.length).toBeGreaterThan(origNameLength);
        });
    }));

    it('Entering hero name in textbox changes hero', injectTcb(tcb => {

      let hdc: HeroDetailComponent
      let template = `<input [(ng-model)]="hero.name"/>`

      return tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rootTC: RTC) => {

          hdc = rootTC.debugElement.componentInstance;

          hdc.hero = new Hero(42, 'Cat Woman');
          rootTC.detectChanges();

          // get the HTML element and change its value in the DOM
          var input = rootTC.debugElement.query(By.css('input')).nativeElement;
          input.value = "Dog Man"
          dispatchEvent(input, 'change'); // event triggers Ng to update model

          rootTC.detectChanges();
          // model update hasn't happened yet, despite `detectChanges`
          expect(hdc.hero.name).toEqual('Cat Woman');

        })
        .then(tick) // must wait a tick for the model update
        .then(() => {
          expect(hdc.hero.name).toEqual('Dog Man');
        });
    }));

    // Simulates ...
    // 1. change a hero
    // 2. select a different hero
    // 3  re-select the first hero
    // 4. confirm that the change is preserved in HTML
    // Reveals 2-way binding bug in alpha-36, fixed in pull #3715 for alpha-37

    it('toggling heroes after modifying name preserves the change on screen', injectTcb(tcb => {

      let hdc: HeroDetailComponent;
      let hero1 = new Hero(1, 'Cat Woman');
      let hero2 = new Hero(2, 'Goat Boy');
      let input: HTMLInputElement;
      let rootTC: RTC;
      let template = `{{hero.id}} - <input [(ng-model)]="hero.name"/>`

      return tcb
        .overrideTemplate(HeroDetailComponent, template)
        .createAsync(HeroDetailComponent)
        .then((rtc: RTC) => {
          rootTC = rtc;
          hdc = rootTC.debugElement.componentInstance;

          hdc.hero = hero1; // start with hero1
          rootTC.detectChanges();

          // get the HTML element and change its value in the DOM
          input = rootTC.debugElement.query(By.css('input')).nativeElement;
          input.value = "Dog Man"
          dispatchEvent(input, 'change'); // event triggers Ng to update model
        })
        .then(tick) // must wait a tick for the model update
        .then(() => {
          expect(hdc.hero.name).toEqual('Dog Man');

          hdc.hero = hero2 // switch to hero2
          rootTC.detectChanges();

          hdc.hero = hero1  // switch back to hero1
          rootTC.detectChanges();

          // model value will be the same changed value (of course)
          expect(hdc.hero.name).toEqual('Dog Man');

          // the view should reflect the same changed value
          expect(input.value).toEqual('Dog Man');
        });
    }));
  });
});
