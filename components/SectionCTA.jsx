import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';
import cx from '@/components/ui/cx';

// Compact call/WhatsApp prompt placed between major sections of long pages.
// Deliberately not a heading, so the page's H2/H3 outline is unchanged.
export default function SectionCTA({
  section,
  title = 'Not sure what’s wrong with your TV?',
  text = 'Talk to a technician. Diagnosis is free and you approve the price before any paid work.',
  className,
  withContainer = true,
}) {
  const body = (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-navy-50 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="flex items-start gap-4">
        <span className="icon-tile hidden bg-white sm:inline-flex" aria-hidden="true">
          <i className="fa-solid fa-headset" />
        </span>
        <div>
          <p className="font-display text-lg font-bold leading-snug text-ink">{title}</p>
          <p className="mt-1 text-small leading-relaxed text-muted">{text}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:flex md:shrink-0">
        <PhoneLink callLocation={`${section}_call`} className="btn btn-primary" data-cta={`${section}_call`}>
          <i className="fa-solid fa-phone" aria-hidden="true" /> Call now
        </PhoneLink>
        <WhatsAppLink className="btn btn-whatsapp" data-cta={`${section}_whatsapp`}>
          <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );

  return (
    <aside aria-label="Talk to a GR Solution technician" data-section={section} className={cx('py-6 sm:py-8', className)}>
      {withContainer ? <div className="container">{body}</div> : body}
    </aside>
  );
}
