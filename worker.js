const TREATMENTS = [
  { name: "Pure Skin Ritual", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Hydra Skin Therapy", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Age Reverse Facial", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Korean Glass Skin", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Dermapen Skin Booster", category: "Microneedling", price: "CRC 45.000", duration: 120 },
  { name: "Dermapen paquete 5 sesiones", category: "Paquete", price: "CRC 180.000", duration: 120 },
  { name: "Salmon DNA Repair paquete 5 sesiones", category: "Paquete", price: "CRC 280.000", duration: 120 },
  { name: "Bridal Glow Experience", category: "Evento", price: "CRC 100.000", duration: 120 },
  { name: "Fotona Total Rejuvenation", category: "Láser Fotona", price: "CRC 350.000", duration: 120 },
  { name: "Silk Skin Laser", category: "Depilación láser", price: "Desde CRC 50.000", duration: 60 },
  { name: "Star Former Sculpt", category: "Corporal", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + axilas", category: "Depilación láser", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + media pierna + axilas", category: "Depilación láser", price: "CRC 75.000", duration: 90 },
  { name: "Bikini completo + pierna completa + axilas + bigote", category: "Depilación láser", price: "CRC 100.000", duration: 120 },
  { name: "Espalda hombre", category: "Depilación láser", price: "CRC 50.000", duration: 60 },
  { name: "Pecho hombre", category: "Depilación láser", price: "CRC 50.000", duration: 60 },
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

    if (url.pathname === "/api/availability" && request.method === "GET") {
      return getAvailability(url, env);
    }

    if (url.pathname === "/api/appointments" && request.method === "POST") {
      return createAppointment(request, env);
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

async function getAvailability(url, env) {
  if (!env.DB) return json({ message: "La base de datos de agenda no está configurada." }, 503);

  const serviceName = String(url.searchParams.get("service") || "").trim();
  const date = String(url.searchParams.get("date") || "").trim();
  const treatment = findTreatment(serviceName);
  if (!treatment) return json({ message: "Servicio no válido." }, 400);
  if (!isValidDate(date)) return json({ message: "Fecha no válida." }, 400);

  const rows = await env.DB.prepare(`
    SELECT time, duration, status FROM appointments
    WHERE date = ? AND status IN ('requested', 'confirmed')
  `).bind(date).all();

  const blocked = await env.DB.prepare(`
    SELECT time FROM blocks WHERE date = ?
  `).bind(date).all();

  const busy = new Set((rows.results || []).flatMap((item) => expandBusySlots(item.time, item.duration || 60)));
  for (const item of blocked.results || []) busy.add(item.time);

  const slots = buildTimeSlots("09:00", "18:00", 30)
    .filter((time) => canFit(time, treatment.duration, busy))
    .map((time) => ({ time }));

  return json({ service: treatment.name, date, slots });
}

async function createAppointment(request, env) {
  if (!env.DB) return json({ message: "La base de datos de agenda no está configurada." }, 503);

  const body = await request.json();
  const name = cleanText(body.name);
  const phone = cleanPhone(body.phone);
  const email = cleanText(body.email).toLowerCase();
  const service = cleanText(body.service);
  const date = cleanText(body.date);
  const time = cleanText(body.time);
  const note = cleanText(body.note || "");
  const treatment = findTreatment(service);

  if (!name || name.length < 3) return json({ message: "Ingresa tu nombre completo." }, 400);
  if (!phone || phone.length < 8) return json({ message: "Ingresa un teléfono válido." }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ message: "Ingresa un correo válido o deja el campo vacío." }, 400);
  if (!treatment) return json({ message: "Selecciona un servicio válido." }, 400);
  if (!isValidDate(date)) return json({ message: "Selecciona una fecha válida." }, 400);
  if (!/^\d{2}:\d{2}$/.test(time)) return json({ message: "Selecciona una hora válida." }, 400);

  const availabilityUrl = new URL("https://local/api/availability");
  availabilityUrl.searchParams.set("service", service);
  availabilityUrl.searchParams.set("date", date);
  const availability = await getAvailability(availabilityUrl, env);
  const availabilityPayload = await availability.clone().json();
  if (!availability.ok || !availabilityPayload.slots?.some((slot) => slot.time === time)) {
    return json({ message: "Ese horario ya no está disponible. Selecciona otro espacio." }, 409);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO appointments (id, name, phone, email, service, date, time, duration, note, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'requested', ?)
  `).bind(id, name, phone, email, treatment.name, date, time, treatment.duration, note, new Date().toISOString()).run();

  return json({
    id,
    message: "Solicitud registrada. El equipo de Jenny Delgado te contactará para confirmar la cita."
  }, 201);
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

function findTreatment(name) {
  const normalized = normalize(name);
  return TREATMENTS.find((item) => normalize(item.name) === normalized);
}

function buildTimeSlots(start, end, stepMinutes) {
  const slots = [];
  let current = toMinutes(start);
  const finish = toMinutes(end);
  while (current < finish) {
    slots.push(fromMinutes(current));
    current += stepMinutes;
  }
  return slots;
}

function expandBusySlots(startTime, duration) {
  const slots = [];
  const start = toMinutes(startTime);
  const end = start + Number(duration || 60);
  for (let minute = start; minute < end; minute += 30) {
    slots.push(fromMinutes(minute));
  }
  return slots;
}

function canFit(startTime, duration, busy) {
  const start = toMinutes(startTime);
  const end = start + Number(duration || 60);
  if (end > toMinutes("18:00")) return false;
  for (let minute = start; minute < end; minute += 30) {
    if (busy.has(fromMinutes(minute))) return false;
  }
  return true;
}

function toMinutes(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  return hour * 60 + minute;
}

function fromMinutes(total) {
  const hour = String(Math.floor(total / 60)).padStart(2, "0");
  const minute = String(total % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const selected = new Date(`${value}T00:00:00-06:00`);
  const today = new Date();
  const floor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return selected >= floor;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 500);
}

function cleanPhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").slice(0, 24);
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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
