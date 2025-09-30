/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

export type Column<Row extends Record<string, any> = any> = {
  key: string;
  header: string | React.ReactNode;
  render?: (row: Row, rowIndex: number) => React.ReactNode;
  minWidth?: string;
  className?: string;
};

type Props<Row extends Record<string, any> = any> = {
  columns: Column<Row>[];
  data: Row[];
  /** Se fornecido, a coluna de ações é exibida; se omitido, a coluna não aparece */
  renderActions?: (row: Row, rowIndex: number) => React.ReactNode;
  rowKey?: (row: Row, rowIndex: number) => React.Key;
  title?: string;
  description?: string;
  actionsHeader?: React.ReactNode;
};

export default function TabelaGenericaComAcoesFixas<
  Row extends Record<string, any> = any
>({
  columns,
  data,
  renderActions,
  rowKey,
  title = "Lista",
  description,
  actionsHeader = "Ações",
}: Props<Row>) {
  const hasActions = typeof renderActions === "function";

  return (
    <section className="p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {description ? (
          <p className="text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          {/* Cabeçalho */}
          <thead className="bg-slate-50 text-slate-600">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ minWidth: col.minWidth }}
                  className={col.className}
                >
                  {col.header}
                </th>
              ))}

              {hasActions && (
                <th
                  className="sticky right-0 z-20 bg-slate-50 px-4 py-3 text-right shadow-[inset_1px_0_0_0_rgba(226,232,240,1)]"
                  style={{ minWidth: "8rem" }}
                >
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>

          {/* Corpo */}
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-slate-500"
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const key = rowKey ? rowKey(row, rowIndex) : rowIndex;
                return (
                  <tr
                    key={key}
                    className="odd:bg-white even:bg-slate-50/40 hover:bg-blue-50/40 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        style={{ minWidth: col.minWidth }}
                        className={`px-4 py-3 text-slate-800 ${
                          col.className || ""
                        }`}
                      >
                        {col.render ? col.render(row, rowIndex) : row[col.key]}
                      </td>
                    ))}

                    {hasActions && (
                      <td
                        className="sticky right-0 z-10 bg-inherit px-4 py-3 text-right shadow-[inset_1px_0_0_0_rgba(241,245,249,1)]"
                        style={{ minWidth: "8rem" }}
                      >
                        {renderActions!(row, rowIndex)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Total: <span className="font-semibold">{data.length}</span> registros
      </div>
    </section>
  );
}
