// Help: https://facebook.github.io/jest/docs/expect.html
import {DynaSentry} from "../../src";

describe('Unit test', () => {
  it('Sample', () => {
    expect(typeof DynaSentry).toBe('function');
  });
});
