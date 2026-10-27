import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';

describe('Kiểm thử component FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState(initialPlayerState);
  });

  it('hiển thị thông báo khi chưa có bài hát yêu thích nào', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Bạn chưa có bài hát yêu thích.')).toBeInTheDocument();
  });

  it('hiển thị danh sách các bài hát yêu thích và nút Phát tất cả', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    render(<FavoritesPage />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: /phát tất cả/i });
    expect(playAllBtn).toBeInTheDocument();

    await user.click(playAllBtn);
    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it('bấm nút Bỏ yêu thích thì xóa bài khỏi danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1'] });

    render(<FavoritesPage />);
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();

    const unFavBtn = screen.getByRole('button', { name: /bỏ yêu thích/i });
    await user.click(unFavBtn);

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
