"use client";

import { useState, useCallback } from "react";

interface TableEditorProps {
  columns: { key: string; label: string; editable?: boolean }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: Record<string, any>[];
  onCellChange: (rowIndex: number, key: string, value: number) => void;
}

export function TableEditor({ columns, rows, onCellChange }: TableEditorProps) {
  const [editing, setEditing] = useState<{ row: number; col: string } | null>(null);

  const handleBlur = useCallback(
    (rowIndex: number, key: string, rawValue: string) => {
      const v = parseFloat(rawValue);
      if (!isNaN(v)) onCellChange(rowIndex, key, v);
      setEditing(null);
    },
    [onCellChange]
  );

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-3 py-2 text-left font-medium text-muted-foreground"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b last:border-0 hover:bg-muted/30">
              {columns.map((c) => {
                const isEditing = editing?.row === ri && editing.col === c.key;
                const editable = c.editable !== false && typeof row[c.key] === "number";
                return (
                  <td key={c.key} className="px-3 py-1.5">
                    {isEditing ? (
                      <input
                        autoFocus
                        type="number"
                        defaultValue={row[c.key] as number}
                        onBlur={(e) => handleBlur(ri, c.key, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBlur(ri, c.key, (e.target as HTMLInputElement).value);
                          }
                        }}
                        className="w-full rounded border bg-background px-1.5 py-0.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    ) : (
                      <span
                        onClick={() => editable && setEditing({ row: ri, col: c.key })}
                        className={
                          editable
                            ? "cursor-pointer rounded px-1.5 py-0.5 font-mono tabular-nums hover:bg-muted"
                            : "px-1.5 py-0.5"
                        }
                      >
                        {row[c.key]}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
