const listEl = document.getElementById('file-list');
const contentEl = document.getElementById('content');
const searchEl = document.getElementById('search');
const consentEl = document.getElementById('consent');
const btnYes = document.getElementById('consent-yes');
const btnNo = document.getElementById('consent-no');

const consentKey = 'telemetry-consent';
let consent = localStorage.getItem(consentKey);
if (consent !== 'yes') {
  consentEl.style.display = 'flex';
} else {
  consentEl.style.display = 'none';
}
btnYes.onclick = () => { localStorage.setItem(consentKey, 'yes'); consentEl.style.display = 'none'; };
btnNo.onclick = () => { localStorage.setItem(consentKey, 'no'); consentEl.style.display = 'none'; };

async function fetchIndex() {
  const res = await fetch('/api/index');
  const data = await res.json();
  return data.files;
}

function renderList(files) {
  listEl.innerHTML = '';
  for (const f of files) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'file-item';
    btn.type = 'button';
    btn.textContent = f;
    btn.setAttribute('aria-label', `Preview ${f}`);
    btn.addEventListener('click', () => loadFile(f, btn));
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}

async function loadFile(file, liEl) {
  setBusy(true);
  for (const b of listEl.querySelectorAll('button.file-item')) { b.classList.remove('active'); b.removeAttribute('aria-current'); }
  if (liEl) { liEl.classList.add('active'); liEl.setAttribute('aria-current', 'true'); }
  const etag = contentEl.dataset.etag || '';
  const res = await fetch(`/api/preview?path=${encodeURIComponent(file)}`, {
    headers: etag ? { 'If-None-Match': etag } : {}
  });
  if (res.status === 304) {
    // cache hit, do nothing
    setBusy(false);
    return;
  }
  const newEtag = res.headers.get('ETag') || '';
  const data = await res.json();
  contentEl.innerHTML = data.html;
  contentEl.dataset.etag = newEtag;
  document.title = `${file} - PM Templates Preview`;
  // move focus to content for screen readers
  contentEl.focus();
  setBusy(false);
  if (localStorage.getItem(consentKey) === 'yes') {
    const payload = { event: 'preview', path: file, ts: new Date().toISOString() };
    void fetch('/api/telemetry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  }
}

function setBusy(b) {
  const sec = document.getElementById('preview');
  sec.setAttribute('aria-busy', String(b));
}

(async function init() {
  const files = await fetchIndex();
  let filtered = files.slice();
  renderList(filtered);
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase();
    filtered = files.filter(f => f.toLowerCase().includes(q));
    renderList(filtered);
  });
  if (filtered.length) {
    // auto-load first item as a demo
    const firstLi = listEl.querySelector('li');
    if (firstLi) firstLi.click();
  }
})();
