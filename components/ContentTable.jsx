/**
 * Generic comparison table. Answer engines and AI Overviews lift tabular facts
 * far more readily than the same information buried in prose, so cost drivers,
 * symptom/cause pairs and local planning facts are published as real tables.
 */
const tableWrap = 'mt-6 overflow-x-auto rounded-2xl border border-black/10';
const thClass = 'whitespace-nowrap px-4 py-3 text-left text-sm font-black uppercase tracking-wide text-white';
const tdClass = 'border-t border-black/5 px-4 py-3 align-top text-textMuted';

export default function ContentTable({ table }) {
  if (!table?.columns?.length || !table?.rows?.length) return null;

  return (
    <figure className="m-0">
      <div className={tableWrap}>
        <table className="w-full border-collapse text-left">
          {table.caption ? <caption className="sr-only">{table.caption}</caption> : null}
          <thead className="bg-secondary">
            <tr>
              {table.columns.map((col) => (
                <th key={col} scope="col" className={thClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="odd:bg-white even:bg-bgLight">
                {row.map((cell, i) => (
                  <td key={`${row[0]}-${i}`} className={`${tdClass} ${i === 0 ? 'font-black text-secondary' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-textMuted">{table.note}</figcaption>
      ) : null}
    </figure>
  );
}
