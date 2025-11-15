document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "123") {
        window.location.href = "index.html";  
    } else {
        document.getElementById("error-msg").textContent = "Credenciales incorrectas";
    }
});
