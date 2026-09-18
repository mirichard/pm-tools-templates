import fetch from 'node-fetch';

export async function getAccessibleResources(token: string) {
  const res = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`accessible-resources failed: ${res.status}`);
  return res.json() as any;
}

export async function createProject(token: string, cloudId: string, body: any) {
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create project failed: ${res.status} ${res.statusText} ${t.substring(0,200)}`);
  }
  return res.json();
}

