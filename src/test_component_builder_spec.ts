import {
  AsyncTestCompleter,
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  dispatchEvent,
  expect,
  iit,
  inject,
  beforeEachBindings,
  it,
  xit,
  TestComponentBuilder,
  RootTestComponent
} from 'angular2/test';

import {Injectable} from 'angular2/angular2';

import {Directive, Component, View, ViewMetadata} from 'angular2/angular2';

import {NgIf} from 'angular2/angular2';

@Component({selector: 'child-comp'})
@View({template: `<span>Original {{childBinding}}</span>`, directives: []})
@Injectable()
class ChildComp {
  childBinding: string;
  constructor() { this.childBinding = 'Child'; }
}

@Component({selector: 'child-comp'})
@View({template: `<span>Mock</span>`})
@Injectable()
class MockChildComp {
}

@Component({selector: 'parent-comp'})
@View({template: `Parent(<child-comp></child-comp>)`, directives: [ChildComp]})
@Injectable()
class ParentComp {
}

@Component({selector: 'my-if-comp'})
@View({template: `MyIf(<span *ng-if="showMore">More</span>)`, directives: [NgIf]})
@Injectable()
class MyIfComp {
  showMore: boolean = false;
}


  describe('test component builder', function() {
    iit('should instantiate a component with valid DOM',
       inject([TestComponentBuilder, AsyncTestCompleter], (tcb:TestComponentBuilder, async:AsyncTestCompleter) => {
        debugger;
         tcb.createAsync(ChildComp).then((rootTestComponent:RootTestComponent) => {
           rootTestComponent.detectChanges();

           expect(rootTestComponent.nativeElement).toHaveText('Original Child');
           async.done();
         });
       }));

    it('should allow changing members of the component',
       inject([TestComponentBuilder, AsyncTestCompleter], (tcb:TestComponentBuilder, async:AsyncTestCompleter) => {

         tcb.createAsync(MyIfComp).then((rootTestComponent:RootTestComponent) => {
           rootTestComponent.detectChanges();
           expect(rootTestComponent.nativeElement).toHaveText('MyIf()');

           rootTestComponent.componentInstance.showMore = true;
           rootTestComponent.detectChanges();
           expect(rootTestComponent.nativeElement).toHaveText('MyIf(More)');

           async.done();
         });
       }));

    it('should override a template',
       inject([TestComponentBuilder, AsyncTestCompleter], (tcb:TestComponentBuilder, async:AsyncTestCompleter) => {

         tcb.overrideTemplate(MockChildComp, '<span>Mock</span>')
             .createAsync(MockChildComp)
             .then((rootTestComponent:RootTestComponent) => {
               rootTestComponent.detectChanges();
               expect(rootTestComponent.nativeElement).toHaveText('Mock');

               async.done();
             });
       }));

    it('should override a view',
       inject([TestComponentBuilder, AsyncTestCompleter], (tcb:TestComponentBuilder, async:AsyncTestCompleter) => {

         tcb.overrideView(ChildComp,
                          new ViewMetadata({template: '<span>Modified {{childBinding}}</span>'}))
             .createAsync(ChildComp)
             .then((rootTestComponent:RootTestComponent) => {
               rootTestComponent.detectChanges();
               expect(rootTestComponent.nativeElement).toHaveText('Modified Child');

               async.done();
             });
       }));

    it('should override component dependencies',
       inject([TestComponentBuilder, AsyncTestCompleter], (tcb:TestComponentBuilder, async:AsyncTestCompleter) => {

         tcb.overrideDirective(ParentComp, ChildComp, MockChildComp)
             .createAsync(ParentComp)
             .then((rootTestComponent:RootTestComponent) => {
               rootTestComponent.detectChanges();
               expect(rootTestComponent.nativeElement).toHaveText('Parent(Mock)');

               async.done();
             });
       }));
  });


