import "jest";
import {IConsoleSplit, consoleSplit} from "./consoleSplit";

describe('consoleSplit', () => {

  const testCases: { console: any[], expected: IConsoleSplit }[] = [
    {console: [], expected: {text: '', restArgs: [], restArgIndex: -1}},
    {console: ['Lola', null, 'apple'], expected: {text: 'Lola', restArgs: [null, 'apple'], restArgIndex: 1}},
    {console: [null], expected: {text: '', restArgs: [null], restArgIndex: 0}},
    {console: ['Hello', 'world'], expected: {text: 'Hello world', restArgs: [], restArgIndex: -1}},
    {console: ['Hello', 'world', {name: 'Lola'}], expected: {text: 'Hello world', restArgs: [{name: 'Lola'}], restArgIndex: 2}},
  ];

  testCases
    .forEach(testCase => {
      let testTitle = JSON.stringify(testCase.console).substr(0, 30);
      if (testTitle.length === 30) testTitle += '...';
      test(testTitle, () => {
        const result = consoleSplit(testCase.console);
        expect(result.text).toBe(testCase.expected.text);
        expect(result.restArgIndex).toBe(testCase.expected.restArgIndex);
        expect(result.restArgs).toMatchObject(testCase.expected.restArgs);
      });
    });
});
