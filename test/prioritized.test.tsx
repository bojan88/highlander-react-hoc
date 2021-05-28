import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { prioritizedHighlander } from '../src';
import TestComponent from './TestComponent';
import { HighlanderLogic } from '../src/base';

describe('prioritized', () => {
  const Highlander = prioritizedHighlander(TestComponent);
  const query = () => screen.queryAllByText('component', { exact: false });

  it('simple', () => {
    render((
      <div>
        <Highlander priority={1} ind={1} />
        <Highlander priority={2} ind={2} />
      </div>
    ));

    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 2');
  });

  it('unmount first', () => {
    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander priority={1} ind={1} />}
        <Highlander priority={2} ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 2');

    rerender(<Component showFirst={false} />);
    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 2');
  });

  it('unmount first with higher priority', () => {
    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander priority={2} ind={1} />}
        <Highlander priority={1} ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 1');

    rerender(<Component showFirst={false} />);
    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 2');
  });

  it('unmount first and mount it again', () => {
    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander priority={1} ind={1} />}
        <Highlander priority={2} ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    rerender(<Component showFirst={false} />);
    rerender(<Component />);

    expect(query()).toHaveLength(1);
    expect(query()[0]?.textContent).toBe('component 2');
  });

  it('ref', () => {
    const ref1 = createRef();
    const ref2 = createRef();

    const Component = ({ showFirst = true }) => (
      <div>
        {showFirst && <Highlander priority={2} ref={ref1} ind={1} />}
        <Highlander priority={1} ref={ref2} ind={2} />
      </div>
    );

    const { rerender } = render(<Component />);
    expect(ref1.current).toBeTruthy();
    expect(ref2.current).not.toBeTruthy();

    rerender(<Component showFirst={false} />);
    expect(ref1.current).not.toBeTruthy();
    expect(ref2.current).toBeTruthy();
  });

  it('cleanup', async () => {
    jest.useFakeTimers();
    const { unmount, container } = render((
      <div>
        <Highlander priority={1} ind={1} />
        <Highlander priority={2} ind={2} />
      </div>
    ));

    const [entry] = Object.entries(container.firstChild as Object)
      .filter(([key]) => key.startsWith('__reactFiber'))
      .map(([, val]) => val);
    const internalHighlanderInstance = entry?.firstEffect?.memoizedProps?.highlander;

    let componentsArr = Array.from(internalHighlanderInstance._items.values());
    expect(internalHighlanderInstance).toBeInstanceOf(HighlanderLogic);
    expect(componentsArr).toHaveLength(1);
    expect(componentsArr[0]).toHaveLength(2);

    unmount();
    jest.runAllTimers();
    componentsArr = Array.from(internalHighlanderInstance._items.values());
    expect(componentsArr).toHaveLength(0);
  });
});