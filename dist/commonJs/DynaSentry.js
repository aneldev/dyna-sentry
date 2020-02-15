"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dyna_stringify_1 = require("dyna-stringify");
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
    function DynaSentry(config) {
        this.config = config;
        this.sentry = config.Sentry;
    }
    DynaSentry.prototype.sendIssue = function (_a) {
        var _this = this;
        var title = _a.title, _b = _a.level, level = _b === void 0 ? ELevel.ERROR : _b, data = _a.data, _c = _a.stringifyData, stringifyData = _c === void 0 ? true : _c, setScope = _a.setScope;
        this.sentry.withScope(function (scope) {
            if (setScope)
                setScope(scope);
            Object.keys(data).forEach(function (key) {
                scope.setExtra(key, stringifyData
                    ? dyna_stringify_1.dynaStringify(data[key], { spaces: 1 })
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