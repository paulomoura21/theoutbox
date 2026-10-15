// js/js-app.js
import { checkPendingToast } from './modules/js-toast.js';
import { initUI } from './modules/js-ui.js';
import { initCart } from './modules/js-cart.js';
import { setupAuth } from './modules/js-auth.js';
import { initProductModal } from './modules/js-productModal.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicia sistema de notificações pendentes
    checkPendingToast();

    // 2. Inicia interações de UI globais
    initUI();

    // 3. Inicia Carrinho e persistência local
    initCart();

    // 4. Inicia Autenticação Supabase
    setupAuth();

    // 5. Inicia eventos do Modal de Produtos
    initProductModal();
});