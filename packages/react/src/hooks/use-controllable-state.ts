import { useState } from 'react';

/** Generic controlled/uncontrolled value pair, mirroring how React handles `value`/`defaultValue`. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const resolved = value !== undefined ? value : internal;

  function set(next: T) {
    if (value === undefined) {
      setInternal(next);
    }
    onChange?.(next);
  }

  return [resolved, set];
}
