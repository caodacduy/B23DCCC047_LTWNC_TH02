import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = playlists.find((p) => p.id === id);

  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    const songMap = new Map(SONGS.map((s) => [s.id, s]));
    return playlist.songIds
      .map((songId) => songMap.get(songId))
      .filter((s): s is Song => Boolean(s));
  }, [playlist]);

  // Use reduce to calculate total duration in seconds
  const totalSeconds = useMemo(() => {
    return playlistSongs.reduce((acc, song) => acc + song.duration, 0);
  }, [playlistSongs]);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (!playlist) {
    return (
      <div className="playlist-detail-page">
        <div className="empty-state">
          <p>Không tìm thấy playlist.</p>
          <Link to="/playlists" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            ← Quay lại danh sách playlist
          </Link>
        </div>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playQueue(playlistSongs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    playQueue(playlistSongs, index);
  };

  const handleRemoveSong = (songId: string) => {
    dispatch({
      type: 'removeSong',
      payload: { playlistId: playlist.id, songId },
    });
  };

  return (
    <div className="playlist-detail-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <Link to="/playlists" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.75rem' }}>
            ← Tất cả playlist
          </Link>
          <h1 className="page-title">{playlist.name}</h1>
          <p className="page-subtitle" style={{ marginBottom: '0.5rem' }}>
            Tổng thời lượng: {totalMinutes} phút {remainingSeconds} giây
          </p>
          <p className="results-count">{playlistSongs.length} bài hát</p>
        </div>

        {playlistSongs.length > 0 && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePlayAll}
            aria-label="Phát tất cả bài trong playlist"
          >
            ▶ Phát tất cả
          </button>
        )}
      </div>

      {playlistSongs.length === 0 ? (
        <div className="empty-state">
          <h3>Playlist chưa có bài hát nào</h3>
          <p>Hãy vào Thư viện và thêm bài hát vào playlist này.</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Đến Thư viện
          </Link>
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
            {playlistSongs.map((song, index) => (
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
                    onClick={() => handlePlaySong(index)}
                    aria-label={`Phát bài ${song.title}`}
                  >
                    Phát
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveSong(song.id)}
                    aria-label={`Bỏ bài ${song.title} khỏi playlist`}
                  >
                    Bỏ
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

export default PlaylistDetailPage;
