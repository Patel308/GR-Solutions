import Link from 'next/link';
import cx from '@/components/ui/cx';

// Visible breadcrumb. Labels and links must keep matching the page's
// BreadcrumbList schema, so only the styling lives here.
export default function Breadcrumb({ items, className }) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cx('text-small', className)}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex min-w-0 items-center gap-2">
              {isLast ? (
                <span className="py-2 font-semibold text-muted" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-12 min-w-12 items-center font-semibold text-navy-600 underline-offset-4 transition-colors hover:text-navy-800 hover:underline"
                  >
                    {item.label}
                  </Link>
                  <span className="text-xs text-line-strong" aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
