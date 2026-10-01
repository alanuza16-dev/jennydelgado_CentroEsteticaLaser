const TREATMENTS = [
  { name: "Pure Skin Ritual", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Hydra Skin Therapy", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Age Reverse Facial", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Korean Glass Skin", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Dermapen Skin Booster", category: "Microneedling", price: "CRC 45.000", duration: 120 },
  { name: "Dermapen paquete 5 sesiones", category: "Paquete", price: "CRC 180.000", duration: 120 },
  { name: "Salmon DNA Repair paquete 5 sesiones", category: "Paquete", price: "CRC 280.000", duration: 120 },
  { name: "Bridal Glow Experience", category: "Evento", price: "CRC 100.000", duration: 120 },
  { name: "Fotona Total Rejuvenation", category: "Laser Fotona", price: "₡ 175.000", duration: 120 },
  { name: "Silk Skin Laser", category: "Depilación laser", price: "Desde CRC 50.000", duration: 60 },
  { name: "Star Former Sculpt", category: "Corporal", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + axilas", category: "Depilación laser", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + media pierna + axilas", category: "Depilación laser", price: "CRC 75.000", duration: 90 },
  { name: "Bikini completo + pierna completa + axilas + bigote", category: "Depilación laser", price: "CRC 100.000", duration: 120 },
  { name: "Espalda hombre", category: "Depilación laser", price: "CRC 50.000", duration: 60 },
  { name: "Pecho hombre", category: "Depilación laser", price: "CRC 50.000", duration: 60 },
  { name: "TightSculpting Fotona", category: "Corporal", price: "Según valoración", duration: 120 },
  { name: "Arañitas / Telangiectasias", category: "Vascular", price: "Según valoración", duration: 60 }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });

    if (url.pathname === "/api/treatments" && request.method === "GET") {
      return json({ treatments: TREATMENTS });
    }

    if ((url.pathname === "/api/availability" && request.method === "GET") ||
        (url.pathname === "/api/appointments" && request.method === "POST")) {
      return json({ message: "La disponibilidad y las citas se confirman por WhatsApp: +506 8884 0452." }, 410);
    }

    if (url.pathname === "/api/admin/appointments" && request.method === "GET") {
      return listAppointments(url, env);
    }

    return withUtf8Charset(await env.ASSETS.fetch(request));
  }
};

function withUtf8Charset(response) {
  const contentType = response.headers.get("Content-Type") || "";
  const lowerType = contentType.toLowerCase();
  const needsCharset = [
    "text/html",
    "text/css",
    "text/plain",
    "application/javascript",
    "text/javascript",
    "application/json",
    "image/svg+xml"
  ].some((type) => lowerType.startsWith(type));

  if (!needsCharset || lowerType.includes("charset=")) return response;

  const headers = new Headers(response.headers);
  headers.set("Content-Type", `${contentType}; charset=utf-8`);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function listAppointments(url, env) {
  if (!env.DB) return json({ message: "La base de datos de agenda no está configurada." }, 503);
  if (!env.ADMIN_TOKEN || url.searchParams.get("token") !== env.ADMIN_TOKEN) {
    return json({ message: "No autorizado." }, 401);
  }

  const rows = await env.DB.prepare(`
    SELECT id, name, phone, email, service, date, time, duration, status, created_at
    FROM appointments
    ORDER BY date ASC, time ASC
    LIMIT 100
  `).all();
  return json({ appointments: rows.results || [] });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
