import { Share, NativeModules } from 'react-native';

type RNPrintModule = { print: (opts: { html: string; jobName?: string }) => Promise<string | undefined> };
const RNPrint = NativeModules.RNPrint as RNPrintModule | undefined;

import type { JournalEntry } from '../types/user';
import { Colors } from '../utils/themes';

import { MOOD_META } from '../utils/mood';
import { formatEntryDate, formatDateShort } from '../utils/dateTime';

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

  const sorted = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const first = sorted[0]?.createdAt.slice(0, 10);
  const last = sorted[sorted.length - 1]?.createdAt.slice(0, 10);
  const dateRange =
    first && last && first !== last
      ? `${formatDateShort(first)} – ${formatDateShort(last)}`
      : first
        ? formatDateShort(first)
        : '—';

  const moodTally: Record<string, number> = {};
  sorted.forEach(e => e.moods.forEach(m => { moodTally[m] = (moodTally[m] ?? 0) + 1; }));
  const topMoodKey = Object.entries(moodTally).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof MOOD_META | undefined;
  const topMoodStr = topMoodKey
    ? `${MOOD_META[topMoodKey].emoji} ${MOOD_META[topMoodKey].label}`
    : '—';

  const rows = sorted
    .map(entry => {
      const primaryMood = entry.moods[0] ?? null;
      const accentColor = primaryMood ? MOOD_META[primaryMood].color : Colors.slate200;
      const moodEmojis = entry.moods.map(m => MOOD_META[m].emoji).join(' ');
      const tagChips = entry.tags.map(t => `<span class="tag">#${esc(t)}</span>`).join('');
      const dateLabel = formatEntryDate(entry.createdAt.slice(0, 10));
      const body = esc(entry.content).replace(/\n/g, '<br/>');
      const title = esc(entry.title);

      return `<div class="entry">
  <div class="accent" style="background:${accentColor}"></div>
  <div class="ec">
    <div class="eh">
      <span class="edate">${esc(dateLabel)}</span>
      ${moodEmojis ? `<span class="emoods">${moodEmojis}</span>` : ''}
    </div>
    ${title ? `<div class="etitle">${title}</div>` : '<div class="etitle notitle">Untitled</div>'}
    ${body ? `<div class="ebody">${body}</div>` : ''}
    ${tagChips ? `<div class="etags">${tagChips}</div>` : ''}
  </div>
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
@page{margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#1e293b;background:#fff;padding:36px 44px;font-size:13px;line-height:1.6}
/* ── Cover ── */
.cover{padding-bottom:22px;margin-bottom:22px;border-bottom:2px solid #f1f5f9}
.brand{font-size:10px;font-weight:700;color:#a0aec0;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:14px}
.cname{font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;line-height:1.1;margin-bottom:3px}
.csub{font-size:12.5px;color:#64748b;margin-bottom:16px}
.stats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.stat{border:1px solid #e8edf2;border-radius:8px;padding:8px 13px;background:#fafbfc;min-width:80px}
.sv{font-size:15px;font-weight:700;color:#0f172a;line-height:1.25}
.sl{font-size:9.5px;color:#94a3b8;font-weight:600;margin-top:2px;text-transform:uppercase;letter-spacing:0.6px}
.cexp{font-size:10.5px;color:#94a3b8}
/* ── Entry ── */
.entry{display:flex;margin-bottom:8px;border-radius:7px;overflow:hidden;border:1px solid #f0f4f8;page-break-inside:avoid;background:#fff}
.accent{width:3px;flex-shrink:0}
.ec{flex:1;padding:11px 13px}
.eh{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
.edate{font-size:9.5px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.7px}
.emoods{font-size:12px;line-height:1}
.etitle{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px;line-height:1.35}
.notitle{color:#94a3b8;font-style:italic;font-weight:400}
.ebody{font-size:12px;color:#374151;line-height:1.7;white-space:pre-wrap}
.etags{margin-top:7px;display:flex;flex-wrap:wrap;gap:4px}
.tag{font-size:9.5px;color:#64748b;background:#f8fafc;border:1px solid #e8edf2;padding:1px 7px;border-radius:20px}
</style>
</head>
<body>
<div class="cover">
  <div class="brand">LarkSoul</div>
  <div class="cname">${esc(userName)}'s Journal</div>
  <div class="csub">Personal diary export</div>
  <div class="stats">
    <div class="stat"><div class="sv">${sorted.length}</div><div class="sl">Entries</div></div>
    <div class="stat"><div class="sv">${dateRange}</div><div class="sl">Period</div></div>
    <div class="stat"><div class="sv">${topMoodStr}</div><div class="sl">Top mood</div></div>
  </div>
  <div class="cexp">Exported on ${exportDate}</div>
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
