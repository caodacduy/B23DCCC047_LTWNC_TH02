import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerBar } from './PlayerBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';

describe('Kiểm thử component PlayerBar', () => {
  beforeEach(() => {
    usePlayerStore.setState(initialPlayerState);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hiển thị "Chưa phát bài nào" khi hàng đợi rỗng', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị thông tin bài hát và số lượng bài trong hàng đợi', () => {
    usePlayerStore.setState({
      queue: [
        { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 },
        { id: 's2', title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 },
      ],
      currentIndex: 0,
      isPlaying: true,
      position: 5,
    });

    render(<PlayerBar />);
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();
  });

  it('bấm nút Phát/Tạm dừng đảo trạng thái isPlaying', async () => {
    const user = userEvent.setup();
    usePlayerStore.setState({
      queue: [{ id: 's1', title: 'Bài 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 150 }],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    render(<PlayerBar />);
    const pauseBtn = screen.getByRole('button', { name: /tạm dừng/i });
    await user.click(pauseBtn);

    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('đồng hồ tự động tăng position sau mỗi giây khi isPlaying là true', () => {
    vi.useFakeTimers();

    usePlayerStore.setState({
      queue: [{ id: 's1', title: 'Bài 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 150 }],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    render(<PlayerBar />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(usePlayerStore.getState().position).toBe(3);
  });
});
