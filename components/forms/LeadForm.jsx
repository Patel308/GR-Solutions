'use client';

import { useId, useRef, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { PhoneLink, WhatsAppLink, currentLeadAttribution, useContactChannel } from '@/components/ContactChannel';
import { adsConversion, sectionOf, track } from '@/components/analytics';
import { newLeadId, normalisePhone } from '@/lib/leads/validate.mjs';
import cx from '@/components/ui/cx';

export const ISSUE_OPTIONS = [
  'No picture but sound works',
  'TV won’t turn on',
  'Lines or spots on screen',
  'Dim or flickering picture',
  'No sound',
  'Restarting or stuck on logo',
  'Cracked or damaged screen',
  'Smart TV, apps or Wi-Fi',
  'Something else',
];

export const BRAND_OPTIONS = ['Samsung', 'Sony', 'LG', 'MI/Xiaomi', 'OnePlus', 'Vu', 'TCL', 'Panasonic', 'Other'];

export const AREA_OPTIONS = ['West Delhi', 'South Delhi', 'East Delhi', 'North Delhi', 'Noida', 'Greater Noida', 'Ghaziabad'];

export { normalisePhone };

const PHONE_ERROR = 'Enter a 10-digit phone number so we can call you back.';

/**
 * One form for every lead capture point. Each submission gets a lead ID and
 * the visitor's attribution (source, campaign, Google Ads click ID) and is sent
 * two ways at once, without a page reload:
 *   1. FormSubmit email (to the inbox, with the CC in siteConfig), as before;
 *   2. /api/lead, which forwards it to Telegram, a Google Sheet and/or a CRM
 *      webhook (whichever are configured on the server).
 * The visitor sees success if either path delivered it. Field `name`
 * attributes match what the inbox already receives (name, phone, brand,
 * service, area, message).
 *
 * fields: list of extra fields to show after phone + name:
 *   'issue' (dropdown), 'brand' (dropdown), 'service' (dropdown of services),
 *   'area' (dropdown), 'message' (textarea)
 */
export default function LeadForm({
  formId,
  section,
  subject,
  hidden = {},
  fields = ['issue'],
  services = [],
  labels = {},
  requireName = false,
  submitLabel = 'Request a callback',
  className,
}) {
  const uid = useId();
  const formRef = useRef(null);
  const statusRef = useRef(null);
  const started = useRef(false);
  const startedAt = useRef(null);
  // Set while the submit button is being pressed: the phone field's blur
  // check then waits for the submit, so the inline error cannot push the
  // button down mid-tap (which made the tap miss and nothing was sent).
  const pressingSubmit = useRef(false);
  const { channel } = useContactChannel();
  const [state, setState] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const id = (name) => `${uid}-${name}`;
  const label = (name, fallback) => labels[name] || fallback;

  const onFirstInteraction = () => {
    if (started.current) return;
    started.current = true;
    startedAt.current = Date.now();
    track('form_start', { form_id: formId, section: section || sectionOf(formRef.current) });
  };

  const validate = (form) => {
    const next = {};
    if (!normalisePhone(form.elements.phone?.value)) next.phone = PHONE_ERROR;
    if (requireName && !form.elements.name?.value.trim()) next.name = 'Please tell us your name.';
    return next;
  };

  const onPhoneBlur = (event) => {
    if (!event.target.value || pressingSubmit.current) return;
    setErrors((current) => ({ ...current, phone: normalisePhone(event.target.value) ? undefined : PHONE_ERROR }));
  };

  const onPhoneInput = (event) => {
    if (errors.phone && normalisePhone(event.target.value)) setErrors((current) => ({ ...current, phone: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors).find((key) => nextErrors[key]);
    if (firstInvalid) {
      form.elements[firstInvalid]?.focus();
      return;
    }

    setState('sending');
    const formData = new FormData(form);
    const phone = normalisePhone(formData.get('phone'));
    const leadId = newLeadId();
    const page = window.location.pathname;
    let attribution = {};
    try {
      attribution = currentLeadAttribution();
    } catch {}
    const sourceLabel = String(formData.get('source') || '');

    // Email copy (FormSubmit): readable extra rows for the inbox.
    formData.set('phone', phone);
    formData.set('lead_id', leadId);
    formData.set('page', page);
    formData.set('lead_channel', channel);
    const trafficSource = attribution.source ? `${attribution.source} / ${attribution.medium}` : '';
    if (trafficSource) formData.set('traffic_source', trafficSource);
    if (attribution.campaign) formData.set('campaign', attribution.campaign);
    if (attribution.click_id) formData.set(attribution.click_id_type || 'click_id', attribution.click_id);
    if (attribution.landing_page) formData.set('landing_page', attribution.landing_page);

    const field = (name) => String(formData.get(name) || '');
    const payload = {
      lead_id: leadId,
      phone,
      name: field('name'),
      issue: field('issue'),
      brand: field('brand'),
      service: field('service'),
      area: field('area'),
      message: field('message'),
      form_id: formId,
      source: sourceLabel,
      subject,
      page,
      lead_channel: channel,
      attribution,
      elapsed_ms: startedAt.current ? Date.now() - startedAt.current : undefined,
      _honey: field('_honey'),
    };

    const email = fetch(siteConfig.formEndpoint, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    })
      .then((response) => response.ok)
      .catch(() => false);
    const api = fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        return response.ok && body?.ok ? body : null;
      })
      .catch(() => null);

    const [emailOk, apiResult] = await Promise.all([email, api]);
    const forwarded = Boolean(apiResult && apiResult.delivered > 0);
    const eventBase = {
      form_id: formId,
      section: section || sectionOf(form),
      lead_channel: channel,
      lead_id: leadId,
      traffic_source: attribution.source,
      traffic_medium: attribution.medium,
    };

    if (emailOk || forwarded) {
      setState('success');
      track('form_submit', { ...eventBase, delivery: [emailOk && 'email', forwarded && 'api'].filter(Boolean).join('+') });
      track('generate_lead', { ...eventBase, method: 'form' });
      adsConversion('lead', { transactionId: leadId, phone });
      requestAnimationFrame(() => statusRef.current?.focus());
    } else {
      setState('error');
      track('form_error', { ...eventBase, email: emailOk, api: apiResult ? 'ok_not_forwarded' : 'failed' });
    }
  }

  if (state === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={cx('rounded-2xl border border-teal-100 bg-teal-50 p-5 text-center outline-none sm:p-6', className)}
      >
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-white text-xl text-success" aria-hidden="true">
          <i className="fa-solid fa-circle-check" />
        </span>
        <p className="mt-3 font-display text-lg font-bold text-ink">Thank you. We will contact you shortly.</p>
        <p className="mt-1 text-small text-muted">We return calls between 9 AM and 9 PM, Monday to Sunday.</p>
        <p className="mt-4 text-small font-semibold text-ink">Need help sooner?</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <PhoneLink callLocation={`${formId}_success_call`} className="btn btn-primary">
            <i className="fa-solid fa-phone" aria-hidden="true" /> Call
          </PhoneLink>
          <WhatsAppLink className="btn btn-whatsapp">
            <i className="fa-brands fa-whatsapp" aria-hidden="true" /> WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  const sending = state === 'sending';

  return (
    <form
      ref={formRef}
      id={formId}
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className={cx('grid gap-4', className)}
      data-hide-sticky
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_cc" value={siteConfig.formNotificationEmail} />
      {Object.entries(hidden).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      {/* Honeypot for FormSubmit: bots fill it, people never see it. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <label htmlFor={id('phone')} className="field-label">
          {label('phone', 'Phone number')}
        </label>
        <input
          id={id('phone')}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          required
          aria-required="true"
          aria-invalid={errors.phone ? 'true' : undefined}
          aria-describedby={errors.phone ? id('phone-error') : undefined}
          placeholder="98765 43210"
          className="field-input"
          onBlur={onPhoneBlur}
          onInput={onPhoneInput}
        />
        {errors.phone ? (
          <p id={id('phone-error')} className="field-error">
            <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" /> {errors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id('name')} className="field-label">
          {label('name', 'Your name')}{' '}
          {requireName ? null : <span className="field-optional">(optional)</span>}
        </label>
        <input
          id={id('name')}
          name="name"
          type="text"
          autoComplete="name"
          required={requireName}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? id('name-error') : undefined}
          className="field-input"
        />
        {errors.name ? (
          <p id={id('name-error')} className="field-error">
            <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" /> {errors.name}
          </p>
        ) : null}
      </div>

      {fields.includes('issue') ? (
        <SelectField id={id('issue')} name="issue" label={label('issue', 'What’s wrong?')} placeholder="Choose the closest match" options={ISSUE_OPTIONS} />
      ) : null}
      {fields.includes('brand') ? (
        <SelectField id={id('brand')} name="brand" label={label('brand', 'TV brand')} placeholder="Select brand" options={BRAND_OPTIONS} />
      ) : null}
      {fields.includes('service') ? (
        <SelectField id={id('service')} name="service" label={label('service', 'Service required')} placeholder="Select service" options={services} />
      ) : null}
      {fields.includes('area') ? (
        <SelectField id={id('area')} name="area" label={label('area', 'Service area')} placeholder="Select area" options={AREA_OPTIONS} />
      ) : null}
      {fields.includes('message') ? (
        <div>
          <label htmlFor={id('message')} className="field-label">
            {label('message', 'Message')} <span className="field-optional">(optional)</span>
          </label>
          <textarea id={id('message')} name="message" rows={4} className="field-input" />
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary btn-lg btn-block mt-1"
        disabled={sending}
        onPointerDown={() => {
          pressingSubmit.current = true;
          setTimeout(() => {
            pressingSubmit.current = false;
          }, 1000);
        }}
      >
        <i className={sending ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'} aria-hidden="true" />
        {sending ? 'Sending…' : submitLabel}
      </button>

      {state === 'error' ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-red-50 p-3 text-small font-semibold text-danger">
          Message could not be sent right now. Please call or WhatsApp us.
        </p>
      ) : (
        <p className="text-center text-small text-muted">We only use your number to call you back about your TV.</p>
      )}
    </form>
  );
}

function SelectField({ id, name, label, placeholder, options }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} <span className="field-optional">(optional)</span>
      </label>
      <select id={id} name={name} defaultValue="" className="field-input">
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
