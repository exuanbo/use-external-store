import type { ReadonlyStore } from "./index";

type Memo<Snapshot, Selection> = [ReadonlyStore<Snapshot>, Snapshot, Selection];

const enum Key {
  Store,
  Snapshot,
  Selection,
}

export const getStore = <Snapshot>(memo: Memo<Snapshot, unknown>) => memo[Key.Store];

export const getSelection = <Selection>(memo: Memo<unknown, Selection>) => memo[Key.Selection];

export const init = <State, Selection>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Selection
): Memo<State, Selection> => {
  const snapshot = store.getState();
  const selection = selector(snapshot);
  return [store, snapshot, selection];
};

type Action<Snapshot, Selection> = [Memo<Snapshot, Selection>] | [];

export const getReducer = <State, Selection>(
  selector: (state: State) => Selection,
  isEqual: (a: Selection, b: Selection) => boolean = Object.is
) => (
  memo: Memo<State, Selection>,
  [nextMemo]: Action<State, Selection>
): Memo<State, Selection> => {
  if (nextMemo) {
    return nextMemo;
  }
  const nextSnapshot = memo[Key.Store].getState();
  if (Object.is(memo[Key.Snapshot], nextSnapshot)) {
    return memo;
  }
  const nextSelection = selector(nextSnapshot);
  if (isEqual(memo[Key.Selection], nextSelection)) {
    memo[Key.Snapshot] = nextSnapshot;
    return memo;
  }
  return [memo[Key.Store], nextSnapshot, nextSelection];
};
