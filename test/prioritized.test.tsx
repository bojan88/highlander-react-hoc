import React from 'react';
import { render, screen } from '@testing-library/react';
import { prioritizedHighlander } from '../src';

describe('prioritized', () => {
  const Component = ({ ind }) => <div>component {ind}</div>;
  const Highlander = prioritizedHighlander(Component);
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
});