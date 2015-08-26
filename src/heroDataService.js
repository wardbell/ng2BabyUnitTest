var hero_1 = require('hero');
exports.Hero = hero_1.Hero;
exports.HEROS = [
    new hero_1.Hero('Naomi'),
    new hero_1.Hero('Brad'),
    new hero_1.Hero('Mahatma Ghandhi'),
    new hero_1.Hero('Julie'),
    new hero_1.Hero('Brian'),
    new hero_1.Hero('Jeff'),
    new hero_1.Hero('Kathy'),
];
var HeroDataService = (function () {
    function HeroDataService() {
        this._heros = [];
    }
    HeroDataService.prototype.getAllHeros = function (force) {
        if (force === void 0) { force = false; }
        // fetch if haven't fetched or fetch is forced
        if (!this._heros.fetched || force) {
            this._heros = exports.HEROS.slice();
            this._heros.fetched = true;
        }
        return this._heros;
    };
    HeroDataService.prototype.getOrCreateHero = function (name) {
        this.getAllHeros(); // make sure we have heros before we add one
        return { haveHero: true, hero: this._getOrCreateHeroImpl(name) };
    };
    HeroDataService.prototype._getOrCreateHeroImpl = function (name) {
        if (!name) {
            return hero_1.Hero.nullo;
        }
        var matches = this._heros.filter(function (hero) {
            return hero.name === name;
        });
        if (matches.length) {
            return matches[0];
        }
        else {
            var hero = new hero_1.Hero(name);
            this._heros.push(hero);
            return hero;
        }
    };
    return HeroDataService;
})();
exports.HeroDataService = HeroDataService;
//# sourceMappingURL=heroDataService.js.map