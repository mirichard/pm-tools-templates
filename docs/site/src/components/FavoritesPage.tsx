import React, { useState, useEffect } from 'react';

interface Template {
  id: string;
  title: string;
  description: string;
  path: string;
  tags: string[];
  methodology: string;
}

interface Props {
  templates: Template[];
}

const FavoritesPage: React.FC<Props> = ({ templates }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('pmtt_favs') || '[]');
    setFavorites(favs);
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.filter(favId => favId !== id);
    setFavorites(newFavorites);
    localStorage.setItem('pmtt_favs', JSON.stringify(newFavorites));
  };

  const favoriteTemplates = templates.filter(t => favorites.includes(t.id));

  if (favoriteTemplates.length === 0) {
    return (
      <div>
        <h1>Favorite Templates</h1>
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          background: 'var(--code-bg)', 
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h2>No favorites yet</h2>
          <p>Start browsing templates and click the ⭐ icon to save your favorites.</p>
          <a 
            href="/pm-tools-templates/"
            style={{ 
              background: 'var(--accent-color)', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '1rem'
            }}
          >
            Browse Templates
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Favorite Templates</h1>
      <p className="marginnote">
        Your favorite templates are saved locally in your browser. 
        You can remove favorites by clicking the ⭐ icon.
      </p>
      
      <div className="template-grid">
        {favoriteTemplates.map(template => (
          <div key={template.id} className="template-card">
            <h3>
              <a href={`/pm-tools-templates/templates/${template.id}`}>{template.title}</a>
              <span
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => toggleFavorite(template.id)}
                title="Remove from favorites"
              >
                ⭐
              </span>
            </h3>
            <p>{template.description}</p>
            <div className="template-meta">
              <span>{template.methodology}</span>
            </div>
            <div className="template-tags">
              {template.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
