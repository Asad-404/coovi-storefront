import Link from "next/link";
import type { ShopSettings } from "@/lib/types";
import { whatsappUrl } from "@/lib/site";

// Same classes for the real link and the stand-in, so swapping one for the other cannot move anything
const CHAT_LINK_CLASS = "flex items-center gap-2 font-semibold hover:text-brand";
const STRIP_CLASS = "block bg-brand py-3.5 text-center text-sm font-semibold text-white";

function ChatLabel() {
  return (
    <>
      Chat:
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25d366] text-white">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.1Z" />
        </svg>
      </span>
    </>
  );
}

// While the settings load the number is unknown, so the link goes to the contact page rather than a guess
export function ChatLinkFallback() {
  return (
    <Link href="/contact" className={CHAT_LINK_CLASS}>
      <ChatLabel />
    </Link>
  );
}

export async function ChatLink({ settings }: { settings: Promise<ShopSettings> }) {
  const { whatsappNumber } = await settings;
  return (
    <a href={whatsappUrl(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" className={CHAT_LINK_CLASS}>
      <ChatLabel />
    </a>
  );
}

// An empty strip of the same height, so the page below does not jump when the text arrives
export function AnnouncementFallback() {
  return (
    <div className={STRIP_CLASS} aria-hidden="true">
      &nbsp;
    </div>
  );
}

export async function Announcement({ settings }: { settings: Promise<ShopSettings> }) {
  const { announcementActive, announcementText } = await settings;
  if (!announcementActive || !announcementText) return null;
  return (
    <Link href="/saree" className={`${STRIP_CLASS} hover:bg-brand-dark`}>
      {announcementText}
    </Link>
  );
}
