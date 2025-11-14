function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    if (email === "admin@mail.com" && pass === "123456") {
        window.location.href = "dashboard.html";
    } else {
        msg.textContent = "Correo o contraseña incorrectos.";
    }
}

function simularNivel() {
    const nivel = (Math.random() * 0.15).toFixed(3);
    document.getElementById("nivelActual").textContent = nivel + "%";

    const li = document.createElement("li");
    li.textContent = "Nivel registrado: " + nivel + "%";
    document.getElementById("historial").appendChild(li);
}
