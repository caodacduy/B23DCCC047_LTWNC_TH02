import React from 'react';

const FavoritesPage: React.FC = () => {
  return (
    <div className="favorites-page">
      <h1 className="page-title">Bài hát yêu thích</h1>
      <p className="page-subtitle">Danh sách các bài hát bạn đã thả tim</p>
      <div className="empty-state">
        <p>Bạn chưa có bài hát yêu thích.</p>
      </div>
    </div>
  );
};

export default FavoritesPage;
