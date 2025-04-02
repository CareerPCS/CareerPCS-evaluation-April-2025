/**
 * To communicate more effeciently (less renders) with the markers on the Map,
 * I currently use the signal-polyfill package, based on the signal ES proposal.
 *
 * This just bridges signals and react hooks.
 *
 * Want to use this a bit more before I move it out to a dedicated package.
 */

import React from "react";
import { Signal } from "signal-polyfill";

export type AnySignal<T> = Signal.State<T> | Signal.Computed<T>;

export function useComputed<T>(callback: () => T, deps: React.DependencyList) {
  const memo_callback = React.useCallback(callback, deps);
  const signal = React.useMemo(
    () =>
      new Signal.Computed(memo_callback, {
        equals: (a, b) => a === b,
      }),
    [memo_callback],
  );
  return signal;
}

export function useCreateSignalState<T>(initial_value: T): Signal.State<T> {
  const signal = React.useMemo(() => new Signal.State(initial_value), []);

  return signal;
}

export function useCreateSignal<T>(
  value: T,
  deps: React.DependencyList = [value],
): Signal.State<T> {
  const signal = React.useMemo(() => new Signal.State(value), []);

  React.useEffect(() => {
    signal.set(value);
  }, deps);

  return signal;
}

export function useSignalEffect(
  callback: () => void,
  deps: React.DependencyList,
) {
  React.useEffect(() => {
    let needsEnqueue = true;

    const w = new Signal.subtle.Watcher(() => {
      if (needsEnqueue) {
        needsEnqueue = false;
        queueMicrotask(processPending);
      }
    });

    function processPending() {
      needsEnqueue = true;

      for (const s of w.getPending()) {
        s.get();
      }

      w.watch();
    }

    let cleanup: (() => void) | void;

    const computed = new Signal.Computed(() => {
      if (typeof cleanup === "function") cleanup();
      cleanup = callback();
    });

    w.watch(computed);
    computed.get();

    return () => {
      w.unwatch(computed);
      if (typeof cleanup === "function") cleanup();
      cleanup = undefined;
    };
  }, deps);
}

export function useSignal<T>(signal: AnySignal<T>): T {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      let needsEnqueue = true;
      const watcher = new Signal.subtle.Watcher(() => {
        if (needsEnqueue) {
          needsEnqueue = false;
          queueMicrotask(processPending);
        }
      });
      function processPending() {
        needsEnqueue = true;
        callback();
        watcher.watch(); // re-watch
      }
      watcher.watch(signal);
      return () => watcher.unwatch(signal);
    },
    [signal],
  );
  const getSnapshot = () => signal.get();
  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
