var Message_1 = require('./Message');
var Level_1 = require('./Level');
var FunctionWrapper = (function () {
    function FunctionWrapper(toBeWrapped, rethrow) {
        if (rethrow === void 0) { rethrow = false; }
        this._toBeWrapped = toBeWrapped;
        this._reThrow = rethrow;
    }
    FunctionWrapper.prototype.init = function (handler) {
        this._handler = handler;
        return this.wrap.bind(this);
    };
    FunctionWrapper.prototype.wrap = function () {
        try {
            return this._toBeWrapped.apply(this, arguments);
        }
        catch (e) {
            this._handler(new Message_1.Message(Level_1.Level.Error, e.message, e));
            if (this._reThrow) {
                throw e;
            }
        }
    };
    return FunctionWrapper;
})();
exports.FunctionWrapper = FunctionWrapper;
