import React, { useMemo, useEffect, useState, Dispatch, ReactElement, Key } from 'react';

interface IUpdater {
  mounted: boolean,
  // current element rendered
  active: boolean,
  key: Key | null,
  updater: Dispatch<Symbol>,
};

interface ISingletonProps {
  children: ReactElement
}

// TODO: update key type
const updatersMap = new Map<any, Array<IUpdater>>();

const setActive = (item: IUpdater) => {
  item.active = true;
  item.updater(Symbol());
  const activeItem = updatersMap.get(item.updater)
    ?.find(({ active }) => active === true);
  if (activeItem) {
    activeItem.active = false;
    activeItem.updater(Symbol());
  }
};

function Singleton({ children: child }: ISingletonProps) {
  // using to trigger rerender
  const [, setState] = useState<Symbol>();

  useMemo(() => {
    const arr = updatersMap.get(child?.type) || [];
    const elKey = child['_owner']?.key;

    if (process.env.NODE_ENV === 'development' && !elKey) {
      throw new Error('alwaysFirstHighlander requires all components to have React keys');
    }

    const updaterItemIndex = arr.findIndex(({ key }) => key === elKey);
    const updaterItem = arr[updaterItemIndex];
    if (updaterItem) {
      updaterItem.active = false;
      updaterItem.mounted = updaterItemIndex === 0;
      updaterItem.updater = setState;
      setActive(updaterItem);
    } else {
      arr.push({
        mounted: true,
        active: !arr.some((e) => e.mounted),
        key: child['_owner']?.key,
        updater: setState,
      });
    }
    updatersMap.set(child.type, arr);
  }, []);

  useEffect(() => () => {
    const arr = updatersMap.get(child.type);
    const updaterEl = arr?.find(({ updater }) => updater !== setState);
    if (updaterEl) {
      updaterEl.mounted = false;
    }
    if (updaterEl?.active) {
      updaterEl.active = false;
      const firstMounted = arr?.find(({ mounted }) => mounted);
      if (firstMounted) {
        setActive(firstMounted)
      }
    }
  }, []);

  const activeUpdaterFn = updatersMap.get(child.type)?.find(({ active }) => active)?.updater;
  return activeUpdaterFn === setState ? child : null;
}

export const alwaysFirstHighlander = (Component: any) => (props: any) => (
  <Singleton>
    <Component {...props} />
  </Singleton>
);
