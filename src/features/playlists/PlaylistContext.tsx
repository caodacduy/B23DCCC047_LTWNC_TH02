import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import type { Playlist } from '../../types';
import { playlistReducer, type PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

export const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
export const PlaylistDispatchContext = createContext<React.Dispatch<PlaylistAction> | undefined>(undefined);

const STORAGE_KEY = 'music-playlists';

function getInitialPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore parsing failure
  }
  return [];
}

interface PlaylistProviderProps {
  children: React.ReactNode;
  initialPlaylists?: Playlist[];
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
  children,
  initialPlaylists,
}) => {
  const loggedReducer = useMemo(() => withLogger(playlistReducer), []);

  const [state, dispatch] = useReducer(
    loggedReducer,
    initialPlaylists ?? undefined,
    () => initialPlaylists ?? getInitialPlaylists()
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage write errors
    }
  }, [state]);

  return (
    <PlaylistStateContext.Provider value={state}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
};

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch(): React.Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch must be used within a PlaylistProvider');
  }
  return context;
}
