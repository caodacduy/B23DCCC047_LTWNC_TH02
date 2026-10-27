import React from 'react';
import type { CSSProperties } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  song: Song;
  index: number;
  style?: CSSProperties;
  onPlay: (song: Song, index: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (songId: string) => void;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  canAddToPlaylist?: boolean;
}

export const SongRow: React.FC<SongRowProps> = React.memo(function SongRow({
  song,
  index,
  style,
  onPlay,
  isFavorite = false,
  onToggleFavorite,
  onAddToQueue,
  onAddToPlaylist,
  canAddToPlaylist = false,
}) {
  return (
    <div
      className="song-row"
      style={style}
      data-song-id={song.id}
    >
      <div className="song-col song-index">{index + 1}</div>
      <div className="song-col song-info">
        <span className="song-title" title={song.title}>{song.title}</span>
        <span className="song-artist" title={song.artist}>{song.artist}</span>
      </div>
      <div className="song-col song-genre">
        <span className="genre-badge">{song.genre}</span>
      </div>
      <div className="song-col song-duration">{formatDuration(song.duration)}</div>
      <div className="song-col song-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm btn-play"
          onClick={() => onPlay(song, index)}
          aria-label={`Phát bài ${song.title}`}
        >
          Phát
        </button>
        <button
          type="button"
          className={`btn btn-icon btn-fav ${isFavorite ? 'is-fav' : ''}`}
          onClick={() => onToggleFavorite?.(song.id)}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onAddToQueue?.(song)}
          aria-label={`Thêm bài ${song.title} vào hàng đợi`}
        >
          + Hàng đợi
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={!canAddToPlaylist}
          onClick={() => onAddToPlaylist?.(song)}
          aria-label={`Thêm bài ${song.title} vào playlist`}
        >
          + Playlist
        </button>
      </div>
    </div>
  );
});

SongRow.displayName = 'SongRow';
