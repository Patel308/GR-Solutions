import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({ eyebrow, title, highlight, description, image = '/images/hero.webp', ctaHref = '/contact', ctaLabel = 'Get Free Quote' }) {
  return (
    <section className="bg-[linear-gradient(135deg,#f0f7ff_0%,#ffffff_72%)] py-[120px]">
      <div className="container grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-softRise">
          <div className="mb-6 flex flex-wrap gap-4">
            {eyebrow ? <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-extrabold uppercase text-primary">{eyebrow}</span> : null}
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-extrabold uppercase text-primary"><i className="fa-solid fa-star" /> 4.9/5 Rating</span>
          </div>
          <h1 className="mb-6 max-w-[850px] text-[clamp(3.2rem,5.5vw,5.2rem)] font-extrabold leading-[1.08] text-secondary">
            {title} <br />
            {highlight ? <span className="text-primary">{highlight}</span> : null}
          </h1>
          <p className="mb-8 max-w-[760px] text-[1.18rem] leading-[1.75] text-textMuted">{description}</p>
          <div className="mb-10 flex flex-wrap gap-5">
            <Link href={ctaHref} className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-primary px-8 py-4 font-extrabold text-white shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:shadow-ctaHover">
              {ctaLabel}
            </Link>
            <Link href="/services" className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-white px-8 py-4 font-extrabold text-primary shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary hover:text-white hover:shadow-ctaHover">
              Explore Services
            </Link>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-secondary">Same-Day</span>
              <span className="text-textMuted">Quick Repair</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-secondary">90-Day</span>
              <span className="text-textMuted">Warranty</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-secondary">Free</span>
              <span className="text-textMuted">Diagnostic</span>
            </div>
          </div>
        </div>
        <div className="relative animate-softRise overflow-hidden rounded-card shadow-oldLg">
          <Image src={image} alt={`${title} ${highlight || ''}`} width={720} height={560} priority />
          <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 p-4 shadow-oldLg">
            <p className="m-0 font-extrabold text-primary">
              <i className="fa-solid fa-shield-halved" /> Certified Techs Only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
