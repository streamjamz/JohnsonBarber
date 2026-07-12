'use client';

import { useState } from 'react';

export default function Faq({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={'faq-item' + (isOpen ? ' open' : '')} key={f.id}>
            <button className="faq-q" onClick={() => setOpen(isOpen ? null : i)}>
              <span>{f.question}</span>
              <span className="faq-sign">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="faq-a">{f.answer}</div>
          </div>
        );
      })}
    </div>
  );
}
