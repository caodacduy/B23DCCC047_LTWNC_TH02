import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import type { Song } from '../../types';
import { SONGS } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlaylists, usePlaylistDispatch } from '../playlists/PlaylistContext';
import { SongRow } from './SongRow';

interface LibraryPageProps {
  onPlaySong?: (song: Song, index: number, list: Song[]) => void;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (songId: string) => void;
  onAddToQueue?: (song: Song) => void;
}

interface RowItemData {
  songs: Song[];
  onPlay: (song: Song, index: number) => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (songId: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  canAddToPlaylist: boolean;
}

const Row = React.memo(({ index, style, data }: ListChildComponentProps<RowItemData>) => {
  const song = data.songs[index];
  if (!song) return null;

  return (
    <SongRow
      song={song}
      index={index}
      style={style}
      onPlay={data.onPlay}
      isFavorite={data.favoriteIds.has(song.id)}
      onToggleFavorite={data.onToggleFavorite}
      onAddToQueue={data.onAddToQueue}
      onAddToPlaylist={data.onAddToPlaylist}
      canAddToPlaylist={data.canAddToPlaylist}
    />
  );
});

Row.displayName = 'VirtualSongRow';

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onPlaySong,
  favoriteIds: propFavoriteIds,
  onToggleFavorite: propToggleFavorite,
  onAddToQueue: propAddToQueue,
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<string>('Mặc định');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  // Stores & Contexts
  const storePlayQueue = usePlayerStore((s) => s.playQueue);
  const storeAddToQueue = usePlayerStore((s) => s.addToQueue);
  const storeFavoriteIds = useFavoritesStore((s) => s.ids);
  const storeToggleFavorite = useFavoritesStore((s) => s.toggle);

  const playlists = usePlaylists();
  const playlistDispatch = usePlaylistDispatch();

  // Sync selectedPlaylistId with available playlists
  useEffect(() => {
    if (playlists.length > 0) {
      if (!selectedPlaylistId || !playlists.some((p) => p.id === selectedPlaylistId)) {
        setSelectedPlaylistId(playlists[0].id);
      }
    } else {
      setSelectedPlaylistId('');
    }
  }, [playlists, selectedPlaylistId]);

  const favoriteIds = useMemo(() => {
    if (propFavoriteIds) return propFavoriteIds;
    return new Set(storeFavoriteIds);
  }, [propFavoriteIds, storeFavoriteIds]);

  const debouncedQuery = useDebounce<string>(searchInput, 300);

  // Mandatory requirement: function handling search input MUST be named handleQueryShift
  const handleQueryShift = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const filteredSongs = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const filtered = SONGS.filter((song) => {
      const matchGenre = selectedGenre === 'Tất cả' || song.genre === selectedGenre;
      if (!matchGenre) return false;

      if (!q) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'Tên A–Z') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }

    if (sortBy === 'Thời lượng tăng dần') {
      return [...filtered].sort((a, b) => a.duration - b.duration);
    }

    return filtered;
  }, [debouncedQuery, selectedGenre, sortBy]);

  const handlePlayRow = useCallback(
    (song: Song, index: number) => {
      if (onPlaySong) {
        onPlaySong(song, index, filteredSongs);
      } else {
        storePlayQueue(filteredSongs, index);
      }
    },
    [onPlaySong, filteredSongs, storePlayQueue]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      if (propAddToQueue) {
        propAddToQueue(song);
      } else {
        storeAddToQueue(song);
      }
    },
    [propAddToQueue, storeAddToQueue]
  );

  const handleToggleFav = useCallback(
    (songId: string) => {
      if (propToggleFavorite) {
        propToggleFavorite(songId);
      } else {
        storeToggleFavorite(songId);
      }
    },
    [propToggleFavorite, storeToggleFavorite]
  );

  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      if (selectedPlaylistId) {
        playlistDispatch({
          type: 'addSong',
          payload: { playlistId: selectedPlaylistId, songId: song.id },
        });
      }
    },
    [selectedPlaylistId, playlistDispatch]
  );

  const canAddToPlaylist = Boolean(selectedPlaylistId && playlists.length > 0);

  const itemData: RowItemData = useMemo(
    () => ({
      songs: filteredSongs,
      onPlay: handlePlayRow,
      favoriteIds,
      onToggleFavorite: handleToggleFav,
      onAddToQueue: handleAddToQueue,
      onAddToPlaylist: handleAddToPlaylist,
      canAddToPlaylist,
    }),
    [
      filteredSongs,
      handlePlayRow,
      favoriteIds,
      handleToggleFav,
      handleAddToQueue,
      handleAddToPlaylist,
      canAddToPlaylist,
    ]
  );

  return (
    <div className="library-page">
      <div className="library-header">
        <h1 className="page-title">Thư viện bài hát</h1>
        <p className="page-subtitle">Khám phá hơn 10.000 bài hát với hiệu năng mượt mà</p>
      </div>

      <div className="library-controls card">
        <div className="control-group search-group">
          <label htmlFor="song-search">Tìm kiếm</label>
          <div className="input-wrapper">
            <input
              id="song-search"
              type="text"
              className="input-field"
              placeholder="Tìm theo tên bài hát hoặc ca sĩ..."
              value={searchInput}
              onChange={handleQueryShift}
            />
            {searchInput && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchInput('')}
                aria-label="Xóa ô tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="genre-select">Thể loại</label>
          <select
            id="genre-select"
            className="select-field"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Pop">Pop</option>
            <option value="Ballad">Ballad</option>
            <option value="Rock">Rock</option>
            <option value="Indie">Indie</option>
            <option value="Rap">Rap</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-select">Sắp xếp</label>
          <select
            id="sort-select"
            className="select-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Mặc định">Mặc định</option>
            <option value="Tên A–Z">Tên A–Z</option>
            <option value="Thời lượng tăng dần">Thời lượng tăng dần</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="playlist-select">Playlist đang chọn</label>
          <select
            id="playlist-select"
            className="select-field"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            disabled={playlists.length === 0}
          >
            {playlists.length === 0 ? (
              <option value="">Chưa có playlist</option>
            ) : (
              playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="results-info">
        {filteredSongs.length > 0 ? (
          <p className="results-count">Tìm thấy {filteredSongs.length} bài hát</p>
        ) : (
          <p className="no-results">Không tìm thấy bài hát nào</p>
        )}
      </div>

      {filteredSongs.length > 0 && (
        <div className="virtual-table-container card">
          <div className="virtual-table-header">
            <div className="song-col song-index">#</div>
            <div className="song-col song-info">Tiêu đề & Nghệ sĩ</div>
            <div className="song-col song-genre">Thể loại</div>
            <div className="song-col song-duration">Thời lượng</div>
            <div className="song-col song-actions">Hành động</div>
          </div>
          <FixedSizeList
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
            itemKey={(index, data) => data.songs[index].id}
            itemData={itemData}
          >
            {Row}
          </FixedSizeList>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
