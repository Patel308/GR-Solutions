import Image from 'next/image';

const testimonials = [
  {
    name: 'Amit Sharma',
    text: 'Excellent service. The technician explained the LED TV issue clearly and completed the repair quickly.',
    image: '/assets/customer_testimonial_male_1769457041364.png',
  },
  {
    name: 'Priya Verma',
    text: 'Professional doorstep support and transparent pricing. My Smart TV was working again the same day.',
    image: '/assets/customer_testimonial_female_1769457061538.png',
  },
  {
    name: 'Rahul Mehta',
    text: 'Good diagnosis for panel lines and honest guidance before repair. Very helpful team.',
    image: '/assets/customer_testimonial_male_2_1769457083041.png',
  },
];

export default function Testimonials() {
  return (
    <section className="section section-testimonials">
      <div className="container">
        <div className="section-title section-centered-title">
          <span className="badge">CUSTOMER TRUST</span>
          <h2>What Customers Say</h2>
          <p>Real feedback from customers across Delhi, Noida and NCR.</p>
        </div>
        <div className="grid-3">
          {testimonials.map((item) => (
            <article className="card" key={item.name}>
              <Image src={item.image} alt={`${item.name} testimonial`} width={90} height={90} className="testimonial-avatar" />
              <p>&quot;{item.text}&quot;</p>
              <h3>{item.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
