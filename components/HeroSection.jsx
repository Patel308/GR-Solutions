import Image from 'next/image';
import Link from 'next/link';
import { PhoneLink } from '@/components/ContactChannel';
import GoogleRating from '@/components/GoogleRating';

// Home / landing hero. On phones the first screen holds the eyebrow, a 2rem
// H1, the summary, a trust line (Google rating, same-day, warranty, free
// diagnosis) and two CTAs; the photo follows below. No entrance animation:
// the hero copy is the LCP element on phones and must paint immediately.
const stats = [
  { value: 'Same-Day', label: 'Quick Repair' },
  { value: '90-Day', label: 'Warranty' },
  { value: 'Free', label: 'Diagnostic' },
];

export default function HeroSection({ eyebrow, title, highlight, description, image = '/images/hero.webp', ctaHref = '/contact', ctaLabel = 'Get Free Quote' }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_100%_0%,rgb(var(--c-navy-50)),transparent_70%),linear-gradient(180deg,#ffffff,rgb(var(--c-surface)))]" data-section="hero">
      <div className="container grid items-center gap-8 pb-10 pt-6 sm:pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <span className="inline-flex items-center gap-1.5 text-eyebrow font-semibold uppercase text-muted">
              <i className="fa-solid fa-location-dot text-teal-600" aria-hidden="true" /> Delhi NCR Doorstep Support
            </span>
          </div>

          <h1 className="mt-4 max-w-[20ch]">
            {title} <br />
            {highlight ? <span className="heading-accent">{highlight}</span> : null}
          </h1>
          <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted lg:text-lg">{description}</p>

          {/* Trust line */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <GoogleRating />
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small">
              {stats.map((stat) => (
                <li key={stat.value} className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-ink">{stat.value}</span>
                  <span className="text-muted">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <PhoneLink callLocation="hero_call" className="btn btn-primary btn-lg" data-cta="hero_call">
              <i className="fa-solid fa-phone" aria-hidden="true" /> Call now
            </PhoneLink>
            <Link href={ctaHref} className="btn btn-secondary btn-lg" data-cta="hero_quote">
              {ctaLabel}
            </Link>
          </div>
          <Link href="/services" className="link-arrow mt-2">
            Explore Services <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-navy-50 shadow-card-hover ring-1 ring-black/5">
            <Image
              src={image}
              alt="GR Solution technician repairing LED TV at home in Delhi NCR"
              width={1024}
              height={1024}
              preload
              fetchPriority="high"
              sizes="(min-width: 992px) 560px, calc(100vw - 2rem)"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]"
            />
          </div>
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-3 shadow-card backdrop-blur">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <i className="fa-solid fa-shield-halved text-teal-600" aria-hidden="true" /> Careful Diagnosis First
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
