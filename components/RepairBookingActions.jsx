'use client';

import { PhoneLink, WhatsAppLink, useContactChannel } from '@/components/ContactChannel';
import { useEnquiry } from '@/components/EnquiryContext';
import cx from '@/components/ui/cx';
import RepairIcon from './RepairIcon';

// Booking buttons for the repair landing pages. Redesign buttons (19 Nov 2026):
// the request button takes a full row on phones, call and WhatsApp share the
// next; one row from 640px. `placement="closing"` sits on the dark CTA panel.
export default function RepairBookingActions({ contentId, label = 'Request free diagnosis', placement = 'hero' }) {
  const { channel } = useContactChannel();
  const { openEnquiry } = useEnquiry();
  const onDark = placement === 'closing';
  const track = (action) => {
    if (typeof window.gtag === 'function') window.gtag('event', 'content_cta_click', {
      content_id: contentId, content_intent: contentId === 'tv-repair-dwarka' ? 'locality' : 'smart_tv',
      cta_location: placement, cta_action: action, lead_channel: channel, page_path: window.location.pathname,
    });
  };
  const book = () => {
    track('open_enquiry');
    openEnquiry('repair_page');
  };
  return <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap [&>*:first-child]:col-span-2" data-repair-actions={`${contentId}:${placement}`}>
    <button type="button" className={cx('btn btn-lg', onDark ? 'btn-light' : 'btn-primary')} onClick={book}>{label}<RepairIcon name="fa-arrow-right" className="shrink-0" /></button>
    <PhoneLink className={cx('btn btn-lg', onDark ? 'btn-outline-light' : 'btn-secondary')} callLocation={`${contentId}_${placement}_call`} onClick={() => track('call')}><RepairIcon name="fa-phone" className="shrink-0" />Call</PhoneLink>
    <WhatsAppLink className="btn btn-whatsapp btn-lg" onClick={() => track('whatsapp')}><RepairIcon name="fa-whatsapp" className="shrink-0" />WhatsApp</WhatsAppLink>
  </div>;
}
