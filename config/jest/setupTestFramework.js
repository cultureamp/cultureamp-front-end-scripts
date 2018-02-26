import path from 'path';
import util from 'util';
import customMatchers from './utils/customMatchers';
import acceptCallsTo from './utils/acceptCallsTo';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

configure({ adapter: new Adapter() });

// load/stub stuff which is expected to be available globally
window.acceptCallsTo = acceptCallsTo;

// Hack - Jest auto-mocking should take care of this for us but we're currently
// not able to get it working.
jest.mock('cultureamp-style-guide/components/Icon/Icon', () => 'MockIcon');

expect.extend(customMatchers);
