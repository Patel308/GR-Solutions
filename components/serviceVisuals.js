// One distinct illustration per TV type for service cards. They replace the two
// stock photos that were repeated across all five services. Drawings, not
// photos: real workshop photography belongs in the "Real workshop photos"
// sections (see docs/design-system.md for the photo shot list).
export const serviceIllustration = {
  'led-tv-repair': '/images/illustrations/led-tv.svg',
  'oled-qled-tv-repair': '/images/illustrations/oled-qled-tv.svg',
  'lcd-tv-repair': '/images/illustrations/lcd-tv.svg',
  'plasma-tv-repair': '/images/illustrations/plasma-tv.svg',
  'curved-tv-repair': '/images/illustrations/curved-tv.svg',
};

export const illustrationFor = (service) => serviceIllustration[service.slug] || service.image;
