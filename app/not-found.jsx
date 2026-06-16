import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section className="bg-bgLight py-[120px] text-center">
        <div className="container">
          <span className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">404</span>
          <h1 className="mb-4 text-[clamp(2rem,4vw,3rem)] font-black text-secondary">
            Page Not Found
          </h1>
          <p className="mx-auto mb-10 max-w-[500px] text-[1.1rem] leading-[1.7] text-textMuted">
            The page you are looking for may have been moved or removed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="rounded-full border-2 border-primary bg-primary px-7 py-3 font-black text-white shadow-cta transition hover:-translate-y-1 hover:bg-secondary">Back to Home</Link>
            <Link href="/services" className="rounded-full border-2 border-primary bg-white px-7 py-3 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">View Services</Link>
            <Link href="/contact" className="rounded-full border-2 border-primary bg-white px-7 py-3 font-black text-primary shadow-cta transition hover:-translate-y-1 hover:bg-primary hover:text-white">Contact GR Solution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
