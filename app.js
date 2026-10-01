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
    copy: "Laser Fotona para trabajar firmeza, textura y luminosidad con protocolo personalizado. Incluye un facial de obsequio.",
    price: "₡ 175.000 · facial de obsequio",
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
    copy: "Tratamiento laser enfocado en venitas visibles y lesiones vasculares superficiales.",
    price: "Según valoración",
    duration: "Duración aproximada: 60 min"
  }
};

const $ = (selector) => document.querySelector(selector);
const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
let lastMenuTrigger = null;

document.documentElement.classList.add("js-ready");

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindVideos();
  bindHeaderScroll();
  initReveal();
  bindBeautyGoals();
  hydrateTreatmentSelect();
  bindBookingForm();
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
  select.insertAdjacentHTML("beforeend", TREATMENTS
    .map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`)
    .join(""));
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  select.value = requestedService && TREATMENTS.some((item) => item.name === requestedService)
    ? requestedService
    : "";
}

function bindBookingForm() {
  $("#booking-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form).entries());
    const name = String(payload.name || "").trim();
    const phone = String(payload.phone || "").trim();
    const service = String(payload.service || "").trim();
    const note = String(payload.note || "").trim();
    if (!name || !phone || !service) {
      showNotice("Completa tu nombre, teléfono y servicio de interés.", true);
      return;
    }
    const lines = [
      "Hola, me gustaría consultar disponibilidad para una cita en Jenny Delgado Centro Estética Laser.",
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Servicio de interés: ${service}`
    ];
    if (note) lines.push(`Comentario: ${note}`);
    lines.push("Quedo pendiente de la fecha y hora disponibles para confirmar.");
    const url = `https://wa.me/50688840452?text=${encodeURIComponent(lines.join("\n"))}`;
    showNotice("Se abrirá WhatsApp. Envía el mensaje para que podamos confirmar tu cita.", false);
    window.location.assign(url);
  });
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
