document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const correo = e.target.correo.value;
    const password = e.target.password.value;

    if (correo === "" || password === "") {
        alert("Por favor completa todos los campos.");
        return;
    }

    // Aquí puedes redirigir al dashboard
    window.location.href = "dashboard.html";
});