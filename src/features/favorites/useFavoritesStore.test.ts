import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('Kiểm thử useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  it('thêm bài hát vào danh sách yêu thích khi chưa có', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle('s1');

    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('bỏ bài hát khỏi danh sách yêu thích khi đã có sẵn', () => {
    useFavoritesStore.setState({ ids: ['s1', 's2'] });

    const { toggle } = useFavoritesStore.getState();
    toggle('s1');

    expect(useFavoritesStore.getState().ids).toEqual(['s2']);
  });
});
