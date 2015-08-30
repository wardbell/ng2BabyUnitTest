///// Boiler Plate ////
import {bind, Component, Directive, EventEmitter, View} from 'angular2/angular2';

import {
  beforeEachBindings,
  DebugElement,
  RootTestComponent as RTC,
ObservableWrapper,
  // Jasmine overrides
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  //expect,
  iit,
  it,
  xit
} from 'angular2/test';

import {injectAsync, injectTcb, expectViewChildHtmlToMatch} from 'testHelpers';

///// Testing this particular component ////

import {Hero} from 'hero';

import {HeroComponent} from 'heroComponent';

let mockHero:Hero;

// HeroWrapper is a convenient way to communicate w/ HeroComponent in a test
@Component({selector: 'hero-wrapper'})
@View({
  template: `<hero [hero]="currentHero" [usernm]="userName" (delete)="onDelete()"></hero>`,
  directives: [HeroComponent]
})
class HeroWrapper {
  currentHero = new Hero('Cat Woman', 42);
  userName = 'Sally';
  testCallback() {} // monkey-punched in a test
  onDelete() { this.testCallback(); }
}

describe('HeroComponent', () => {

  beforeEach(() => {
    mockHero = new Hero('Cat Woman', 42);
  });

  it('can be created', () => {
    let hc = new HeroComponent()
    expect(hc instanceof HeroComponent).toEqual(true); // proof of life
  });


  it('parent "currentHero" flows down to HeroComponent', injectTcb( (tcb, done) => {
    tcb
      .createAsync(HeroWrapper)
      .then((rootTC:RTC) => {

        rootTC.detectChanges();
        let hc:HeroComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:HeroWrapper = rootTC.componentInstance;

        expect(hw.currentHero).toBe(hc.hero);
        done();
      });
  }));

  // FRAGILE because assumes precise knowledge of HeroComponent template
  it('delete button should raise delete event for parent component', injectTcb( (tcb, done) => {
    tcb
      .createAsync(HeroWrapper)
      .then((rootTC:RTC) => {

        rootTC.detectChanges();
        let hc:HeroComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:HeroWrapper = rootTC.componentInstance;

        // Watch the HeroComponent.delete EventEmitter's event
        let subscription = hc.delete.toRx().subscribe(() => {
          // console.log('HeroComponent.delete event raised');
          subscription.dispose();})

        // We can invoke HeroComponent delete button handler OR
        // trigger the 'click' event on the delete HeroComponent button
        // BUT DON'T DO BOTH
        // hc.onDelete();
        rootTC.componentViewChildren[0]
          .componentViewChildren[1]
          .triggerEventHandler('click', {});

        hw.testCallback = () => {
          // if wrapper.onDelete is called, HeroComponent.delete event must have been raised
          //console.log('HeroWrapper.onDelete called');
          expect(true).toEqual(true);
          done();
        }
      });
  }), 500); // needs some time to complete; 100ms is not long enough

  // FRAGILE because assumes precise knowledge of HeroComponent template
  it('update button should modify hero', injectTcb( (tcb, done) => {
     let origNameLength = mockHero.name.length;
     tcb
      .createAsync(HeroWrapper)
      .then((rootTC:RTC) => {

        rootTC.detectChanges();
        let hc:HeroComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:HeroWrapper = rootTC.componentInstance;

        // We can invoke HeroComponent update button handler OR
        // trigger the 'click' event on the HeroComponent update button
        // BUT DON'T DO BOTH
        // hc.onUpdate();
        rootTC.componentViewChildren[0]
          .componentViewChildren[2]
          .triggerEventHandler('click', {});

        expect(hw.currentHero.name.length).toBeGreaterThan(origNameLength);
        done();
      });
  }));

});