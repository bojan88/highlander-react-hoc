import React, { createRef, useEffect } from 'react';
import { render, screen } from '@testing-library/react';

import { highlander } from '../src';
import TestComponent from './TestComponent';

describe('default', () => {
  const Highlander = highlander(TestComponent);
  const query = () => screen.queryAllByText('component', { exact: false });

  it('simple', () => {
    render((
      <div>
        <Highlander ind={1} />
        <Highlander ind={2} />
      </div>
    ));

    expect(query()).toHaveLength(1);
    expect(query()[0].textContent).toBe('component 1');
  });

  it('unmount first', () => {
    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander ind={1} />}
        <Highlander ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    rerender(<Component showFirst={false} />);

    expect(query()).toHaveLength(1);
    expect(query()[0].textContent).toBe('component 2');
  });

  // does not try to always render the first component
  // in case the first component is removed (unmounted), and another rendered
  // if the first becomes available again it won't be rendered
  // and the current one will be kept
  it('unmount first and mount it again', () => {
    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander ind={1} />}
        <Highlander ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    rerender(<Component showFirst={false} />);
    rerender(<Component />);

    expect(query()).toHaveLength(1);
    // second component should stay
    expect(query()[0].textContent).toBe('component 2');
  });

  it('useEffect called', () => {
    const fn = jest.fn();
    const Highlander = highlander(({ ind }) => {
      useEffect(() => fn(ind), []);
      return null;
    });
    const Component = () => (
      <div>
        <Highlander ind="1" />
        <Highlander ind="2" />
      </div>
    );

    render(<Component />);

    expect(fn).toBeCalledWith('1');
    expect(fn).toBeCalledTimes(1);
  });

  it('ref', () => {
    const ref1 = createRef();
    const ref2 = createRef();

    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander ref={ref1} ind={1} />}
        <Highlander ref={ref2} ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    expect(ref1.current).toBeTruthy();
    expect(ref2.current).not.toBeTruthy();

    rerender(<Component showFirst={false} />);
    expect(ref1.current).not.toBeTruthy();
    expect(ref2.current).toBeTruthy();
  });

  // TODO: try to test for cleaning
  // TODO: test nested components
  // TODO: test ref
});