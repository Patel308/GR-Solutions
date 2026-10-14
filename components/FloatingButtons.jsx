import { PhoneLink, WhatsAppLink } from '@/components/ContactChannel';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-[900] hidden flex-col gap-3 md:flex">
      <WhatsAppLink
        className="flex size-[54px] items-center justify-center rounded-full bg-[#25d366] text-xl text-white shadow-oldLg transition duration-300 hover:-translate-y-1"
        aria-label="WhatsApp GR Solution"
      >
        <i className="fa-brands fa-whatsapp" />
      </WhatsAppLink>
      <PhoneLink
        callLocation="floating_call_button"
        className="flex size-[54px] items-center justify-center rounded-full bg-primary text-xl text-white shadow-oldLg transition duration-300 hover:-translate-y-1"
        aria-label="Call GR Solution"
      >
        <i className="fa-solid fa-phone" />
      </PhoneLink>
    </div>
  );
}
