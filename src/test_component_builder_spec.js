var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var test_1 = require('angular2/test');
var angular2_1 = require('angular2/angular2');
var angular2_2 = require('angular2/angular2');
var angular2_3 = require('angular2/angular2');
var ChildComp = (function () {
    function ChildComp() {
        this.childBinding = 'Child';
    }
    ChildComp = __decorate([
        angular2_2.Component({ selector: 'child-comp' }),
        angular2_2.View({ template: "<span>Original {{childBinding}}</span>", directives: [] }),
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ChildComp);
    return ChildComp;
})();
var MockChildComp = (function () {
    function MockChildComp() {
    }
    MockChildComp = __decorate([
        angular2_2.Component({ selector: 'child-comp' }),
        angular2_2.View({ template: "<span>Mock</span>" }),
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MockChildComp);
    return MockChildComp;
})();
var ParentComp = (function () {
    function ParentComp() {
    }
    ParentComp = __decorate([
        angular2_2.Component({ selector: 'parent-comp' }),
        angular2_2.View({ template: "Parent(<child-comp></child-comp>)", directives: [ChildComp] }),
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ParentComp);
    return ParentComp;
})();
var MyIfComp = (function () {
    function MyIfComp() {
        this.showMore = false;
    }
    MyIfComp = __decorate([
        angular2_2.Component({ selector: 'my-if-comp' }),
        angular2_2.View({ template: "MyIf(<span *ng-if=\"showMore\">More</span>)", directives: [angular2_3.NgIf] }),
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MyIfComp);
    return MyIfComp;
})();
test_1.describe('test component builder', function () {
    test_1.iit('should instantiate a component with valid DOM', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        debugger;
        tcb.createAsync(ChildComp).then(function (rootTestComponent) {
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('Original Child');
            async.done();
        });
    }));
    test_1.it('should allow changing members of the component', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        tcb.createAsync(MyIfComp).then(function (rootTestComponent) {
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('MyIf()');
            rootTestComponent.componentInstance.showMore = true;
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('MyIf(More)');
            async.done();
        });
    }));
    test_1.it('should override a template', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        tcb.overrideTemplate(MockChildComp, '<span>Mock</span>')
            .createAsync(MockChildComp)
            .then(function (rootTestComponent) {
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('Mock');
            async.done();
        });
    }));
    test_1.it('should override a view', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        tcb.overrideView(ChildComp, new angular2_2.ViewMetadata({ template: '<span>Modified {{childBinding}}</span>' }))
            .createAsync(ChildComp)
            .then(function (rootTestComponent) {
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('Modified Child');
            async.done();
        });
    }));
    test_1.it('should override component dependencies', test_1.inject([test_1.TestComponentBuilder, test_1.AsyncTestCompleter], function (tcb, async) {
        tcb.overrideDirective(ParentComp, ChildComp, MockChildComp)
            .createAsync(ParentComp)
            .then(function (rootTestComponent) {
            rootTestComponent.detectChanges();
            test_1.expect(rootTestComponent.nativeElement).toHaveText('Parent(Mock)');
            async.done();
        });
    }));
});
//# sourceMappingURL=test_component_builder_spec.js.map