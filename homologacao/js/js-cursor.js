document.addEventListener("DOMContentLoaded", () => {
    // Não inicializa o cursor customizado em telas touch/mobile
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        return;
    }

    const cursor = document.querySelector(".cursor");

    if (cursor) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        const interactables = document.querySelectorAll("a, button, input, .btn-square, .btn-neon, .expandable-btn, .btn-cookie, .product-card, .size-btn");
        interactables.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
        });
    }
});