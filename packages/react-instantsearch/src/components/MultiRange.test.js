/* eslint-env jest, jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
Enzyme.configure({ adapter: new Adapter() });

import MultiRange from './MultiRange';

describe('MultiRange', () => {
  it('supports passing items values', () => {
    const tree = renderer
      .create(
        <MultiRange
          createURL={() => '#'}
          refine={() => null}
          items={[
            {
              label: 'label1',
              value: '10:',
              isRefined: false,
              noRefinement: false,
            },
            {
              label: 'label2',
              value: '10:20',
              isRefined: false,
              noRefinement: false,
            },
            {
              label: 'label3',
              value: '20:30',
              isRefined: false,
              noRefinement: false,
            },
            {
              label: 'label4',
              value: '30:',
              isRefined: false,
              noRefinement: false,
            },
            { label: 'All', value: '', isRefined: true, noRefinement: false },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('supports having a selected item', () => {
    const tree = renderer
      .create(
        <MultiRange
          createURL={() => '#'}
          refine={() => null}
          items={[
            {
              label: 'label1',
              value: '10:',
              isRefined: false,
              noRefinement: false,
            },
            {
              label: 'label2',
              value: '10:20',
              isRefined: true,
              noRefinement: false,
            },
            {
              label: 'label3',
              value: '20:30',
              isRefined: false,
              noRefinement: false,
            },
            {
              label: 'label4',
              value: '30:',
              isRefined: false,
              noRefinement: false,
            },
            { label: 'All', value: '', isRefined: false, noRefinement: false },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('no refinements', () => {
    const tree = renderer
      .create(
        <MultiRange
          createURL={() => '#'}
          refine={() => null}
          items={[
            {
              label: 'label1',
              value: '10:',
              isRefined: false,
              noRefinement: true,
            },
            {
              label: 'label2',
              value: '10:20',
              isRefined: false,
              noRefinement: true,
            },
            {
              label: 'label3',
              value: '20:30',
              isRefined: false,
              noRefinement: true,
            },
            {
              label: 'label4',
              value: '30:',
              isRefined: false,
              noRefinement: true,
            },
            { label: 'All', value: '', isRefined: true, noRefinement: false },
          ]}
          canRefine={true}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('refines its value on change', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <MultiRange
        refine={refine}
        items={[
          {
            label: 'label',
            value: '10:',
            isRefined: false,
            noRefinement: false,
          },
          {
            label: 'label',
            value: '10:20',
            isRefined: false,
            noRefinement: false,
          },
          {
            label: 'label',
            value: '20:30',
            isRefined: false,
            noRefinement: false,
          },
          {
            label: 'label',
            value: '30:',
            isRefined: false,
            noRefinement: false,
          },
        ]}
        canRefine={true}
      />
    );

    const items = wrapper.find('.ais-MultiRange__item');

    expect(items.length).toBe(4);

    const firstItem = items.first().find('.ais-MultiRange__itemRadio');

    firstItem.simulate('change', { target: { checked: true } });

    expect(refine.mock.calls.length).toBe(1);
    expect(refine.mock.calls[0][0]).toEqual('10:');

    wrapper.unmount();
  });

  it('indicate when there is no refinement', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <MultiRange
        refine={refine}
        items={[
          {
            label: 'label',
            value: '10:',
            isRefined: false,
            noRefinement: true,
          },
          {
            label: 'label',
            value: '10:20',
            isRefined: false,
            noRefinement: true,
          },
          {
            label: 'label',
            value: '20:30',
            isRefined: false,
            noRefinement: true,
          },
          {
            label: 'label',
            value: '30:',
            isRefined: false,
            noRefinement: true,
          },
        ]}
        canRefine={false}
      />
    );

    const itemWrapper = wrapper.find('.ais-MultiRange__noRefinement');
    expect(itemWrapper.length).toBe(1);

    const items = wrapper.find('.ais-MultiRange__itemNoRefinement');
    expect(items.length).toBe(4);

    wrapper.unmount();
  });
});
