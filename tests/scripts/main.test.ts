// Help: https://facebook.github.io/jest/docs/expect.html
import {sayHelloWorld} from "../../src";

describe('Unit test', () => {
  it('Sample', () => {
    expect(typeof sayHelloWorld).toBe('function');
  });
});
