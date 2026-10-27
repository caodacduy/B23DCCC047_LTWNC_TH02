import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const initialPlayerState = {
  queue: [] as Song[],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
};

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  ...initialPlayerState,

  playQueue: (songs: Song[], startIndex: number) => {
    if (!songs || songs.length === 0) return;
    const safeIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
    set({
      queue: songs,
      currentIndex: safeIndex,
      position: 0,
      isPlaying: true,
    });
  },

  togglePlay: () => {
    const { currentIndex, queue, isPlaying } = get();
    if (currentIndex === -1 || queue.length === 0) return;
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex >= queue.length - 1) {
      set({ isPlaying: false });
    } else {
      set({
        currentIndex: currentIndex + 1,
        position: 0,
      });
    }
  },

  prev: () => {
    const { position, currentIndex } = get();
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        position: 0,
      });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song: Song) => {
    const { queue } = get();
    if (queue.some((s) => s.id === song.id)) {
      return;
    }
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { isPlaying, queue, currentIndex, position, next } = get();
    if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) return;

    const currentSong = queue[currentIndex];
    const nextPosition = position + 1;

    if (nextPosition >= currentSong.duration) {
      next();
    } else {
      set({ position: nextPosition });
    }
  },
}));
