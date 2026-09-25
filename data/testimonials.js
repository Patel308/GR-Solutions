// Customer testimonials shown on the homepage and /reviews.
//
// Only add feedback a customer actually gave, with their permission. These are
// deliberately NOT marked up as Review/AggregateRating schema: Google does not
// show self-published reviews of a LocalBusiness as rich results, and marking
// them up risks a manual action. Independent reviews live on the Google
// Business Profile (siteConfig.googleBusinessProfile).
export const testimonials = [
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

// Google Business Profile snapshot. Quotes are copied verbatim from public
// Google reviews (reviewer names withheld). Update `asOf` whenever the figures
// are refreshed -- a stale rating is worse than none. Not marked up as schema.
export const googleReviewSnapshot = {
  rating: '4.9',
  count: 9,
  asOf: 'September 2026',
  quotes: [
    { text: 'Excellent and Affordable Service....there machanics are very Friendly', stars: 5 },
    { text: 'Very professional team and affordable price.', stars: 5 },
    { text: 'He was quite professional to work with helping us repair our plasma TV display', stars: 4 },
  ],
};
