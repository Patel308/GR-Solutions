'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { contactChannels } from '@/data/siteConfig';
import {
  STORAGE_KEY,
  applyTouch,
  channelFor,
  channelForPath,
  classifyVisit,
  leadAttribution,
  lineFor,
  parseStored,
} from '@/lib/leads/attribution.mjs';

// Attribution of this browser, resolved once per page load from the URL and
// referrer the visitor arrived with, then kept for 90 days in localStorage
// (first-party, no cookies). See lib/leads/attribution.mjs for the rules.
let attributionState;

export function getAttributionState() {
  if (attributionState !== undefined) return attributionState;
  let stored = null;
  try {
    stored = parseStored(window.localStorage.getItem(STORAGE_KEY));
    window.sessionStorage.removeItem('gr_lead_channel'); // pre-2026-10 session flag
  } catch {}

  const touch = classifyVisit({
    search: window.location.search,
    referrer: document.referrer,
    host: window.location.host,
    pathname: window.location.pathname,
  });
  attributionState = applyTouch(stored, touch);
  try {
    if (attributionState.last) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attributionState));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return attributionState;
}

/** Flat attribution fields for the current page, attached to leads and events. */
export function currentLeadAttribution() {
  return leadAttribution(getAttributionState(), window.location.pathname);
}

// Channel from the stored touch: 'ads' or 'seo', or 'direct' when the visitor
// has no search, AI, social, referral or ad visit in the last 90 days.
function getStoredChannel() {
  const state = getAttributionState();
  return state.last ? channelFor(state, window.location.pathname) : 'direct';
}

const subscribe = () => () => {};
const getServerChannel = () => null;

const ContactChannelContext = createContext(null);

// Decides which number set (ads or seo) the visitor sees. The server render
// uses the route alone, so every page's HTML (what search engines and AI
// crawlers read) carries the organic number, except the ads-only /landing.
// After hydration a visitor whose latest non-direct visit in the last 90 days
// came from an ad click sees the ads number on every page; a later visit from
// search, an AI assistant or a referral switches back to the organic number.
// Page lines (lineFor) apply only after hydration: direct visitors on the
// home page see the home line, organic and direct visitors on the brand
// repair pages the seo2 line. The server HTML never does, so crawlers always
// read the business number.
export function ContactChannelProvider({ children }) {
  const pathname = usePathname();
  const storedChannel = useSyncExternalStore(subscribe, getStoredChannel, getServerChannel);
  const direct = storedChannel === 'direct';
  const channel = storedChannel && !direct ? storedChannel : channelForPath(pathname);
  const line = storedChannel === null ? channel : lineFor(channel, pathname, direct);
  return (
    <ContactChannelContext.Provider value={{ channel, line, ...contactChannels[line] }}>
      {children}
    </ContactChannelContext.Provider>
  );
}

export function useContactChannel() {
  const pathname = usePathname();
  const value = useContext(ContactChannelContext);
  if (value) return value;
  const channel = channelForPath(pathname);
  return { channel, line: channel, ...contactChannels[channel] };
}

// Call link for the current channel. Renders the number itself when no
// children are passed.
export function PhoneLink({ callLocation, children, ...props }) {
  const { channel, line, phone, phoneHref } = useContactChannel();
  return (
    <a href={phoneHref} data-call-location={callLocation} data-lead-channel={channel} data-lead-line={line} {...props}>
      {children ?? phone}
    </a>
  );
}

// Prefilled WhatsApp text built from the page the visitor is on. Pages put a
// short context on <main data-wa-context="OLED/QLED TV repair in Noida">.
export function whatsAppMessage(element) {
  const host = element?.closest?.('[data-wa-context]') || document.querySelector('main[data-wa-context]');
  const context = host?.getAttribute('data-wa-context');
  return context ? `Hi GR Solution, I need ${context}.` : 'Hi GR Solution, I need help with my TV.';
}

// The server HTML keeps a plain wa.me link (works without JavaScript); the
// message is added at click time so it always matches the current page.
export function WhatsAppLink({ children, message, onClick, ...props }) {
  const { channel, line, whatsappHref } = useContactChannel();
  const handleClick = (event) => {
    const text = message || whatsAppMessage(event.currentTarget);
    event.currentTarget.href = `${whatsappHref}?text=${encodeURIComponent(text)}`;
    onClick?.(event);
  };
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      data-lead-channel={channel}
      data-lead-line={line}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

export function PhoneNumber() {
  return useContactChannel().phone;
}
