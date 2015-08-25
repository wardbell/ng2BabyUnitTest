var Hero = (function () {
    function Hero(_name) {
        this._name = _name;
    }
    Object.defineProperty(Hero.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { this._name = value; },
        enumerable: true,
        configurable: true
    });
    return Hero;
})();
exports.Hero = Hero;
//# sourceMappingURL=hero.js.map