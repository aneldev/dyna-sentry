export interface IFilterOut {
  texts: string[];
  caseSensitive?: boolean; // Default: false
}

export class FilterOut {
  private readonly filterOutTexts: string[];

  constructor(private readonly config: IFilterOut) {
    const {caseSensitive = false} = this.config;
    this.filterOutTexts =
      caseSensitive
        ? config.texts
        : config.texts.map(t => t.toLowerCase());
  }

  public filter(text: string): boolean { // Returns true if the text is valid, is not filtered out and should be returned
    const {caseSensitive = false} = this.config;
    const userText =
      caseSensitive
        ? text
        : text.toLowerCase();
    return !this.filterOutTexts.find(textToFilterOut => userText.indexOf(textToFilterOut) > -1);
  }
}
