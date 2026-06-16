import { siteConfig } from '@/data/siteConfig';

export default function FloatingButtons() {
  return (
    <div className="floating-actions fixed bottom-5 right-5 z-[900] flex flex-col gap-3">
      <a href={siteConfig.whatsappHref} className="float-btn btn-whatsapp flex size-[54px] items-center justify-center rounded-full bg-[#25d366] text-xl text-white shadow-oldLg transition duration-300 hover:-translate-y-1" aria-label="WhatsApp GR Solution" target="_blank">
        <i className="fa-brands fa-whatsapp" />
      </a>
      <a href={siteConfig.phoneHref} className="float-btn btn-call flex size-[54px] items-center justify-center rounded-full bg-primary text-xl text-white shadow-oldLg transition duration-300 hover:-translate-y-1" aria-label="Call GR Solution">
        <i className="fa-solid fa-phone" />
      </a>
    </div>
  );
}
