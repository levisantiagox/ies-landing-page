/**
 * Cloudflare Worker — GHL Form Proxy
 * Keeps PIT token and Location ID server-side.
 *
 * Environment variables (set in Cloudflare dashboard > Worker > Settings > Variables):
 *   GHL_PIT         = your-private-integration-token
 *   GHL_LOCATION_ID = your-ghl-location-id
 *
 * Deploy: wrangler deploy
 * Or paste into Cloudflare dashboard > Workers > Quick Edit
 */

const GHL_API = 'https://services.leadconnectorhq.com';
const ALLOWED_ORIGINS = [
  'https://workshop.cracka.digital',
  'https://cracka.digital',
  'https://www.cracka.digital',
  'https://crackasystems.com.au',
  'https://www.crackasystems.com.au',
  'http://localhost',
  'http://127.0.0.1'
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.find(o => origin && origin.startsWith(o));
  return {
    'Access-Control-Allow-Origin': allowed || ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    try {
      const body = await request.json();

      // Inject server-side credentials
      const contactPayload = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        companyName: body.companyName,
        website: body.website || undefined,
        locationId: env.GHL_LOCATION_ID,
        tags: ['cracka workshop'],
        source: 'Cracka Systems - IES Landing Page'
      };

      const ghlHeaders = {
        'Authorization': 'Bearer ' + env.GHL_PIT,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      };

      // Step 1: Create contact
      const contactRes = await fetch(GHL_API + '/contacts/', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify(contactPayload)
      });

      if (!contactRes.ok) {
        const err = await contactRes.text();
        return new Response(JSON.stringify({ error: 'Contact creation failed', detail: err }), {
          status: contactRes.status,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      const contactData = await contactRes.json();
      const contactId = contactData.contact.id;

      // Step 2: Create opportunity
      const oppRes = await fetch(GHL_API + '/opportunities/', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({
          pipelineId: 'mwois8wGmq2K2tyGuV3j',
          pipelineStageId: '32d46166-94ee-4424-8fa3-21cc484665fa',
          locationId: env.GHL_LOCATION_ID,
          contactId: contactId,
          name: contactPayload.firstName + ' ' + contactPayload.lastName + ' — Cracka Workshop',
          status: 'open',
          source: 'Cracka Systems - IES Landing Page'
        })
      });

      if (!oppRes.ok) {
        const err = await oppRes.text();
        return new Response(JSON.stringify({ error: 'Opportunity creation failed', detail: err }), {
          status: oppRes.status,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, contactId: contactId }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: 'Server error', message: err.message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  }
};
