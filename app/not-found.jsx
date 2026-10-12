import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="hero-surface py-20 text-center sm:py-28" data-section="not_found">
        <div className="container">
          <span className="eyebrow justify-center">404</span>
          <h1 className="mt-3">
            Page Not Found
          </h1>
          <p className="lead mx-auto mt-4 max-w-[32rem]">
            The page you are looking for may have been moved or removed.
          </p>
          <div className="mx-auto mt-8 grid max-w-md gap-3 sm:max-w-none sm:grid-flow-col sm:justify-center">
            <Link href="/" className="btn btn-primary btn-lg">Back to Home</Link>
            <Link href="/services" className="btn btn-secondary btn-lg">View Services</Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">Contact GR Solution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
