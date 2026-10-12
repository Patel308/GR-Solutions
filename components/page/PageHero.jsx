import { getImageProps } from 'next/image';
import { preload } from 'react-dom';
import Breadcrumb from '@/components/Breadcrumb';
import cx from '@/components/ui/cx';

const HERO_IMAGE_SIZES = '(min-width: 1280px) 510px, (min-width: 992px) 39vw, (min-width: 608px) 576px, calc(100vw - 2rem)';

// The hero photo is the largest element of the first screen on desktop, so it
// is preloaded at high priority there (the <img> then uses that response). On
// phones it sits below the summary and the calls to action, so it is fetched
// at low priority and never competes with the text that paints first (the
// phone LCP element).
function HeroImage({ src, alt }) {
  const { props } = getImageProps({ src, alt, width: 680, height: 500, sizes: HERO_IMAGE_SIZES, loading: 'eager' });
  preload(props.src, {
    as: 'image',
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: 'high',
    media: '(min-width: 992px)',
  });
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      fetchPriority="low"
      className="relative aspect-[680/500] w-full rounded-[1.25rem] object-cover shadow-card-hover ring-1 ring-black/5"
    />
  );
}

// Hero for the service, city, brand and locality templates. Reading order on
// a phone: breadcrumb, eyebrow, H1, the answer-first summary (always the first
// block after the H1, as a plain <p>), the calls to action, supporting copy,
// then the photo. On desktop the photo (or, on pages without one, a decorative
// drawing passed as `art`) sits beside the copy.
export default function PageHero({ breadcrumb, eyebrow, title, answer, actions, children, image, art, section = 'page_hero' }) {
  const twoColumns = Boolean(image || art);
  return (
    <section className="hero-surface border-b border-line" data-section={section}>
      <div className="container pb-10 pt-2 sm:pb-12 lg:pb-16 lg:pt-4">
        <Breadcrumb items={breadcrumb} />
        <div
          className={cx(
            'mt-3 grid gap-8 lg:mt-6',
            twoColumns ? 'lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-14' : 'max-w-4xl',
          )}
        >
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h1 className="mt-3">{title}</h1>
            {answer ? <p className="answer-box mt-5">{answer}</p> : null}
            {actions ? <div className="mt-6">{actions}</div> : null}
            {children}
          </div>

          {image ? (
            <div className="relative mx-auto w-full max-w-[36rem] lg:max-w-none">
              <div className="absolute -inset-3 hidden rounded-[1.75rem] bg-gradient-to-br from-teal-100/60 via-transparent to-navy-100/70 lg:block" aria-hidden="true" />
              <HeroImage src={image.src} alt={image.alt} />
            </div>
          ) : null}

          {!image && art ? <div className="hidden lg:flex lg:justify-center">{art}</div> : null}
        </div>
      </div>
    </section>
  );
}

// Primary actions under the summary: two equal buttons on phones (a third
// wraps to its own row), a single row from 640px. `stack` gives each button
// its own row on phones, for labels too long to sit side by side.
export function HeroActions({ children, stack = false }) {
  return (
    <div
      className={cx(
        'grid gap-3 sm:flex sm:flex-wrap',
        stack ? 'grid-cols-1' : 'grid-cols-2 [&>*:nth-child(3)]:col-span-2',
      )}
    >
      {children}
    </div>
  );
}
