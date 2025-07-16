// src/components/MilestoneTable.js
import React from 'react';

const MilestoneTable = ({ data }) => (
  <div>
    <h3>Milestone Tracker</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Project</th><th>Name</th><th>Due</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(m => (
          <tr key={m.milestone_id}>
            <td>{m.milestone_id}</td>
            <td>{m.project_id}</td>
            <td>{m.name}</td>
            <td>{m.due}</td>
            <td>{m.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MilestoneTable;

