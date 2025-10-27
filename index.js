const overlay = document.getElementById("entryOverlay");
const nameInput = document.getElementById("guestName");
const enterBtn = document.getElementById("enterBtn");
const guestSpan = document.getElementById("guestSpan");
const confirmBtn = document.getElementById("confirmBtn");
const declineBtn = document.getElementById("declineBtn");
const printBtn = document.getElementById("printBtn");
const afterReply = document.getElementById("afterReply");
const toast = document.getElementById("toast");

const STORAGE_KEY = "convite_rsvps_v1";
const NAME_KEY = "convite_env_name";

// --- Utilidades ---
function showToast(msg, time = 2200) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), time);
}

function getQueryParam(key) {
  const p = new URLSearchParams(location.search);
  return p.get(key);
}

// --- Nome do convidado ---
function loadSavedName() {
  try {
    const obj = JSON.parse(localStorage.getItem(NAME_KEY));
    return obj?.name || null;
  } catch {
    return null;
  }
}

function saveNameLocally(name) {
  localStorage.setItem(NAME_KEY, JSON.stringify({ name }));
}

// --- RSVP ---
function saveRSVP(name, status) {
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    list = [];
  }
  list = list.filter((r) => r.name.toLowerCase() !== name.toLowerCase());
  list.push({ name, status, at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function updateRSVP(status) {
  const name = guestSpan.textContent || nameInput.value.trim();
  if (!name) {
    showToast("Confirme seu nome primeiro.");
    return;
  }

  saveRSVP(name, status);

  if (status === "confirmado") {
    afterReply.innerHTML = `<p class="success">🎉 Sua presença foi confirmada! <br> Traga seu traje de banho! Esperamos você 😊</p>`;
    showToast("Presença confirmada. Obrigado!");
  } else {
    afterReply.innerHTML = `<p class="error">💔 Sentiremos sua falta, mas agradecemos pela resposta.</p>`;
    showToast("Status atualizado.");
  }
}

// --- Entrada no convite ---
function enterGuest() {
  const name = nameInput.value.trim();
  if (name.length < 2) {
    showToast("Digite um nome válido.");
    nameInput.focus();
    return;
  }
  guestSpan.textContent = name;
  overlay.style.display = "none";
  saveNameLocally(name);
  showToast(`Bem-vindo(a), ${name}! 🎉`);
}

// --- Inicialização ---
(function init() {
  const qname = getQueryParam("name");
  if (qname) {
    const decoded = decodeURIComponent(qname);
    nameInput.value = decoded;
    enterGuest();
  } else {
    const saved = loadSavedName();
    if (saved) {
      nameInput.value = saved;
    }
  }
})();

// --- Eventos ---
enterBtn.addEventListener("click", enterGuest);
nameInput.addEventListener("keydown", (e) => e.key === "Enter" && enterGuest());

// confirmBtn.addEventListener("click", () => updateRSVP("confirmado"));
// declineBtn.addEventListener("click", () => updateRSVP("nao"));
// printBtn.addEventListener("click", () => window.print());

function openImage(src) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const downloadBtn = document.getElementById("downloadBtn");

  modalImg.src = src;
  downloadBtn.href = src;
  modal.classList.add("show");
}

function closeImage() {
  document.getElementById("imgModal").classList.remove("show");
}
