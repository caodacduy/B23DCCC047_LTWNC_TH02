import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PlaylistsPage } from './PlaylistsPage';
import { PlaylistProvider } from './PlaylistContext';
import type { Playlist } from '../../types';

// Hàm helper renderWithProviders bọc PlaylistProvider và MemoryRouter theo yêu cầu đề bài
function renderWithProviders(
  ui: React.ReactElement,
  { initialPlaylists = [] as Playlist[] } = {}
) {
  return render(
    <PlaylistProvider initialPlaylists={initialPlaylists}>
      <MemoryRouter>{ui}</MemoryRouter>
    </PlaylistProvider>
  );
}

describe('Kiểm thử component PlaylistsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const createButton = screen.getByRole('button', { name: /^tạo$/i });
    await user.click(createButton);

    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PlaylistsPage />);

    const input = screen.getByPlaceholderText('Nhập tên playlist mới...');
    const createButton = screen.getByRole('button', { name: /^tạo$/i });

    await user.type(input, 'Nhạc Acoustic');
    await user.click(createButton);

    expect(screen.getByText('Nhạc Acoustic')).toBeInTheDocument();
    expect(screen.getByText('0 bài')).toBeInTheDocument();
  });

  it('báo lỗi "Tên playlist đã tồn tại" khi tạo playlist trùng tên (không phân biệt hoa thường)', async () => {
    const user = userEvent.setup();
    const existing: Playlist[] = [
      { id: 'pl_1', name: 'Chạy bộ', songIds: [] },
    ];

    renderWithProviders(<PlaylistsPage />, { initialPlaylists: existing });

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Nhập tên playlist mới...');
    const createButton = screen.getByRole('button', { name: /^tạo$/i });

    await user.type(input, 'chạy bộ');
    await user.click(createButton);

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument();
  });

  it('bấm nút Xóa thì xóa playlist khỏi danh sách', async () => {
    const user = userEvent.setup();
    const existing: Playlist[] = [
      { id: 'pl_1', name: 'Playlist Cần Xóa', songIds: [] },
    ];

    renderWithProviders(<PlaylistsPage />, { initialPlaylists: existing });

    const deleteButton = screen.getByRole('button', { name: /xóa playlist playlist cần xóa/i });
    await user.click(deleteButton);

    expect(screen.queryByText('Playlist Cần Xóa')).not.toBeInTheDocument();
  });
});
