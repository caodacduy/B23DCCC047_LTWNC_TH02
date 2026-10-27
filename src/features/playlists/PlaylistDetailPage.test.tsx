import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PlaylistDetailPage } from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import type { Playlist } from '../../types';

function renderDetailWithRouter(
  initialEntries: string[],
  initialPlaylists: Playlist[] = []
) {
  return render(
    <PlaylistProvider initialPlaylists={initialPlaylists}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          <Route path="/playlists" element={<div>Trang danh sách playlist</div>} />
        </Routes>
      </MemoryRouter>
    </PlaylistProvider>
  );
}

describe('Kiểm thử component PlaylistDetailPage', () => {
  beforeEach(() => {
    usePlayerStore.setState(initialPlayerState);
    localStorage.clear();
  });

  it('hiển thị "Không tìm thấy playlist" khi id không tồn tại', () => {
    renderDetailWithRouter(['/playlists/non-existent-id']);
    expect(screen.getByText('Không tìm thấy playlist.')).toBeInTheDocument();
  });

  it('hiển thị thông tin playlist, tính tổng thời lượng bằng reduce và cho phép phát tất cả', async () => {
    const user = userEvent.setup();
    // s1 = 150s (2m 30s), s2 = 187s (3m 07s) => Tổng 337s = 5 phút 37 giây
    const playlists: Playlist[] = [
      { id: 'pl_running', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];

    renderDetailWithRouter(['/playlists/pl_running'], playlists);

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();

    const playAllBtn = screen.getByRole('button', { name: /phát tất cả/i });
    await user.click(playAllBtn);

    expect(usePlayerStore.getState().isPlaying).toBe(true);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
  });

  it('bấm nút Bỏ thì xóa bài hát khỏi playlist', async () => {
    const user = userEvent.setup();
    const playlists: Playlist[] = [
      { id: 'pl_running', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ];

    renderDetailWithRouter(['/playlists/pl_running'], playlists);

    const removeButtons = screen.getAllByRole('button', { name: /^bỏ/i });
    await user.click(removeButtons[0]);

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });
});
