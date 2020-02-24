"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterOut = /** @class */ (function () {
    function FilterOut(config) {
        this.config = config;
        var _a = this.config.caseSensitive, caseSensitive = _a === void 0 ? false : _a;
        this.filterOutTexts =
            caseSensitive
                ? config.texts
                : config.texts.map(function (t) { return t.toLowerCase(); });
    }
    FilterOut.prototype.filter = function (text) {
        var _a = this.config.caseSensitive, caseSensitive = _a === void 0 ? false : _a;
        var userText = caseSensitive
            ? text
            : text.toLowerCase();
        return !this.filterOutTexts.find(function (textToFilterOut) { return userText.indexOf(textToFilterOut) > -1; });
    };
    return FilterOut;
}());
exports.FilterOut = FilterOut;
//# sourceMappingURL=filterOut.js.map