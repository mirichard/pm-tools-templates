import fetch from 'node-fetch';

export async function getMe(token: string) {
  const res = await fetch('https://app.asana.com/api/1.0/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`whoami failed: ${res.status}`);
  return res.json() as any;
}

export async function createProject(token: string, workspace: string, body: any) {
  const res = await fetch('https://app.asana.com/api/1.0/projects', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { ...body, workspace } })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create project failed: ${res.status} ${res.statusText} ${t.substring(0,200)}`);
  }
  return res.json();
}

export async function createTask(token: string, body: any) {
  const res = await fetch('https://app.asana.com/api/1.0/tasks', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: body })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`create task failed: ${res.status} ${res.statusText} ${t.substring(0,200)}`);
  }
  return res.json();
}

