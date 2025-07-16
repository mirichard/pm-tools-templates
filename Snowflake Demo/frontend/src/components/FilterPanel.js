// src/components/FilterPanel.js
import React, { useState, useEffect } from 'react';

const pmOptions = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve'];
const statusOptions = ['Planned', 'In Progress', 'Completed', 'On Hold'];

const FilterPanel = ({ onFilterChange }) => {
  const [selectedPMs, setSelectedPMs] = useState(pmOptions);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions);

  useEffect(() => {
    onFilterChange({ pms: selectedPMs, status: selectedStatus });
  }, [selectedPMs, selectedStatus, onFilterChange]);

  const togglePM = (pm) => {
    setSelectedPMs(prev =>
      prev.includes(pm) ? prev.filter(x => x !== pm) : [...prev, pm]
    );
  };

  const toggleStatus = (st) => {
    setSelectedStatus(prev =>
      prev.includes(st) ? prev.filter(x => x !== st) : [...prev, st]
    );
  };

  const resetFilters = () => {
    setSelectedPMs(pmOptions);
    setSelectedStatus(statusOptions);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Filters
        <button onClick={resetFilters} style={{ padding: '4px 8px', fontSize: '0.9em' }}>
          Reset Filters
        </button>
      </h3>
      <fieldset style={{ marginBottom: '8px', border: '1px solid #ccc', padding: '8px' }}>
        <legend>Project Manager</legend>
        {pmOptions.map(pm => (
          <label key={pm} style={{ margin: '0 8px', cursor: 'pointer', padding: '4px', borderRadius: '4px', background: selectedPMs.includes(pm) ? '#e0f7fa' : 'transparent' }}>
            <input
              type="checkbox"
              checked={selectedPMs.includes(pm)}
              onChange={() => togglePM(pm)}
              style={{ marginRight: '4px' }}
            />
            {pm}
          </label>
        ))}
      </fieldset>
      <fieldset style={{ border: '1px solid #ccc', padding: '8px' }}>
        <legend>Status</legend>
        {statusOptions.map(st => (
          <label key={st} style={{ margin: '0 8px', cursor: 'pointer', padding: '4px', borderRadius: '4px', background: selectedStatus.includes(st) ? '#e0f7fa' : 'transparent' }}>
            <input
              type="checkbox"
              checked={selectedStatus.includes(st)}
              onChange={() => toggleStatus(st)}
              style={{ marginRight: '4px' }}
            />
            {st}
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default FilterPanel;

