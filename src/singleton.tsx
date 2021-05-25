import React, { useMemo, useEffect, useState } from 'react';

const updatersMap = new Map();
const currentMap = new Map();

// TODO: add forwardRef
function Singleton({ children: child }) {
  // using to trigger rerender
  const [, setState] = useState<Function>();

  useMemo(() => {
    const arr = updatersMap.get(child.type) || [];
    arr.push(setState);
    updatersMap.set(child.type, arr);
    if (arr.length === 1) {
      currentMap.set(child.type, setState);
    }
  }, []);

  useEffect(() => () => {
    const arr = updatersMap.get(child.type).filter((c) => c !== setState);
    updatersMap.set(child.type, arr);

    // chech if component is removed
    if (!arr.includes(currentMap.get(child.type))) {
      // set the first updater as current, and invoke it to rerender
      currentMap.set(child.type, arr[0]);
      arr[0]?.(Symbol());
    }

    if (arr.length === 0) {
      updatersMap.delete(child.type);
      currentMap.delete(child.type);
    }
  }, []);

  return currentMap.get(child.type) === setState ? child : null;
}

export const highlander = (Component: any) => (props: any) => (
  <Singleton>
    <Component {...props} />
  </Singleton>
);
