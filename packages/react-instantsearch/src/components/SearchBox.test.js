/* eslint-env jest, jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import SearchBox from './SearchBox';

describe('SearchBox', () => {
  it('applies its default props', () => {
    const tree = renderer.create(<SearchBox refine={() => null} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('transfers the autoFocus prop to the underlying input element', () => {
    const tree = renderer
      .create(<SearchBox refine={() => null} autoFocus />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('treats its query prop as its input value', () => {
    const inst = renderer.create(
      <SearchBox refine={() => null} currentRefinement="QUERY1" />
    );
    expect(inst.toJSON()).toMatchSnapshot();

    inst.update(<SearchBox refine={() => null} currentRefinement="QUERY2" />);
    expect(inst.toJSON()).toMatchSnapshot();
  });
  it('lets you customize its theme', () => {
    const tree = renderer
      .create(
        <SearchBox
          refine={() => null}
          theme={{
            root: 'ROOT',
            wrapper: 'WRAPPER',
            input: 'INPUT',
            submit: 'SUBMIT',
            reset: 'RESET',
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('lets you give custom components for reset and submit', () => {
    const tree = renderer
      .create(
        <SearchBox
          refine={() => null}
          submitComponent={<span>🔍</span>}
          resetComponent={
            <svg viewBox="200 198 108 122">
              <path d="M200.8 220l45 46.7-20 47.4 31.7-34 50.4 39.3-34.3-52.6 30.2-68.3-49.7 51.7" />
            </svg>
          }
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('lets you customize its translations', () => {
    const tree = renderer
      .create(
        <SearchBox
          refine={() => null}
          translations={{
            resetTitle: 'RESET_TITLE',
            placeholder: 'PLACEHOLDER',
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('treats query as a default value when searchAsYouType=false', () => {
    const wrapper = mount(
      <SearchBox
        refine={() => null}
        currentRefinement="QUERY1"
        searchAsYouType={false}
      />
    );
    expect(wrapper.find('input').props().value).toBe('QUERY1');
    wrapper.find('input').simulate('change', { target: { value: 'QUERY2' } });
    expect(wrapper.find('input').props().value).toBe('QUERY2');
    wrapper.unmount();
  });

  it('refines its value on change when searchAsYouType=true', () => {
    const refine = jest.fn();
    const wrapper = mount(<SearchBox searchAsYouType refine={refine} />);
    wrapper.find('input').simulate('change', { target: { value: 'hello' } });
    expect(refine.mock.calls.length).toBe(1);
    expect(refine.mock.calls[0][0]).toBe('hello');
    wrapper.unmount();
  });

  it('only refines its query on submit when searchAsYouType=false', () => {
    const refine = jest.fn();
    const wrapper = mount(
      <SearchBox searchAsYouType={false} refine={refine} />
    );
    wrapper.find('input').simulate('change', { target: { value: 'hello' } });
    expect(refine.mock.calls.length).toBe(0);
    wrapper.find('form').simulate('submit');
    expect(refine.mock.calls.length).toBe(1);
    expect(refine.mock.calls[0][0]).toBe('hello');
    wrapper.unmount();
  });

  it('onSubmit behavior should be override if provided as props', () => {
    const onSubmit = jest.fn();
    const refine = jest.fn();
    const wrapper = mount(
      <SearchBox searchAsYouType={false} onSubmit={onSubmit} refine={refine} />
    );
    wrapper.find('form').simulate('submit');
    expect(onSubmit.mock.calls.length).toBe(1);
    expect(refine.mock.calls.length).toBe(0);
    wrapper.unmount();
  });

  it('focuses the input when one of the keys in focusShortcuts is pressed', () => {
    let input;
    mount(
      <SearchBox
        refine={() => null}
        focusShortcuts={['s', 84]}
        __inputRef={node => {
          input = node;
        }}
      />
    );

    input.focus = jest.fn();
    const event1 = new KeyboardEvent('keydown', { keyCode: 82 });
    document.dispatchEvent(event1);
    expect(input.focus.mock.calls.length).toBe(0);
    const event2 = new KeyboardEvent('keydown', { keyCode: 83 });
    document.dispatchEvent(event2);
    expect(input.focus.mock.calls.length).toBe(1);
    const event3 = new KeyboardEvent('keydown', { keyCode: 84 });
    document.dispatchEvent(event3);
    expect(input.focus.mock.calls.length).toBe(2);
  });

  it('should accept `onXXX` events', () => {
    const onSubmit = jest.fn();
    const onReset = jest.fn();

    const inputEventsList = [
      'onChange',
      'onFocus',
      'onBlur',
      'onSelect',
      'onKeyDown',
      'onKeyPress',
    ];
    const inputProps = inputEventsList.reduce(
      (props, prop) => ({ ...props, [prop]: jest.fn() }),
      {}
    );

    const wrapper = mount(
      <SearchBox
        refine={() => null}
        onSubmit={onSubmit}
        onReset={onReset}
        {...inputProps}
      />
    );

    // simulate form events `onReset` && `onSubmit`
    wrapper.find('form').simulate('submit');
    expect(onSubmit).toBeCalled();

    wrapper.find('form').simulate('reset');
    expect(onReset).toBeCalled();

    // simulate input search events
    inputEventsList.forEach(eventName => {
      wrapper
        .find('input')
        .simulate(eventName.replace(/^on/, '').toLowerCase());
      expect(inputProps[eventName]).toBeCalled();
    });
  });
});
