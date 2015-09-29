import {HeroesComponent} from './heroes.component';
import {Hero} from './hero';
import {HeroService} from './hero.service';
import {User} from './user';

let hc:HeroesComponent;
let heroData: Hero[]; // fresh heroes for each test
let mockUser: User;
let service: HeroService;

// get the promise from the refresh spy;
// casting required because of inadequate d.ts for Jasmine
let refreshPromise = () => (<any>service.refresh).calls.mostRecent().returnValue;

describe('HeroesComponent (no Angular)', () => {

  beforeEach(()=> {
    heroData = [new Hero(1, 'Foo'), new Hero(2, 'Bar'), new Hero(3, 'Baz')];
    mockUser = new User();
  });

  beforeEach(()=> {
    service = <any> new HappyHeroService();
    hc = new HeroesComponent(service, mockUser)
  });

  it('can be created', () => {
    expect(hc instanceof HeroesComponent).toEqual(true); // proof of life
  });

  it('has expected userName', () => {
    expect(hc.userName).toEqual(mockUser.name);
  });

  describe('#onInit', () => {
    it('HeroService.refresh not called immediately', () => {
      let spy = <jasmine.Spy><any> service.refresh;
      expect(spy.calls.count()).toEqual(0);
    });

    it('onInit calls HeroService.refresh', () => {
      let spy = <jasmine.Spy><any> service.refresh;
      hc.onInit(); // Angular framework calls when it creates the component
      expect(spy.calls.count()).toEqual(1);
    });
  })

  describe('#heroes', () => {

    it('lacks heroes when created', () => {
      let heroes = hc.heroes;
      expect(heroes.length).toEqual(0); // not filled yet
    });

    it('has heroes after cache loaded', done => {
      hc.onInit(); // Angular framework calls when it creates the component

      refreshPromise().then(() => {
          let heroes = hc.heroes; // now the component has heroes to show
          expect(heroes.length).toEqual(heroData.length);
        })
        .catch(fail).then(done);
    });

    it('restores heroes after refresh called again', done => {
      hc.onInit(); // component initialization triggers service
      let heroes: Hero[];

      refreshPromise().then(() => {
          heroes = hc.heroes; // now the component has heroes to show
          heroes[0].name = 'Wotan';
          heroes.push(new Hero(33, 'Thor'));
          hc.onRefresh();
        })
        .then(() => {
          heroes = hc.heroes; // get it again (don't reuse old array!)
          expect(heroes[0]).not.toEqual('Wotan'); // change reversed
          expect(heroes.length).toEqual(heroData.length); // orig num of heroes
        })
        .catch(fail).then(done);
    });
  });


  describe('#onSelected', () => {

    it('no hero is selected by default', () => {
      expect(hc.currentHero).not.toBeDefined();
    });

    it('sets the "currentHero"', () => {
      hc.onSelect(heroData[1]); // select the second hero
      expect(hc.currentHero).toEqual(heroData[1]);
    });

    it('no hero is selected after onRefresh() called', () => {
      hc.onSelect(heroData[1]); // select the second hero
      hc.onRefresh();
      expect(hc.currentHero).not.toBeDefined();
    });
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
