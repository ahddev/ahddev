import { extractAddresses } from "@/lib/mail/threading";
import { parseMailbox } from "@/lib/mail/format";

/** Default sender, taken from RESEND_FROM ("reach@ahed.dev" or "Ahed <reach@ahed.dev>"). */
export function mailIdentity() {
  const from = process.env.RESEND_FROM ?? "";
  const address = extractAddresses(from)[0] ?? "";
  return {
    address,
    name: parseMailbox(from).name,
    domain: address.split("@")[1] ?? "",
  };
}
