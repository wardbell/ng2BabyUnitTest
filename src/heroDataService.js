var hero_1 = require('hero');
var HeroDataService = (function () {
    function HeroDataService() {
        this._heros = [];
    }
    HeroDataService.prototype.getOrCreateHero = function (name) {
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