/**
 * 🚀 React 19 Debounce Hook
 * Tối ưu performance cho search và filter inputs
 */

import { useState, useEffect } from 'react';

/**
 * ✅ Custom hook để debounce value
 * @param value - Giá trị cần debounce
 * @param delay - Delay time (milliseconds)
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set timeout để update debounced value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout nếu value thay đổi trước khi timeout complete
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * ✅ Hook để debounce callback function
 * Hữu ích cho complex operations như API calls
 */
export const useDebounceCallback = <T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number = 300
): T => {
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

    const debouncedCallback = ((...args: Parameters<T>) => {
        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);

        setTimeoutId(newTimeoutId);
    }) as T;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return debouncedCallback;
};

export default useDebounce;
