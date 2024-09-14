import type { Store } from "./index";

type Memo<Snapshot, Selection> = [Store<Snapshot>, Snapshot, Selection];

const enum Key {
  Store,
  Snapshot,
  Selection,
}

export function getStore<Snapshot>(
  memo: Memo<Snapshot, unknown>
): Store<Snapshot> {
  return memo[Key.Store];
}

export function getSelection<Selection>(
  memo: Memo<unknown, Selection>
): Selection {
  return memo[Key.Selection];
}

export function init<State, Selection>(
  store: Store<State>,
  selector: (state: State) => Selection
): Memo<State, Selection> {
  const snapshot = store.getState();
  const selection = selector(snapshot);
  return [store, snapshot, selection];
}

type Action<Snapshot, Selection> = [Memo<Snapshot, Selection> | undefined];

export function update<Snapshot, Selection>(
  memo?: Memo<Snapshot, Selection>
): Action<Snapshot, Selection> {
  return [memo];
}

export function getReducer<State, Selection>(
  selector: (state: State) => Selection,
  isEqual: (a: Selection, b: Selection) => boolean = Object.is
) {
  return (
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
}
