/**
 * Generic comparison table. Answer engines and AI Overviews lift tabular facts
 * far more readily than the same information buried in prose, so cost drivers,
 * symptom/cause pairs and local planning facts are published as real tables.
 *
 * On phones the same table restyles into stacked cards with CSS only (column
 * names come from data-label attributes), so every cell stays visible without
 * horizontal scrolling and the HTML is identical at every width.
 */
export default function ContentTable({ table }) {
  if (!table?.columns?.length || !table?.rows?.length) return null;

  return (
    <figure className="m-0 mt-6">
      <div className="data-table-wrap stack-on-mobile overflow-x-auto rounded-xl border border-line bg-white">
        <table className="data-table" role="table">
          {table.caption ? <caption className="sr-only">{table.caption}</caption> : null}
          <thead role="rowgroup">
            <tr role="row">
              {table.columns.map((col) => (
                <th key={col} scope="col" role="columnheader">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {table.rows.map((row, rowIndex) => (
              <tr key={`${row[0]}-${rowIndex}`} role="row">
                {row.map((cell, i) => (
                  <td key={`${row[0]}-${i}`} role="cell" data-label={table.columns[i]}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? (
        <figcaption className="mt-3 text-small text-muted">{table.note}</figcaption>
      ) : null}
    </figure>
  );
}
