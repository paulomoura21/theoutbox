// js/modules/js-productModal.js
import { cart, saveAndRenderCart } from './js-cart.js';
import { showToast } from './js-toast.js';

export function initProductModal() {
    const productModal = document.getElementById("productDetailModal");
    const btnCloseProductModal = document.getElementById("btnCloseProductModal");
    const cartPanel = document.getElementById("cartPanel");
    
    let currentSelectedProduct = null;
    let selectedSize = "M";

    window.openProductDetail = function(productData) {
        currentSelectedProduct = productData;
        selectedSize = "M";

        if (productModal) {
            document.getElementById("pModalImage").src = productData.imagem || 'photos/tela_inicial_001.png';
            document.getElementById("pModalBrand").textContent = `${productData.marca || 'THE OUT'} / DROP 001`;
            document.getElementById("pModalTitle").textContent = productData.descr_item || 'SHELL 01';
            
            const priceVal = Number(productData.valor || 0);
            document.getElementById("pModalPrice").textContent = `R$ ${priceVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            
            const parcelVal = (priceVal / 6).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            document.getElementById("pModalParcels").textContent = `6x de R$ ${parcelVal} sem juros`;

            document.querySelectorAll(".size-btn").forEach(btn => {
                btn.classList.toggle("active", btn.getAttribute("data-size") === selectedSize);
            });

            productModal.classList.add("open");
        }
    };

    if (btnCloseProductModal) {
        btnCloseProductModal.addEventListener("click", () => productModal.classList.remove("open"));
    }

    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedSize = btn.getAttribute("data-size");
        });
    });

    const btnAddToCartModal = document.getElementById("btnAddToCartModal");
    if (btnAddToCartModal) {
        btnAddToCartModal.addEventListener("click", () => {
            if (!currentSelectedProduct) return;

            const existingIndex = cart.findIndex(item => item.id === currentSelectedProduct.cod_item && item.size === selectedSize);

            if (existingIndex > -1) {
                cart[existingIndex].qty += 1;
            } else {
                cart.push({
                    id: currentSelectedProduct.cod_item || Date.now(),
                    title: currentSelectedProduct.descr_item || 'PRODUTO',
                    brand: currentSelectedProduct.marca || 'THE OUT',
                    price: Number(currentSelectedProduct.valor || 0),
                    image: currentSelectedProduct.imagem || 'photos/tela_inicial_001.png',
                    size: selectedSize,
                    qty: 1
                });
            }

            saveAndRenderCart();
            if (productModal) productModal.classList.remove("open");
            showToast(`ADICIONADO: ${currentSelectedProduct.descr_item || 'ITEM'} (${selectedSize})`, "success");
            
            if (window.uiOpenSidePanel) window.uiOpenSidePanel(cartPanel);
        });
    }
}