// js/modules/js-auth.js

export function setupAuth() {
    const accountBtnText = document.getElementById("accountBtnText");
    const savedUser = JSON.parse(localStorage.getItem("user_mbms"));

    function updateAccountUI(userData) {
        const isUserPage = window.location.pathname.includes("user_page.html");
        
        if (userData && userData.nome) {
            const firstName = userData.nome.trim().split(" ")[0];
            if (accountBtnText) accountBtnText.textContent = firstName.toUpperCase();
            
            const dName = document.getElementById("userDashFirstName");
            if(dName) dName.textContent = firstName.toUpperCase();
            const dFullName = document.getElementById("userDashFullName");
            if(dFullName) dFullName.textContent = userData.nome;
            const dEmail = document.getElementById("userDashEmail");
            if(dEmail) dEmail.textContent = userData.email || "";
        } else {
            if (accountBtnText) accountBtnText.textContent = "ACCOUNT";
            if (isUserPage) {
                window.location.href = "index.html";
            }
        }
    }

    // 1. LOGOUT GERAL
    async function handleLogout() {
        if (window.supabaseClient) await window.supabaseClient.auth.signOut();
        localStorage.removeItem("user_mbms");
        localStorage.setItem("toast_msg", JSON.stringify({ text: "SESSÃO ENCERRADA // VOCÊ FOI DESLOGADO.", type: "success" }));
        window.location.href = "index.html";
    }

    const btnDashSairConta = document.getElementById("btnDashSairConta");
    if (btnDashSairConta) btnDashSairConta.addEventListener("click", handleLogout);

    if (savedUser) updateAccountUI(savedUser);

    // 2. LÓGICA DE ABERTURA DOS 6 PAINÉIS LATERAIS DO DASHBOARD
    const panelsToBind = [
        { btn: document.getElementById("btnOpenProfilePanel"), panel: document.getElementById("profilePanel") },
        { btn: document.getElementById("btnOpenCartPanel"), panel: document.getElementById("cartPanel") },
        { btn: document.getElementById("btnOpenOrdersPanel"), panel: document.getElementById("ordersPanel") },
        { btn: document.getElementById("btnOpenAddressPanel"), panel: document.getElementById("addressPanel") },
        { btn: document.getElementById("btnOpenPaymentsPanel"), panel: document.getElementById("paymentsPanel") },
        { btn: document.getElementById("btnOpenSupportPanel"), panel: document.getElementById("supportPanel") }
    ];

    panelsToBind.forEach(item => {
        if (item.btn && item.panel) {
            item.btn.addEventListener("click", (e) => {
                e.preventDefault();
                if(window.uiOpenSidePanel) {
                    window.uiOpenSidePanel(item.panel);
                } else {
                    item.panel.classList.add("open");
                }
            });
        }
    });

    // Garante que o botão X feche qualquer painel aberto
    document.querySelectorAll('.closePanelBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parentPanel = e.target.closest('.side-panel');
            if (parentPanel) parentPanel.classList.remove('open');
            if (window.uiCloseAllPanels) window.uiCloseAllPanels();
        });
    });

    // 3. LÓGICA DE UPLOAD, POP-UPS E CONTROLE DA FOTO DE PERFIL
    const userAvatarContainer = document.getElementById("userAvatarContainer");
    const avatarUploadInput = document.getElementById("avatarUploadInput");
    const avatarActionPanel = document.getElementById("avatarActionPanel");
    const btnViewAvatar = document.getElementById("btnViewAvatar");
    const btnChangeAvatar = document.getElementById("btnChangeAvatar");
    const btnDeleteAvatar = document.getElementById("btnDeleteAvatar");

    const imageLightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const avatarPreviewModal = document.getElementById("avatarPreviewModal");
    const avatarPreviewImg = document.getElementById("avatarPreviewImg");
    const btnCancelUpload = document.getElementById("btnCancelUpload");
    const btnConfirmUpload = document.getElementById("btnConfirmUpload");

    let currentAvatarUrl = null;
    let pendingUploadFileExt = null;
    let cropper = null;

    if (imageLightbox) {
        imageLightbox.addEventListener("click", (e) => {
            if (e.target === imageLightbox) {
                imageLightbox.classList.remove("open");
            }
        });
    }

    async function loadUserAvatar(userId) {
        const { data } = await window.supabaseClient.from('mbms_usuarios').select('avatar_url').eq('usuario_id', userId).single();
        if (data && data.avatar_url) applyAvatarToUI(data.avatar_url);
    }

    function applyAvatarToUI(url) {
        currentAvatarUrl = url;
        let img = userAvatarContainer.querySelector(".real-avatar-img");
        if (!img) {
            img = document.createElement("img");
            img.className = "real-avatar-img";
            userAvatarContainer.appendChild(img);
        }
        img.src = url + "?t=" + new Date().getTime(); 
        userAvatarContainer.classList.add("has-photo");
        const defaultIcon = userAvatarContainer.querySelector(".default-avatar-icon");
        if(defaultIcon) defaultIcon.style.display = "none";
    }

    function removeAvatarFromUI() {
        currentAvatarUrl = null;
        const img = userAvatarContainer.querySelector(".real-avatar-img");
        if (img) img.remove();
        userAvatarContainer.classList.remove("has-photo");
        const defaultIcon = userAvatarContainer.querySelector(".default-avatar-icon");
        if(defaultIcon) defaultIcon.style.display = "block";
    }

    if (userAvatarContainer && avatarUploadInput) {
        if (savedUser) loadUserAvatar(savedUser.id);

        userAvatarContainer.addEventListener("click", () => {
            if (userAvatarContainer.classList.contains("has-photo")) {
                if (window.uiOpenSidePanel) window.uiOpenSidePanel(avatarActionPanel);
                else avatarActionPanel.classList.add("open");
            } else {
                avatarUploadInput.click();
            }
        });

        if (btnViewAvatar) {
            btnViewAvatar.addEventListener("click", () => {
                if (currentAvatarUrl && imageLightbox && lightboxImg) {
                    lightboxImg.src = currentAvatarUrl;
                    imageLightbox.classList.add("open");
                }
                avatarActionPanel.classList.remove("open");
            });
        }

        if (btnChangeAvatar) {
            btnChangeAvatar.addEventListener("click", () => {
                avatarUploadInput.click();
                avatarActionPanel.classList.remove("open");
            });
        }

        if (btnDeleteAvatar) {
            btnDeleteAvatar.addEventListener("click", async () => {
                if (!savedUser) return;
                avatarActionPanel.classList.remove("open");
                if(window.showToast) window.showToast("EXCLUINDO ARQUIVO VISUAL...", "success");

                if (currentAvatarUrl) {
                    const fileName = currentAvatarUrl.split('/').pop().split('?')[0];
                    await window.supabaseClient.storage.from('usuarios').remove([fileName]);
                }

                const { error } = await window.supabaseClient.from('mbms_usuarios').update({ avatar_url: null }).eq('usuario_id', savedUser.id);
                if (!error) {
                    removeAvatarFromUI();
                    if(window.showToast) window.showToast("IDENTIDADE VISUAL REMOVIDA.", "success");
                }
            });
        }

        avatarUploadInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file || !savedUser) return;

            pendingUploadFileExt = file.name.split('.').pop();

            const reader = new FileReader();
            reader.onload = function(event) {
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
                
                avatarPreviewImg.src = event.target.result;
                avatarPreviewModal.classList.add("open");

                cropper = new Cropper(avatarPreviewImg, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: false,
                    center: false,
                    highlight: false,
                    cropBoxMovable: false,
                    cropBoxResizable: false,
                    toggleDragModeOnDblclick: false,
                });
            };
            reader.readAsDataURL(file);
            e.target.value = ''; 
        });

        if (btnCancelUpload) {
            btnCancelUpload.addEventListener("click", () => {
                if (cropper) cropper.destroy();
                cropper = null;
                avatarPreviewModal.classList.remove("open");
            });
        }

        if (btnConfirmUpload) {
            btnConfirmUpload.addEventListener("click", async () => {
                if (!cropper || !savedUser) return;

                btnConfirmUpload.disabled = true;
                btnConfirmUpload.textContent = "PROCESSANDO...";

                const canvas = cropper.getCroppedCanvas({
                    width: 600,
                    height: 600,
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high',
                });

                canvas.toBlob(async (blob) => {
                    avatarPreviewModal.classList.remove("open");
                    if(window.showToast) window.showToast("ENVIANDO PARA O ARQUIVO...", "success");

                    const fileName = `avatar_${savedUser.id}_${Date.now()}.${pendingUploadFileExt || 'jpg'}`;

                    const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
                        .from('usuarios')
                        .upload(fileName, blob, { upsert: true, contentType: blob.type });

                    btnConfirmUpload.disabled = false;
                    btnConfirmUpload.textContent = "CORTAR E ENVIAR";

                    if (uploadError) {
                        if(window.showToast) window.showToast("ERRO AO ENVIAR ARQUIVO.", "error");
                        return;
                    }

                    const { data: { publicUrl } } = window.supabaseClient.storage.from('usuarios').getPublicUrl(fileName);
                    const { error: updateError } = await window.supabaseClient.from('mbms_usuarios').update({ avatar_url: publicUrl }).eq('usuario_id', savedUser.id);

                    if (updateError) {
                        if(window.showToast) window.showToast("ERRO AO VINCULAR ARQUIVO.", "error");
                        return;
                    }

                    applyAvatarToUI(publicUrl);
                    if (cropper) { cropper.destroy(); cropper = null; }
                    
                    if(window.showToast) window.showToast("IDENTIDADE VISUAL ATUALIZADA.", "success");
                }, 'image/jpeg', 0.9);
            });
        }
    }
}