const customMatchers = require('./utils/customMatchers');
const acceptCallsTo = require('./utils/acceptCallsTo');
const configure = require('enzyme').configure;
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

// load/stub stuff which is expected to be available globally
window.acceptCallsTo = acceptCallsTo;

// Hack - Jest auto-mocking should take care of this for us but we're currently
// not able to get it working.
jest.mock('cultureamp-style-guide/components/Icon/Icon', () => 'MockIcon');

expect.extend(customMatchers);
