import "jest";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000;

// help: https://facebook.github.io/jest/docs/expect.html

describe('Test sample', () => {
  it('Calcs', () => {
    expect(1 + 1).toBe(2);
  });
});
