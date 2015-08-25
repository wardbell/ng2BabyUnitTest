var hero_1 = require('hero');
var _heros = [
    new hero_1.Hero('Naomi'),
    new hero_1.Hero('Brad'),
    new hero_1.Hero('Mahatma Ghandhi'),
    new hero_1.Hero('Julie'),
];
var HeroDataService = (function () {
    function HeroDataService() {
        this._heros = [];
    }
    HeroDataService.prototype.getAllHeros = function () {
        return _heros.slice();
    };
    HeroDataService.prototype.getOrCreateHero = function (name) {
        if (!name) {
            return hero_1.Hero.nullo;
        }
        var matches = _heros.filter(function (hero) {
            return hero.name === name;
        });
        if (matches.length) {
            return matches[0];
        }
        else {
            var hero = new hero_1.Hero(name);
            _heros.push(hero);
            return hero;
        }
    };
    return HeroDataService;
})();
exports.HeroDataService = HeroDataService;
//# sourceMappingURL=heroDataService.js.map