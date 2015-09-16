var Message_1 = require('./Message');
var Level_1 = require('./Level');
var ConsolePlaceHolder = (function () {
    function ConsolePlaceHolder() {
    }
    ConsolePlaceHolder.prototype.assert = function (test, message) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.clear = function () { };
    ConsolePlaceHolder.prototype.count = function (countTitle) { };
    ConsolePlaceHolder.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.dir = function (value) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.dirxml = function (value) { };
    ConsolePlaceHolder.prototype.error = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.group = function (groupTitle) { };
    ConsolePlaceHolder.prototype.groupCollapsed = function (groupTitle) { };
    ConsolePlaceHolder.prototype.groupEnd = function () { };
    ConsolePlaceHolder.prototype.info = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    ConsolePlaceHolder.prototype.msIsIndependentlyComposed = function (element) { return false; };
    ConsolePlaceHolder.prototype.profile = function (reportName) { };
    ConsolePlaceHolder.prototype.profileEnd = function () { };
    ConsolePlaceHolder.prototype.select = function (element) { };
    ConsolePlaceHolder.prototype.time = function (timerName) { };
    ConsolePlaceHolder.prototype.timeEnd = function (timerName) { };
    ConsolePlaceHolder.prototype.trace = function () { };
    ConsolePlaceHolder.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    };
    return ConsolePlaceHolder;
})();
var ConsoleWrapper = (function () {
    function ConsoleWrapper(rethrow) {
        if (rethrow === void 0) { rethrow = false; }
        this._console = {};
        this._rethrow = rethrow;
    }
    ConsoleWrapper.prototype.init = function (handler) {
        this._handler = handler;
        this.wrap();
    };
    ConsoleWrapper.prototype.wrap = function () {
        if (typeof console === 'undefined') {
            window.console = new ConsolePlaceHolder();
        }
        this._console[Level_1.Level.Log] = console.log;
        this._console[Level_1.Level.Debug] = console.debug;
        this._console[Level_1.Level.Info] = console.info;
        this._console[Level_1.Level.Warn] = console.warn;
        this._console[Level_1.Level.Error] = console.error;
        console.debug = this.handleDebug.bind(this);
        console.log = this.handleLog.bind(this);
        console.info = this.handleInfo.bind(this);
        console.warn = this.handleWarn.bind(this);
        console.error = this.handleError.bind(this);
    };
    ConsoleWrapper.prototype.handle = function (level, message) {
        var optionalParams = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            optionalParams[_i - 2] = arguments[_i];
        }
        this._handler(new Message_1.Message(level, message));
        if (this._rethrow) {
            while (this._console[level] === undefined && level > 1) {
                level--;
            }
            this._console[level].bind(console)(message);
        }
    };
    ConsoleWrapper.prototype.handleLog = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.handle(Level_1.Level.Log, message, optionalParams);
    };
    ConsoleWrapper.prototype.handleDebug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.handle(Level_1.Level.Debug, message, optionalParams);
    };
    ConsoleWrapper.prototype.handleInfo = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.handle(Level_1.Level.Info, message, optionalParams);
    };
    ConsoleWrapper.prototype.handleWarn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.handle(Level_1.Level.Warn, message, optionalParams);
    };
    ConsoleWrapper.prototype.handleError = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        this.handle(Level_1.Level.Error, message, optionalParams);
    };
    return ConsoleWrapper;
})();
exports.ConsoleWrapper = ConsoleWrapper;
