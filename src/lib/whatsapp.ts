const WHATSAPP_NUMBER = "919876543210"; // Replace with actual business number

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function packageEnquiryMessage(packageTitle: string, destination: string): string {
  return `Hi BookTick! 👋\n\nI am interested in the *${packageTitle}* package to *${destination}*.\n\nCould you please share more details about:\n- Pricing & availability\n- Customization options\n- Inclusions & exclusions\n\nThank you!`;
}

export function flightEnquiryMessage(from: string, to: string, airline: string, departure: string): string {
  return `Hi BookTick! 👋\n\nI am interested in enquiring about the following flight:\n\n✈️ *Route:* ${from} → ${to}\n🛫 *Airline:* ${airline}\n🕐 *Departure:* ${departure}\n\nCould you please share more details about pricing, availability, and booking process?\n\nThank you!`;
}

export function generalEnquiryMessage(destination?: string): string {
  return `Hi BookTick! 👋\n\nI am interested in planning a trip${destination ? ` to *${destination}*` : ""}.\n\nCould you please share suitable packages, flights, and pricing?\n\nThank you!`;
}
