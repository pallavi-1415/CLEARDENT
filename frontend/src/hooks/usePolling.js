import { useEffect, useRef } from 'react';

/**
 * A custom hook to execute a callback function at a regular interval.
 * @param {Function} callback 
 * @param {number|null} delay 
 * @param {Array} dependencies 
 */
export function usePolling(callback, delay, dependencies = []) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) return;
    
    // Execute immediately on mount or dependency change
    savedCallback.current();
    
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, ...dependencies]);
}
