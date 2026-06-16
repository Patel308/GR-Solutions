import Link from 'next/link';

export default function Breadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm">
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-textMuted" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="font-semibold text-accent no-underline transition hover:text-primary">
                    {item.label}
                  </Link>
                  <span className="text-xs text-slate-300">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
