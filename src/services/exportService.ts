import { Share, NativeModules } from 'react-native';

type RNPrintModule = { print: (opts: { html: string; jobName?: string }) => Promise<string | undefined> };
const RNPrint = NativeModules.RNPrint as RNPrintModule | undefined;

import type { JournalEntry } from '../models/interfaces/users.model';
import { MOOD_META } from '../utils/mood';
import { formatEntryDate } from '../utils/dateTime';

export type ExportFormat = 'pdf' | 'json';

export async function exportJournal(
  format: ExportFormat,
  entries: JournalEntry[],
  userName: string,
): Promise<void> {
  if (format === 'json') {
    return exportAsJSON(entries, userName);
  }
  return exportAsPDF(entries, userName);
}

async function exportAsJSON(
  entries: JournalEntry[],
  userName: string,
): Promise<void> {
  const payload = {
    app: 'LarkSoul',
    exported_at: new Date().toISOString(),
    user: userName,
    total_entries: entries.length,
    entries: entries.map(
      ({ id, title, content, moods, tags, createdAt, updatedAt }) => ({
        id,
        title,
        content,
        moods,
        tags,
        created_at: createdAt,
        updated_at: updatedAt,
      }),
    ),
  };

  await Share.share(
    { message: JSON.stringify(payload, null, 2) },
    { dialogTitle: 'Save Journal as JSON', subject: 'LarkSoul Journal Export' },
  );
}

async function exportAsPDF(
  entries: JournalEntry[],
  userName: string,
): Promise<void> {
  if (!RNPrint?.print) {
    throw new Error('PDF export requires a native build. Run pod install (iOS) or rebuild the app (Android).');
  }
  await RNPrint.print({ html: buildHTML(entries, userName), jobName: 'LarkSoul Journal' });
}

function buildHTML(entries: JournalEntry[], userName: string): string {
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const rows = entries
    .map(entry => {
      const moods = entry.moods
        .map(m => `${MOOD_META[m].emoji}&nbsp;${MOOD_META[m].label}`)
        .join('&emsp;');
      const tagChips = entry.tags
        .map(t => `<span class="tag">${esc(t)}</span>`)
        .join('');
      const dateLabel = formatEntryDate(entry.createdAt.slice(0, 10));
      const body = esc(entry.content).replace(/\n/g, '<br/>');

      return `<div class="entry">
  <div class="meta">
    <span class="date">${esc(dateLabel)}</span>
    ${moods ? `<span class="moods">${moods}</span>` : ''}
  </div>
  <h2>${esc(entry.title) || '<em>Untitled</em>'}</h2>
  <p class="body">${body || '<span class="empty">No content</span>'}</p>
  ${tagChips ? `<div class="tags">${tagChips}</div>` : ''}
</div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(userName)}'s Journal</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1e293b;padding:40px 48px;font-size:14px;line-height:1.65}
.cover{margin-bottom:36px;padding-bottom:20px;border-bottom:2px solid #e2e8f0}
.cover h1{font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.4px}
.cover .sub{font-size:13px;color:#64748b;margin-top:6px}
.entry{margin-bottom:24px;padding:20px 24px;border:1px solid #e2e8f0;border-radius:12px;page-break-inside:avoid}
.meta{display:flex;align-items:center;gap:14px;margin-bottom:8px}
.date{font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px}
.moods{font-size:13px;color:#475569}
h2{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:10px}
.body{font-size:14px;color:#334155;line-height:1.75;white-space:pre-wrap}
.empty{color:#94a3b8;font-style:italic}
.tags{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px}
.tag{background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;font-size:11px;padding:2px 10px;border-radius:20px}
</style>
</head>
<body>
<div class="cover">
  <h1>${esc(userName)}'s Journal</h1>
  <p class="sub">Exported ${exportDate}&ensp;·&ensp;${entries.length} ${
    entries.length === 1 ? 'entry' : 'entries'
  }</p>
</div>
${rows}
</body>
</html>`;
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
