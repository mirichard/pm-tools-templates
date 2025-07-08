import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
  onToggleHelp: () => void;
  onSort: () => void;
  onQuickFind?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onToggleFilters,
  onToggleHelp,
  onSort,
  onQuickFind,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    onSearch('');
    searchInputRef.current?.focus();
  };

  const handleQuickFind = () => {
    if (onQuickFind) {
      onQuickFind();
    } else {
      // Default behavior: focus search input
      searchInputRef.current?.focus();
    }
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="search-bar">
          <div className={`search-input-container ${isFocused ? 'focused' : ''}`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search templates..."
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="search-input"
              aria-label="Search templates"
              aria-describedby="search-help"
            />
            <span className="search-icon">🔍</span>
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="search-clear"
                aria-label="Clear search"
                type="button"
              >
                ×
              </button>
            )}
            {isFocused && (
              <div className="search-hint" id="search-help">
                Press Ctrl+K for command palette
              </div>
            )}
          </div>
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
            onClick={handleQuickFind}
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
            aria-label="Help and keyboard shortcuts"
          >
            Help
          </button>
        </div>
      </nav>
    </header>
  );
};
