// src/components/UpcomingTasks.js
import React from 'react';

const UpcomingTasks = ({ data }) => (
  <div>
    <h3>Upcoming Tasks</h3>
    <table>
      <thead>
        <tr>
          <th>Task ID</th><th>Milestone</th><th>Task Name</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map(t => (
          <tr key={t.task_id}>
            <td>{t.task_id}</td>
            <td>{t.milestone_id}</td>
            <td>{t.task_name || t.name}</td>
            <td>{t.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UpcomingTasks;
