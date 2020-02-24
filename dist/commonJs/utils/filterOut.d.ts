export interface IFilterOut {
    texts: string[];
    caseSensitive?: boolean;
}
export declare class FilterOut {
    private readonly config;
    private readonly filterOutTexts;
    constructor(config: IFilterOut);
    filter(text: string): boolean;
}
