import React from 'react';
import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

export const ProgressBar: React.FC = React.memo(() => {
  const position = usePlayerStore((s) => s.position);
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 && s.currentIndex < s.queue.length
      ? s.queue[s.currentIndex]
      : null
  );

  const duration = currentSong ? currentSong.duration : 0;
  const progressPercent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="player-progress-container">
      <span className="time-label">{formatDuration(position)}</span>
      <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="time-label right">{formatDuration(duration)}</span>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
