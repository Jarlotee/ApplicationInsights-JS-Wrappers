var Insight;
(function (Insight) {
    var Startup = (function () {
        function Startup(options) {
            this._options = options;
            this._listeners = new Array();
            if (window.localStorage) {
                this._storage = new Insight.Storage.LocalStorage();
            }
            else {
                this._storage = new Insight.Storage.ArrayStorage();
            }
            this._aggregator = new Insight.Aggregators.BaseAggregator(this._storage, this._options.level);
            if (options.console) {
                this._listeners.push(new Insight.Listeners.ConsoleListener(this._aggregator.console));
            }
            this.start();
        }
        Startup.prototype.start = function () {
            this._syncHandle = setInterval(this.sync.bind(this), this._options.syncInterval);
        };
        Startup.prototype.pause = function () {
            clearInterval(this._syncHandle);
        };
        Startup.prototype.sync = function () {
            var pull = (this._storage.count() < this._options.syncSize) ?
                this._storage.count() : this._options.syncSize;
            var messages = this._storage.pop(pull);
            this._listeners.forEach(function (listener) {
                messages.forEach(function (message) {
                    listener.listen(message);
                });
            });
        };
        return Startup;
    })();
    Insight.Startup = Startup;
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    (function (Level) {
        Level[Level["None"] = 0] = "None";
        Level[Level["Error"] = 1] = "Error";
        Level[Level["Warn"] = 2] = "Warn";
        Level[Level["Info"] = 3] = "Info";
        Level[Level["Debug"] = 4] = "Debug";
        Level[Level["Log"] = 5] = "Log";
    })(Insight.Level || (Insight.Level = {}));
    var Level = Insight.Level;
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Message = (function () {
        function Message(level, message, stack) {
            this.level = level;
            this.message = message;
            this.stack = stack;
        }
        return Message;
    })();
    Insight.Message = Message;
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Aggregators;
    (function (Aggregators) {
        var BaseAggregator = (function () {
            function BaseAggregator(storage, level) {
                this._storage = storage;
                this._level = level;
                this.console = new Insight.Wrappers.ConsoleWrapper(this.handleConsole.bind(this));
                this._errors = new Insight.Wrappers.ErrorWrapper(false, this.handleErrors.bind(this));
            }
            BaseAggregator.prototype.append = function (message) {
                if (message.level <= this._level) {
                    this._storage.push(message);
                }
            };
            BaseAggregator.prototype.decodeParameter = function (param) {
                if (typeof param === "string") {
                    return param;
                }
                else if (param instanceof Array) {
                    return "";
                }
                else if (typeof param === "object") {
                    return JSON.stringify(param);
                }
            };
            BaseAggregator.prototype.handleConsole = function (level, message) {
                var _this = this;
                var optionalParams = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    optionalParams[_i - 2] = arguments[_i];
                }
                var formatted = "" + this.decodeParameter(message);
                optionalParams.forEach(function (element) {
                    formatted += " " + _this.decodeParameter(element);
                });
                this.append(new Insight.Message(level, formatted));
            };
            BaseAggregator.prototype.handleErrors = function (event, source, fileNumber, columnNumber, e) {
                var stack;
                if (e && e.stack) {
                    stack = e.stack;
                }
                this.append(new Insight.Message(Insight.Level.Error, this.decodeParameter(event), stack));
            };
            return BaseAggregator;
        })();
        Aggregators.BaseAggregator = BaseAggregator;
    })(Aggregators = Insight.Aggregators || (Insight.Aggregators = {}));
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Listeners;
    (function (Listeners) {
        var ConsoleListener = (function () {
            function ConsoleListener(wrapper) {
                this._wrapper = wrapper;
            }
            ConsoleListener.prototype.listen = function (message) {
                if (this._wrapper) {
                    this._wrapper.console[message.level].bind(console)(message.message, message.stack);
                }
                else {
                    if (message.level === Insight.Level.Error) {
                        console.error(message.message);
                    }
                    else if (message.level === Insight.Level.Warn) {
                        console.warn(message.message);
                    }
                    else if (message.level === Insight.Level.Info) {
                        console.info(message.message);
                    }
                    else if (message.level === Insight.Level.Debug) {
                        console.debug("" + message.message);
                    }
                    else {
                        console.log(message.message);
                    }
                }
            };
            return ConsoleListener;
        })();
        Listeners.ConsoleListener = ConsoleListener;
    })(Listeners = Insight.Listeners || (Insight.Listeners = {}));
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Storage;
    (function (Storage) {
        var ArrayStorage = (function () {
            function ArrayStorage() {
                this._messages = new Array();
            }
            ArrayStorage.prototype.push = function (item) {
                if (item)
                    this._messages.push(item);
            };
            ArrayStorage.prototype.pop = function (count) {
                return this._messages.splice(0, count);
            };
            ArrayStorage.prototype.count = function () {
                return this._messages.length;
            };
            return ArrayStorage;
        })();
        Storage.ArrayStorage = ArrayStorage;
    })(Storage = Insight.Storage || (Insight.Storage = {}));
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Storage;
    (function (Storage) {
        var LocalStorage = (function () {
            function LocalStorage() {
                this._prefix = "Insight_";
                this._count = 0;
                this._keys = new Array();
                this.loadStorage();
            }
            LocalStorage.prototype.loadStorage = function () {
                for (var key in localStorage) {
                    if (key.indexOf(this._prefix) === 0) {
                        this._keys.push(key);
                        this._count++;
                    }
                }
            };
            LocalStorage.prototype.now = function () {
                if (window.performance && performance.now) {
                    return performance.now();
                }
                else {
                    return new Date().getTime();
                }
            };
            LocalStorage.prototype.push = function (item) {
                var ts = this.now();
                var rnd = Math.random() * Math.pow(10, 17);
                var key = this._prefix + "_" + ts + "_" + rnd;
                localStorage.setItem(key, JSON.stringify(item));
                this._keys.push(key);
                this._count++;
            };
            LocalStorage.prototype.pop = function (count) {
                var results = new Array();
                var keys = this._keys.splice(0, count);
                for (var i = 0; i < keys.length; i++) {
                    results.push(JSON.parse(localStorage.getItem(keys[i])));
                    localStorage.removeItem(keys[i]);
                    this._count--;
                }
                return results;
            };
            LocalStorage.prototype.count = function () {
                return this._count;
            };
            return LocalStorage;
        })();
        Storage.LocalStorage = LocalStorage;
    })(Storage = Insight.Storage || (Insight.Storage = {}));
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Wrappers;
    (function (Wrappers) {
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
            function ConsoleWrapper(handler) {
                this._handler = handler;
                this.console = {};
                this.wrap();
            }
            ConsoleWrapper.prototype.wrap = function () {
                if (!window.console) {
                    window.console = new ConsolePlaceHolder();
                }
                this.console[Insight.Level.Log] = console.log;
                this.console[Insight.Level.Debug] = console.debug;
                this.console[Insight.Level.Info] = console.info;
                this.console[Insight.Level.Warn] = console.warn;
                this.console[Insight.Level.Error] = console.error;
                console.debug = this.handleDebug.bind(this);
                console.log = this.handleLog.bind(this);
                console.info = this.handleInfo.bind(this);
                console.warn = this.handleWarn.bind(this);
                console.error = this.handleError.bind(this);
            };
            ConsoleWrapper.prototype.handleLog = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this._handler(Insight.Level.Log, message, optionalParams);
            };
            ConsoleWrapper.prototype.handleDebug = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this._handler(Insight.Level.Debug, message, optionalParams);
            };
            ConsoleWrapper.prototype.handleInfo = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this._handler(Insight.Level.Info, message, optionalParams);
            };
            ConsoleWrapper.prototype.handleWarn = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this._handler(Insight.Level.Warn, message, optionalParams);
            };
            ConsoleWrapper.prototype.handleError = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                this._handler(Insight.Level.Error, message, optionalParams);
            };
            return ConsoleWrapper;
        })();
        Wrappers.ConsoleWrapper = ConsoleWrapper;
    })(Wrappers = Insight.Wrappers || (Insight.Wrappers = {}));
})(Insight || (Insight = {}));
var Insight;
(function (Insight) {
    var Wrappers;
    (function (Wrappers) {
        var ErrorWrapper = (function () {
            function ErrorWrapper(rethrow, handler) {
                this._reThrow = rethrow;
                this._handler = handler;
                this.wrap();
            }
            ErrorWrapper.prototype.wrap = function () {
                this._defaultOnError = window.onerror;
                window.onerror = this.handleError.bind(this);
            };
            ErrorWrapper.prototype.handleError = function (event, source, fileNumber, columnNumber, e) {
                this._handler(event, source, fileNumber, columnNumber, e);
                if (this._reThrow) {
                    this._defaultOnError(event, source, fileNumber, columnNumber);
                }
            };
            return ErrorWrapper;
        })();
        Wrappers.ErrorWrapper = ErrorWrapper;
    })(Wrappers = Insight.Wrappers || (Insight.Wrappers = {}));
})(Insight || (Insight = {}));
//TODO
