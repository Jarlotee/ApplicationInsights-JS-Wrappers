var Message_1 = require('./Message');
var Level_1 = require('./Level');
var OnErrorWrapper = (function () {
    function OnErrorWrapper(rethrow) {
        if (rethrow === void 0) { rethrow = false; }
        this._reThrow = rethrow;
    }
    OnErrorWrapper.prototype.init = function (handler) {
        this._handler = handler;
        this.wrap();
    };
    OnErrorWrapper.prototype.wrap = function () {
        if (typeof window !== 'undefined') {
            this._defaultOnError = window.onerror;
            window.onerror = this.handleError.bind(this);
        }
    };
    OnErrorWrapper.prototype.handleError = function (event, source, fileNumber, columnNumber, e) {
        this._handler(new Message_1.Message(Level_1.Level.Error, event, e));
        if (this._reThrow) {
            this._defaultOnError(event, source, fileNumber, columnNumber, e);
        }
    };
    return OnErrorWrapper;
})();
exports.OnErrorWrapper = OnErrorWrapper;
