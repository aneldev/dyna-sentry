export interface IConsoleSplit {
    text: string;
    restArgs: any[];
    restArgIndex: number;
}
export declare const consoleSplit: (consoleArgs: any[]) => IConsoleSplit;
