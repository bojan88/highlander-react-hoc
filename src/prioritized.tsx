import React, { useMemo } from 'react';
import { HighlanderLogic, IHighlanderLogic, IUpdater } from './base';
import Highlander from './highlander';

const getMaxPriorityItem = (items: IUpdater[]): IUpdater => items
  .filter(({ mounted }) => mounted)
  .reduce((acc, el) => (acc.priority ?? 0) < (el.priority ?? 0) ? el : acc, items[0]);

class PrioritizedHighlanderLogic extends HighlanderLogic implements IHighlanderLogic {
  beforeFirstRender(child, updater, priority) {
    const arr: IUpdater[] = this._items.get(child.type) || [];

    if (process.env.NODE_ENV !== 'production' && typeof priority === 'undefined') {
      throw new Error('priorityHighlander requires all components to have "priority" prop');
    }

    if (process.env.NODE_ENV !== 'production' && typeof priority !== 'number') {
      throw new Error('"priority" prop only supports numbers');
    }

    const items = arr.filter(({ priority: cPriority }) => cPriority === priority);
    const [updaterItem] = items;
    const isDuplicate = items.length > 1 || updaterItem?.mounted;
    if (process.env.NODE_ENV !== 'production' && isDuplicate) {
      throw new Error('"priority" prop should be unique');
    }

    if (updaterItem) {
      updaterItem.mounted = true;
      updaterItem.active = false;
      updaterItem.updater = updater;
    } else {
      arr.push({
        mounted: true,
        active: false,
        priority,
        updater,
      });
    }

    this._items.set(child.type, [...arr]);
  }

  onMount(child) {
    const arr = this._items.get(child.type);
    const maxPriorityItem = getMaxPriorityItem(arr);
    this.setActive(maxPriorityItem);
    this._items.set(child.type, [...arr]);
  }

  onUnmount(child, updater) {
    const arr = this._items.get(child.type);
    const updaterEl = arr?.find(({ updater: cUpdater }) => cUpdater === updater);
    if (updaterEl) {
      updaterEl.mounted = false;
    }
    const maxPriorityItem = getMaxPriorityItem(arr);
    this.setActive(maxPriorityItem);
    this._items.set(child.type, [...arr]);
  }

  shouldRender(child, updater) {
    const activeItem = useMemo(
      () => this._items.get(child.type)?.find(({ active }) => active),
      [this._items.get(child.type)],
    );
    return activeItem?.updater === updater;
  }
};

const highlanderLogic = new PrioritizedHighlanderLogic();

export const prioritizedHighlander = (Component: any) => ({ priority, ...props }) => (
  <Highlander priority={priority} highlander={highlanderLogic}>
    <Component {...props} />
  </Highlander>
);
