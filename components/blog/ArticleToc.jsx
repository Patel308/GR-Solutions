import cx from '@/components/ui/cx';

// "On this page" jump links to the article's existing H2s. Not a heading, so
// the article outline is unchanged. Phones get a collapsible card above the
// article; desktop gets a sticky list beside it (see TocSpy for the
// current-section highlight).

function TocList({ items }) {
  return (
    <ol className="m-0 grid list-none gap-0.5 p-0">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="toc-link block rounded-lg border-l-2 border-transparent py-2 pl-3 pr-2 text-[0.9375rem] leading-snug text-muted transition-colors hover:bg-surface hover:text-navy-700"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TocDetails({ items, className }) {
  if (!items?.length) return null;
  return (
    <details className={cx('group card overflow-hidden', className)} data-toc>
      <summary className="flex min-h-[3.25rem] items-center justify-between gap-3 px-4 py-3 font-semibold text-ink">
        <span className="flex items-center gap-2.5">
          <i className="fa-solid fa-list-ul text-teal-600" aria-hidden="true" />
          On this page
        </span>
        <i className="fa-solid fa-chevron-down text-xs text-navy-600 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <nav aria-label="On this page" className="border-t border-line px-2 py-2">
        <TocList items={items} />
      </nav>
    </details>
  );
}

export function TocNav({ items, className }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="On this page" className={className} data-toc>
      <p className="eyebrow mb-3">On this page</p>
      <TocList items={items} />
    </nav>
  );
}

// Stable, readable fragment ids for the article's H2s.
export function headingId(text, used) {
  const base =
    text
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72)
      .replace(/-+$/g, '') || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}
