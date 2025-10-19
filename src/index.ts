import { useEffect, useReducer } from "react";

import * as Memo from "./memo";

export type ListenerCallback = () => void;

export interface Unsubscribe {
  (): void;
}

export interface ReadonlyStore<State> {
  getState: () => State;
  subscribe: (listener: ListenerCallback) => Unsubscribe;
}

export function defineStore<State>(store: ReadonlyStore<State>) {
  return store;
}

export function useExternalStore<State, Selection>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean
) {
  let [memo, dispatch] = useReducer(
    Memo.getReducer(selector, isEqual),
    {},
    () => Memo.init(store, selector)
  );

  useEffect(() => {
    dispatch([]);
    return store.subscribe(() => dispatch([]));
  }, [store]);

  if (Memo.getStore(memo) !== store) {
    dispatch([memo = Memo.init(store, selector)]);
  }
  return Memo.getSelection(memo);
}
