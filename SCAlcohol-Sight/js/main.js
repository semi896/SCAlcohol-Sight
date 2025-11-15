// js/main.js

// Usuario demo válido (puedes cambiarlo o integrarlo con backend más adelante)
const DEMO_USER = {
  email: "admin@mail.com",
  password: "123456"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMessage");
  const btnDemo = document.getElementById("btnDemo");

  if (btnDemo) {
    btnDemo.addEventListener("click", () => {
      document.getElementById("email").value = DEMO_USER.email;
      document.getElementById("password").value = DEMO_USER.password;
      msg.textContent = "Credenciales de demo rellenadas.";
      msg.style.color = "#0a6"; // verde
    });
  }

  if (!form) return;

  form.addEventListener("submit", (ev) => {
    ev.preventDefault(); // evita recargar la página

    // obtener valores
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // validaciones simples
    if (!email || !password) {
      showMessage("Completa todos los campos.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Introduce un correo válido.", "error");
      return;
    }

    // Validación contra demo (reemplazar por llamada al backend si existe)
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      // "loguear" (simulación)
      localStorage.setItem("scalcohol_logged", "true");
      localStorage.setItem("scalcohol_user", JSON.stringify({ email }));

      showMessage("Inicio de sesión correcto. Redirigiendo...", "success");
      // esperar 700ms para que el usuario vea el mensaje
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
      return;
    }

    showMessage("Correo o contraseña incorrectos.", "error");
  });

  function showMessage(text, type) {
    if (!msg) return;
    msg.textContent = text;
    if (type === "success") {
      msg.style.color = "#0a6";
    } else {
      msg.style.color = "#c00";
    }
  }

  function isValidEmail(email) {
    // comprobación básica de formato
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});