export type Genre = 'Pop' | 'Ballad' | 'Rock' | 'Indie' | 'Rap';

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  duration: number; // đơn vị: giây
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}
