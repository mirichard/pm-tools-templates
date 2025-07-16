// src/components/FilterPanel.js
import React, { useState, useEffect } from 'react';

const pmOptions = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve'];
const statusOptions = ['Planned', 'In Progress', 'Completed', 'On Hold'];

const FilterPanel = ({ onFilterChange }) => {
  const [selectedPMs, setSelectedPMs] = useState(pmOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions);

  useEffect(() => {
    onFilterChange({ pms: selectedPMs, status: selectedStatus });
  }, [selectedPMs, selectedStatus]);

  const togglePM = pm => {
    setSelectedPMs(prev =>
      prev.includes(pm) ? prev.filter(x => x !== pm) : [...prev, pm]
    );
  };

  const toggleStatus = st => {
    setSelectedStatus(prev =>
      prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]
    );
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3>Filters</h3>
      <div>
        <strong>PM:</strong>
        {pmOptions.map(pm => (
          <label key={pm} style={{ margin: '0 8px' }}>
            <input
              type="checkbox"
              checked={selectedPMs.includes(pm)}
              onChange={() => togglePM(pm)}
            />
            {pm}
          </label>
        ))}
      </div>
      <div>
        <strong>Status:</strong>
        {statusOptions.map(st => (
          <label key={st} style={{ margin: '0 8px' }}>
            <input
              type="checkbox"
              checked={selectedStatus.includes(st)}
              onChange={() => toggleStatus(st)}
            />
            {st}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;
