import React from 'react';
import { render, screen } from '@testing-library/react';
import { singleton } from '../src';

describe('always first', () => {
  const Component = ({ ind }) => <div>component {ind}</div>;
  const Highlander = singleton(Component);
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
    expect(query()[0].textContent).toBe('component 1');
  });
});