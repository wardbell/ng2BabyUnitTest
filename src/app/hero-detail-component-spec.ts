///// Boiler Plate ////
import {bind, Component, Directive, EventEmitter, View} from 'angular2/angular2';

import {
  beforeEachBindings, DebugElement, RootTestComponent as RTC,
  // Jasmine overrides
  beforeEach, ddescribe, xdescribe, describe, iit, it, xit //expect,
} from 'angular2/test';

import {injectAsync, injectTcb, expectViewChildHtmlToMatch} from 'test-helpers/test-helpers';

///// Testing this component ////
import {HeroDetailComponent} from './hero-detail-component';
import {Hero} from './hero';

// TestWrapper is a convenient way to communicate w/ HeroDetailComponent in a test
@Component({selector: 'hero-wrapper'})
@View({
  template: `<hero [hero]="currentHero" [user-name]="userName" (delete)="onDelete()"></hero>`,
  directives: [HeroDetailComponent]
})
class TestWrapper {
  currentHero = new Hero('Cat Woman', 42);
  userName = 'Sally';
  testCallback() {} // monkey-punched in a test
  onDelete() { this.testCallback(); }
}

describe('HeroDetailComponent', () => {

  it('can be created', () => {
    let hc = new HeroDetailComponent()
    expect(hc instanceof HeroDetailComponent).toEqual(true); // proof of life
  });

  it('parent "currentHero" flows down to HeroDetailComponent', injectTcb( (tcb, done) => {
    tcb
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {
        let hc:HeroDetailComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:TestWrapper = rootTC.componentInstance;

        rootTC.detectChanges(); // trigger view binding

        expect(hw.currentHero).toBe(hc.hero);
        done();
      });
  }));

  it('delete button should raise delete event for parent component', injectTcb( (tcb, done) => {
    tcb
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {

        let hdc:HeroDetailComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:TestWrapper = rootTC.componentInstance;

        rootTC.detectChanges(); // trigger view binding

        // Watch the HeroComponent.delete EventEmitter's event
        let subscription = hdc.delete.toRx().subscribe(() => {
          // console.log('HeroComponent.delete event raised');
          subscription.dispose();})

        // We can EITHER invoke HeroComponent delete button handler OR
        // trigger the 'click' event on the delete HeroComponent button
        // BUT DON'T DO BOTH

        // Trigger event
        // FRAGILE because assumes precise knowledge of HeroComponent template
        rootTC.componentViewChildren[0]
          .componentViewChildren[1]
          .triggerEventHandler('click', {});

        hw.testCallback = () => {
          // if wrapper.onDelete is called, HeroComponent.delete event must have been raised
          //console.log('HeroWrapper.onDelete called');
          expect(true).toEqual(true);
          done();
        }
        // hc.onDelete();
        // done();
      });
  }), 500); // needs some time for event to complete; 100ms is not long enough

  it('update button should modify hero', injectTcb( (tcb, done) => {

     tcb
      .createAsync(TestWrapper)
      .then((rootTC:RTC) => {

        let hc:HeroDetailComponent = rootTC.componentViewChildren[0].componentInstance;
        let hw:TestWrapper = rootTC.componentInstance;
        let origNameLength = hw.currentHero.name.length;

        rootTC.detectChanges(); // trigger view binding

        // We can EITHER invoke HeroComponent update button handler OR
        // trigger the 'click' event on the HeroComponent update button
        // BUT DON'T DO BOTH

        // Trigger event
        // FRAGILE because assumes precise knowledge of HeroComponent template
        rootTC.componentViewChildren[0]
          .componentViewChildren[2]
          .triggerEventHandler('click', {});

        // hc.onUpdate(); // Invoke button handler
        expect(hw.currentHero.name.length).toBeGreaterThan(origNameLength);
        done();
      });
  }));

});
