import React, { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export const PlayerBar: React.FC = () => {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );
  const queueLength = usePlayerStore((s) => s.queue.length);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);

  // Clock effect: updates every second when playing
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, tick]);

  return (
    <footer className="player-bar-container" aria-label="Trình phát nhạc">
      <div className="player-track-info">
        {currentSong ? (
          <div>
            <div className="player-now-playing" title={`${currentSong.title} – ${currentSong.artist}`}>
              Đang phát: {currentSong.title} – {currentSong.artist}
            </div>
            <div className="player-artist">{currentSong.genre}</div>
          </div>
        ) : (
          <div className="player-now-playing">Chưa phát bài nào</div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={prev}
            aria-label="Trước"
          >
            Trước
          </button>
          <button
            type="button"
            className="player-btn-main"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={next}
            aria-label="Sau"
          >
            Sau
          </button>
        </div>
        <ProgressBar />
      </div>

      <div className="player-right">
        <span className="queue-badge">Hàng đợi: {queueLength} bài</span>
      </div>
    </footer>
  );
};

export default PlayerBar;
