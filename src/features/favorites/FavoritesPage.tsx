import React, { useMemo } from 'react';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export const FavoritesPage: React.FC = () => {
  const ids = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);

  const favoriteSongs = useMemo(() => {
    const songMap = new Map(SONGS.map((s) => [s.id, s]));
    return ids.map((id) => songMap.get(id)).filter((s): s is Song => Boolean(s));
  }, [ids]);

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  };

  const handlePlaySingle = (index: number) => {
    playQueue(favoriteSongs, index);
  };

  return (
    <div className="favorites-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Bài hát yêu thích</h1>
          <p className="page-subtitle">Danh sách {favoriteSongs.length} bài hát bạn đã lưu lại</p>
        </div>
        {favoriteSongs.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePlayAll}
            aria-label="Phát tất cả bài hát yêu thích"
          >
            ▶ Phát tất cả
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có bài hát yêu thích.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="virtual-table-header">
            <div className="song-col song-index">#</div>
            <div className="song-col song-info">Tiêu đề & Nghệ sĩ</div>
            <div className="song-col song-genre">Thể loại</div>
            <div className="song-col song-duration">Thời lượng</div>
            <div className="song-col song-actions">Hành động</div>
          </div>
          <div className="simple-list" style={{ margin: 0 }}>
            {favoriteSongs.map((song, index) => (
              <div key={song.id} className="song-row" style={{ height: '56px' }}>
                <div className="song-col song-index">{index + 1}</div>
                <div className="song-col song-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
                <div className="song-col song-genre">
                  <span className="genre-badge">{song.genre}</span>
                </div>
                <div className="song-col song-duration">{formatDuration(song.duration)}</div>
                <div className="song-col song-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-play"
                    onClick={() => handlePlaySingle(index)}
                    aria-label={`Phát bài ${song.title}`}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-fav is-fav"
                    onClick={() => toggleFavorite(song.id)}
                    aria-label="Bỏ yêu thích"
                    title="Bỏ yêu thích"
                  >
                    ♥
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => addToQueue(song)}
                    aria-label={`Thêm bài ${song.title} vào hàng đợi`}
                  >
                    + Hàng đợi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
