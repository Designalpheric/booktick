import { NextRequest, NextResponse } from "next/server";
import { EnquiryFormData } from "@/types";

// In-memory store for demo; replace with a real DB (e.g. Prisma + PostgreSQL)
const enquiries: (EnquiryFormData & { id: string; createdAt: string; status: string })[] = [];

export async function POST(req: NextRequest) {
  try {
    const body: EnquiryFormData = await req.json();

    // Basic server-side validation
    if (!body.name || !body.mobile || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const enquiry = {
      ...body,
      id: `ENQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "New",
    };

    // Save locally (demo)
    enquiries.push(enquiry);

    // ─── OneDesk Integration ─────────────────────────────────────────────────
    // OneDesk is a project management / helpdesk tool. To integrate:
    //
    // 1. Go to https://app.onedesk.com → Settings → API → Generate API key
    // 2. Set environment variables:
    //    ONEDESK_API_KEY=your_api_key
    //    ONEDESK_COMPANY_ID=your_company_id
    //
    // 3. Each enquiry creates a TICKET (helpdesk) or TASK (project) in OneDesk.
    //
    // The OneDesk REST API endpoint to create a ticket:
    //   POST https://app.onedesk.com/rest/2.0/tickets/create
    //
    // With body:
    //   {
    //     "ticket": {
    //       "name": "Travel Enquiry – {name} – {destination}",
    //       "description": "...",
    //       "type": "ticket",
    //       "priority": "normal",
    //       "customFields": { ... }
    //     }
    //   }
    // ────────────────────────────────────────────────────────────────────────

    if (process.env.ONEDESK_API_KEY && process.env.ONEDESK_COMPANY_ID) {
      await createOneDeskTicket(enquiry);
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: "Enquiry submitted successfully. Our team will contact you within 2 hours.",
    });
  } catch (err) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

export async function GET() {
  // Admin-only: return all enquiries
  // In production, protect this route with authentication
  return NextResponse.json({ enquiries, total: enquiries.length });
}

// ─── OneDesk API Helper ──────────────────────────────────────────────────────
async function createOneDeskTicket(enquiry: EnquiryFormData & { id: string; createdAt: string; status: string }) {
  const ONEDESK_API_KEY = process.env.ONEDESK_API_KEY!;
  const ONEDESK_COMPANY_ID = process.env.ONEDESK_COMPANY_ID!;

  const ticketName = `[${enquiry.enquiryType.toUpperCase()}] ${enquiry.name} → ${enquiry.destination || "General"}`;

  const description = `
🧳 TRAVEL ENQUIRY — ${enquiry.id}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${enquiry.name}
📱 Mobile: ${enquiry.mobile}
📧 Email: ${enquiry.email}
✈️ Enquiry Type: ${enquiry.enquiryType}
🌍 Destination: ${enquiry.destination || "Not specified"}
${enquiry.packageOrFlight ? `📦 Package/Flight: ${enquiry.packageOrFlight}` : ""}
📅 Travel Date: ${enquiry.travelDate || "Not specified"}
👥 Travellers: ${enquiry.travellers}
💬 Message: ${enquiry.message || "None"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Status: New
⏰ Received: ${new Date(enquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
  `.trim();

  try {
    // OneDesk REST API v2 — create ticket
    const response = await fetch(
      `https://app.onedesk.com/rest/2.0/tickets/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ONEDESK_API_KEY}`,
          "X-OneDesk-Company": ONEDESK_COMPANY_ID,
        },
        body: JSON.stringify({
          ticket: {
            name: ticketName,
            description,
            priority: "normal",
            type: "ticket",
            status: "open",
            tags: [enquiry.enquiryType, "website-enquiry", enquiry.destination || "general"],
            customFields: {
              customerName: enquiry.name,
              customerEmail: enquiry.email,
              customerPhone: enquiry.mobile,
              destination: enquiry.destination,
              travelDate: enquiry.travelDate,
              travellers: enquiry.travellers,
              enquiryType: enquiry.enquiryType,
              packageOrFlight: enquiry.packageOrFlight || "",
              enquiryId: enquiry.id,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OneDesk API error:", response.status, errorText);
    } else {
      const data = await response.json();
      console.log("OneDesk ticket created:", data?.ticket?.id || data);
    }
  } catch (err) {
    console.error("Failed to create OneDesk ticket:", err);
  }
}
