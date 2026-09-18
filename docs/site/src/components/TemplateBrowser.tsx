import React, { useState, useEffect, useMemo } from 'react';

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

const TemplateBrowser: React.FC<Props> = ({ templates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodologyFilter, setMethodologyFilter] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('pmtt_favs') || '[]');
    setFavorites(favs);
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('pmtt_favs', JSON.stringify(newFavorites));
  };

  const filteredTemplates = useMemo(() => {
    return templates
      .filter(t => {
        if (showFavorites && !favorites.includes(t.id)) {
          return false;
        }
        if (methodologyFilter !== 'all' && t.methodology !== methodologyFilter) {
          return false;
        }
        if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase()) && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [templates, searchTerm, methodologyFilter, showFavorites, favorites]);

  const methodologies = useMemo(() => {
    return ['all', ...new Set(templates.map(t => t.methodology))];
  }, [templates]);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">PM</div>
            <span className="logo-text">Template Library</span>
          </div>
          <nav>
            <a href="/pm-tools-templates/favorites" className="btn btn-secondary">
              ⭐ My Favorites ({favorites.length})
            </a>
          </nav>
        </div>
      </header>

      <div className="container">
        {/* Search and Filters */}
        <div className="search-section">
          <div className="search-header">
            <h2 className="search-title">Find Your Perfect Template</h2>
            <span className="results-count">
              {filteredTemplates.length} of {templates.length} templates
            </span>
          </div>
          
          <div className="search-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="search-input">
                🔍 Search templates
              </label>
              <input
                id="search-input"
                type="text"
                className="form-input"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="methodology-filter">
                📋 Methodology
              </label>
              <select
                id="methodology-filter"
                className="form-select"
                value={methodologyFilter}
                onChange={e => setMethodologyFilter(e.target.value)}
              >
                {methodologies.map(m => (
                  <option key={m} value={m}>
                    {m === 'all' ? 'All Methodologies' : m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Filter</label>
              <button
                className={`btn ${showFavorites ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                {showFavorites ? '⭐ Favorites Only' : '📚 Show All'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredTemplates.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No templates found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              {showFavorites 
                ? "You haven't favorited any templates yet. Browse all templates and click the star to save your favorites."
                : "Try adjusting your search terms or methodology filter to find what you're looking for."
              }
            </p>
            {showFavorites && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowFavorites(false)}
                style={{ marginTop: '1rem' }}
              >
                Browse All Templates
              </button>
            )}
          </div>
        ) : (
          <div className="template-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-card-header">
                  <h3 className="template-title">
                    <a href={`/pm-tools-templates/templates/${template.id}`}>
                      {template.title}
                    </a>
                  </h3>
                  <button
                    className="favorite-btn"
                    onClick={() => toggleFavorite(template.id)}
                    title={favorites.includes(template.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.includes(template.id) ? '⭐' : '☆'}
                  </button>
                </div>
                
                <p className="template-description">{template.description}</p>
                
                <div className="template-meta">
                  <span className="methodology-badge">
                    📋 {template.methodology.charAt(0).toUpperCase() + template.methodology.slice(1)}
                  </span>
                </div>
                
                <div className="template-tags">
                  {template.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="tag">+{template.tags.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateBrowser;
