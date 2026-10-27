const BUILD_TAG = "mz-4073";
void BUILD_TAG;

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import FavoritesPage from './features/favorites/FavoritesPage';
import PlaylistsPage from './features/playlists/PlaylistsPage';
import PlaylistDetailPage from './features/playlists/PlaylistDetailPage';
import PlayerBar from './features/player/PlayerBar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container" data-theme="dark">
        <header className="navbar">
          <NavLink to="/" className="brand">
            <span className="brand-icon">🎵</span>
            <span>Mini Music</span>
          </NavLink>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Thư viện
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Yêu thích
            </NavLink>
            <NavLink
              to="/playlists"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Playlist
            </NavLink>
          </nav>
          <div className="nav-actions">
            <button type="button" className="btn btn-secondary btn-sm">
              Giao diện sáng
            </button>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </main>

        <PlayerBar />
      </div>
    </BrowserRouter>
  );
};

export default App;
