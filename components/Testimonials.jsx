import Image from 'next/image';

const testimonials = [
  {
    name: 'Amit Sharma',
    text: 'Excellent service. The technician explained the LED TV issue clearly and completed the repair quickly.',
    image: '/assets/customer_testimonial_male_1769457041364.webp',
  },
  {
    name: 'Priya Verma',
    text: 'Professional doorstep support and transparent pricing. My OLED TV was working again the same day.',
    image: '/assets/customer_testimonial_female_1769457061538.webp',
  },
  {
    name: 'Rahul Mehta',
    text: 'Good diagnosis for panel lines and honest guidance before repair. Very helpful team.',
    image: '/assets/customer_testimonial_male_2_1769457083041.webp',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">CUSTOMER TRUST</span>
          <h2 className="mt-5 text-4xl font-black text-secondary">What Customers Say</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-textMuted">Real feedback from customers across Delhi, Noida and NCR.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article className="rounded-card border border-black/5 bg-white p-10 shadow-oldMd transition duration-300 hover:-translate-y-1 hover:shadow-oldLg" key={item.name}>
              <Image src={item.image} alt={`Customer feedback for GR Solution TV repair service from ${item.name}`} width={90} height={90} className="mb-6 rounded-full" />
              <p className="text-lg leading-relaxed text-textMain">&quot;{item.text}&quot;</p>
              <h3 className="mt-4 text-xl font-black text-secondary">{item.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
