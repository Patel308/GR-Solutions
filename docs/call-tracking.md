# GR Solution Call Tracking

The site now tracks every phone CTA click through one shared listener. It covers header, homepage, service pages, contact, footer, page CTA and floating call buttons without changing the public phone number or the `tel:` behavior.

## Events

The GA4 web stream uses Measurement ID `G-0RQ8C75FPT`. Each click sends a `generate_lead` event with:

- `method`: `phone`
- `call_location`: the CTA surface, such as `header_call_now` or `floating_call_button`
- `page_path`: the page where the click happened

The listener also pushes a `phone_call_click` object to `window.dataLayer` for GTM-compatible setups.

## GA4 reporting configuration

The local environment and production Docker build must both expose:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0RQ8C75FPT
```

The Measurement ID is public by design and is passed to the production image by the GitHub Actions workflow. After rebuilding and redeploying, mark `generate_lead` as a Key event in GA4. The event will then show phone CTA conversions by page and CTA location.

## Actual connected-call tracking

A website can measure a phone-link click, but it cannot know whether a call was answered, its duration, or whether the caller became a lead. For those outcomes, subscribe to a call-tracking provider and obtain a dedicated tracking number that forwards to `+91 99902 83890`. That provider number should replace the website number only after it has been tested and the forwarding/privacy terms are confirmed.
