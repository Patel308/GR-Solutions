import Image from 'next/image';
import Link from 'next/link';

export default function ServiceCard({ service, featured = false, carousel = false }) {
  return (
    <article className={carousel ? `carousel-card ${featured ? 'active-card' : ''}` : 'card service-card-next'}>
      <Image src={service.image} alt={`${service.title} by GR Solution`} width={520} height={360} />
      <div className="card-content">
        <h3>{service.title}</h3>
        <p>{service.shortDescription}</p>
        <Link href={`/services/${service.slug}`} className="btn btn-primary">
          View Service
        </Link>
      </div>
    </article>
  );
}
