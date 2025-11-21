// main.js - manejador común para la demo

const DEMO_USER = { email: "demo@gmail.com", password: "123456", name: "Usuario Demo" };

document.addEventListener("DOMContentLoaded", () => {
  // --- Login page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const demoBtn = document.getElementById("demoBtn");
    if (demoBtn) demoBtn.addEventListener("click", fillDemo);

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = (document.getElementById("email").value || "").trim();
      const pass = (document.getElementById("password").value || "").trim();
      if (!email || !pass) return alert("Completa todos los campos");
      if (email === DEMO_USER.email && pass === DEMO_USER.password) {
        localStorage.setItem("sc_user", JSON.stringify({ email: DEMO_USER.email, name: DEMO_USER.name }));
        localStorage.setItem("sc_logged", "1");
        window.location.href = "dashboard.html";
      } else {
        alert("Credenciales incorrectas");
      }
    });
  }

  // --- Signup page
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("su_name").value.trim();
      const email = document.getElementById("su_email").value.trim();
      const pass = document.getElementById("su_password").value.trim();
      if (!name || !email || !pass) return alert("Completa todos los campos");
      // guardamos demo-locally (en proyecto real: enviar al backend)
      localStorage.setItem("sc_user", JSON.stringify({ name, email }));
      localStorage.setItem("sc_logged", "1");
      alert("Cuenta creada. Redirigiendo al Dashboard...");
      window.location.href = "dashboard.html";
    });
  }

  // --- Usertype selection
  const tipoButtons = document.querySelectorAll(".tipo");
  if (tipoButtons.length) {
    tipoButtons.forEach(b => b.addEventListener("click", () => {
      const role = b.getAttribute("data-role");
      const user = JSON.parse(localStorage.getItem("sc_user") || "{}");
      user.role = role;
      localStorage.setItem("sc_user", JSON.stringify(user));
      alert("Seleccionado: " + role);
      // ir a signup o login segun lo desees
      window.location.href = "signup.html";
    }));
  }

  // --- Dashboard protection + initialization
  if (location.pathname.includes("dashboard.html")) {
    const logged = localStorage.getItem("sc_logged");
    if (!logged) { window.location.href = "login.html"; return; }
    const u = JSON.parse(localStorage.getItem("sc_user") || "{}");
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("sc_logged");
      window.location.href = "login.html";
    });
    const simulateBtn = document.getElementById("simulateBtn");
    if (simulateBtn) simulateBtn.addEventListener("click", () => {
      const level = simulateScanResult();
      addToHistory(level);
      refreshDashboard();
    });
  }

  // --- Scan page
  if (location.pathname.includes("scan.html")) {
    const startScan = document.getElementById("startScan");
    if (startScan) {
      startScan.addEventListener("click", () => {
        const result = simulateScanResult();
        document.getElementById("scanResult").textContent = result + "%";
        addToHistory(result);
      });
    }
  }

  // --- History page
  if (location.pathname.includes("history.html")) {
    renderHistory();
    const clearBtn = document.getElementById("clearHistory");
    if (clearBtn) clearBtn.addEventListener("click", () => {
      if (!confirm("Borrar todo el historial?")) return;
      localStorage.removeItem("sc_history");
      renderHistory();
    });
  }

  // --- Profile page
  if (location.pathname.includes("profile.html")) {
    const usr = JSON.parse(localStorage.getItem("sc_user") || "{}");
    document.getElementById("p_name").textContent = usr.name || "—";
    document.getElementById("p_email").textContent = usr.email || "—";
    document.getElementById("p_role").textContent = usr.role || "—";
    const edit = document.getElementById("editProfile");
    if (edit) edit.addEventListener("click", () => alert("Edición simulada. En producción editaría datos via backend."));
  }
});

// -------------- helpers ---------------
function fillDemo() {
  document.getElementById("email").value = DEMO_USER.email;
  document.getElementById("password").value = DEMO_USER.password;
}

function simulateScanResult(){
  // genera un resultado entre 0.00 y 0.15 (porcentaje)
  const val = (Math.random() * 0.15);
  const pct = (val*100).toFixed(2);
  return pct; // ejemplo: "2.34" (porcentaje)
}

function addToHistory(pct){
  const now = new Date().toLocaleString();
  const item = { ts: now, value: pct };
  const hist = JSON.parse(localStorage.getItem("sc_history") || "[]");
  hist.unshift(item);
  localStorage.setItem("sc_history", JSON.stringify(hist.slice(0,50))); // guardamos max 50
}

function renderHistory(){
  const list = document.getElementById("historyList");
  if (!list) return;
  const hist = JSON.parse(localStorage.getItem("sc_history") || "[]");
  list.innerHTML = "";
  if (!hist.length) {
    list.innerHTML = "<li class='muted'>No hay registros</li>";
    return;
  }
  hist.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${h.ts} — ${h.value}%`;
    list.appendChild(li);
  });
}

function refreshDashboard(){
  const hist = JSON.parse(localStorage.getItem("sc_history") || "[]");
  const levelEl = document.getElementById("alcLevel");
  const summaryEl = document.getElementById("summary");
  const recEl = document.getElementById("recommend");

  if (!hist.length) {
    if (levelEl) levelEl.textContent = "0.00%";
    if (summaryEl) summaryEl.textContent = "No hay registros recientes.";
    if (recEl) recEl.textContent = "Sin datos.";
    return;
  }
  const last = hist[0];
  if (levelEl) levelEl.textContent = last.value + "%";
  summaryEl.textContent = `${hist.length} registro(s). Último: ${last.ts}`;
  const v = parseFloat(last.value);
  if (v < 0.5) recEl.textContent = "Nivel seguro.";
  else if (v < 1.5) recEl.textContent = "Precaución. Evita conducir.";
  else recEl.textContent = "Alto riesgo. Solicita ayuda.";
}
