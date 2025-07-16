// src/data/api.js
import axios from 'axios';

/**
 * Fetch project KPIs from backend API
 * @returns Promise resolving to array of { project_id, percent_complete, budget_status, ... }
 */
export const fetchProjectKPIs = () => {
  return axios.get('/api/project_kpis')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching project KPIs:', error);
      return [];
    });
};
