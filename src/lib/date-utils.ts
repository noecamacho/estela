import { Timestamp } from 'firebase/firestore';
import type { Translations } from '../i18n/translations';

function relativePrefix(d: Date, t: Translations): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return `${t.time.today} — `;
  if (diff === 1) return `${t.time.yesterday} — `;
  return '';
}

export function formatDate(timestamp: Timestamp, t: Translations): string {
  const d = timestamp.toDate();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  const prefix = relativePrefix(d, t);

  return t.time.dateFormat({
    prefix,
    day: t.time.days[d.getDay()],
    date: d.getDate(),
    month: t.time.months[d.getMonth()],
    year: d.getFullYear(),
    time: `${h12}:${m}${ampm}`,
  });
}

export function toLocalInput(timestamp: Timestamp): string {
  const d = timestamp.toDate();
  const y = d.getFullYear();
  const mo = (d.getMonth() + 1).toString().padStart(2, '0');
  const da = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  return `${y}-${mo}-${da}T${h}:${mi}`;
}
