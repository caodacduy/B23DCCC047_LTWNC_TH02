import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('Kiểm thử hook useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('giữ nguyên giá trị cũ trước 300ms và cập nhật giá trị mới sau khi advanceTimersByTime(300)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    // Đổi giá trị mới
    rerender({ value: 'nắng', delay: 300 });

    // Trước 300ms: vẫn là giá trị cũ
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('mưa');

    // Sau khi đủ 300ms: cập nhật giá trị mới
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('nắng');
  });

  it('hủy timer cũ nếu giá trị thay đổi liên tục trước khi hết delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'a', delay: 300 },
      }
    );

    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('a');

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Tổng cộng 300ms trôi qua nhưng 'abc' mới được 150ms -> vẫn là 'a'
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('abc');
  });
});
