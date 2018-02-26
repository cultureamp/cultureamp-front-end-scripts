const customMatchers = {
  toBeNullish(actual) {
    const pass = actual == null;
    return { pass };
  },
  toBeCalledOnce(actual) {
    const pass = actual.mock.calls.length === 1;
    return { pass };
  },
  toBeWithinPrecision(actual, expected, precision) {
    const pass =
      actual >= expected - precision && actual <= expected + precision;
    const message = () =>
      `Expected ${actual} to be within ${precision} of ${expected}`;
    return { pass, message };
  },
};

export default customMatchers;
