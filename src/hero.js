var nextId = 1;
var Hero = (function () {
    function Hero(_name, _id) {
        this._name = _name;
        this._id = _id;
        if (!_id) {
            this._id = nextId++;
        }
    }
    Object.defineProperty(Hero.prototype, "id", {
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
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