'use client';

import { useState } from 'react';

export default function Checklist({ items }) {
  const [done, setDone] = useState(() => items.map(() => false));

  function toggle(i) {
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="checklist">
      {items.map((c, i) => (
        <div
          className={'check-row no-print' + (done[i] ? ' done' : '')}
          key={c.id}
          onClick={() => toggle(i)}
        >
          <div className="check-box">{done[i] ? '✓' : ''}</div>
          <div className="check-num">{i + 1}</div>
          <div className="check-body">
            <div className="check-title">{c.title}</div>
            <div className="check-desc">{c.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
