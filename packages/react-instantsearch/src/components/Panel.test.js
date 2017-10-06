/* eslint-env jest, jasmine */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Panel from './Panel';

describe('Panel', () => {
  it('panel should add a classname when no refinement', () => {
    const wrapper = mount(
      <Panel title="category">
        <div className="content" />
      </Panel>
    );

    const title = wrapper.find('.ais-Panel__title');

    expect(title.text()).toEqual('category');
    expect(wrapper.find('.ais-Panel__noRefinement').length).toBe(0);

    wrapper.setState({ canRefine: false });

    expect(wrapper.find('.ais-Panel__noRefinement').length).toBe(1);
  });
});
