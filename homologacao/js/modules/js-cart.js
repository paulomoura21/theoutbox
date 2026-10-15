// js/modules/js-cart.js

export let cart = JSON.parse(localStorage.getItem("cart_mbms")) || [];

export function saveAndRenderCart() {
    localStorage.setItem("cart_mbms", JSON.stringify(cart));
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    const cartBtnText = document.getElementById("cartBtnText");
    if (cartBtnText) cartBtnText.textContent = `CART (${totalItems})`;

    const cartContentArea = document.getElementById("cartPanelContent");
    if (cartContentArea) {
        if (cart.length === 0) {
            cartContentArea.innerHTML = `
                <p style="color: var(--color-light-gray); text-transform: uppercase;">Ainda sem artefatos.</p>
                <button class="btn-neon panel-action-btn" onclick="window.location.href='produtos.html'" style="margin-top: 20px;">EXPLORAR PRODUTOS</button>
            `;
        } else {
            let html = `<div class="cart-items-list">`;
            let totalPrice = 0;

            cart.forEach((item, index) => {
                const subtotal = item.price * item.qty;
                totalPrice += subtotal;
                html += `
                    <div class="cart-item-card">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
                        <div class="cart-item-details">
                            <span class="cart-item-title">${item.title}</span>
                            <span class="cart-item-sub">${item.brand} // TAM: ${item.size} (${item.qty}x)</span>
                            <span class="cart-item-price">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <button class="cart-item-remove" data-index="${index}">&times;</button>
                    </div>
                `;
            });

            html += `</div>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>SUBTOTAL:</span>
                        <span style="color: var(--color-neon);">R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <button class="btn-neon panel-action-btn" style="margin-top: 10px;">FINALIZAR COMPRA</button>
                </div>
            `;

            cartContentArea.innerHTML = html;
            cartContentArea.querySelectorAll(".cart-item-remove").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const idx = parseInt(e.target.getAttribute("data-index"));
                    cart.splice(idx, 1);
                    saveAndRenderCart();
                });
            });
        }
    }
}

export function initCart() {
    saveAndRenderCart();
}