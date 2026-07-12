'use client';

export default function PrintButton() {
  return (
    <button className="btn btn-red print-btn no-print" onClick={() => window.print()}>
      🖨 Print One-Pager
    </button>
  );
}
