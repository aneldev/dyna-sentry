export interface IConsoleSplit {
  text: string;
  restArgs: any[];
  restArgIndex: number;
}

export const consoleSplit = (consoleArgs: any[]): IConsoleSplit => {
  const output: IConsoleSplit = {
    text: '',
    restArgs: [],
    restArgIndex: -1,
  };
  let argsStarted = false;
  consoleArgs.forEach((arg, index) => {
    if (argsStarted) {
      output.restArgs.push(arg);
      return;
    }
    if (typeof arg === "string") {
      if (output.text) output.text += " ";
      output.text += arg;
      return;
    }
    argsStarted = true;
    output.restArgIndex = index;
    output.restArgs.push(arg);
  });

  return output;
};
