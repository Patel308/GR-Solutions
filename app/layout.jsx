import './globals.css';
// Self-hosted icon subset (replaces the render-blocking cdnjs Font Awesome CSS).
import './icons.css';
import { fontDisplay } from './fonts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyActionBar from '@/components/StickyActionBar';
import { EnquiryProvider } from '@/components/EnquiryContext';
import JsonLd from '@/components/JsonLd';
import CallTracking from '@/components/CallTracking';
import { ContactChannelProvider } from '@/components/ContactChannel';
import { siteConfig, entityIds, sameAsProfiles } from '@/data/siteConfig';

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'GR Solution | TV Repair Delhi, Noida & NCR',
  },
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/images/logo.jpg',
  },
  // TODO: Add metadata.verification.google when the real Google Search Console code is provided.
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    images: [siteConfig.defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [siteConfig.defaultOgImage],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d47a1',
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': entityIds.organization,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}${siteConfig.logo}`,
  },
  ...(sameAsProfiles.length ? { sameAs: sameAsProfiles } : {}),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.phone,
    contactType: 'customer service',
    areaServed: siteConfig.serviceAreas,
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': entityIds.localBusiness,
  parentOrganization: { '@id': entityIds.organization },
  ...(sameAsProfiles.length ? { sameAs: sameAsProfiles } : {}),
  name: siteConfig.name,
  image: `${siteConfig.url}${siteConfig.logo}`,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Card',
  priceRange: 'Inspection-based estimate',
  hasMap: siteConfig.googleBusinessProfile,
  address: {
    '@type': 'PostalAddress',
    ...siteConfig.address,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  areaServed: siteConfig.serviceAreas,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: siteConfig.openingHours.days,
    opens: siteConfig.openingHours.opens,
    closes: siteConfig.openingHours.closes,
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': entityIds.website,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { '@id': entityIds.organization },
  inLanguage: 'en-IN',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={fontDisplay.variable}>
      <body className="font-sans">
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        <ContactChannelProvider>
          <EnquiryProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[3000] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-primary focus:shadow-card-hover"
            >
              Skip to content
            </a>
            <Header />
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
            <Footer />
            <StickyActionBar />
          </EnquiryProvider>
        </ContactChannelProvider>
        <CallTracking />
      </body>
    </html>
  );
}
