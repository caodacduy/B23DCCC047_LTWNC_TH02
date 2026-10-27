import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from './SongRow';
import type { Song } from '../../types';

const mockSong: Song = {
  id: 's1',
  title: 'Mưa tháng Sáu 1',
  artist: 'Lê Minh',
  genre: 'Pop',
  duration: 150, // 2:30
};

describe('Kiểm thử component SongRow', () => {
  it('hiển thị tên bài hát và thời lượng 2:30 chính xác', () => {
    const handlePlay = vi.fn();

    render(
      <SongRow
        song={mockSong}
        index={0}
        onPlay={handlePlay}
      />
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
  });

  it('bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', async () => {
    const user = userEvent.setup();
    const handlePlay = vi.fn();

    render(
      <SongRow
        song={mockSong}
        index={0}
        onPlay={handlePlay}
      />
    );

    const playButton = screen.getByRole('button', { name: /phát/i });
    await user.click(playButton);

    expect(handlePlay).toHaveBeenCalledTimes(1);
    expect(handlePlay).toHaveBeenCalledWith(mockSong, 0);
  });

  it('bấm nút yêu thích gọi hàm onToggleFavorite với đúng id bài hát', async () => {
    const user = userEvent.setup();
    const handleToggleFavorite = vi.fn();

    render(
      <SongRow
        song={mockSong}
        index={0}
        onPlay={vi.fn()}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={false}
      />
    );

    const favButton = screen.getByRole('button', { name: /thêm vào yêu thích/i });
    await user.click(favButton);

    expect(handleToggleFavorite).toHaveBeenCalledTimes(1);
    expect(handleToggleFavorite).toHaveBeenCalledWith('s1');
  });
});
