import { useEffect, useState } from 'react';

/** useState that is saved to localStorage, and survives storage being unavailable. */
export default function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode or storage full – keep working in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
