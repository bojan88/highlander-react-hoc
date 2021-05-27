import React, { useMemo } from 'react';
import { HighlanderLogic, IHighlanderLogic } from './base';
import Highlander from './highlander';

class SimpleHighlanderLogic extends HighlanderLogic implements IHighlanderLogic {
  beforeFirstRender(child, updater) {
    const arr = this._items.get(child.type) || [];
    arr.push({
      mounted: true,
      active: !arr.some((e) => e.mounted),
      updater,
    });
    this._items.set(child.type, arr);
    this.setActive(arr[0], true);
  }

  onUnmount(child, updater) {
    const updaterObj = this._items.get(child.type)
      ?.find(({ updater: cUpdater }) => cUpdater === updater);
    const arr = this._items.get(child.type)?.filter((obj) => obj !== updaterObj);

    if ((arr?.length ?? 0) === 0) {
      this._items.delete(child.type);
    } else if (arr) {
      this._items.set(child.type, arr);
      if (arr[0]) {
        this.setActive(arr[0]);
      }
    }
  }

  shouldRender(child, updater) {
    const activeItem = useMemo(
      () => this._items.get(child.type)?.find(({ active }) => active),
      [this._items.get(child.type)],
    );
    return activeItem?.updater === updater;
  }
};

const highlanderLogic = new SimpleHighlanderLogic();

export const highlander = (Component: any) => (props: any) => (
  <Highlander highlander={highlanderLogic}>
    <Component {...props} />
  </Highlander>
);
