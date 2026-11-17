
document.addEventListener("DOMContentLoaded", function () {

    // Atualiza o ano automaticamente
    const ano = document.getElementById("year");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }

    // Destaca a página atual no menu
    let pagina = window.location.pathname.split("/").pop();

    if (pagina === "") {
        pagina = "index.html";
    }

    document.querySelectorAll("nav a").forEach(function (link) {
        if (link.getAttribute("href") === pagina) {
            link.style.color = "#ffffff";
            link.setAttribute("aria-current", "page");
        }
    });

});
