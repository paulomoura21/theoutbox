// js/modules/js-toast.js

export function showToast(text, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-message ${type === "error" ? "error" : ""}`;
    
    const iconColor = type === "error" ? "#ff3333" : "var(--color-neon)";
    toast.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${text}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

export function checkPendingToast() {
    const pendingToast = localStorage.getItem("toast_msg");
    if (pendingToast) {
        const toastData = JSON.parse(pendingToast);
        setTimeout(() => showToast(toastData.text, toastData.type), 300);
        localStorage.removeItem("toast_msg");
    }
}

// Expõe globalmente apenas se necessário pelo HTML legado
window.showToast = showToast;