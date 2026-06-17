import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  alternates: { canonical: '/about' },
  openGraph: { title: pageMetadata.about.title, description: pageMetadata.about.description, url: '/about' },
};

const coreValues = [
  {
    icon: 'fa-solid fa-microchip',
    title: 'Technical Mastery',
    text: 'Expert repair knowledge backed by advanced diagnostic tools and hands-on technical experience.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Honest Pricing',
    text: 'Clear diagnosis, transparent estimates and no hidden repair charges before work begins.',
  },
  {
    icon: 'fa-solid fa-certificate',
    title: 'Certified Excellence',
    text: 'Skilled technicians handling LED, OLED/QLED, LCD, Plasma and Curved TV repair with professional care.',
  },
  {
    icon: 'fa-solid fa-headset',
    title: 'Priority Support',
    text: 'Fast communication, doorstep assistance and reliable support across Delhi, Noida and NCR.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'About Us', item: `${siteConfig.url}/about` },
          ],
        }}
      />
      <section className="py-24">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-black text-primary">ABOUT GR SOLUTION</span>
            <h1 className="mt-6 text-[clamp(2.8rem,5vw,4.5rem)] font-black leading-tight text-secondary">
              Excellence In <span className="text-primary">TV Repair Service</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-textMuted">
              GR Solution focuses on dependable LED, OLED/QLED, LCD, Plasma and Curved TV repair support for families and businesses
              across Delhi, Noida and NCR.
            </p>
            <div className="mt-8 flex flex-wrap gap-8">
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-secondary">15+</span>
                <span className="text-textMuted">Years Experience</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-secondary">25k+</span>
                <span className="text-textMuted">Customers Served</span>
              </div>
            </div>
          </div>
          <Image src="/images/team.webp" alt="GR Solution repair team" width={650} height={480} className="w-full rounded-[20px] shadow-oldLg" />
        </div>
      </section>
      <section className="py-20">
        <div className="container">
          <div className="mb-20 text-center">
            <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">OUR VALUES</span>
            <h2 className="text-4xl font-black text-secondary">Our Core Values</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {coreValues.map((value) => (
              <article className="group rounded-card border border-black/5 bg-white p-8 shadow-oldMd transition duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:shadow-oldLg" key={value.title}>
                <div className="mb-6 flex size-[70px] items-center justify-center rounded-[18px] bg-primary/10 text-2xl text-primary transition duration-300 group-hover:bg-white group-hover:text-primary">
                  <i className={value.icon} />
                </div>
                <h3 className="text-xl font-black text-secondary transition duration-300 group-hover:text-white">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-textMuted transition duration-300 group-hover:text-white/90">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
