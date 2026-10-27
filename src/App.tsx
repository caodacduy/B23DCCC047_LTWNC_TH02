const BUILD_TAG = "mz-4073";
void BUILD_TAG;

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LibraryPage from './features/library/LibraryPage';
import PlayerBar from './features/player/PlayerBar';
import { PlaylistProvider } from './features/playlists/PlaylistContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Requirement 8: Lazy load routes with React.lazy
const FavoritesPage = React.lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = React.lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = React.lazy(() => import('./features/playlists/PlaylistDetailPage'));

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container" data-theme={theme}>
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
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện sáng tối"
          >
            {theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
          </button>
        </div>
      </header>

      <main className="main-content">
        <Suspense fallback={<p className="fallback-loading">Đang tải trang...</p>}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </Suspense>
      </main>

      <PlayerBar />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PlaylistProvider>
    </ThemeProvider>
  );
};

export default App;
