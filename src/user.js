// imagine this is the result of a login
var User = (function () {
    function User(_name) {
        this._name = _name;
    }
    Object.defineProperty(User.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    return User;
})();
exports.User = User;
;
//# sourceMappingURL=user.js.map