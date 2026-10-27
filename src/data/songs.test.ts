import { describe, it, expect } from 'vitest';
import { generateSongs, SONGS } from './songs';

describe('Kiểm thử sinh dữ liệu bài hát', () => {
  it('generateSongs(10000) tạo ra đúng 10000 phần tử', () => {
    const songs = generateSongs(10000);
    expect(songs).toHaveLength(10000);
  });

  it('mọi id bài hát đều là duy nhất và không bị trùng lặp', () => {
    const ids = SONGS.map((song) => song.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10000);
  });

  it('mọi thời lượng bài hát đều nằm trong khoảng từ 150 đến 300 giây', () => {
    for (const song of SONGS) {
      expect(song.duration).toBeGreaterThanOrEqual(150);
      expect(song.duration).toBeLessThanOrEqual(300);
    }
  });

  it('thông tin bài hát đầu tiên đúng theo quy tắc sinh dữ liệu', () => {
    expect(SONGS[0]).toEqual({
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      genre: 'Pop',
      duration: 150,
    });
  });
});
