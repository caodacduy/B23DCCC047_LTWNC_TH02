import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore, initialPlayerState } from './usePlayerStore';
import type { Song } from '../../types';

const mockSongs: Song[] = [
  { id: 's1', title: 'Bài 1', artist: 'Ca sĩ A', genre: 'Pop', duration: 150 },
  { id: 's2', title: 'Bài 2', artist: 'Ca sĩ B', genre: 'Rock', duration: 180 },
  { id: 's3', title: 'Bài 3', artist: 'Ca sĩ C', genre: 'Indie', duration: 200 },
];

describe('Kiểm thử usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      ...initialPlayerState,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('playQueue đặt đúng bài hát, vị trí bắt đầu và bắt đầu phát', () => {
    const { playQueue } = usePlayerStore.getState();
    playQueue(mockSongs, 1);

    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(mockSongs);
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('tick ở giây cuối tự động chuyển sang bài tiếp theo', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 0,
      isPlaying: true,
      position: 149, // Giây cuối cùng của bài 1 (thời lượng 150s)
    });

    const { tick } = usePlayerStore.getState();
    tick();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('next ở bài cuối cùng thì dừng phát (isPlaying là false)', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 2, // Bài cuối cùng trong mảng 3 phần tử
      isPlaying: true,
      position: 50,
    });

    const { next } = usePlayerStore.getState();
    next();

    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
  });

  it('prev khi đã phát quá 3 giây chỉ tua về 0:00 mà không lùi bài', () => {
    usePlayerStore.setState({
      queue: mockSongs,
      currentIndex: 1,
      isPlaying: true,
      position: 10,
    });

    const { prev } = usePlayerStore.getState();
    prev();

    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('addToQueue thêm bài mới vào cuối hàng đợi và bỏ qua bài đã tồn tại', () => {
    usePlayerStore.setState({
      queue: [mockSongs[0]],
      currentIndex: 0,
      isPlaying: true,
      position: 0,
    });

    const { addToQueue } = usePlayerStore.getState();

    // Thêm bài đã có
    addToQueue(mockSongs[0]);
    expect(usePlayerStore.getState().queue).toHaveLength(1);

    // Thêm bài chưa có
    addToQueue(mockSongs[1]);
    expect(usePlayerStore.getState().queue).toHaveLength(2);
    expect(usePlayerStore.getState().queue[1].id).toBe('s2');
  });
});
