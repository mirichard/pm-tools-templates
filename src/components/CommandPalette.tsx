import React, { useState, useEffect, useRef } from 'react';
import { HighlightText } from './HighlightText';
import './animations.css';

interface CommandPaletteProps {
  onCommand: (command: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onCommand }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Common commands
  const commands = [
    { id: 'open-search', label: 'Search Templates', shortcut: '⌘K', section: 'Search' },
    { id: 'clear-filters', label: 'Clear All Filters', shortcut: '⌘0', section: 'Filters' },
    { id: 'show-shortcuts', label: 'Show Keyboard Shortcuts', shortcut: '⌘/', section: 'Help' },
    { id: 'sort-by-name', label: 'Sort by Name', shortcut: '⌘S', section: 'Sort' },
    { id: 'sort-by-recent', label: 'Sort by Recent', shortcut: '⌘R', section: 'Sort' },
    { id: 'toggle-view', label: 'Toggle Grid/List View', shortcut: '⌘V', section: 'View' },
    { id: 'filter-methodology', label: 'Filter by Methodology', shortcut: '⌘M', section: 'Filters' },
    { id: 'filter-category', label: 'Filter by Category', shortcut: '⌘C', section: 'Filters' },
  ];

  // Filter commands based on search
  // Group commands by section
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.section]) {
      acc[command.section] = [];
    }
    acc[command.section].push(command);
    return acc;
  }, {} as Record<string, typeof commands>);

  // Filter and flatten commands
  const filteredCommands = Object.entries(groupedCommands)
    .flatMap(([section, sectionCommands]) => {
      const filtered = sectionCommands.filter(command =>
        command.label.toLowerCase().includes(query.toLowerCase())
      );
      return filtered.length > 0
        ? [{ type: 'section', label: section }, ...filtered]
        : [];
    });

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= filteredCommands.length) return prev;
          if ('type' in filteredCommands[nextIndex]) return nextIndex + 1;
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const nextIndex = prev - 1;
          if (nextIndex < 0) return prev;
          if ('type' in filteredCommands[nextIndex]) return nextIndex - 1;
          return nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          onCommand(selectedCommand.id);
        }
        break;
    }
  };

  return (
    <div
      className="command-palette"
      role="dialog"
      aria-label="Command palette"
    >
      <div className="command-palette-input">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search commands..."
          aria-label="Search commands"
        />
      </div>
      <div 
        className="command-palette-results" 
        role="listbox"
        aria-label="Command search results"
      >
        {filteredCommands.map((command, index) => (
          'type' in command ? (
            <div
              key={command.label}
              className="command-section"
              role="presentation"
            >
              {command.label}
            </div>
          ) : (
            <div
              key={command.id}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => onCommand(command.id)}
            >
            <span className="command-label">
              <HighlightText text={command.label} highlight={query} />
            </span>
              <span className="command-shortcut">{command.shortcut}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};
