import Image from 'next/image';
import Link from 'next/link';
import { illustrationFor } from '@/components/serviceVisuals';
import cx from '@/components/ui/cx';

// Service card: a compact row on phones, a vertical card from 640px up. The
// "View Service" link is stretched over the whole card, so the entire card is
// one large tap target while the link text stays the same.
export default function ServiceCard({ service, className }) {
  return (
    <article className={cx('card card-interactive group relative flex h-full overflow-hidden sm:flex-col', className)}>
      <div className="flex w-28 shrink-0 items-center justify-center bg-gradient-to-br from-navy-50 to-teal-50 p-3 sm:w-auto sm:px-6 sm:py-5">
        <Image
          src={illustrationFor(service)}
          alt={`${service.title} service by GR Solution`}
          width={320}
          height={200}
          unoptimized
          className="h-auto w-full max-w-[220px] transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
        <h3 className="text-[1.0625rem] sm:text-h3">{service.title}</h3>
        <p className="mt-1.5 flex-1 text-small leading-relaxed text-muted sm:text-[0.9375rem]">{service.shortDescription}</p>
        <Link
          href={`/services/${service.slug}`}
          className="link-arrow mt-1 min-h-[2.75rem] self-start text-[0.9375rem] after:absolute after:inset-0 after:content-['']"
        >
          View Service <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
