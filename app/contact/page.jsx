import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { pageMetadata } from '@/data/pages';
import { siteConfig } from '@/data/siteConfig';

export const metadata = {
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  alternates: { canonical: '/contact' },
  openGraph: { title: pageMetadata.contact.title, description: pageMetadata.contact.description, url: '/contact' },
};

export default function ContactPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact GR Solution',
          url: `${siteConfig.url}/contact`,
        }}
      />
      <section className="section contact-hero-pro">
        <div className="container contact-hero-grid-pro">
          <div className="contact-hero-copy-pro">
            <span className="badge">REACH OUT</span>
            <h1>
              Experience Premium <span className="primary-text">At-Home TV Repair</span>
            </h1>
            <p>
              Delhi, Noida & NCR&apos;s trusted engineering team for OLED, QLED and LED TV repairs. Contact us for a free
              diagnostic consultation and professional same-day doorstep service.
            </p>
          </div>
          <Image src="/images/service_tv.png" alt="GR Solution technician repairing a TV at home" width={650} height={520} className="contact-hero-image-pro" priority />
        </div>
      </section>
      <section className="section contact-mid-pro">
        <div className="container contact-mid-grid-pro">
          <div className="contact-info-panel-pro">
            <h2>
              Have A Question? <br />
              <span className="primary-text">Talk To Us</span>
            </h2>
            <p className="contact-intro-pro">
              Have questions about a repair or want to book an appointment? Get in touch with our team and we&apos;ll get
              back to you quickly.
            </p>
            <div className="contact-cards-next">
              <article className="contact-row-pro">
                <i className="fa-solid fa-phone-volume" />
                <div>
                  <h3>Direct Call</h3>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                  <p>Mon - Sun: 9:00 AM - 9:00 PM</p>
                </div>
              </article>
              <article className="contact-row-pro">
                <i className="fa-solid fa-location-dot" />
                <div>
                  <h3>Service Location</h3>
                  <a href={siteConfig.googleBusinessProfile} target="_blank">
                    {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality} {siteConfig.address.postalCode}
                  </a>
                  <p>{siteConfig.serviceAreas.join(', ')}</p>
                </div>
              </article>
              <article className="contact-row-pro">
                <i className="fa-solid fa-envelope" />
                <div>
                  <h3>Email Support</h3>
                  <a href={siteConfig.emailHref}>{siteConfig.email}</a>
                </div>
              </article>
            </div>
          </div>
          <div className="appointment-card-pro">
            <ContactForm id="appointmentForm" title="Book Your Appointment" appointment />
          </div>
        </div>
      </section>
      <section className="section section-full-width-map contact-map-pro">
        <div className="container">
          <div className="map-heading-pro">
            <div>
              <span className="badge">LOCATION</span>
              <h2>Locate Our Center</h2>
            </div>
            <Link href={siteConfig.googleBusinessProfile} target="_blank" className="btn btn-outline">
              View Google Business Profile
            </Link>
          </div>
          <iframe
            title="GR Solution service area map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112075.76219313936!2d77.1065171731608!3d28.613766785899995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf0154942ae45%3A0x6b107e33527a7187!2sDelhi%20NCR!5e0!3m2!1sen!2sin!4v1714571983054!5m2!1sen!2sin"
            width="100%"
            height="380"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
