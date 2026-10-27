import React from 'react';
import { useParams } from 'react-router-dom';

const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="playlist-detail-page">
      <h1 className="page-title">Chi tiết playlist: {id}</h1>
    </div>
  );
};

export default PlaylistDetailPage;
