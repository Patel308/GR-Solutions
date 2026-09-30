# GR Solution Call Tracking

## Separate numbers for ads and SEO

Paid-ad leads and organic (SEO) leads ring on different numbers, for both calls and WhatsApp. The numbers live in `contactChannels` in `data/siteConfig.js`:

| Channel | Number | Shown on |
| --- | --- | --- |
| `ads` | +91 99902 83890 | `/` and `/landing` (the `adPaths` list), plus any page opened from an ad click |
| `seo` | +91 93155 15700 | every other page (services, city, brand, locality, blog, pricing, about, contact, ...) |

How the channel is picked (`components/ContactChannel.jsx`):

1. The server render uses the route alone: pages in `adPaths` get `ads`, everything else gets `seo`.
2. A visit that arrives with an ad click ID (`gclid`, `gbraid`, `wbraid`, `gad_source`, `fbclid`, `msclkid`) or a paid `utm_medium` (`cpc`, `ppc`, `paid`, ...) is always `ads`, whatever page it lands on.
3. The landing page's channel is remembered for the browser-tab session. An ad visitor who browses from `/` into a service page keeps the ads number, and an organic visitor who lands on a blog post keeps the SEO number on `/`.

To send ads to another page, add its path to `adPaths` (or rely on the click ID). Every call or WhatsApp button must use `PhoneLink` / `WhatsAppLink` / `PhoneNumber` from `components/ContactChannel.jsx`, not `siteConfig.phoneHref`, or it will always show the ads number.

Schema (`telephone` in JSON-LD) and `llms.txt` keep the primary number (+91 99902 83890) so the business NAP stays consistent with the Google Business Profile.

## Click tracking

The site now tracks every phone CTA click through one shared listener. It covers header, homepage, service pages, contact, footer, page CTA and floating call buttons without changing the public phone number or the `tel:` behavior.

### Events

The GA4 web stream uses Measurement ID `G-0RQ8C75FPT`. Each click sends a `generate_lead` event with:

- `method`: `phone`
- `call_location`: the CTA surface, such as `header_call_now` or `floating_call_button`
- `lead_channel`: `ads` or `seo`, the number set the visitor was shown
- `page_path`: the page where the click happened

The listener also pushes a `phone_call_click` object to `window.dataLayer` for GTM-compatible setups.

### GA4 reporting configuration

The local environment and production Docker build must both expose:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT
```

The Measurement ID is public by design and is passed to the production image by the GitHub Actions workflow. After rebuilding and redeploying, mark `generate_lead` as a Key event in GA4. The event will then show phone CTA conversions by page and CTA location. Register `lead_channel` as an event-scoped custom dimension to split them into ads vs SEO.

### Actual connected-call tracking

A website can measure a phone-link click, but it cannot know whether a call was answered, its duration, or whether the caller became a lead. For those outcomes, subscribe to a call-tracking provider and obtain a dedicated tracking number that forwards to `+91 99902 83890`. That provider number should replace the website number only after it has been tested and the forwarding/privacy terms are confirmed.
