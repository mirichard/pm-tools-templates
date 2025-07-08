import React from 'react';
import './Header.css';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
  onToggleHelp: () => void;
  onSort: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onToggleFilters,
  onToggleHelp,
  onSort,
}) => {
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search templates..."
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="nav-controls">
          <button
            onClick={onToggleFilters}
            className="nav-button"
            aria-label="Toggle filters"
          >
            Filters
          </button>
          <button
            onClick={() => {}}
            className="nav-button"
            aria-label="Quick find"
          >
            Find
          </button>
          <button
            onClick={onSort}
            className="nav-button"
            aria-label="Sort templates"
          >
            Sort
          </button>
          <button
            onClick={onToggleHelp}
            className="nav-button"
            aria-label="Help"
          >
            Help
          </button>
        </div>
      </nav>
    </header>
  );
};
