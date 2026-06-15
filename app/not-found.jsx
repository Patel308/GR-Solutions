import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <section style={{ padding: '120px 0', textAlign: 'center', background: 'var(--bg-light)' }}>
        <div className="container">
          <span className="badge" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>404</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--secondary)', marginBottom: '1rem' }}>
            Page Not Found
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            The page you are looking for may have been moved or removed.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
            <Link href="/services" className="btn btn-outline">View Services</Link>
            <Link href="/contact" className="btn btn-outline">Contact GR Solution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
