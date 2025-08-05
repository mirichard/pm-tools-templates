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
      <h1>Template Browser</h1>
      <div className="filters">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="search-input">Search</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="methodology-filter">Methodology</label>
            <select
              id="methodology-filter"
              value={methodologyFilter}
              onChange={e => setMethodologyFilter(e.target.value)}
            >
              {methodologies.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <button
            className={`favorites-toggle ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>

      <div className="template-grid">
        {filteredTemplates.map(template => (
          <div key={template.id} className="template-card">
            <h3>
              <a href={`/pm-tools-templates/templates/${template.id}`}>{template.title}</a>
              <span
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={() => toggleFavorite(template.id)}
              >
                {favorites.includes(template.id) ? '⭐' : '☆'}
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

export default TemplateBrowser;
