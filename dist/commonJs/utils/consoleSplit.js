"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleSplit = function (consoleArgs) {
    var output = {
        text: '',
        restArgs: [],
        restArgIndex: -1,
    };
    var argsStarted = false;
    consoleArgs.forEach(function (arg, index) {
        if (argsStarted) {
            output.restArgs.push(arg);
            return;
        }
        if (typeof arg === "string") {
            if (output.text)
                output.text += " ";
            output.text += arg;
            return;
        }
        argsStarted = true;
        output.restArgIndex = index;
        output.restArgs.push(arg);
    });
    return output;
};
//# sourceMappingURL=consoleSplit.js.map