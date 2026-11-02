import { contactChannels } from '@/data/siteConfig';
import { createLeadHandler } from '@/lib/leads/handler.mjs';

// Website leads: validated here, then forwarded to the destinations switched
// on in the server's environment (Telegram, Google Sheet, CRM webhook). The
// browser also emails each lead through FormSubmit, so a lead still arrives if
// either path is down. Set-up: docs/lead-tracking.md.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const handler = createLeadHandler({ env: process.env, lines: contactChannels });

export function POST(request) {
  return handler.post(request);
}

export function GET() {
  return handler.status();
}
