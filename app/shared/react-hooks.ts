import React from "react";

const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);
export const useIsomorphicLayoutEffect =
  canUseDOM ? React.useLayoutEffect : () => {};

export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined {
  const ref = React.useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return React.useCallback(
    (...args: Args) => ref.current?.(...args),
    [ref],
  ) as (...args: Args) => R;
}

export function useEffectWithAbortSignal(
  effect: (signal: AbortSignal) => void,
  deps?: React.DependencyList,
) {
  React.useEffect(() => {
    const controller = new AbortController();
    effect(controller.signal);
    return () => controller.abort();
  }, deps);
}

export function useIsomorphicLayoutEffectWithAbortSignal(
  effect: (signal: AbortSignal) => void,
  deps?: React.DependencyList,
) {
  useIsomorphicLayoutEffect(() => {
    const controller = new AbortController();
    effect(controller.signal);
    return () => controller.abort();
  }, deps);
}
