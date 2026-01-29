import { useEffect, useRef, useState } from 'react'

interface DebounceOptions {
  /**
   * Максимальное время ожидания перед принудительным обновлением
   * Полезно если пользователь долго печатает без остановки
   * @default undefined (нет лимита)
   */
  maxWait?: number
}

/**
 * Хук для debounce значения
 *
 * @param value - значение для debounce
 * @param delay - задержка в миллисекундах (по умолчанию 500мс)
 * @param options - дополнительные опции
 *
 * @example базовое использование
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 400);
 *
 * @example с maxWait
 * const debouncedSearch = useDebounce(search, 400, {
 *   maxWait: 1000  // максимум 1 сек ожидания, даже если пользователь продолжает печатать
 * });
 */
export function useDebounce<T>(value: T, delay: number = 500, options: DebounceOptions = {}): T {
  const { maxWait } = options

  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const previousValueRef = useRef<T>(value)

  useEffect(() => {
    // если значение не изменилось = ничего не делаем
    if (previousValueRef.current === value) {
      return
    }

    previousValueRef.current = value

    // очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // устанавливаем новый таймер
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)

      // очищаем maxWait таймер после обновления
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current)
        maxWaitTimeoutRef.current = undefined
      }
    }, delay)

    // если задан maxWait и таймер еще не установлен
    if (maxWait && !maxWaitTimeoutRef.current) {
      maxWaitTimeoutRef.current = setTimeout(() => {
        setDebouncedValue(value)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        maxWaitTimeoutRef.current = undefined
      }, maxWait)
    }

    // сleanup функция
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current)
      }
    }
  }, [value, delay, maxWait])

  return debouncedValue
}
