import "jest";
import {FilterOut} from "./FilterOut";

describe('FilterOut', () => {
  describe('case sensitive', () => {
    const filterOut = new FilterOut({
      texts: 'Debug,Info,Fatal'.split(','),
      caseSensitive: true,
    });

    [
      {text: 'This is Info text', expected: false},
      {text: 'This is info text', expected: true},
      {text: 'This is Warn text', expected: true},
      {text: 'This is Error text', expected: true},
      {text: 'This is Debug text', expected: false},
      {text: 'This is Fatal text', expected: false},
      {text: 'This is fatal text', expected: true},
      {text: 'Debug text', expected: false},
      {text: 'Hello world', expected: true},
    ]
      .forEach(({text, expected}) => {
        test(`For text "${text}" should return ${expected}`, () => {
          expect(filterOut.filter(text)).toBe(expected);
        });
      });
  });
  describe('non case sensitive', () => {
    const filterOut = new FilterOut({
      texts: 'Debug,info,Fatal'.split(','),
      caseSensitive: false,
    });

    [
      {text: 'This is Info text', expected: false},
      {text: 'This is info text', expected: false},
      {text: 'This is Warn text', expected: true},
      {text: 'This is Error text', expected: true},
      {text: 'This is Debug text', expected: false},
      {text: 'This is Fatal text', expected: false},
      {text: 'This is fatal text', expected: false},
      {text: 'Debug text', expected: false},
      {text: 'Hello world', expected: true},
    ]
      .forEach(({text, expected}) => {
        test(`For text "${text}" should return ${expected}`, () => {
          expect(filterOut.filter(text)).toBe(expected);
        });
      });
  });
});
