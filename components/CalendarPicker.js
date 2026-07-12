'use client';

import { useMemo, useState } from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n) { return String(n).padStart(2, '0'); }
export function localId(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

export default function CalendarPicker({ value, onChange, closedDays = [0] }) {
  const now = new Date();
  const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [view, setView] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return { y, m: m - 1 };
    }
    return { y: now.getFullYear(), m: now.getMonth() };
  });

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out = [];
    for (let i = 0; i < startOffset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(view.y, view.m, d);
      const past = date < todayMid;
      const closed = closedDays.includes(date.getDay());
      out.push({ d, id: localId(view.y, view.m, d), disabled: past || closed, closed });
    }
    return out;
  }, [view, closedDays, todayMid]);

  const atCurrentMonth = view.y === now.getFullYear() && view.m === now.getMonth();

  function move(delta) {
    setView((v) => {
      const nm = v.m + delta;
      const y = v.y + Math.floor(nm / 12);
      const m = ((nm % 12) + 12) % 12;
      return { y, m };
    });
  }

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" className="cal-nav" onClick={() => move(-1)} disabled={atCurrentMonth} aria-label="Previous month">‹</button>
        <div className="cal-title">{MONTHS[view.m]} {view.y}</div>
        <button type="button" className="cal-nav" onClick={() => move(1)} aria-label="Next month">›</button>
      </div>
      <div className="cal-dows">
        {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((c, i) =>
          c === null ? (
            <div key={`b${i}`} className="cal-day blank" />
          ) : (
            <button
              type="button"
              key={c.id}
              className={'cal-day' + (c.disabled ? ' disabled' : '') + (value === c.id ? ' selected' : '')}
              disabled={c.disabled}
              onClick={() => onChange(c.id)}
            >
              {c.d}
            </button>
          )
        )}
      </div>
    </div>
  );
}
