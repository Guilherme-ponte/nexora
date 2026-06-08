/* =============================================
   NEXORA — Configuração do Firebase / Firestore
   =============================================

   COMO CONFIGURAR (passo a passo):
   ─────────────────────────────────
   1. Acesse https://console.firebase.google.com
   2. Clique em "Criar projeto" → dê um nome (ex: "nexora-db")
   3. Desative o Google Analytics (opcional) → Criar projeto
   4. No painel, clique em "Firestore Database" (menu lateral)
   5. Clique em "Criar banco de dados"
      → Selecione "Iniciar no modo de teste"
      → Escolha a região "southamerica-east1 (São Paulo)"
   6. Volte ao painel → clique no ícone </> (Web)
   7. Registre o app (dê qualquer apelido, ex: "nexora-web")
   8. COPIE o objeto firebaseConfig que aparecer e cole abaixo
   ============================================= */

const firebaseConfig = {
  apiKey:            "AIzaSyCZcocm_cqMSX-pMYQ8_e6no_s8usXVGXc",
  authDomain:        "nexora-db-148dc.firebaseapp.com",
  projectId:         "nexora-db-148dc",
  storageBucket:     "nexora-db-148dc.firebasestorage.app",
  messagingSenderId: "979392892706",
  appId:             "1:979392892706:web:ad2bf216f05eb2cc189f7b"
};

/* ── Inicialização ────────────────────────────────────────────
   Não edite abaixo desta linha.
   ──────────────────────────────────────────────────────────── */
(function () {
  const notConfigured =
    !firebaseConfig.apiKey ||
    firebaseConfig.apiKey === 'COLE_AQUI' ||
    firebaseConfig.apiKey.trim() === '';

  if (notConfigured) {
    console.warn(
      '[Nexora] Firebase não configurado.\n' +
      'Edite js/firebase-config.js e cole as chaves do seu projeto.\n' +
      'O site funcionará normalmente com localStorage enquanto isso.'
    );
    window._nexoraFirestoreReady = false;
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
    window.firestoreDB = firebase.firestore();
    window._nexoraFirestoreReady = true;
    console.log('[Nexora] Firebase inicializado ✓');
  } catch (e) {
    console.error('[Nexora] Erro ao inicializar Firebase:', e.message);
    window._nexoraFirestoreReady = false;
  }
})();
