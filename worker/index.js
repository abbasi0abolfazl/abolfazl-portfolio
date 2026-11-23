/**
 * Cloudflare Worker: Telegram Contact Relay
 * Host: api.abolfazlabbasi.com
 * Route: api.abolfazlabbasi.com/*
 */

const ALLOWED_ORIGINS = [
  'https://abolfazlabbasi.com',
  'https://www.abolfazlabbasi.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

function isOriginAllowed(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.pages.dev')) return true;
  if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(origin) {
  const allowed = isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = getCorsHeaders(origin);

    // Handle preflight CORS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Health check endpoint
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'portfolio-telegram-relay',
          domain: 'api.abolfazlabbasi.com',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Only allow POST for contact messages
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body = await request.json().catch(() => null);
      if (!body) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { name, email, message, subject } = body;

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: 'Name, email, and message are required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Email format verification
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email address provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check for environment variables
      if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment secrets');
        return new Response(
          JSON.stringify({ error: 'Relay service is not configured with Telegram credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const clientIp = request.headers.get('cf-connecting-ip') || 'Unknown';
      const country = request.headers.get('cf-ipcountry') || 'Unknown';
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const formattedMessage = [
        `📬 <b>پیام جدید از وبسایت abolfazlabbasi.com</b>`,
        ``,
        `👤 <b>نام فرستنده:</b> ${escapeHtml(name)}`,
        `📧 <b>ایمیل:</b> <code>${escapeHtml(email)}</code>`,
        subject ? `🏷️ <b>موضوع:</b> ${escapeHtml(subject)}` : null,
        `🕒 <b>زمان:</b> ${timestamp} UTC`,
        `🌐 <b>مبدا:</b> ${escapeHtml(clientIp)} (${escapeHtml(country)})`,
        ``,
        `💬 <b>متن پیام:</b>`,
        `${escapeHtml(message)}`,
      ].filter(Boolean).join('\n');

      const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: formattedMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const telegramResult = await telegramResponse.json().catch(() => ({}));

      if (!telegramResponse.ok || !telegramResult.ok) {
        console.error('Telegram API error:', telegramResult);
        return new Response(
          JSON.stringify({ error: 'Telegram dispatch failed', details: telegramResult }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Message delivered to Telegram successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      console.error('Worker runtime error:', err);
      return new Response(
        JSON.stringify({ error: 'Internal server error processing contact message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  },
};
