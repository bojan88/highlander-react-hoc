import { Dispatch, ReactElement } from 'react';

export interface IUpdater {
  mounted: boolean;
  // current element rendered
  active: boolean;
  priority?: number;
  updater: Dispatch<Symbol>;
}

export interface IHighlanderLogic {
  _items: Map<any, Array<IUpdater>>;
  beforeFirstRender(
    child: ReactElement,
    updater: Dispatch<Symbol>,
    priority?: number
  ): void;
  onMount?(child: ReactElement, updater: Dispatch<Symbol>): void;
  onUnmount(child: ReactElement, updater: Dispatch<Symbol>): void;
  shouldRender(child: ReactElement, updater: Dispatch<Symbol>): boolean;
}

export interface IHighlanderReactElement {
  children: ReactElement;
  highlander: IHighlanderLogic;
  priority?: number;
}

export class HighlanderLogic {
  _items = new Map();

  setActive(child: ReactElement, item: IUpdater, skipRender?: boolean) {
    const activeItem = this._items
      .get(child.type)
      ?.find(({ active }) => active === true);
    if (!skipRender && activeItem) {
      activeItem.active = false;
      activeItem.updater(Symbol());
    }

    item.active = true;
    if (!skipRender && item.mounted) {
      item.updater(Symbol());
    }
  }

  cleanup(child: ReactElement) {
    const instances: IUpdater[] = this._items.get(child.type);
    if (!instances) {
      return;
    }

    const allUnmounted = Array.from(instances).every(({ mounted }) => !mounted);
    if (allUnmounted) {
      this._items.delete(child.type);
    }
  }
}
