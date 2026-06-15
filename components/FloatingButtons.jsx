import { siteConfig } from '@/data/siteConfig';

export default function FloatingButtons() {
  return (
    <div className="floating-actions">
      <a href={siteConfig.whatsappHref} className="float-btn btn-whatsapp" aria-label="WhatsApp GR Solution" target="_blank">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <a href={siteConfig.phoneHref} className="float-btn btn-call" aria-label="Call GR Solution">
        <i className="fa-solid fa-phone" />
      </a>
    </div>
  );
}
