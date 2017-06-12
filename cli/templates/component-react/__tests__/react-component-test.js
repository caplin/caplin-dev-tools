import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Globe from '../react-component';

describe('example test', function() {
  it('should have count of zero when first loaded', () => {
    const wrapper = shallow(<Globe owner="Bob" />);
    const counterText = wrapper.find('.counter').first().text();
    expect(counterText).toEqual('count:0');
  });
});
