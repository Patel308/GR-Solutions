'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { adPaths, contactChannels } from '@/data/siteConfig';

const STORAGE_KEY = 'gr_lead_channel';
const PAID_CLICK_PARAMS = ['gclid', 'gbraid', 'wbraid', 'gad_source', 'fbclid', 'msclkid'];
const PAID_MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'paid_social', 'display'];

const channelForPath = (pathname) => (adPaths.includes(pathname) ? 'ads' : 'seo');

function isPaidClick(search) {
  const params = new URLSearchParams(search);
  if (PAID_CLICK_PARAMS.some((key) => params.has(key))) return true;
  return PAID_MEDIUMS.includes((params.get('utm_medium') || '').toLowerCase());
}

// Resolved once per page load, from the URL the visitor landed on.
let sessionChannel = null;

function getSessionChannel() {
  if (sessionChannel) return sessionChannel;

  let channel = null;
  try {
    channel = sessionStorage.getItem(STORAGE_KEY);
  } catch {}

  if (isPaidClick(window.location.search)) channel = 'ads';
  if (channel !== 'ads' && channel !== 'seo') channel = channelForPath(window.location.pathname);

  try {
    sessionStorage.setItem(STORAGE_KEY, channel);
  } catch {}
  sessionChannel = channel;
  return channel;
}

const subscribe = () => () => {};
const getServerChannel = () => null;

const ContactChannelContext = createContext(null);

// Decides which number set (ads or seo) the visitor sees. The server render
// uses the route alone. On the client, the channel of the session's landing
// page is remembered, so an ad visitor who browses from "/" into a service page
// keeps the ads number, and an organic visitor who lands on a blog post keeps
// the seo number on "/". An ad click (gclid etc.) always switches to ads.
export function ContactChannelProvider({ children }) {
  const pathname = usePathname();
  const storedChannel = useSyncExternalStore(subscribe, getSessionChannel, getServerChannel);
  const channel = storedChannel || channelForPath(pathname);
  return (
    <ContactChannelContext.Provider value={{ channel, ...contactChannels[channel] }}>
      {children}
    </ContactChannelContext.Provider>
  );
}

export function useContactChannel() {
  const pathname = usePathname();
  const value = useContext(ContactChannelContext);
  if (value) return value;
  const channel = channelForPath(pathname);
  return { channel, ...contactChannels[channel] };
}

// Call link for the current channel. Renders the number itself when no
// children are passed.
export function PhoneLink({ callLocation, children, ...props }) {
  const { channel, phone, phoneHref } = useContactChannel();
  return (
    <a href={phoneHref} data-call-location={callLocation} data-lead-channel={channel} {...props}>
      {children ?? phone}
    </a>
  );
}

export function WhatsAppLink({ children, ...props }) {
  const { channel, whatsappHref } = useContactChannel();
  return (
    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-lead-channel={channel} {...props}>
      {children}
    </a>
  );
}

export function PhoneNumber() {
  return useContactChannel().phone;
}
