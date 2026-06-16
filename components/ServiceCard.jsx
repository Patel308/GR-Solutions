import Image from 'next/image';
import Link from 'next/link';

export default function ServiceCard({ service, featured = false, carousel = false }) {
  return (
    <article
      className={
        carousel
          ? `carousel-card flex min-h-[560px] w-[380px] flex-col overflow-hidden rounded-card border border-primary/10 bg-white shadow-cardPro transition duration-300 ease-old hover:-translate-y-4 hover:border-primary hover:shadow-oldLg ${featured ? 'active-card' : ''}`
          : 'card service-card-next flex flex-col overflow-hidden rounded-card border border-black/5 bg-white p-0 shadow-oldMd transition duration-300 ease-old hover:-translate-y-1 hover:shadow-oldLg'
      }
    >
      <Image src={service.image} alt={`${service.title} by GR Solution`} width={520} height={360} />
      <div className="card-content flex flex-1 flex-col p-10">
        <h3 className="mb-4 text-2xl font-extrabold text-secondary">{service.title}</h3>
        <p className="mb-6 text-base leading-relaxed text-textMuted">{service.shortDescription}</p>
        <Link href={`/services/${service.slug}`} className="btn btn-primary mt-auto inline-flex self-start rounded-full border-2 border-primary bg-primary px-7 py-3 font-extrabold text-white shadow-cta transition duration-300 ease-old hover:-translate-y-1 hover:border-secondary hover:bg-secondary">
          View Service
        </Link>
      </div>
    </article>
  );
}
