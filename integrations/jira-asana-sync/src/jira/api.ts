type AccessibleResource = { id: string; name: string; url: string; scopes: string[]; }; // cloudId is id

async function apiGet(url: string, token: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira API GET ${url} failed: ${res.status} ${res.statusText} — ${text.substring(0,200)}`);
  }
  return res.json();
}

export async function getAccessibleResources(token: string): Promise<AccessibleResource[]> {
  const url = 'https://api.atlassian.com/oauth/token/accessible-resources';
  return apiGet(url, token);
}

export async function getIssueTypes(token: string, cloudId: string) {
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issuetype`;
  return apiGet(url, token);
}

export async function getFields(token: string, cloudId: string) {
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field`;
  return apiGet(url, token);
}

export async function setProjectProperty(token: string, cloudId: string, projectKey: string, propertyKey: string, value: any) {
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/${encodeURIComponent(projectKey)}/properties/${encodeURIComponent(propertyKey)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira API PUT project property failed: ${res.status} ${res.statusText} — ${text.substring(0,200)}`);
  }
  return true;
}
