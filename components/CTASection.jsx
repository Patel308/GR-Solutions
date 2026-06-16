import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';

export default function CTASection({ title = 'Need expert repair support?', text = 'Call GR Solution for fast doorstep service across Delhi, Noida and NCR.' }) {
  return (
    <section className="bg-secondary py-24 text-white">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-white">FAST SUPPORT</span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight">{title}</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/75">{text}</p>
        </div>
        <div className="flex flex-wrap gap-4 lg:justify-end">
          <a href={siteConfig.phoneHref} className="inline-flex rounded-full border-2 border-primary bg-primary px-8 py-4 font-extrabold text-white shadow-cta transition duration-300 hover:-translate-y-1 hover:bg-primaryDark">
            <i className="fa-solid fa-phone" /> Call Now
          </a>
          <Link href="/contact" className="inline-flex rounded-full border-2 border-white/35 bg-transparent px-8 py-4 font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-white hover:text-primary">
            Book Service
          </Link>
        </div>
      </div>
    </section>
  );
}
