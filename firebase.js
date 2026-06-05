import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
setDoc,
deleteDoc,
onSnapshot,
writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsxgboiE95vtGRWGya4R74sAW5auqFnDg",
  authDomain: "spx-field-assistant-v2.firebaseapp.com",
  projectId: "spx-field-assistant-v2",
  storageBucket: "spx-field-assistant-v2.firebasestorage.app",
  messagingSenderId: "783194764099",
  appId: "1:783194764099:web:fc103f085bda19a2e3f5f6",
  measurementId: "G-BRW948QJ09"
};
// ============================================================

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const auth = getAuth(app);

// --- Coleções ---
const COL_VISITS = "spx_visits";
const COL_EQUIPS = "spx_equips";
const COL_KITS   = "spx_kits";
const COL_USERS  = "users";
const COL_VALVE_SPECS = "spx_valve_specs";

let realtimeUnsubscribers = [];

window._db = db;
window._auth = auth;
window.currentUser = null;
window.currentUserProfile = null;
window.currentRole = null;

function isAdminRole(role) {
  return role === "superadmin" || role === "admin";
}

function setLoginMessage(message) {
  const el = document.getElementById("loginMsg");
  if (el) el.textContent = message || "";
}

function setAppVisible(visible) {
  const appShell = document.getElementById("appShell");
  const loginScreen = document.getElementById("loginScreen");

  if (appShell) appShell.style.display = visible ? "grid" : "none";
  if (loginScreen) loginScreen.style.display = visible ? "none" : "flex";
}

function renderCurrentPage() {
  try {
    if (typeof window.updateNavCounts === "function") window.updateNavCounts();
    if (typeof window.renderVisits === "function") window.renderVisits();

    const activePage = document.querySelector(".page.active")?.id?.replace("page-", "");

    if (activePage === "equipamentos" && typeof window.renderEquipPage === "function") {
      window.renderEquipPage();
    }

    if (activePage === "relatorio" && typeof window.renderReportSelectors === "function") {
      window.renderReportSelectors();
    }

    if (activePage === "kits" && typeof window.renderKitsTable === "function") {
      window.renderKitsTable();
    }
  } catch (err) {
    console.warn("Renderização:", err);
  }
}

function applyPermissions() {
  const role = window.currentRole;
  const canSeeAdmin = isAdminRole(role);

  const adminElements = [
    document.getElementById("nav-section-admin"),
    document.getElementById("nav-kits"),
    document.getElementById("nav-config")
  ];

  adminElements.forEach(el => {
    if (el) el.style.display = canSeeAdmin ? "" : "none";
  });

  const userLabel = document.getElementById("currentUserLabel");
  if (userLabel) {
    const profile = window.currentUserProfile || {};
    const roleLabel = role === "superadmin" ? "SuperAdmin" : role === "admin" ? "Admin" : "Técnico";
    userLabel.textContent = `${profile.nome || window.currentUser?.email || "Usuário"} · ${roleLabel}`;
  }

  const currentPage = document.querySelector(".page.active")?.id;
  if (!canSeeAdmin && (currentPage === "page-kits" || currentPage === "page-config")) {
    if (typeof window.navigate === "function") window.navigate("visitas");
  }
}

async function loadUserProfile(uid) {
  const ref = doc(db, COL_USERS, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    setLoginMessage("Usuário sem autorização. Peça ao administrador para cadastrar seu UID na coleção users.");
    await signOut(auth);
    return null;
  }

  const profile = snap.data();

  if (profile.ativo !== true) {
    setLoginMessage("Usuário inativo. Acesso bloqueado.");
    await signOut(auth);
    return null;
  }

  if (!["superadmin", "admin", "tecnico"].includes(profile.role)) {
    setLoginMessage("Perfil inválido. Use role: superadmin, admin ou tecnico.");
    await signOut(auth);
    return null;
  }

  return { uid, ...profile };
}

function stopRealtime() {
  realtimeUnsubscribers.forEach(unsub => {
    try { unsub(); } catch (_) {}
  });
  realtimeUnsubscribers = [];
}

function startRealtime() {
  stopRealtime();

  realtimeUnsubscribers.push(
    onSnapshot(collection(db, COL_VISITS), snap => {
      window.visits = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      renderCurrentPage();
    })
  );

  realtimeUnsubscribers.push(
    onSnapshot(collection(db, COL_EQUIPS), snap => {
      window.equipments = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      renderCurrentPage();
    })
  );

  realtimeUnsubscribers.push(
    onSnapshot(collection(db, COL_KITS), snap => {
      window.kits = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      renderCurrentPage();
    })
  );
}

// --- Helpers Firestore expostos para o código legado ---
window.fsGetAll = async (col) => {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
};

window.fsSave = async (col, item) => {
  await setDoc(doc(db, col, item.id), item);
};

window.fsDelete = async (col, id) => {
  await deleteDoc(doc(db, col, id));
};

  window.fsSaveBatch = async (col, items) => {
  const chunkSize = 500;

  for (let i = 0; i < items.length; i += chunkSize) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + chunkSize);

    chunk.forEach(item => {
      batch.set(doc(db, col, item.id), item);
    });

    await batch.commit();
  }
};

window.fsSubscribe = (col, callback) => {
  return onSnapshot(collection(db, col), (snap) => {
    callback(snap.docs.map(d => ({ ...d.data(), id: d.id })));
  });
};

async function bootstrap() {
  try {
    window.visits      = await window.fsGetAll(COL_VISITS);
    window.equipments  = await window.fsGetAll(COL_EQUIPS);
    window.kits        = await window.fsGetAll(COL_KITS);
  } catch(err) {
    console.error("Firestore:", err);
    window.visits = [];
    window.equipments = [];
    window.kits = [];
  }

  if (typeof window._appInit === "function") window._appInit();
}

async function doLogin() {
  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    setLoginMessage("Informe e-mail e senha.");
    return;
  }

  try {
    setLoginMessage("Entrando...");
    await signInWithEmailAndPassword(auth, email, password);
  } catch(err) {
    console.error("Login:", err);
    setLoginMessage("E-mail ou senha inválidos.");
  }
}

window.appLogout = async () => {
  await signOut(auth);
};

window.addEventListener("DOMContentLoaded", () => {
  setAppVisible(false);

  document.getElementById("btnLogin")?.addEventListener("click", doLogin);

  document.getElementById("loginPassword")?.addEventListener("keydown", e => {
    if (e.key === "Enter") doLogin();
  });

  document.getElementById("loginEmail")?.addEventListener("keydown", e => {
    if (e.key === "Enter") doLogin();
  });

  document.getElementById("btnLogout")?.addEventListener("click", async () => {
    await signOut(auth);
  });
});

onAuthStateChanged(auth, async (user) => {
  stopRealtime();

  if (!user) {
    window.currentUser = null;
    window.currentUserProfile = null;
    window.currentRole = null;
    window.visits = [];
    window.equipments = [];
    window.kits = [];
    setAppVisible(false);
    applyPermissions();
    return;
  }

  try {
    const profile = await loadUserProfile(user.uid);
    if (!profile) return;

    window.currentUser = user;
    window.currentUserProfile = profile;
    window.currentRole = profile.role;

    setLoginMessage("");
    setAppVisible(true);

    await bootstrap();
    applyPermissions();
    startRealtime();

    console.log("Firebase conectado!");
    console.log("Projeto:", firebaseConfig.projectId);
    console.log("Usuário:", user.email, "Perfil:", profile.role);
  } catch(err) {
    console.error("Autenticação:", err);
    setLoginMessage("Erro ao validar usuário.");
    await signOut(auth);
  }
});
