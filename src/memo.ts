import type { Store } from "./index";

interface Memo<Snapshot, Selection> {
  store: Store<Snapshot>;
  snapshot: Snapshot;
  selection: Selection;
}

export function init<State, Selection>([store, selector]: [
  store: Store<State>,
  selector: (state: State) => Selection
]): Memo<State, Selection> {
  const snapshot = store.getState();
  const selection = selector(snapshot);
  return {
    store,
    snapshot,
    selection,
  };
}

interface Action<Snapshot, Selection> {
  nextMemo?: Memo<Snapshot, Selection>;
}

export function update<Snapshot, Selection>(
  memo?: Memo<Snapshot, Selection>
): Action<Snapshot, Selection> {
  return {
    nextMemo: memo,
  };
}

export function getReducer<State, Selection>(
  selector: (state: State) => Selection,
  isEqual: (a: Selection, b: Selection) => boolean = Object.is
) {
  return (
    memo: Memo<State, Selection>,
    { nextMemo }: Action<State, Selection>
  ) => {
    if (nextMemo) {
      return nextMemo;
    }
    const nextSnapshot = memo.store.getState();
    if (Object.is(memo.snapshot, nextSnapshot)) {
      return memo;
    }
    const nextSelection = selector(nextSnapshot);
    if (isEqual(memo.selection, nextSelection)) {
      memo.snapshot = nextSnapshot;
      return memo;
    }
    return {
      ...memo,
      snapshot: nextSnapshot,
      selection: nextSelection,
    };
  };
}
