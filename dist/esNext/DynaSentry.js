import { dynaStringify } from "dyna-stringify";
import { consoleSplit } from "./consoleSplit";
export var EConsoleType;
(function (EConsoleType) {
    EConsoleType["ERROR"] = "error";
    EConsoleType["WARN"] = "warn";
    EConsoleType["LOG"] = "log";
    EConsoleType["INFO"] = "info";
    EConsoleType["DEBUG"] = "debug";
})(EConsoleType || (EConsoleType = {}));
export var ELevel;
(function (ELevel) {
    ELevel["FATAL"] = "fatal";
    ELevel["ERROR"] = "error";
    ELevel["WARN"] = "warning";
    ELevel["LOG"] = "log";
    ELevel["INFO"] = "info";
    ELevel["DEBUG"] = "debug";
    ELevel["CRITICAL"] = "critical";
})(ELevel || (ELevel = {}));
var DynaSentry = /** @class */ (function () {
    function DynaSentry(config) {
        this.config = config;
        // private
        this.originalConsoles = {};
        this.sentry = config.Sentry;
        this.initSniffConsoles();
    }
    DynaSentry.prototype.sendIssue = function (_a) {
        var _this = this;
        var title = _a.title, _b = _a.level, level = _b === void 0 ? ELevel.ERROR : _b, data = _a.data, _c = _a.stringifyData, stringifyData = _c === void 0 ? true : _c, setScope = _a.setScope;
        this.sentry.withScope(function (scope) {
            if (setScope)
                setScope(scope);
            Object.keys(data).forEach(function (key) {
                scope.setExtra(key, stringifyData
                    ? dynaStringify(data[key], { spaces: 1 })
                    : data[key]);
            });
            scope.setLevel(level);
            _this.sentry.captureMessage(title);
        });
    };
    DynaSentry.prototype.initSniffConsoles = function () {
        var _this = this;
        var _a = this.config.captureConsole, captureConsole = _a === void 0 ? {} : _a;
        var _b = captureConsole.consoleTypes, consoleTypes = _b === void 0 ? [] : _b, _c = captureConsole.filter, filter = _c === void 0 ? function () { return true; } : _c, _d = captureConsole.stringifyData, stringifyData = _d === void 0 ? false : _d, setScope = captureConsole.setScope;
        consoleTypes
            .forEach(function (consoleType) {
            _this.originalConsoles[consoleType] = console[consoleType];
            console[consoleType] = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.originalConsoles)[consoleType].apply(_a, args);
                if (filter(consoleType, args)) {
                    var consoleContent_1 = consoleSplit(args);
                    _this.sendIssue({
                        title: (function () {
                            if (consoleContent_1.text)
                                return consoleContent_1.text;
                            return "Console Object: " + dynaStringify(args[0]);
                        })(),
                        level: (function () {
                            if (consoleType === EConsoleType.WARN)
                                return ELevel.WARN;
                            return consoleType;
                        })(),
                        data: consoleContent_1.restArgs
                            .reduce(function (acc, arg, index) {
                            acc["console-arg-" + (index + consoleContent_1.restArgIndex)] = arg;
                            return acc;
                        }, {}),
                        stringifyData: stringifyData,
                        setScope: setScope,
                    });
                }
            };
        });
    };
    return DynaSentry;
}());
export { DynaSentry };
//# sourceMappingURL=DynaSentry.js.map