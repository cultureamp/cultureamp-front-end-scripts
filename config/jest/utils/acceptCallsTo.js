import equals from './equals.js';

/*
acceptCalls to is a utility available globally in Jest tests which can be used
with Jest mock functions.

It configures a Jest mock function with a custom implementation which returns a
specified value only when it is called with specified arguments. can be applied
to the same mock function multiple times.

Args specified via .withArgsEqualTo() are matched using Jasmine's expect().toEqual()
behaviour. Args specified with .withArgs() are matched using strict equality.

Examples:

  // multiple configs can be chained
  acceptCallsTo(someJestMockFunction)
    .withArgs(args, to, accept)
    .withArgs(other, args, to, accept)
    .andReturn(returnValue)
    .withArgsEqualTo(argToMatch)
    .andReturn(otherReturnValue);

  // calling acceptCallsTo again with same mock function adds to existing 'acceptable calls'
  acceptCallsTo(someJestMockFunction)
    .withArgs(more, args, to, accept)
    .andReturn(anotherReturnValue)

  // when using .withArgsEqualTo, normal Jest matcher constructs can be used
  acceptCallsTo(someJestMockFunction)
    .withArgsEqualTo(expect.any(String), expect.objectContaining({a: 'b'}))
    .andReturn(returnValue);

  // calling .clear() removes all existing 'acceptable calls'
  acceptCallsTo(someJestMockFunction)
    .clear()
    .withArgs(args, to, accept)
    .andReturn(returnValue)
 */

const util = require.requireActual('util');

// compares two arrays of arguments for shallow equality
const argsShallowEqual = (actual, expected) =>
  !actual.some((actualArg, i) => actualArg !== expected[i]);

// composes a jest mock function's previous or default implementation with an
// 'acceptable call' implementation
function addAcceptableCallMockImplementation(mockFn) {
  mockFn.mockImplementation((...actualArgs) => {
    const match = mockFn._acceptableCalls.find(({ acceptableArgs, exact }) => {
      const comparator = exact ? argsShallowEqual : equals;
      return comparator(actualArgs, acceptableArgs);
    });

    if (match) return match.returnValue;

    let errorMessage =
      'No matching acceptable call signature found for call to mock function\n';
    errorMessage += 'Called with args: ' + util.inspect(actualArgs) + '\n';
    errorMessage += 'Acceptable calls:' + '\n';
    mockFn._acceptableCalls.forEach(
      ({ acceptableArgs, returnValue, exact }, index) => {
        errorMessage += '\t' + index + ':\n';
        errorMessage +=
          '\t' +
          (exact ? 'withArgs: ' : 'withArgsEqualTo: ') +
          util.inspect(acceptableArgs) +
          '\n';
        errorMessage += '\t' + 'andReturn: ' + util.inspect(returnValue) + '\n';
      }
    );

    throw new Error(errorMessage);
  });
}

export default function acceptCallsTo(mockFn) {
  if (!(typeof mockFn === 'function' && mockFn.mock)) {
    throw new Error(`expected a mock function, got ${util.inspect(mockFn)}`);
  }

  // set up if not already initialized
  if (!mockFn._acceptableCalls) {
    mockFn._acceptableCalls = [];
    addAcceptableCallMockImplementation(mockFn);
  }

  function makeChainableReturnValue() {
    const acceptableArgsForChain = [];

    return {
      withArgs(...acceptableArgs) {
        acceptableArgsForChain.push({ acceptableArgs, exact: true });

        return this;
      },
      withArgsEqualTo(...acceptableArgs) {
        acceptableArgsForChain.push({ acceptableArgs, exact: false });

        return this;
      },
      andReturn(returnValue) {
        acceptableArgsForChain.forEach(({ acceptableArgs, exact }) => {
          mockFn._acceptableCalls.push({
            acceptableArgs,
            exact,
            returnValue,
          });
        });

        // start a new chain of acceptable args
        return makeChainableReturnValue();
      },
      clear() {
        // reset all acceptable calls to this mock function
        mockFn._acceptableCalls = [];

        return makeChainableReturnValue();
      },
    };
  }

  return makeChainableReturnValue();
}
