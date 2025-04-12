import { useStorage } from '@/hooks/useStorage'
import { useCallback, useEffect, useState } from 'react';

const DEFAULT_CACHE_DURATION = 1000 * 60 * 5; // 5分

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export interface UseCacheOptions {
  storageType?: 'localStorage' | 'sessionStorage';
  duration?: number;
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseCacheOptions = {}
) {
  const {
    storageType = 'localStorage',
    duration = DEFAULT_CACHE_DURATION
  } = options;

  const cacheKey = `cache_${key}`;

  const { value: cachedData, set: setCachedData, remove: removeCachedData } = useStorage<CacheItem<T>>(cacheKey, null, storageType);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [cachedData]);

  const fetchData = useCallback(async (forceRefresh = false): Promise<T | undefined> => {
    if (isLoading) return

    setIsLoading(true)

    const now = Date.now();
    const isValid = cachedData &&
      typeof cachedData.timestamp === 'number' &&
      (now - cachedData.timestamp < duration);

    if (isValid && !forceRefresh) {
      console.log('Return Cache!!!')

      setIsLoading(false);

      return cachedData.data;
    }

    console.log('Refresh Cache!!!')

    try {
      const freshData = await fetcher();

      setCachedData({
        data: freshData,
        timestamp: now
      });

      setData(freshData);
      setIsLoading(false);

      return freshData;
    } catch (error) {
      if (cachedData) {
        console.warn('Failed to fetch fresh data, using stale cache:', error);

        setIsLoading(false);

        return cachedData.data;
      }

      setIsLoading(false);

      throw error;
    }
  }, [cachedData, duration, fetcher, isLoading, setCachedData]);

  const clearCache = useCallback(() => {
    setData(null);
    removeCachedData();
  }, [removeCachedData])

  const isStale = useCallback(() => {
    if (!cachedData || typeof cachedData.timestamp !== 'number') return true;

    return Date.now() - cachedData.timestamp > duration;
  }, [cachedData, duration]);

  return {
    cachedData: data,
    isLoading,
    fetchData,
    clearCache,
    isStale: isStale()
  };
}