const API_BASE = "/api";

const TREATMENTS = [
  { name: "Pure Skin Ritual", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Hydra Skin Therapy", category: "Facial signature", price: "CRC 35.000", duration: 120 },
  { name: "Age Reverse Facial", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Korean Glass Skin", category: "Facial signature", price: "CRC 40.000", duration: 120 },
  { name: "Dermapen Skin Booster", category: "Microneedling", price: "CRC 45.000", duration: 120 },
  { name: "Dermapen paquete 5 sesiones", category: "Paquete", price: "CRC 180.000", duration: 120 },
  { name: "Salmon DNA Repair paquete 5 sesiones", category: "Paquete", price: "CRC 280.000", duration: 120 },
  { name: "Bridal Glow Experience", category: "Evento", price: "CRC 100.000", duration: 120 },
  { name: "Fotona Total Rejuvenation", category: "Laser Fotona", price: "CRC 350.000", duration: 120 },
  { name: "Silk Skin Laser", category: "Depilacion laser", price: "Desde CRC 50.000", duration: 60 },
  { name: "Star Former Sculpt", category: "Corporal", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + axilas", category: "Depilacion laser", price: "CRC 50.000", duration: 60 },
  { name: "Bikini completo + media pierna + axilas", category: "Depilacion laser", price: "CRC 75.000", duration: 90 },
  { name: "Bikini completo + pierna completa + axilas + bigote", category: "Depilacion laser", price: "CRC 100.000", duration: 120 },
  { name: "Espalda hombre", category: "Depilacion laser", price: "CRC 50.000", duration: 60 },
  { name: "Pecho hombre", category: "Depilacion laser", price: "CRC 50.000", duration: 60 },
  { name: "TightSculpting Fotona", category: "Corporal", price: "Segun valoracion", duration: 120 },
  { name: "Aranitas / Telangiectasias", category: "Vascular", price: "Segun valoracion", duration: 60 }
];

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindVideos();
  hydrateTreatmentSelect();
  hydrateToday();
  bindBookingForm();
  loadAvailability();
});

function bindNavigation() {
  const params = new URLSearchParams(window.location.search);
  const section = params.get("section") || window.location.hash.replace("#", "");
  if (section) {
    window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (params.get("section")) window.history.replaceState(null, "", window.location.pathname);
    });
  }

  $("#mobile-menu-toggle")?.addEventListener("click", () => {
    const nav = $("#main-nav");
    const button = $("#mobile-menu-toggle");
    if (!nav || !button) return;
    nav.toggleAttribute("data-open");
    button.setAttribute("aria-expanded", String(nav.hasAttribute("data-open")));
  });
}

function bindVideos() {
  document.querySelectorAll("[data-video]").forEach((button) => {
    button.addEventListener("click", () => openVideoModal(button.dataset.video, button.dataset.title));
  });
  $("#video-modal-close")?.addEventListener("click", closeVideoModal);
  $("#video-modal")?.addEventListener("click", (event) => {
    if (event.target.id === "video-modal") closeVideoModal();
  });
}

function hydrateTreatmentSelect() {
  const select = $("#booking-service");
  if (!select) return;
  select.innerHTML = TREATMENTS
    .map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)} - ${escapeHtml(item.price)}</option>`)
    .join("");
  select.addEventListener("change", loadAvailability);
}

function hydrateToday() {
  const date = $("#booking-date");
  if (!date) return;
  const today = toDateInput(new Date());
  date.min = today;
  date.value = today;
  date.addEventListener("change", loadAvailability);
}

function bindBookingForm() {
  $("#booking-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector("button[type='submit']");
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.service = $("#booking-service")?.value || payload.service;
    payload.date = $("#booking-date")?.value || payload.date;
    payload.time = document.querySelector("[name='time']:checked")?.value || "";

    if (!payload.time) {
      showNotice("Selecciona una hora disponible para continuar.", true);
      return;
    }

    submitButton.disabled = true;
    showNotice("Guardando solicitud de cita...", false);

    try {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "No se pudo guardar la cita.");
      form.reset();
      hydrateToday();
      showNotice(result.message || "Solicitud registrada. Te contactaremos para confirmar.", false);
      await loadAvailability();
    } catch (error) {
      showNotice(error.message || "No se pudo conectar con la agenda. Intenta de nuevo.", true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function loadAvailability() {
  const service = $("#booking-service")?.value;
  const date = $("#booking-date")?.value;
  const list = $("#slot-list");
  if (!service || !date || !list) return;
  list.innerHTML = '<p class="empty-state">Buscando horarios...</p>';

  try {
    const url = new URL(`${API_BASE}/availability`, window.location.origin);
    url.searchParams.set("service", service);
    url.searchParams.set("date", date);
    const response = await fetch(url);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "No se pudo leer disponibilidad.");
    renderSlots(payload.slots || []);
  } catch (error) {
    list.innerHTML = `<p class="empty-state is-error">${escapeHtml(error.message || "Agenda no disponible.")}</p>`;
  }
}

function renderSlots(slots) {
  const list = $("#slot-list");
  if (!list) return;
  if (!slots.length) {
    list.innerHTML = '<p class="empty-state">No hay horarios disponibles para esta fecha.</p>';
    return;
  }
  list.innerHTML = slots.map((slot, index) => `
    <label class="slot-option">
      <input type="radio" name="time" value="${slot.time}" ${index === 0 ? "checked" : ""}>
      <span>${slot.time}</span>
    </label>
  `).join("");
}

function showNotice(message, isError) {
  const notice = $("#form-notice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-error", Boolean(isError));
  notice.hidden = false;
}

function openVideoModal(videoId, title = "Video informativo") {
  const modal = $("#video-modal");
  const frame = $("#video-frame");
  const heading = $("#video-modal-title");
  if (!modal || !frame) return;
  if (heading) heading.textContent = title;
  frame.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  modal.hidden = false;
}

function closeVideoModal() {
  const modal = $("#video-modal");
  const frame = $("#video-frame");
  if (!modal || !frame) return;
  frame.src = "";
  modal.hidden = true;
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
