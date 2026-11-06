import React from 'react';

// Definisi tipe untuk setiap kolom
export interface Column<T> {
  key: keyof T | string;
  label: string;
}

// Definisi Props untuk komponen DataTable (menggunakan Generic <T>)
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  renderActions,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.key || index)}
                className="px-5 py-4 font-semibold">
                {column.label}
              </th>
            ))}

            {renderActions && <th className="px-5 py-4 text-right">Aksi</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-50">
              {columns.map((column, index) => (
                <td key={String(column.key || index)} className="px-5 py-4">
                  {/* Menggunakan type assertion agar aman di TypeScript */}
                  {String(item[column.key as keyof T] ?? '')}
                </td>
              ))}

              {renderActions && (
                <td className="px-5 py-4 text-right">{renderActions(item)}</td>
              )}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-5 py-10 text-center text-neutral-400">
                Belum ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
