import './globals.css';
// Self-hosted icon subset (replaces the render-blocking cdnjs Font Awesome CSS).
import './icons.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import JsonLd from '@/components/JsonLd';
import CallTracking from '@/components/CallTracking';
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
    <html lang="en-IN">
      <body>
        <JsonLd data={[organizationSchema, localBusinessSchema, websiteSchema]} />
        <Header />
        {children}
        <Footer />
        <FloatingButtons />
        <CallTracking />
      </body>
    </html>
  );
}
