import React from 'react';
import { shallow, mount, render } from 'enzyme';

import {{componentName}} from '../react-component';

describe('example test', function() {
  test('should have count of zero when first loaded', () => {
    const wrapper = shallow(<{{componentName}} owner="Bob" />);
    const counterText = wrapper.find('.counter').first().text();
    expect(counterText).toEqual('count:0');
  });
});
