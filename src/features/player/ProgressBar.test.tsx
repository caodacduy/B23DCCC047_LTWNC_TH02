import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';

describe('Kiểm thử component ProgressBar', () => {
  beforeEach(() => {
    usePlayerStore.setState(initialPlayerState);
  });

  it('hiển thị thời lượng 0:00 và 0:00 khi chưa phát bài nào', () => {
    render(<ProgressBar />);
    const labels = screen.getAllByText('0:00');
    expect(labels.length).toBeGreaterThanOrEqual(1);
  });

  it('hiển thị đúng tiến trình khi đang phát bài hát', () => {
    usePlayerStore.setState({
      queue: [{ id: 's1', title: 'Bài 1', artist: 'Ca sĩ 1', genre: 'Pop', duration: 150 }],
      currentIndex: 0,
      position: 30,
      isPlaying: true,
    });

    render(<ProgressBar />);
    expect(screen.getByText('0:30')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '20');
  });
});
