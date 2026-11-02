import Link from 'next/link';
import cx from '@/components/ui/cx';

// A group of internal links shown as full-width tap targets. The anchor text is
// exactly `label`; icons are decorative.
export default function LinkTiles({ links, icon, className }) {
  if (!links?.length) return null;

  return (
    <div className={cx('grid gap-3', className)}>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="link-tile">
          <span className="flex min-w-0 items-center gap-3">
            {icon ? <i className={cx(icon, 'w-4 shrink-0 text-center text-teal-600')} aria-hidden="true" /> : null}
            <span>{link.label}</span>
          </span>
          <i className="fa-solid fa-arrow-right shrink-0" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
