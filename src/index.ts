import { useEffect, useReducer } from "react";

import * as Memo from "./memo";
import { tuple } from "./utils";

export type ListenerCallback = () => void;

export interface Unsubscribe {
  (): void;
}

export interface Store<State> {
  getState: () => State;
  subscribe: (listener: ListenerCallback) => Unsubscribe;
}

export function defineStore<State>(store: Store<State>) {
  return store;
}

export function useExternalStore<State, Selection>(
  store: Store<State>,
  selector: (state: State) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean
) {
  const [memo, dispatch] = useReducer(
    Memo.getReducer(selector, isEqual),
    tuple(store, selector),
    (args) => Memo.init(...args)
  );

  useEffect(() => {
    dispatch(Memo.update());
    return store.subscribe(() => dispatch(Memo.update()));
  }, [store]);

  if (Memo.getStore(memo) !== store) {
    const nextMemo = Memo.init(store, selector);
    dispatch(Memo.update(nextMemo));
    return Memo.getSelection(nextMemo);
  }
  return Memo.getSelection(memo);
}
