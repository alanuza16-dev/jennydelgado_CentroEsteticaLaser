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

const BEAUTY_GOALS = {
  luminosidad: {
    label: "Luminosidad",
    title: "Korean Glass Skin",
    copy: "Protocolo orientado a luminosidad, textura uniforme y acabado radiante.",
    price: "Desde CRC 40.000",
    duration: "Duración aproximada: 120 min"
  },
  textura: {
    label: "Textura",
    title: "Dermapen Skin Booster",
    copy: "Microneedling para mejorar textura, poros, líneas finas e hidratación.",
    price: "Desde CRC 45.000",
    duration: "Duración aproximada: 120 min"
  },
  rejuvenecimiento: {
    label: "Rejuvenecimiento",
    title: "Fotona Total Rejuvenation",
    copy: "Láser Fotona para trabajar firmeza, textura y luminosidad con protocolo personalizado.",
    price: "CRC 350.000",
    duration: "Duración aproximada: 120 min"
  },
  firmeza: {
    label: "Firmeza corporal",
    title: "TightSculpting Fotona",
    copy: "Tratamiento no invasivo para tensar piel y apoyar remodelación corporal.",
    price: "Según valoración",
    duration: "Duración aproximada: 120 min"
  },
  vello: {
    label: "Vello",
    title: "Silk Skin Laser",
    copy: "Reducción progresiva del vello con enfoque en seguridad y precisión.",
    price: "Desde CRC 50.000",
    duration: "Duración aproximada: 60 min"
  },
  vascular: {
    label: "Lesiones vasculares",
    title: "Arañitas / Telangiectasias",
    copy: "Tratamiento láser enfocado en venitas visibles y lesiones vasculares superficiales.",
    price: "Según valoración",
    duration: "Duración aproximada: 60 min"
  }
};

const $ = (selector) => document.querySelector(selector);
const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
let lastMenuTrigger = null;
let bookingStep = 1;

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindVideos();
  bindHeaderScroll();
  initReveal();
  bindBeautyGoals();
  hydrateTreatmentSelect();
  hydrateToday();
  bindBookingForm();
  bindBookingSummary();
  loadAvailability();
  initMobileBookingFlow();
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

  const nav = $("#main-nav");
  const button = $("#mobile-menu-toggle");
  button?.addEventListener("click", toggleMobileMenu);
  nav?.addEventListener("click", (event) => {
    const closeTarget = event.target.closest("[data-close-menu]");
    if (event.target === nav) {
      closeMobileMenu({ restoreFocus: false });
      return;
    }
    if (!closeTarget) return;
    if (handleMobileHashNavigation(closeTarget, event)) return;
    closeMobileMenu({ restoreFocus: false });
  });
  nav?.addEventListener("keydown", trapMobileMenuFocus);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) closeMobileMenu();
  });
  window.addEventListener("pageshow", () => closeMobileMenu({ restoreFocus: false }));
  window.addEventListener("hashchange", () => closeMobileMenu({ restoreFocus: false }));
}

function toggleMobileMenu() {
  const nav = $("#main-nav");
  if (!nav?.hasAttribute("data-open")) return openMobileMenu();
  closeMobileMenu();
}

function openMobileMenu() {
  const nav = $("#main-nav");
  const button = $("#mobile-menu-toggle");
  if (!nav || !button) return;
  lastMenuTrigger = document.activeElement;
  resetMobileMenuPanel(nav);
  nav.setAttribute("data-open", "");
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-label", "Cerrar menú");
  document.body.classList.add("nav-open");
  window.requestAnimationFrame(() => nav.querySelector("[data-close-menu], a[href], button")?.focus());
}

function closeMobileMenu(options = {}) {
  const nav = $("#main-nav");
  const button = $("#mobile-menu-toggle");
  if (!nav || !button) return;
  nav.removeAttribute("data-open");
  resetMobileMenuPanel(nav);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("nav-open");
  if (nav.contains(document.activeElement)) document.activeElement.blur();
  if (options.restoreFocus !== false) (lastMenuTrigger || button).focus?.();
}

function resetMobileMenuPanel(nav) {
  nav.scrollTop = 0;
  const shell = nav.querySelector(".mobile-menu-shell");
  if (shell) shell.scrollTop = 0;
}

function handleMobileHashNavigation(target, event) {
  const link = target.closest("a[href]");
  if (!link) return false;
  const destination = new URL(link.getAttribute("href"), window.location.href);
  const samePage = destination.origin === window.location.origin && destination.pathname === window.location.pathname;
  if (!samePage || !destination.hash) return false;
  const section = document.querySelector(destination.hash);
  if (!section) return false;
  event.preventDefault();
  closeMobileMenu({ restoreFocus: false });
  window.history.pushState(null, "", destination.hash);
  window.requestAnimationFrame(() => {
    const headerHeight = $(".site-header")?.getBoundingClientRect().height || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  });
  return true;
}

function trapMobileMenuFocus(event) {
  if (event.key !== "Tab" || !document.body.classList.contains("nav-open")) return;
  const nav = $("#main-nav");
  const items = Array.from(nav?.querySelectorAll(focusableSelector) || [])
    .filter((item) => item.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function bindHeaderScroll() {
  const header = $(".site-header");
  if (!header) return;
  const sync = () => header.toggleAttribute("data-condensed", window.scrollY > 24);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  items.forEach((item) => observer.observe(item));
}

function bindBeautyGoals() {
  document.querySelectorAll("[data-beauty-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-beauty-goal]").forEach((item) => item.classList.toggle("is-active", item === button));
      renderBeautyGoal(button.dataset.beautyGoal);
    });
  });
}

function renderBeautyGoal(key) {
  const goal = BEAUTY_GOALS[key] || BEAUTY_GOALS.luminosidad;
  if ($("#beauty-goal-label")) $("#beauty-goal-label").textContent = goal.label;
  if ($("#beauty-goal-title")) $("#beauty-goal-title").textContent = goal.title;
  if ($("#beauty-goal-copy")) $("#beauty-goal-copy").textContent = goal.copy;
  if ($("#beauty-goal-price")) $("#beauty-goal-price").textContent = goal.price;
  if ($("#beauty-goal-duration")) $("#beauty-goal-duration").textContent = goal.duration;
  if ($("#beauty-goal-link")) $("#beauty-goal-link").href = `agenda.html?service=${encodeURIComponent(goal.title)}`;
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
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  if (requestedService && TREATMENTS.some((item) => item.name === requestedService)) {
    select.value = requestedService;
  }
  select.addEventListener("change", loadAvailability);
  select.addEventListener("change", updateBookingSummary);
  updateBookingSummary();
}

function hydrateToday() {
  const date = $("#booking-date");
  if (!date) return;
  const today = toDateInput(new Date());
  date.min = today;
  date.value = today;
  date.addEventListener("change", loadAvailability);
  date.addEventListener("change", updateBookingSummary);
}

function bindBookingSummary() {
  $("#slot-list")?.addEventListener("change", updateBookingSummary);
  updateBookingSummary();
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
      updateBookingSummary();
      showNotice(result.message || "Solicitud registrada. Te contactaremos para confirmar.", false);
      await loadAvailability();
      setBookingStep(5);
    } catch (error) {
      showNotice(error.message || "No se pudo conectar con la agenda. Intenta de nuevo.", true);
    } finally {
      submitButton.disabled = false;
    }
  });
}

function initMobileBookingFlow() {
  const form = $("#booking-form");
  if (!form) return;
  $("#booking-prev")?.addEventListener("click", () => setBookingStep(Math.max(1, bookingStep - 1)));
  $("#booking-next")?.addEventListener("click", () => {
    if (!validateBookingStep(bookingStep)) return;
    if (bookingStep >= 4) {
      form.requestSubmit();
      return;
    }
    setBookingStep(bookingStep + 1);
  });
  form.addEventListener("change", () => updateBookingStepControls());
  setBookingStep(1);
}

function setBookingStep(step) {
  const form = $("#booking-form");
  if (!form) return;
  bookingStep = Math.min(5, Math.max(1, Number(step) || 1));
  form.dataset.bookingStep = String(bookingStep);
  document.querySelectorAll("[data-progress-step]").forEach((item) => {
    const itemStep = Number(item.dataset.progressStep);
    item.classList.toggle("is-active", itemStep === bookingStep);
    item.classList.toggle("is-complete", itemStep < bookingStep);
  });
  updateBookingStepControls();
  if (window.matchMedia("(max-width: 760px)").matches) {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateBookingStepControls() {
  const prev = $("#booking-prev");
  const next = $("#booking-next");
  if (prev) prev.disabled = bookingStep <= 1 || bookingStep >= 5;
  if (next) {
    next.hidden = bookingStep >= 5;
    next.textContent = bookingStep >= 4 ? "Solicitar confirmación" : "Continuar";
  }
}

function validateBookingStep(step) {
  if (step === 1 && !$("#booking-service")?.value) {
    showNotice("Selecciona un tratamiento para continuar.", true);
    return false;
  }
  if (step === 2 && !$("#booking-date")?.value) {
    showNotice("Selecciona una fecha para continuar.", true);
    return false;
  }
  if (step === 3 && !document.querySelector("[name='time']:checked")) {
    showNotice("Selecciona una hora disponible para continuar.", true);
    return false;
  }
  return true;
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
  updateBookingSummary();
}

function showNotice(message, isError) {
  const notice = $("#form-notice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-error", Boolean(isError));
  notice.hidden = false;
}

function updateBookingSummary() {
  const serviceName = $("#booking-service")?.value || TREATMENTS[0].name;
  const treatment = TREATMENTS.find((item) => item.name === serviceName) || TREATMENTS[0];
  const date = $("#booking-date")?.value || "";
  const time = document.querySelector("[name='time']:checked")?.value || "";
  if ($("#summary-service")) $("#summary-service").textContent = treatment.name;
  if ($("#summary-price")) $("#summary-price").textContent = treatment.price;
  if ($("#summary-duration")) $("#summary-duration").textContent = `${treatment.duration} min aprox.`;
  if ($("#summary-date")) $("#summary-date").textContent = date ? formatDate(date) : "Selecciona una fecha";
  if ($("#summary-time")) $("#summary-time").textContent = time || "Selecciona una hora";
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

function formatDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("es-CR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(year, month - 1, day));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
