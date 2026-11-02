'use client';

import { PhoneLink, WhatsAppLink, useContactChannel } from '@/components/ContactChannel';
import { useEnquiry } from '@/components/EnquiryContext';
import RepairIcon from './RepairIcon';
import styles from './RepairLandingPage.module.css';

export default function RepairBookingActions({ contentId, label = 'Request free diagnosis', placement = 'hero' }) {
  const { channel } = useContactChannel();
  const { openEnquiry } = useEnquiry();
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
  return <div className={styles.actions} data-repair-actions={`${contentId}:${placement}`}>
    <button type="button" className={styles.primaryButton} onClick={book}>{label}<RepairIcon name="fa-arrow-right" /></button>
    <PhoneLink className={styles.outlineButton} callLocation={`${contentId}_${placement}_call`} onClick={() => track('call')}><RepairIcon name="fa-phone" />Call</PhoneLink>
    <WhatsAppLink className={styles.whatsappButton} onClick={() => track('whatsapp')}><RepairIcon name="fa-whatsapp" />WhatsApp</WhatsAppLink>
  </div>;
}
