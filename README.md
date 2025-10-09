# use-external-store

[![npm](https://img.shields.io/npm/v/use-external-store.svg)](https://www.npmjs.com/package/use-external-store)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-external-store.svg?label=bundle%20size)](https://bundlephobia.com/package/use-external-store)

A lightweight React hook for subscribing to external state stores, optimized for concurrent rendering and inspired by [`use-zustand`](https://github.com/zustandjs/use-zustand).

## Installation

```bash
# npm
npm install use-external-store

# Yarn
yarn add use-external-store

# pnpm
pnpm add use-external-store
```

## Differences from useSyncExternalStore

`useSyncExternalStore` has the "Sync" behavior that doesn't work nicely with concurrent rendering.

`useExternalStore` is implemented only with `useReducer` and `useEffect`. It suffers from tearing, but works better with concurrent rendering.

## Usage

```tsx
import { useExternalStore } from "use-external-store";

// created with zustand, redux, etc.
import { type RootState, store } from "./store";

function useStore<Selection>(
  selector: (state: RootState) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean
) {
  return useExternalStore(store, selector, isEqual);
}

function App() {
  const count = useStore((state) => state.count);
  return <div>{count}</div>;
}
```

## API

```ts
interface ReadonlyStore<State> {
  getState(): State;
  subscribe(listener: () => void): () => void;
}

function defineStore<State>(
  store: ReadonlyStore<State>
): ReadonlyStore<State>;

function useExternalStore<State, Selection>(
  store: ReadonlyStore<State>,
  selector: (state: State) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean
): Selection;
```

## License

[MIT License](https://github.com/exuanbo/use-external-store/blob/main/LICENSE) @ 2024-Present [Xuanbo Cheng](https://github.com/exuanbo)
