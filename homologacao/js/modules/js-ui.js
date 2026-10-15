// js/modules/js-ui.js

export function initUI() {
    // --- 1. REVEAL SCROLL ---
    const reveals = document.querySelectorAll(".reveal-text");
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        reveal.style.opacity = 0;
        reveal.style.transform = "translateY(30px)";
        reveal.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        revealOnScroll.observe(reveal);
    });

    // --- 2. GERENCIAMENTO DE PAINÉIS LATERAIS ---
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");

    const openLoginBtn = document.getElementById("openLoginBtn");
    const openCartBtn = document.getElementById("openCartBtn");
    const loginPanel = document.getElementById("loginPanel");
    const cartPanel = document.getElementById("cartPanel");
    const closePanelBtns = document.querySelectorAll(".closePanelBtn");

    function closeAllPanels() {
        if (menuOverlay) menuOverlay.classList.remove("open");
        if (sideMenu) sideMenu.classList.remove("open");
        if (loginPanel) loginPanel.classList.remove("open");
        if (cartPanel) cartPanel.classList.remove("open");
    }

    function openSidePanel(panel) {
        closeAllPanels();
        if (menuOverlay) menuOverlay.classList.add("open");
        if (panel) panel.classList.add("open");
    }

    if (hamburgerBtn && sideMenu) hamburgerBtn.addEventListener("click", (e) => { e.preventDefault(); openSidePanel(sideMenu); });
    if (openLoginBtn && loginPanel) openLoginBtn.addEventListener("click", (e) => { e.preventDefault(); openSidePanel(loginPanel); });
    if (openCartBtn && cartPanel) openCartBtn.addEventListener("click", (e) => { e.preventDefault(); openSidePanel(cartPanel); });

    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeAllPanels);
    closePanelBtns.forEach(btn => btn.addEventListener("click", closeAllPanels));
    if (menuOverlay) menuOverlay.addEventListener("click", closeAllPanels);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" || event.key === "Esc") {
            closeAllPanels();
            const dashModal = document.getElementById("accountDashboardModal");
            if (dashModal) dashModal.classList.remove("open");
            const productModal = document.getElementById("productDetailModal");
            if (productModal) productModal.classList.remove("open");
        }
    });

    // --- 3. REDIRECIONAMENTO DE BUSCA NA NAV ---
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query !== "") {
                window.location.href = `produtos.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // --- 4. BANNER DE COOKIES ---
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptCookiesBtn = document.getElementById("acceptCookiesBtn");
    const declineCookiesBtn = document.getElementById("declineCookiesBtn");

    if (cookieBanner) {
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            setTimeout(() => { cookieBanner.classList.add("show"); }, 600);
        }
        if (acceptCookiesBtn) acceptCookiesBtn.addEventListener("click", () => { localStorage.setItem("cookieConsent", "accepted"); cookieBanner.classList.remove("show"); });
        if (declineCookiesBtn) declineCookiesBtn.addEventListener("click", () => { localStorage.setItem("cookieConsent", "declined"); cookieBanner.classList.remove("show"); });
    }
    
    // Expõe para uso no módulo de carrinho e produto
    window.uiOpenSidePanel = openSidePanel;
    window.uiCloseAllPanels = closeAllPanels;
}