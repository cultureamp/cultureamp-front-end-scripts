import isEqual from 'lodash.isequal';

/**
 * Test deep equality between two values, allowing asymmetric results. This will use the standard
 * lodash isEqual comparison https://lodash.com/docs/3.10.1#isEqual unless one of the values uses
 * `expect.objectContaining()`, in which case an asymmetric comparison will be used.
 *
 * Designed to be compatible with https://github.com/facebook/jest/blob/master/packages/expect/src/jasmine_utils.js#L31
 * which is not available as an exported module.
 * */

export default function equals(a, b) {
  return isEqual(a, b, customMatcher);
}

function customMatcher(a, b) {
  const aIsAsymmetric = isAsymmetric(a);
  const bIsAsymmetric = isAsymmetric(b);
  if (aIsAsymmetric && !bIsAsymmetric) {
    return a.asymmetricMatch(b);
  }
  if (bIsAsymmetric && !aIsAsymmetric) {
    return b.asymmetricMatch(a);
  }
}

function isAsymmetric(object) {
  return object && typeof object.asymmetricMatch === 'function';
}
