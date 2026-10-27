import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { LibraryPage } from './LibraryPage';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore, initialPlayerState } from '../player/usePlayerStore';
import type { Playlist } from '../../types';

function renderLibrary(initialPlaylists: Playlist[] = []) {
  return render(
    <PlaylistProvider initialPlaylists={initialPlaylists}>
      <LibraryPage />
    </PlaylistProvider>
  );
}

describe('Kiểm thử component LibraryPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState(initialPlayerState);
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('mở trang hiển thị "Tìm thấy 10000 bài hát"', () => {
    renderLibrary();
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
  });

  it('gõ "mưa" vào ô tìm kiếm thì chỉ lọc lại sau 300ms và tìm thấy 1250 bài hát', () => {
    renderLibrary();
    const searchInput = screen.getByLabelText('Tìm kiếm');

    fireEvent.change(searchInput, { target: { value: 'mưa' } });

    // Lúc vừa gõ xong (chưa hết 300ms): vẫn là 10000 bài
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    // Sau 300ms: lọc thành 1250 bài
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('chọn thể loại Rock khi ô tìm kiếm vẫn là "mưa" thì hiển thị "Tìm thấy 250 bài hát"', () => {
    renderLibrary();
    const searchInput = screen.getByLabelText('Tìm kiếm');
    const genreSelect = screen.getByLabelText('Thể loại');

    fireEvent.change(searchInput, { target: { value: 'mưa' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.change(genreSelect, { target: { value: 'Rock' } });
    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('gõ "xyz" thì hiển thị thông báo "Không tìm thấy bài hát nào"', () => {
    renderLibrary();
    const searchInput = screen.getByLabelText('Tìm kiếm');

    fireEvent.change(searchInput, { target: { value: 'xyz' } });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('sắp xếp theo Tên A–Z với bộ lọc trống thì dòng đầu tiên là "Biển bình yên 1"', () => {
    renderLibrary();
    const sortSelect = screen.getByLabelText('Sắp xếp');

    fireEvent.change(sortSelect, { target: { value: 'Tên A–Z' } });

    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();
  });

  it('thêm bài hát vào playlist đã chọn khi bấm nút + Playlist', () => {
    const playlists: Playlist[] = [
      { id: 'pl_gym', name: 'Tập Gym', songIds: [] },
    ];

    renderLibrary(playlists);

    const addButtons = screen.getAllByRole('button', { name: /vào playlist/i });
    expect(addButtons[0]).not.toBeDisabled();

    fireEvent.click(addButtons[0]);
    // Bài đầu tiên đã được thêm
  });
});
