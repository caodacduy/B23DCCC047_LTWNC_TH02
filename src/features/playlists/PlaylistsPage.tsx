import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';
import type { Playlist } from '../../types';

interface CreatePlaylistFormProps {
  existingPlaylists: Playlist[];
}

export const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = ({ existingPlaylists }) => {
  const dispatch = usePlaylistDispatch();
  const [playlistName, setPlaylistName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = playlistName.trim();

    if (!trimmed) {
      setErrorMessage('Tên playlist không được để trống');
      return;
    }

    const isDuplicate = existingPlaylists.some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      setErrorMessage('Tên playlist đã tồn tại');
      return;
    }

    dispatch({
      type: 'create',
      payload: { name: trimmed },
    });

    setPlaylistName('');
    setErrorMessage('');
  };

  return (
    <form onSubmit={handleCreate} className="playlist-form card">
      <div className="control-group" style={{ flex: 1 }}>
        <label htmlFor="new-playlist-name">Tên playlist</label>
        <input
          id="new-playlist-name"
          type="text"
          className="input-field"
          placeholder="Nhập tên playlist mới..."
          value={playlistName}
          onChange={(e) => {
            setPlaylistName(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
        />
        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1.6rem' }}>
        Tạo
      </button>
    </form>
  );
};

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const handleRemove = (id: string) => {
    dispatch({ type: 'remove', payload: { id } });
  };

  return (
    <div className="playlists-page">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Danh sách playlist</h1>
        <p className="page-subtitle">Quản lý và tổ chức các bộ sưu tập âm nhạc của bạn</p>
      </div>

      <CreatePlaylistForm existingPlaylists={playlists} />

      {playlists.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <h3>Chưa có playlist nào</h3>
          <p>Hãy tạo playlist đầu tiên của bạn ở biểu mẫu bên trên.</p>
        </div>
      ) : (
        <div className="playlist-grid">
          {playlists.map((pl) => (
            <div key={pl.id} className="playlist-card" data-playlist-id={pl.id}>
              <div className="playlist-card-header">
                <h3>{pl.name}</h3>
                <span className="queue-badge">{pl.songIds.length} bài</span>
              </div>
              <div className="playlist-card-actions">
                <Link to={`/playlists/${pl.id}`} className="btn btn-secondary btn-sm">
                  Xem chi tiết
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(pl.id)}
                  aria-label={`Xóa playlist ${pl.name}`}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
