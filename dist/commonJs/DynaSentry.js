"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ELevel;
(function (ELevel) {
    ELevel["FATAL"] = "fatal";
    ELevel["ERROR"] = "error";
    ELevel["WARN"] = "warning";
    ELevel["LOG"] = "log";
    ELevel["INFO"] = "info";
    ELevel["DEBUG"] = "debug";
    ELevel["CRITICAL"] = "critical";
})(ELevel = exports.ELevel || (exports.ELevel = {}));
var DynaSentry = /** @class */ (function () {
    function DynaSentry(sentry) {
        this.sentry = sentry;
    }
    DynaSentry.prototype.sendIssue = function (_a) {
        var _this = this;
        var title = _a.title, _b = _a.level, level = _b === void 0 ? ELevel.ERROR : _b, data = _a.data, _c = _a.stringifyData, stringifyData = _c === void 0 ? true : _c;
        this.sentry.withScope(function (scope) {
            Object.keys(data).forEach(function (key) {
                scope.setExtra(key, stringifyData
                    ? JSON.stringify(data[key], null, 2)
                    : data[key]);
            });
            scope.setLevel(level);
            _this.sentry.captureMessage(title);
        });
    };
    return DynaSentry;
}());
exports.DynaSentry = DynaSentry;
//# sourceMappingURL=DynaSentry.js.map