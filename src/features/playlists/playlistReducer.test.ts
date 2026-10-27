import { describe, it, expect } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from '../../types';

describe('Kiểm thử playlistReducer', () => {
  it('tạo playlist mới với danh sách bài hát rỗng', () => {
    const initialState: Playlist[] = [];
    const nextState = playlistReducer(initialState, {
      type: 'create',
      payload: { name: 'Nhạc thư giãn', id: 'pl_test_1' },
    });

    expect(nextState).toHaveLength(1);
    expect(nextState[0]).toEqual({
      id: 'pl_test_1',
      name: 'Nhạc thư giãn',
      songIds: [],
    });
  });

  it('addSong không thêm trùng bài vào cùng một playlist', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Pop Hits', songIds: ['s1'] },
    ];

    // Thêm bài đã có 's1'
    const stateAfterDup = playlistReducer(initialState, {
      type: 'addSong',
      payload: { playlistId: 'pl_1', songId: 's1' },
    });
    expect(stateAfterDup[0].songIds).toEqual(['s1']);

    // Thêm bài mới 's2'
    const stateAfterNew = playlistReducer(stateAfterDup, {
      type: 'addSong',
      payload: { playlistId: 'pl_1', songId: 's2' },
    });
    expect(stateAfterNew[0].songIds).toEqual(['s1', 's2']);
  });

  it('removeSong xóa đúng bài hát khỏi playlist', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Pop Hits', songIds: ['s1', 's2', 's3'] },
    ];

    const nextState = playlistReducer(initialState, {
      type: 'removeSong',
      payload: { playlistId: 'pl_1', songId: 's2' },
    });

    expect(nextState[0].songIds).toEqual(['s1', 's3']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Pop Hits', songIds: ['s1'] },
      { id: 'pl_2', name: 'Rock Ballad', songIds: ['s2'] },
    ];

    const nextState = playlistReducer(initialState, {
      type: 'remove',
      payload: { id: 'pl_non_existent' },
    });

    expect(nextState).toEqual(initialState);
  });

  it('đổi tên playlist chính xác', () => {
    const initialState: Playlist[] = [
      { id: 'pl_1', name: 'Tên cũ', songIds: [] },
    ];

    const nextState = playlistReducer(initialState, {
      type: 'rename',
      payload: { id: 'pl_1', name: 'Tên mới' },
    });

    expect(nextState[0].name).toBe('Tên mới');
  });
});
