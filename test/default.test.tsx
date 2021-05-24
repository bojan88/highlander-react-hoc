import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { singleton } from '../src';

// does not try to always render the first component
// in case the first component is removed (unmounted), and another rendered
// if the first becomes available again it won't be rendered
// and the current one will be kept
describe('default', () => {
  const Highlander = singleton(({ ind }) => <div>component {ind}</div>);
  const query = () => screen.queryAllByText('component', { exact: false });

  it('simle', () => {
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
    const Highlander = singleton(({ ind }) => {
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
});