var Level_1 = require('./Level');
var FunctionWrapper_1 = require('./FunctionWrapper');
var ApplicationInsightsAggregator = (function () {
    function ApplicationInsightsAggregator(appInsights, level) {
        if (level === void 0) { level = Level_1.Level.Error; }
        this._appInsights = appInsights;
        this.level = level;
    }
    ApplicationInsightsAggregator.prototype.handleMessage = function (message) {
        if (message.level === Level_1.Level.Error && message.exception) {
            this._appInsights.trackException(message.exception, 'insightjs');
        }
        else {
            var name = this.getLevelName(message.level);
            var details = message.message;
            if (this.isJson(details)) {
                details = JSON.parse(details);
            }
            this._appInsights.trackTrace(message.message, { 'Level': name });
        }
    };
    ApplicationInsightsAggregator.prototype.init = function (wrappers) {
        var _this = this;
        wrappers.forEach(function (element) {
            element.init(_this.handleMessage.bind(_this));
        });
    };
    ApplicationInsightsAggregator.prototype.wrapFunction = function (toBeWrapped, rethrow) {
        var wrapper = new FunctionWrapper_1.FunctionWrapper(toBeWrapped, rethrow);
        return wrapper.init(this.handleMessage.bind(this));
    };
    ApplicationInsightsAggregator.prototype.getLevelName = function (level) {
        for (var n in Level_1.Level) {
            if (typeof Level_1.Level[n] === 'number' && Level_1.Level[n].toString() === level.toString()) {
                return n;
            }
        }
        return null;
    };
    ApplicationInsightsAggregator.prototype.isJson = function (value) {
        try {
            JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return true;
    };
    return ApplicationInsightsAggregator;
})();
exports.ApplicationInsightsAggregator = ApplicationInsightsAggregator;
