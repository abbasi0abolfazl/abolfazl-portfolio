import React from 'react';

export default function CustomTable({ markdown }) {
  // استخراج جدول از متن Markdown
  const extractTable = (content) => {
    const lines = content.split('\n');
    let inTable = false;
    let tableLines = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableLines.push(line.trim());
      } else if (inTable && !line.trim().startsWith('|')) {
        break;
      }
    }
    
    if (tableLines.length < 2) return null;
    
    // پارس هدر
    const headers = tableLines[0]
      .split('|')
      .filter(cell => cell.trim() !== '')
      .map(cell => cell.trim());
    
    // اسکیپ خط جداکننده (|---|---|)
    const dataRows = tableLines.slice(2);
    
    // پارس داده‌ها
    const rows = dataRows.map(row => {
      return row
        .split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());
    });
    
    return { headers, rows };
  };
  
  const table = extractTable(markdown);
  
  if (!table) return null;
  
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-border/50 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-card text-foreground font-semibold border-b border-border/50">
          <tr>
            {table.headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/20">
          {table.rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="even:bg-primary/[0.03] hover:bg-primary/[0.06] transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-2.5 text-foreground/70">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}