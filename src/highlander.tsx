import { useState, useMemo, useLayoutEffect } from 'react';
import { IHighlanderReactElement } from './base';

// TODO: add forwardRef??
function Highlander({ children: child, highlander, priority }: IHighlanderReactElement) {
  // using this to trigger rerender
  const [, setState] = useState<Symbol>();
  useMemo(() => highlander.beforeFirstRender(child, setState, priority), []);
  useLayoutEffect(() => {
    highlander.onMount?.(child, setState);
    return () => highlander.onUnmount(child, setState);
  }, []);
  return highlander.shouldRender(child, setState) ? child : null;
}

export default Highlander;
