/* =============================================
   NEXORA — App Controller
   ============================================= */

/* --- App State --- */
let currentUser = null;
let currentView = 'login';
let currentCourseId = null;
let currentLessonId = null;
let currentFilter = 'all';
let editingCourseId = null;
let lessonDrafts = [];

/* --- Session --- */
function loadSession() {
  try {
    const s = sessionStorage.getItem('nexora_session');
    if (s) currentUser = JSON.parse(s);
  } catch {}
}

function saveSession(user) {
  currentUser = user;
  sessionStorage.setItem('nexora_session', JSON.stringify(user));
}

function clearSession() {
  currentUser = null;
  sessionStorage.removeItem('nexora_session');
}

/* =============================================
   NOTIFICATIONS
   ============================================= */
let notifTimer = null;
function showNotification(message, type = 'info') {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification ${type}`;
  if (notifTimer) clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.className = 'notification hidden'; }, 3500);
}

/* =============================================
   MODAL
   ============================================= */
function showModal(html, onClose) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.classList.remove('hidden');
  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(onClose));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(onClose); });
}

function closeModal(cb) {
  document.getElementById('modal-overlay').classList.add('hidden');
  if (cb) cb();
}

/* =============================================
   ROUTER
   ============================================= */
function navigate(view, params = {}) {
  if (params.courseId !== undefined) currentCourseId = params.courseId;
  if (params.lessonId !== undefined) currentLessonId = params.lessonId;
  currentView = view;
  render();
  window.scrollTo(0, 0);
}

/* =============================================
   UTILITIES
   ============================================= */
function formatPrice(price) {
  if (!price || price === 0) return '<span class="free">Grátis</span>';
  return 'R$ ' + price.toFixed(2).replace('.', ',');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function avatarHtml(user, size = 36) {
  const color = user.color || '#6366f1';
  return `<div class="sidebar-avatar" style="background:${color};color:#fff;width:${size}px;height:${size}px;font-size:${Math.round(size*0.38)}px">${getInitials(user.name)}</div>`;
}

function starRating(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function thumbClass(thumb) {
  const valid = ['js','react','python','design','node','sql','php','vue'];
  return valid.includes(thumb) ? thumb : 'default';
}

function thumbEmoji(thumb) {
  const map = { js:'⚡', react:'⚛️', python:'🐍', design:'🎨', node:'🟢', sql:'🗄️', php:'🐘', vue:'💚', default:'📚' };
  return map[thumb] || map.default;
}

/* =============================================
   RENDER — MAIN ROUTER
   ============================================= */
function render() {
  const app = document.getElementById('app');
  if (!currentUser) {
    if (currentView === 'register') { app.innerHTML = renderRegister(); }
    else { app.innerHTML = renderLogin(); }
    attachAuthEvents();
    return;
  }
  if (currentUser.role === 'teacher') {
    renderTeacherLayout(app);
  } else {
    renderStudentLayout(app);
  }
}

/* =============================================
   AUTH VIEWS
   ============================================= */
function renderLogin() {
  return `
  <div class="auth-page fade-in">
    <div class="auth-left">
      <div class="logo">Ne<span>x</span>ora</div>
      <h1>Aprenda sem limites.<br>Ensine com impacto.</h1>
      <p>A plataforma completa para cursos online. Acesse milhares de conteúdos ou crie seu próprio curso e transforme vidas.</p>
      <div class="auth-features">
        <div class="auth-feature">
          <div class="auth-feature-icon">🎓</div>
          <div class="auth-feature-text">+6.000 alunos aprendendo agora</div>
        </div>
        <div class="auth-feature">
          <div class="auth-feature-icon">📚</div>
          <div class="auth-feature-text">Cursos em programação, design, dados e mais</div>
        </div>
        <div class="auth-feature">
          <div class="auth-feature-icon">🏆</div>
          <div class="auth-feature-text">Certificados reconhecidos pelo mercado</div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <h2>Bem-vindo de volta!</h2>
      <p class="subtitle">Faça login para continuar aprendendo</p>

      <div class="auth-demos">
        <strong>🔑 Contas de demonstração</strong>
        <div>
          Aluno: <b>student@nexora.com</b> / senha: <b>123456</b><br>
          Professor: <b>teacher@nexora.com</b> / senha: <b>123456</b>
        </div>
      </div>

      <form id="login-form">
        <div class="form-group">
          <label>E-mail</label>
          <input type="email" id="login-email" placeholder="seu@email.com" required>
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input type="password" id="login-password" placeholder="••••••••" required>
        </div>
        <button type="button" class="btn btn-primary btn-full btn-lg" style="margin-top:8px" onclick="doLogin()">
          Entrar na Plataforma
        </button>
      </form>

      <div class="auth-switch">
        Não tem conta? <a id="go-register">Cadastre-se grátis</a>
      </div>
    </div>
  </div>`;
}

function renderRegister() {
  return `
  <div class="auth-page fade-in">
    <div class="auth-left">
      <div class="logo">Ne<span>x</span>ora</div>
      <h1>Comece sua jornada hoje.</h1>
      <p>Junte-se a milhares de alunos e professores na maior plataforma de educação online do Brasil.</p>
      <div class="auth-features">
        <div class="auth-feature">
          <div class="auth-feature-icon">✅</div>
          <div class="auth-feature-text">Cadastro 100% gratuito</div>
        </div>
        <div class="auth-feature">
          <div class="auth-feature-icon">🚀</div>
          <div class="auth-feature-text">Comece a aprender em minutos</div>
        </div>
        <div class="auth-feature">
          <div class="auth-feature-icon">💼</div>
          <div class="auth-feature-text">Professores monetizam seus conhecimentos</div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <h2>Crie sua conta</h2>
      <p class="subtitle">Rápido, fácil e gratuito</p>

      <div style="margin-bottom:18px">
        <label style="font-size:13px;font-weight:600;display:block;margin-bottom:8px">Eu sou...</label>
        <div class="role-selector">
          <div class="role-card selected" data-role="student" onclick="selectRole('student')">
            <div class="role-icon">🎓</div>
            <div class="role-name">Aluno</div>
          </div>
          <div class="role-card" data-role="teacher" onclick="selectRole('teacher')">
            <div class="role-icon">👨‍🏫</div>
            <div class="role-name">Professor</div>
          </div>
        </div>
        <input type="hidden" id="reg-role" value="student">
      </div>

      <form id="register-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nome completo</label>
            <input type="text" id="reg-name" placeholder="Seu nome" required>
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" id="reg-email" placeholder="seu@email.com" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Senha</label>
            <input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required>
          </div>
          <div class="form-group">
            <label>Confirmar senha</label>
            <input type="password" id="reg-confirm" placeholder="Repita a senha" required>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-full btn-lg" onclick="doRegister()">
          Criar conta grátis
        </button>
      </form>

      <div class="auth-switch">
        Já tem conta? <a id="go-login">Fazer login</a>
      </div>
    </div>
  </div>`;
}

function selectRole(role) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-role="${role}"]`).classList.add('selected');
  document.getElementById('reg-role').value = role;
}

function doLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  if (!email || !password) { showNotification('Preencha e-mail e senha.', 'error'); return; }
  const user = findUser(email, password);
  if (!user) { showNotification('E-mail ou senha incorretos.', 'error'); return; }
  saveSession(user);
  showNotification(`Bem-vindo(a), ${user.name.split(' ')[0]}!`, 'success');
  navigate(user.role === 'teacher' ? 'teacher/dashboard' : 'student/dashboard');
}

function doRegister() {
  const name     = document.getElementById('reg-name')?.value.trim();
  const email    = document.getElementById('reg-email')?.value.trim();
  const password = document.getElementById('reg-password')?.value;
  const confirm  = document.getElementById('reg-confirm')?.value;
  const role     = document.getElementById('reg-role')?.value || 'student';
  if (!name || !email || !password) { showNotification('Preencha todos os campos.', 'error'); return; }
  if (password.length < 6) { showNotification('Senha deve ter ao menos 6 caracteres.', 'error'); return; }
  if (password !== confirm) { showNotification('As senhas não coincidem.', 'error'); return; }
  const user = createUser(name, email, password, role);
  if (!user) { showNotification('Este e-mail já está cadastrado.', 'error'); return; }
  saveSession(user);
  showNotification(`Conta criada! Bem-vindo(a), ${name.split(' ')[0]}!`, 'success');
  navigate(role === 'teacher' ? 'teacher/dashboard' : 'student/dashboard');
}

function attachAuthEvents() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); doLogin(); });
  const regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', (e) => { e.preventDefault(); doRegister(); });
  document.getElementById('go-register')?.addEventListener('click', () => navigate('register'));
  document.getElementById('go-login')?.addEventListener('click', () => navigate('login'));
}

/* =============================================
   STUDENT LAYOUT
   ============================================= */
function renderStudentLayout(app) {
  const navItems = [
    { view: 'student/dashboard', icon: '🏠', label: 'Início' },
    { view: 'student/catalog',   icon: '🔍', label: 'Explorar Cursos' },
    { view: 'student/my-courses',icon: '📖', label: 'Meus Cursos' },
    { view: 'student/profile',   icon: '👤', label: 'Perfil' }
  ];

  const isLesson = currentView === 'student/lesson';

  app.innerHTML = `
  <div class="app-layout fade-in">
    ${!isLesson ? `
    <aside class="sidebar">
      <div class="sidebar-logo">Ne<span>x</span>ora</div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Navegação</div>
        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <a class="${currentView === item.view ? 'active' : ''}" onclick="navigate('${item.view}')">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>
      </div>
      <div class="sidebar-bottom">
        <div class="sidebar-user">
          ${avatarHtml(currentUser)}
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${currentUser.name}</div>
            <div class="sidebar-user-role">Aluno</div>
          </div>
          <button class="sidebar-logout" onclick="logout()" title="Sair">⇥</button>
        </div>
      </div>
    </aside>` : ''}
    <div class="main-content" style="${isLesson ? '' : ''}">
      ${!isLesson ? `
      <header class="topbar">
        <div class="topbar-title">${getStudentPageTitle()}</div>
        <div class="topbar-actions">
          <div class="topbar-search">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Buscar cursos..." id="search-input" oninput="handleSearch(this.value)">
          </div>
        </div>
      </header>` : ''}
      <main id="page-content">
        ${renderStudentPage()}
      </main>
    </div>
  </div>`;

  attachStudentEvents();
}

function getStudentPageTitle() {
  const titles = {
    'student/dashboard': 'Início',
    'student/catalog': 'Explorar Cursos',
    'student/my-courses': 'Meus Cursos',
    'student/profile': 'Meu Perfil'
  };
  return titles[currentView] || 'Nexora';
}

function renderStudentPage() {
  switch (currentView) {
    case 'student/dashboard':  return renderStudentDashboard();
    case 'student/catalog':    return renderStudentCatalog();
    case 'student/my-courses': return renderStudentMyCourses();
    case 'student/lesson':     return renderLessonViewer();
    case 'student/profile':    return renderStudentProfile();
    default: return renderStudentDashboard();
  }
}

/* --- Student Dashboard --- */
function renderStudentDashboard() {
  const stats = getStudentStats(currentUser.id);
  const enrollments = getEnrollmentsByUser(currentUser.id);
  const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const recentCourses = inProgress.slice(0, 3).map(e => {
    const course = getCourseById(e.courseId);
    if (!course) return '';
    return `
    <div class="course-card" onclick="navigate('student/lesson', {courseId: ${course.id}, lessonId: 1})">
      <div class="course-thumb ${thumbClass(course.thumb)}">${thumbEmoji(course.thumb)}
        <span class="course-level-badge">${course.progress}%</span>
      </div>
      <div class="course-body">
        <div class="course-category">${course.category}</div>
        <div class="course-title">${course.title}</div>
        <div class="course-teacher">Por ${getTeacherName(course.teacherId)}</div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${e.progress}%"></div></div>
        <div class="progress-label"><span>${e.progress}% concluído</span><span>${course.lessonsCount} aulas</span></div>
      </div>
    </div>`;
  }).join('');

  const activities = enrollments.slice(0, 5).map(e => {
    const course = getCourseById(e.courseId);
    if (!course) return '';
    const typeInfo = e.progress === 100
      ? { icon: '🏆', dot: 'done', msg: `Concluiu <b>${course.title}</b>` }
      : e.progress > 0
      ? { icon: '▶️', dot: 'lesson', msg: `Continuou <b>${course.title}</b> — ${e.progress}%` }
      : { icon: '📚', dot: 'enroll', msg: `Matriculou-se em <b>${course.title}</b>` };
    return `
    <div class="activity-item">
      <div class="activity-dot ${typeInfo.dot}">${typeInfo.icon}</div>
      <div class="activity-info">
        <p>${typeInfo.msg}</p>
        <span>${formatDate(e.enrolledAt)}</span>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>${greeting}, ${currentUser.name.split(' ')[0]}! 👋</h1>
      <p>Continue de onde parou e avance no seu aprendizado.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">📚</div>
        <div class="stat-info"><h3>${stats.total}</h3><p>Cursos matriculados</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">⚡</div>
        <div class="stat-info"><h3>${stats.inProgress}</h3><p>Em progresso</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-info"><h3>${stats.completed}</h3><p>Concluídos</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">🏆</div>
        <div class="stat-info"><h3>${stats.completed}</h3><p>Certificados</p></div>
      </div>
    </div>

    ${inProgress.length > 0 ? `
    <div class="section-header">
      <h2>Continuar aprendendo</h2>
      <a onclick="navigate('student/my-courses')" class="btn btn-ghost btn-sm">Ver todos →</a>
    </div>
    <div class="courses-grid mb-24">${recentCourses}</div>
    ` : `
    <div class="card text-center mb-24">
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>Comece sua jornada!</h3>
        <p>Você ainda não iniciou nenhum curso. Explore nosso catálogo e comece a aprender.</p>
        <button class="btn btn-primary" onclick="navigate('student/catalog')">Explorar Cursos</button>
      </div>
    </div>
    `}

    <div class="two-col">
      <div class="card">
        <div class="section-header" style="margin-bottom:12px"><h2>Atividade recente</h2></div>
        ${activities || '<p class="text-muted" style="font-size:13px">Nenhuma atividade ainda.</p>'}
      </div>
      <div class="card">
        <div class="section-header" style="margin-bottom:16px"><h2>Cursos em destaque</h2></div>
        ${getCourses().slice(0,3).map(c => `
          <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="openCourseDetail(${c.id})">
            <div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0" class="course-thumb ${thumbClass(c.thumb)}">${thumbEmoji(c.thumb)}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.title}</div>
              <div style="font-size:12px;color:var(--text-muted)">${c.category} • ⭐ ${c.rating}</div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-outline btn-full" style="margin-top:16px" onclick="navigate('student/catalog')">Ver catálogo completo</button>
      </div>
    </div>
  </div>`;
}

/* --- Student Catalog --- */
function renderStudentCatalog(searchTerm = '') {
  const categories = ['all', ...new Set(getCourses().map(c => c.category))];
  let courses = getCourses();
  if (currentFilter && currentFilter !== 'all') {
    courses = courses.filter(c => c.category === currentFilter);
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>Explorar Cursos</h1>
      <p>${courses.length} curso${courses.length !== 1 ? 's' : ''} disponível${courses.length !== 1 ? 'is' : ''}</p>
    </div>

    <div class="catalog-filters">
      ${categories.map(cat => `
        <button class="filter-btn ${currentFilter === cat ? 'active' : ''}"
          onclick="setFilter('${cat}')">
          ${cat === 'all' ? 'Todos' : cat}
        </button>
      `).join('')}
    </div>

    ${courses.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <h3>Nenhum curso encontrado</h3>
        <p>Tente buscar por outro termo ou limpe os filtros.</p>
        <button class="btn btn-outline" onclick="setFilter('all')">Limpar filtros</button>
      </div>
    ` : `
      <div class="courses-grid">
        ${courses.map(c => renderCourseCard(c)).join('')}
      </div>
    `}
  </div>`;
}

function renderCourseCard(course) {
  const teacher = DB.users.find(u => u.id === course.teacherId);
  const enrolled = isEnrolled(currentUser?.id, course.id);
  return `
  <div class="course-card" onclick="openCourseDetail(${course.id})">
    <div class="course-thumb ${thumbClass(course.thumb)}">
      ${thumbEmoji(course.thumb)}
      <span class="course-level-badge">${course.level}</span>
    </div>
    <div class="course-body">
      <div class="course-category">${course.category}</div>
      <div class="course-title">${course.title}</div>
      <div class="course-teacher">👨‍🏫 ${teacher?.name || 'Instrutor'}</div>
      <div class="course-meta">
        <span>📚 ${course.lessonsCount} aulas</span>
        <span>⏱️ ${course.duration}</span>
        <span>👥 ${course.studentsCount?.toLocaleString('pt-BR')}</span>
      </div>
      <div class="course-footer">
        <div class="course-price">${formatPrice(course.price)}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="course-rating"><span class="stars">⭐</span>${course.rating}</div>
          ${enrolled ? '<span class="badge badge-success">Matriculado</span>' : ''}
        </div>
      </div>
    </div>
  </div>`;
}

/* --- Student My Courses --- */
function renderStudentMyCourses() {
  const enrollments = getEnrollmentsByUser(currentUser.id);
  if (enrollments.length === 0) {
    return `
    <div class="page-content fade-in">
      <div class="page-header"><h1>Meus Cursos</h1></div>
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Nenhum curso ainda</h3>
        <p>Você ainda não se matriculou em nenhum curso. Explore nosso catálogo!</p>
        <button class="btn btn-primary" onclick="navigate('student/catalog')">Explorar Cursos</button>
      </div>
    </div>`;
  }

  const tabs = [
    { key: 'all', label: 'Todos', count: enrollments.length },
    { key: 'progress', label: 'Em andamento', count: enrollments.filter(e => e.progress > 0 && e.progress < 100).length },
    { key: 'completed', label: 'Concluídos', count: enrollments.filter(e => e.progress === 100).length }
  ];

  const filter = window._myCourseFilter || 'all';
  let filtered = enrollments;
  if (filter === 'progress')  filtered = enrollments.filter(e => e.progress > 0 && e.progress < 100);
  if (filter === 'completed') filtered = enrollments.filter(e => e.progress === 100);

  const cards = filtered.map(e => {
    const course = getCourseById(e.courseId);
    if (!course) return '';
    const teacher = DB.users.find(u => u.id === course.teacherId);
    return `
    <div class="course-card">
      <div class="course-thumb ${thumbClass(course.thumb)}">${thumbEmoji(course.thumb)}
        ${e.progress === 100 ? '<span class="course-level-badge" style="background:#22c55e">✓ Completo</span>' : ''}
      </div>
      <div class="course-body">
        <div class="course-category">${course.category}</div>
        <div class="course-title">${course.title}</div>
        <div class="course-teacher">👨‍🏫 ${teacher?.name || 'Instrutor'}</div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${e.progress}%"></div></div>
        <div class="progress-label"><span>${e.progress}% concluído</span><span>Desde ${formatDate(e.enrolledAt)}</span></div>
        <button class="btn btn-primary btn-full" style="margin-top:12px"
          onclick="navigate('student/lesson', {courseId:${course.id}, lessonId:1})">
          ${e.progress === 0 ? '▶ Começar' : e.progress === 100 ? '🔄 Revisar' : '▶ Continuar'}
        </button>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>Meus Cursos</h1>
      <p>${enrollments.length} curso${enrollments.length !== 1 ? 's' : ''} matriculado${enrollments.length !== 1 ? 's' : ''}</p>
    </div>
    <div class="catalog-filters">
      ${tabs.map(t => `
        <button class="filter-btn ${filter === t.key ? 'active' : ''}"
          onclick="setMyCourseFilter('${t.key}')">
          ${t.label} (${t.count})
        </button>
      `).join('')}
    </div>
    ${filtered.length === 0
      ? '<div class="empty-state"><div class="empty-icon">📭</div><h3>Nenhum curso nessa categoria</h3></div>'
      : `<div class="courses-grid">${cards}</div>`
    }
  </div>`;
}

/* --- Lesson Viewer --- */
function renderLessonViewer() {
  const course = getCourseById(currentCourseId);
  if (!course) return '<div class="page-content"><p>Curso não encontrado.</p></div>';

  const lessonIdx = course.lessons.findIndex(l => l.id === currentLessonId) !== -1
    ? course.lessons.findIndex(l => l.id === currentLessonId)
    : 0;
  const lesson = course.lessons[lessonIdx];
  const prevLesson = lessonIdx > 0 ? course.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < course.lessons.length - 1 ? course.lessons[lessonIdx + 1] : null;
  const isComplete = isLessonComplete(currentUser.id, course.id, lesson.id);

  const lessonTypeIcon = { video: '▶️', project: '🏗️', quiz: '📝' };

  return `
  <div style="display:flex;flex-direction:column;min-height:100vh">
    <div style="background:var(--sidebar-bg);padding:12px 24px;display:flex;align-items:center;gap:16px;border-bottom:1px solid rgba(255,255,255,.1)">
      <button class="btn btn-ghost" style="color:rgba(255,255,255,.7)" onclick="navigate('student/my-courses')">← Voltar</button>
      <span style="color:rgba(255,255,255,.8);font-size:14px;font-weight:600">${course.title}</span>
      <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
        <div style="background:rgba(255,255,255,.1);border-radius:99px;height:6px;width:120px">
          <div style="background:var(--primary);height:100%;border-radius:99px;width:${getEnrollmentsByUser(currentUser.id).find(e=>e.courseId===course.id)?.progress||0}%"></div>
        </div>
        <span style="color:rgba(255,255,255,.5);font-size:12px">${getEnrollmentsByUser(currentUser.id).find(e=>e.courseId===course.id)?.progress||0}%</span>
      </div>
    </div>

    <div class="lesson-layout" style="flex:1">
      <div class="lesson-main">
        <div class="lesson-video-area">
          <div class="lesson-video-placeholder">
            <div class="play-btn">▶</div>
            <p>${lesson.title}</p>
            <p style="margin-top:4px;font-size:12px">${lesson.duration} • ${lesson.type === 'video' ? 'Vídeo' : 'Projeto'}</p>
          </div>
        </div>
        <div class="lesson-info">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div>
              <div style="font-size:12px;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">
                Aula ${lessonIdx + 1} de ${course.lessons.length}
              </div>
              <h2>${lesson.title}</h2>
            </div>
            ${isComplete
              ? '<span class="badge badge-success">✓ Concluída</span>'
              : `<button class="btn btn-success" onclick="completeLesson(${course.id}, ${lesson.id})">✓ Marcar como concluída</button>`
            }
          </div>
          <div class="lesson-description-card">
            <strong>Sobre esta aula</strong><br>
            Nesta aula você aprenderá os conceitos fundamentais de <em>${lesson.title}</em>. Assista ao vídeo completo e pratique os exercícios apresentados. Duração estimada: <strong>${lesson.duration}</strong>.
          </div>
          <div class="lesson-nav-btns" style="margin-top:20px">
            ${prevLesson
              ? `<button class="btn btn-outline" onclick="navigate('student/lesson',{courseId:${course.id},lessonId:${prevLesson.id}})">← Anterior</button>`
              : '<button class="btn btn-outline" disabled>← Anterior</button>'
            }
            ${nextLesson
              ? `<button class="btn btn-primary" onclick="navigate('student/lesson',{courseId:${course.id},lessonId:${nextLesson.id}})">Próxima →</button>`
              : '<button class="btn btn-success" onclick="finishCourse()">🏆 Finalizar Curso</button>'
            }
          </div>
        </div>
      </div>

      <aside class="lesson-sidebar">
        <div class="lesson-sidebar-header">
          <h3>Conteúdo do Curso</h3>
          <p>${course.lessonsCount} aulas • ${course.duration}</p>
        </div>
        ${course.lessons.map((l, i) => {
          const done = isLessonComplete(currentUser.id, course.id, l.id);
          const active = l.id === lesson.id;
          return `
          <div class="lesson-list-item ${active ? 'active' : ''} ${done ? 'completed' : ''}"
            onclick="navigate('student/lesson',{courseId:${course.id},lessonId:${l.id}})">
            <div class="lesson-num">${done ? '✓' : i+1}</div>
            <div class="lesson-list-info">
              <div class="lesson-list-title">${l.title}</div>
              <div class="lesson-list-meta">${l.duration} • ${l.type === 'video' ? 'Vídeo' : 'Projeto'}</div>
            </div>
            <div class="lesson-list-type">${lessonTypeIcon[l.type] || '▶️'}</div>
          </div>`;
        }).join('')}
      </aside>
    </div>
  </div>`;
}

/* --- Student Profile --- */
function renderStudentProfile() {
  const stats = getStudentStats(currentUser.id);
  return `
  <div class="page-content fade-in">
    <div class="page-header"><h1>Meu Perfil</h1></div>

    <div class="profile-header">
      <div class="profile-avatar-big" style="background:${currentUser.color};color:#fff">
        ${getInitials(currentUser.name)}
      </div>
      <div class="profile-header-info">
        <h2>${currentUser.name}</h2>
        <p>${currentUser.email}</p>
        <div class="role-tag">🎓 Aluno</div>
      </div>
      <button class="btn btn-outline" style="margin-left:auto" onclick="openEditProfile()">✏️ Editar Perfil</button>
    </div>

    <div class="two-col">
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Informações</h3>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[
            ['👤', 'Nome', currentUser.name],
            ['📧', 'E-mail', currentUser.email],
            ['📅', 'Membro desde', formatDate(currentUser.joined)],
            ['📝', 'Bio', currentUser.bio || 'Nenhuma bio cadastrada.']
          ].map(([icon, label, val]) => `
            <div style="display:flex;gap:10px">
              <span style="font-size:18px">${icon}</span>
              <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:700">${label}</div>
              <div style="font-size:14px;margin-top:2px">${val}</div></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Estatísticas</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[
            ['📚', 'Cursos matriculados', stats.total],
            ['⚡', 'Em andamento', stats.inProgress],
            ['✅', 'Concluídos', stats.completed],
            ['🏆', 'Certificados', stats.completed]
          ].map(([icon, label, val]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:18px">${icon}</span>
                <span style="font-size:14px">${label}</span>
              </div>
              <span style="font-size:20px;font-weight:800;color:var(--primary)">${val}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* =============================================
   TEACHER LAYOUT
   ============================================= */
function renderTeacherLayout(app) {
  const navItems = [
    { view: 'teacher/dashboard', icon: '📊', label: 'Dashboard' },
    { view: 'teacher/courses',   icon: '📚', label: 'Meus Cursos' },
    { view: 'teacher/students',  icon: '👥', label: 'Alunos' },
    { view: 'teacher/profile',   icon: '👤', label: 'Perfil' }
  ];

  app.innerHTML = `
  <div class="app-layout fade-in">
    <aside class="sidebar">
      <div class="sidebar-logo">Ne<span>x</span>ora <span style="font-size:11px;background:var(--accent);color:#fff;padding:2px 7px;border-radius:99px;font-weight:700;vertical-align:middle">PRO</span></div>
      <div class="sidebar-section">
        <div class="sidebar-section-label">Painel do Professor</div>
        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <a class="${currentView === item.view ? 'active' : ''}" onclick="navigate('${item.view}')">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>
      </div>
      <div class="sidebar-section" style="margin-top:auto">
        <div class="sidebar-section-label">Ações Rápidas</div>
        <nav class="sidebar-nav">
          <a onclick="openCreateCourse()">
            <span class="nav-icon">➕</span>
            Novo Curso
          </a>
        </nav>
      </div>
      <div class="sidebar-bottom">
        <div class="sidebar-user">
          ${avatarHtml(currentUser)}
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${currentUser.name}</div>
            <div class="sidebar-user-role">Professor</div>
          </div>
          <button class="sidebar-logout" onclick="logout()" title="Sair">⇥</button>
        </div>
      </div>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div class="topbar-title">${getTeacherPageTitle()}</div>
        <div class="topbar-actions">
          <button class="btn btn-accent" onclick="openCreateCourse()">➕ Novo Curso</button>
        </div>
      </header>
      <main id="page-content">${renderTeacherPage()}</main>
    </div>
  </div>`;

  attachTeacherEvents();
}

function getTeacherPageTitle() {
  const titles = {
    'teacher/dashboard': 'Dashboard',
    'teacher/courses':   'Meus Cursos',
    'teacher/students':  'Alunos',
    'teacher/profile':   'Meu Perfil'
  };
  return titles[currentView] || 'Dashboard';
}

function renderTeacherPage() {
  switch (currentView) {
    case 'teacher/dashboard': return renderTeacherDashboard();
    case 'teacher/courses':   return renderTeacherCourses();
    case 'teacher/students':  return renderTeacherStudents();
    case 'teacher/profile':   return renderTeacherProfile();
    default: return renderTeacherDashboard();
  }
}

/* --- Teacher Dashboard --- */
function renderTeacherDashboard() {
  const stats = getTeacherStats(currentUser.id);
  const courses = getCoursesByTeacher(currentUser.id);
  const studentsData = getTeacherStudentsData(currentUser.id).slice(0, 5);

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>Bem-vindo(a), ${currentUser.name.split(' ').slice(-1)[0]}! 👋</h1>
      <p>Resumo da sua atividade como professor na plataforma.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">📚</div>
        <div class="stat-info"><h3>${stats.totalCourses}</h3><p>Cursos publicados</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">👥</div>
        <div class="stat-info"><h3>${stats.totalStudents}</h3><p>Alunos matriculados</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">💰</div>
        <div class="stat-info"><h3>R$ ${stats.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits:0,maximumFractionDigits:0})}</h3><p>Receita estimada</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow">⭐</div>
        <div class="stat-info">
          <h3>${courses.length > 0 ? (courses.reduce((s,c) => s+c.rating, 0)/courses.length).toFixed(1) : '—'}</h3>
          <p>Avaliação média</p>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="section-header">
          <h2>Meus Cursos</h2>
          <a onclick="navigate('teacher/courses')" class="btn btn-ghost btn-sm">Ver todos →</a>
        </div>
        ${courses.length === 0
          ? `<div class="card text-center"><div class="empty-state"><div class="empty-icon">📋</div><h3>Nenhum curso ainda</h3><p>Crie seu primeiro curso!</p><button class="btn btn-primary" onclick="openCreateCourse()">Criar Curso</button></div></div>`
          : courses.slice(0,4).map(c => `
          <div class="manage-course-card" style="margin-bottom:12px">
            <div class="manage-course-header course-thumb ${thumbClass(c.thumb)}">${thumbEmoji(c.thumb)}</div>
            <div class="manage-course-body">
              <h4>${c.title}</h4>
              <div class="manage-course-meta">
                <span>👥 ${getEnrollmentsByCourse(c.id).length} alunos</span>
                <span>📚 ${c.lessonsCount} aulas</span>
                <span>⭐ ${c.rating}</span>
              </div>
              <div class="manage-course-actions">
                <button class="btn btn-outline btn-sm" onclick="openEditCourse(${c.id})">✏️ Editar</button>
                <button class="btn btn-ghost btn-sm" onclick="viewCourseStudents(${c.id})">👥 Alunos</button>
              </div>
            </div>
          </div>`).join('')
        }
      </div>

      <div>
        <div class="section-header"><h2>Últimas matrículas</h2></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Aluno</th><th>Curso</th><th>Progresso</th></tr></thead>
            <tbody>
              ${studentsData.length === 0
                ? '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:24px">Nenhum aluno ainda</td></tr>'
                : studentsData.map(s => `
                <tr>
                  <td>
                    <div class="td-user">
                      <div class="td-avatar" style="background:${s.userColor||'#6366f1'};color:#fff">${getInitials(s.userName||'?')}</div>
                      <div class="td-user-info"><div class="name">${s.userName}</div><div class="email">${s.userEmail}</div></div>
                    </div>
                  </td>
                  <td style="font-size:13px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.courseName}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="progress-bar" style="width:80px;margin:0"><div class="progress-bar-fill" style="width:${s.progress}%"></div></div>
                      <span style="font-size:12px;color:var(--text-muted)">${s.progress}%</span>
                    </div>
                  </td>
                </tr>`).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

/* --- Teacher Courses --- */
function renderTeacherCourses() {
  const courses = getCoursesByTeacher(currentUser.id);

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>Meus Cursos</h1>
      <p>${courses.length} curso${courses.length !== 1 ? 's' : ''} publicado${courses.length !== 1 ? 's' : ''}</p>
    </div>

    ${courses.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📋</div><h3>Nenhum curso ainda</h3><p>Crie seu primeiro curso e comece a ensinar.</p><button class="btn btn-primary btn-lg" onclick="openCreateCourse()">➕ Criar Primeiro Curso</button></div>`
      : `<div class="courses-grid">${courses.map(c => renderTeacherCourseCard(c)).join('')}</div>`
    }
  </div>`;
}

function renderTeacherCourseCard(course) {
  const enrolled = getEnrollmentsByCourse(course.id).length;
  return `
  <div class="manage-course-card">
    <div class="manage-course-header course-thumb ${thumbClass(course.thumb)}">${thumbEmoji(course.thumb)}</div>
    <div class="manage-course-body">
      <div class="course-category" style="margin-bottom:4px">${course.category}</div>
      <h4>${course.title}</h4>
      <div class="manage-course-meta">
        <span>👥 ${enrolled} aluno${enrolled!==1?'s':''}</span>
        <span>📚 ${course.lessonsCount} aulas</span>
        <span>⏱️ ${course.duration}</span>
        <span>⭐ ${course.rating}</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:16px;font-weight:800">${formatPrice(course.price)}</span>
        <span class="badge badge-success">Publicado</span>
      </div>
      <div class="manage-course-actions">
        <button class="btn btn-primary btn-sm" onclick="openEditCourse(${course.id})">✏️ Editar</button>
        <button class="btn btn-outline btn-sm" onclick="viewCourseStudents(${course.id})">👥 Alunos</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="confirmDeleteCourse(${course.id})">🗑️</button>
      </div>
    </div>
  </div>`;
}

/* --- Teacher Students --- */
function renderTeacherStudents() {
  const students = getTeacherStudentsData(currentUser.id);

  return `
  <div class="page-content fade-in">
    <div class="page-header">
      <h1>Meus Alunos</h1>
      <p>${students.length} matrícula${students.length !== 1 ? 's' : ''} no total</p>
    </div>

    <div class="table-wrap">
      <div class="table-header">
        <h3>Lista de Alunos</h3>
        <span class="badge badge-primary">${students.length} registros</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Curso</th>
            <th>Matriculado em</th>
            <th>Progresso</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${students.length === 0
            ? '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted)">Nenhum aluno matriculado ainda.</td></tr>'
            : students.map(s => `
            <tr>
              <td>
                <div class="td-user">
                  <div class="td-avatar" style="background:${s.userColor||'#6366f1'};color:#fff">${getInitials(s.userName||'?')}</div>
                  <div class="td-user-info">
                    <div class="name">${s.userName}</div>
                    <div class="email">${s.userEmail}</div>
                  </div>
                </div>
              </td>
              <td style="font-size:13px;max-width:180px">
                <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${s.courseName}">${s.courseName}</div>
              </td>
              <td style="font-size:13px;color:var(--text-muted)">${formatDate(s.enrolledAt)}</td>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar" style="width:80px;margin:0"><div class="progress-bar-fill" style="width:${s.progress}%"></div></div>
                  <span style="font-size:12px;font-weight:600">${s.progress}%</span>
                </div>
              </td>
              <td>
                ${s.progress === 100
                  ? '<span class="badge badge-success">Concluído</span>'
                  : s.progress > 0
                  ? '<span class="badge badge-primary">Em andamento</span>'
                  : '<span class="badge badge-muted">Não iniciado</span>'
                }
              </td>
            </tr>`).join('')
          }
        </tbody>
      </table>
    </div>
  </div>`;
}

/* --- Teacher Profile --- */
function renderTeacherProfile() {
  const stats = getTeacherStats(currentUser.id);
  const courses = getCoursesByTeacher(currentUser.id);
  return `
  <div class="page-content fade-in">
    <div class="page-header"><h1>Meu Perfil</h1></div>
    <div class="profile-header">
      <div class="profile-avatar-big" style="background:${currentUser.color};color:#fff">${getInitials(currentUser.name)}</div>
      <div class="profile-header-info">
        <h2>${currentUser.name}</h2>
        <p>${currentUser.email}</p>
        <div class="role-tag">👨‍🏫 Professor</div>
      </div>
      <button class="btn btn-outline" style="margin-left:auto" onclick="openEditProfile()">✏️ Editar Perfil</button>
    </div>
    <div class="two-col">
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Informações</h3>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[
            ['👤','Nome',currentUser.name],['📧','E-mail',currentUser.email],
            ['📅','Na plataforma desde',formatDate(currentUser.joined)],
            ['📝','Bio',currentUser.bio||'Nenhuma bio cadastrada.']
          ].map(([icon,label,val]) => `
            <div style="display:flex;gap:10px">
              <span style="font-size:18px">${icon}</span>
              <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;font-weight:700">${label}</div>
              <div style="font-size:14px;margin-top:2px">${val}</div></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">Estatísticas</h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[
            ['📚','Cursos publicados',stats.totalCourses],
            ['👥','Total de alunos',stats.totalStudents],
            ['💰','Receita estimada',`R$ ${stats.totalRevenue.toLocaleString('pt-BR',{minimumFractionDigits:0})}`],
            ['⭐','Avaliação média',courses.length>0?(courses.reduce((s,c)=>s+c.rating,0)/courses.length).toFixed(1):'—']
          ].map(([icon,label,val])=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:10px"><span style="font-size:18px">${icon}</span><span style="font-size:14px">${label}</span></div>
              <span style="font-size:20px;font-weight:800;color:var(--primary)">${val}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* =============================================
   MODALS — Course Detail
   ============================================= */
function openCourseDetail(courseId) {
  const course = getCourseById(courseId);
  if (!course) return;
  const teacher = DB.users.find(u => u.id === course.teacherId);
  const enrolled = currentUser && isEnrolled(currentUser.id, courseId);

  showModal(`
    <div class="modal-header">
      <h3>Detalhes do Curso</h3>
      <button class="modal-close">✕</button>
    </div>
    <div class="course-detail">
      <div class="course-detail-thumb course-thumb ${thumbClass(course.thumb)}">${thumbEmoji(course.thumb)}</div>
      <div class="course-category">${course.category}</div>
      <h2>${course.title}</h2>
      <p>${course.description}</p>
      <div class="course-detail-meta">
        <span>👨‍🏫 ${teacher?.name}</span>
        <span>⭐ ${course.rating} (${course.studentsCount?.toLocaleString('pt-BR')} alunos)</span>
        <span>📚 ${course.lessonsCount} aulas</span>
        <span>⏱️ ${course.duration}</span>
        <span>📊 ${course.level}</span>
      </div>
      <div class="lessons-preview">
        <h4>Conteúdo do Curso</h4>
        ${course.lessons.map((l, i) => `
          <div class="lesson-preview-item">
            <span class="lp-icon">${l.type === 'video' ? '▶️' : '🏗️'}</span>
            <span>${i+1}. ${l.title}</span>
            <span class="lp-duration">${l.duration}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost modal-close">Fechar</button>
      ${enrolled
        ? `<button class="btn btn-success" onclick="closeModal();navigate('student/lesson',{courseId:${courseId},lessonId:1})">▶ Continuar Curso</button>`
        : `<button class="btn btn-primary" onclick="enrollInCourse(${courseId})">Matricular-se — ${formatPrice(course.price)}</button>`
      }
    </div>
  `);
}

function enrollInCourse(courseId) {
  enroll(currentUser.id, courseId);
  showNotification('Matrícula realizada com sucesso! 🎉', 'success');
  closeModal();
  navigate('student/my-courses');
}

/* =============================================
   MODALS — Create / Edit Course
   ============================================= */
function openCreateCourse() {
  editingCourseId = null;
  lessonDrafts = [
    { id: 1, title: '', duration: '20min', type: 'video' }
  ];
  showCourseForm(null);
}

function openEditCourse(courseId) {
  editingCourseId = courseId;
  const course = getCourseById(courseId);
  if (!course) return;
  lessonDrafts = course.lessons.map((l, i) => ({ ...l }));
  showCourseForm(course);
}

function showCourseForm(course) {
  const thumbOptions = ['js','react','python','design','node','sql','php','vue','default'];
  const categories = ['Programação','Data Science','Design','Back-End','Banco de Dados','DevOps','Marketing','Negócios'];
  const levels = ['Iniciante','Intermediário','Avançado','Todos os níveis','Iniciante ao Avançado'];

  showModal(`
    <div class="modal-header">
      <h3>${course ? 'Editar Curso' : 'Criar Novo Curso'}</h3>
      <button class="modal-close">✕</button>
    </div>
    <div style="max-height:70vh;overflow-y:auto;padding-right:4px">
      <form id="course-form">
        <div class="form-group">
          <label>Título do Curso *</label>
          <input type="text" id="cf-title" placeholder="Ex: JavaScript Completo do Zero ao Avançado" value="${course?.title||''}" required>
        </div>
        <div class="form-group">
          <label>Descrição *</label>
          <textarea id="cf-desc" placeholder="Descreva o que os alunos vão aprender..." required>${course?.description||''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Categoria</label>
            <select id="cf-category">
              ${categories.map(c => `<option value="${c}" ${course?.category===c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Nível</label>
            <select id="cf-level">
              ${levels.map(l => `<option value="${l}" ${course?.level===l?'selected':''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Preço (R$)</label>
            <input type="number" id="cf-price" min="0" step="0.01" placeholder="0 = Grátis" value="${course?.price||''}">
          </div>
          <div class="form-group">
            <label>Duração total</label>
            <input type="text" id="cf-duration" placeholder="Ex: 40h" value="${course?.duration||''}">
          </div>
        </div>
        <div class="form-group">
          <label>Thumbnail</label>
          <select id="cf-thumb">
            ${thumbOptions.map(t => `<option value="${t}" ${course?.thumb===t?'selected':''}>${t} ${thumbEmoji(t)}</option>`).join('')}
          </select>
        </div>

        <hr class="divider">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <label style="font-size:13px;font-weight:600">Aulas do Curso</label>
          <button type="button" class="btn btn-outline btn-sm" onclick="addLessonDraft()">+ Adicionar Aula</button>
        </div>
        <div id="lessons-list">
          ${renderLessonDrafts()}
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost modal-close">Cancelar</button>
      <button class="btn btn-primary" onclick="saveCourse()">${course ? 'Salvar Alterações' : 'Publicar Curso'}</button>
    </div>
  `);
}

function renderLessonDrafts() {
  return lessonDrafts.map((l, i) => `
    <div class="lesson-form-item">
      <span style="font-size:12px;font-weight:700;color:var(--text-muted);width:20px;flex-shrink:0">${i+1}</span>
      <input type="text" placeholder="Título da aula" value="${l.title}" oninput="lessonDrafts[${i}].title=this.value">
      <input type="text" placeholder="Duração" style="width:90px" value="${l.duration}" oninput="lessonDrafts[${i}].duration=this.value">
      <select onchange="lessonDrafts[${i}].type=this.value">
        <option value="video" ${l.type==='video'?'selected':''}>Vídeo</option>
        <option value="project" ${l.type==='project'?'selected':''}>Projeto</option>
        <option value="quiz" ${l.type==='quiz'?'selected':''}>Quiz</option>
      </select>
      <button type="button" class="remove-lesson-btn" onclick="removeLessonDraft(${i})">✕</button>
    </div>
  `).join('');
}

function addLessonDraft() {
  lessonDrafts.push({ id: Date.now(), title: '', duration: '20min', type: 'video' });
  document.getElementById('lessons-list').innerHTML = renderLessonDrafts();
}

function removeLessonDraft(idx) {
  if (lessonDrafts.length <= 1) { showNotification('O curso precisa ter ao menos 1 aula.', 'error'); return; }
  lessonDrafts.splice(idx, 1);
  document.getElementById('lessons-list').innerHTML = renderLessonDrafts();
}

function saveCourse() {
  const title = document.getElementById('cf-title').value.trim();
  const desc  = document.getElementById('cf-desc').value.trim();
  if (!title || !desc) { showNotification('Preencha título e descrição.', 'error'); return; }
  if (lessonDrafts.some(l => !l.title.trim())) { showNotification('Preencha o título de todas as aulas.', 'error'); return; }

  const data = {
    title, description: desc,
    category:  document.getElementById('cf-category').value,
    level:     document.getElementById('cf-level').value,
    price:     parseFloat(document.getElementById('cf-price').value) || 0,
    duration:  document.getElementById('cf-duration').value || '—',
    thumb:     document.getElementById('cf-thumb').value,
    teacherId: currentUser.id,
    lessons:   lessonDrafts.map((l, i) => ({ id: l.id || i+1, title: l.title, duration: l.duration, type: l.type }))
  };

  if (editingCourseId) {
    updateCourse(editingCourseId, data);
    showNotification('Curso atualizado com sucesso! ✅', 'success');
  } else {
    createCourse(data);
    showNotification('Curso publicado com sucesso! 🚀', 'success');
  }
  closeModal();
  navigate('teacher/courses');
}

/* =============================================
   MODALS — Confirm Delete
   ============================================= */
function confirmDeleteCourse(courseId) {
  const course = getCourseById(courseId);
  showModal(`
    <div class="modal-header">
      <h3>Confirmar exclusão</h3>
      <button class="modal-close">✕</button>
    </div>
    <p style="color:var(--text-muted);margin-bottom:24px">
      Tem certeza que deseja excluir o curso <strong>${course?.title}</strong>?<br>
      Todos os dados de matrícula também serão removidos. Esta ação não pode ser desfeita.
    </p>
    <div class="modal-footer">
      <button class="btn btn-ghost modal-close">Cancelar</button>
      <button class="btn btn-danger" onclick="doDeleteCourse(${courseId})">🗑️ Excluir Curso</button>
    </div>
  `);
}

function doDeleteCourse(courseId) {
  deleteCourse(courseId);
  showNotification('Curso excluído.', 'info');
  closeModal();
  navigate('teacher/courses');
}

/* =============================================
   MODAL — Edit Profile
   ============================================= */
function openEditProfile() {
  showModal(`
    <div class="modal-header">
      <h3>Editar Perfil</h3>
      <button class="modal-close">✕</button>
    </div>
    <form id="profile-form">
      <div class="form-group">
        <label>Nome completo</label>
        <input type="text" id="pf-name" value="${currentUser.name}" required>
      </div>
      <div class="form-group">
        <label>E-mail</label>
        <input type="email" id="pf-email" value="${currentUser.email}" required>
      </div>
      <div class="form-group">
        <label>Bio</label>
        <textarea id="pf-bio" placeholder="Conte um pouco sobre você...">${currentUser.bio||''}</textarea>
      </div>
      <div class="form-group">
        <label>Nova senha <span style="color:var(--text-muted);font-weight:400">(deixe em branco para manter)</span></label>
        <input type="password" id="pf-password" placeholder="••••••••">
      </div>
    </form>
    <div class="modal-footer">
      <button class="btn btn-ghost modal-close">Cancelar</button>
      <button class="btn btn-primary" onclick="saveProfile()">Salvar Alterações</button>
    </div>
  `);
}

function saveProfile() {
  const name     = document.getElementById('pf-name').value.trim();
  const email    = document.getElementById('pf-email').value.trim();
  const bio      = document.getElementById('pf-bio').value.trim();
  const password = document.getElementById('pf-password').value;
  if (!name || !email) { showNotification('Nome e e-mail são obrigatórios.', 'error'); return; }
  const updates = { name, email, bio };
  if (password && password.length >= 6) updates.password = password;
  else if (password) { showNotification('Senha deve ter ao menos 6 caracteres.', 'error'); return; }
  const updated = updateUser(currentUser.id, updates);
  saveSession(updated);
  showNotification('Perfil atualizado! ✅', 'success');
  closeModal();
  navigate(currentView);
}

/* =============================================
   TEACHER — View students of specific course
   ============================================= */
function viewCourseStudents(courseId) {
  const course = getCourseById(courseId);
  const enrollments = getEnrollmentsByCourse(courseId);
  const rows = enrollments.map(e => {
    const user = DB.users.find(u => u.id === e.userId);
    return user ? `
      <tr>
        <td><div class="td-user">
          <div class="td-avatar" style="background:${user.color||'#6366f1'};color:#fff">${getInitials(user.name)}</div>
          <div class="td-user-info"><div class="name">${user.name}</div><div class="email">${user.email}</div></div>
        </div></td>
        <td style="font-size:13px">${formatDate(e.enrolledAt)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar" style="width:80px;margin:0"><div class="progress-bar-fill" style="width:${e.progress}%"></div></div>
            <span style="font-size:12px;font-weight:600">${e.progress}%</span>
          </div>
        </td>
      </tr>` : '';
  }).join('');

  showModal(`
    <div class="modal-header">
      <h3>Alunos — ${course?.title}</h3>
      <button class="modal-close">✕</button>
    </div>
    <p style="color:var(--text-muted);margin-bottom:16px">${enrollments.length} aluno${enrollments.length!==1?'s':''} matriculado${enrollments.length!==1?'s':''}</p>
    <div style="max-height:400px;overflow-y:auto">
      <table style="width:100%">
        <thead><tr><th style="text-align:left;padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted)">Aluno</th><th style="text-align:left;padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted)">Matrícula</th><th style="text-align:left;padding:10px 0;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted)">Progresso</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="3" style="padding:20px;text-align:center;color:var(--text-muted)">Nenhum aluno ainda.</td></tr>'}</tbody>
      </table>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost modal-close">Fechar</button></div>
  `);
}

/* =============================================
   EVENTS
   ============================================= */
function attachStudentEvents() {}
function attachTeacherEvents() {}

function setFilter(filter) {
  currentFilter = filter;
  navigate('student/catalog');
}

function setMyCourseFilter(filter) {
  window._myCourseFilter = filter;
  navigate('student/my-courses');
}

function handleSearch(value) {
  if (currentView !== 'student/catalog') {
    currentFilter = 'all';
    navigate('student/catalog');
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) { input.value = value; renderCatalogWithSearch(value); }
    }, 50);
  } else {
    renderCatalogWithSearch(value);
  }
}

function renderCatalogWithSearch(term) {
  const content = document.getElementById('page-content');
  if (content) content.innerHTML = renderStudentCatalog(term);
}

function getTeacherName(teacherId) {
  const teacher = DB.users.find(u => u.id === teacherId);
  return teacher?.name || 'Instrutor';
}

function completeLesson(courseId, lessonId) {
  markLessonComplete(currentUser.id, courseId, lessonId);
  showNotification('Aula marcada como concluída! ✅', 'success');
  navigate('student/lesson', { courseId, lessonId });
}

function finishCourse() {
  showNotification('🏆 Parabéns! Você concluiu o curso!', 'success');
  navigate('student/my-courses');
}

function logout() {
  clearSession();
  currentView = 'login';
  currentCourseId = null;
  currentLessonId = null;
  currentFilter = 'all';
  window._myCourseFilter = 'all';
  render();
}

/* =============================================
   INIT
   ============================================= */
loadSession();
render();
