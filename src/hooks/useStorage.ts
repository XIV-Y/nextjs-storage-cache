import { useState, useEffect } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

interface StorageValue<T> {
  value: T | null;
  set: (value: T) => void;
  remove: () => void;
}

export function useStorage<T>(
  key: string,
  initialValue: T | null = null,
  storageType: StorageType = 'localStorage'
): StorageValue<T> {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue);

  // isMounted フラグでハイドレーションの問題を回避する
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    try {
      if (typeof window !== 'undefined') {
        const storage = window[storageType];
        const item = storage.getItem(key);

        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading from ${storageType}:`, error);
    }
  }, [key, storageType]);

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);

      if (typeof window !== 'undefined') {
        window[storageType].setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error(`Error writing to ${storageType}:`, error);
    }
  };

  const removeValue = (): void => {
    try {
      setStoredValue(null);

      if (typeof window !== 'undefined') {
        window[storageType].removeItem(key);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error(`Error removing from ${storageType}:`, error);
    }
  };

  if (!isMounted) {
    return { value: initialValue, set: setValue, remove: removeValue };
  }

  return { value: storedValue, set: setValue, remove: removeValue };
}
