/* =============================================
   NEXORA — Data & State Management
   ============================================= */

const STORAGE_KEY = 'nexora_db';

const DEFAULT_DATA = {
  users: [
    {
      id: 1, name: 'Carlos Silva', email: 'student@nexora.com',
      password: '123456', role: 'student',
      bio: 'Desenvolvedor frontend apaixonado por JavaScript.',
      joined: '2024-01-15', color: '#6366f1'
    },
    {
      id: 2, name: 'Ana Souza', email: 'ana@nexora.com',
      password: '123456', role: 'student',
      bio: 'Estudante de Ciências da Computação.',
      joined: '2024-02-20', color: '#ec4899'
    },
    {
      id: 3, name: 'Lucas Ferreira', email: 'lucas@nexora.com',
      password: '123456', role: 'student',
      bio: 'UX Designer migrando para programação.',
      joined: '2024-03-05', color: '#f97316'
    },
    {
      id: 4, name: 'Julia Martins', email: 'julia@nexora.com',
      password: '123456', role: 'student',
      bio: 'Analista de dados em transição de carreira.',
      joined: '2024-03-18', color: '#22c55e'
    },
    {
      id: 5, name: 'Thiago Rocha', email: 'thiago@nexora.com',
      password: '123456', role: 'student',
      bio: 'Bacharel em Sistemas de Informação.',
      joined: '2024-04-02', color: '#a855f7'
    },
    {
      id: 6, name: 'Prof. Roberto Lima', email: 'teacher@nexora.com',
      password: '123456', role: 'teacher',
      bio: '15 anos de experiência em desenvolvimento web.',
      joined: '2023-06-10', color: '#0ea5e9'
    },
    {
      id: 7, name: 'Prof. Mariana Costa', email: 'mariana@nexora.com',
      password: '123456', role: 'teacher',
      bio: 'Especialista em Data Science e Machine Learning.',
      joined: '2023-08-05', color: '#d946ef'
    }
  ],

  courses: [
    {
      id: 1, teacherId: 6,
      title: 'JavaScript Completo — Do Zero ao Avançado',
      description: 'Domine JavaScript com projetos reais. Aprenda fundamentos, ES6+, DOM, APIs, Promises, async/await e muito mais. Ideal para iniciantes e quem quer solidificar o conhecimento.',
      category: 'Programação', level: 'Todos os níveis',
      price: 89.90, rating: 4.8, studentsCount: 1247,
      thumb: 'js', duration: '40h', lessonsCount: 7,
      lessons: [
        { id: 1, title: 'Introdução ao JavaScript', duration: '15min', type: 'video' },
        { id: 2, title: 'Variáveis, Tipos e Operadores', duration: '22min', type: 'video' },
        { id: 3, title: 'Funções e Escopo', duration: '28min', type: 'video' },
        { id: 4, title: 'Arrays e Objetos', duration: '35min', type: 'video' },
        { id: 5, title: 'DOM e Eventos', duration: '38min', type: 'video' },
        { id: 6, title: 'Promises e Async/Await', duration: '42min', type: 'video' },
        { id: 7, title: 'Projeto Final: Todo App Completo', duration: '65min', type: 'project' }
      ]
    },
    {
      id: 2, teacherId: 6,
      title: 'React do Zero ao PRO com Hooks',
      description: 'Construa aplicações modernas com React. Aprenda componentes, hooks, Context API, React Router, e integração com APIs REST. Projetos práticos do mundo real.',
      category: 'Programação', level: 'Intermediário',
      price: 119.90, rating: 4.9, studentsCount: 834,
      thumb: 'react', duration: '55h', lessonsCount: 8,
      lessons: [
        { id: 1, title: 'Fundamentos do React', duration: '20min', type: 'video' },
        { id: 2, title: 'Componentes e Props', duration: '25min', type: 'video' },
        { id: 3, title: 'useState e useEffect', duration: '32min', type: 'video' },
        { id: 4, title: 'Context API e useContext', duration: '28min', type: 'video' },
        { id: 5, title: 'React Router v6', duration: '30min', type: 'video' },
        { id: 6, title: 'Integração com APIs REST', duration: '35min', type: 'video' },
        { id: 7, title: 'Gerenciamento de Estado Avançado', duration: '40min', type: 'video' },
        { id: 8, title: 'Projeto: E-commerce Completo', duration: '80min', type: 'project' }
      ]
    },
    {
      id: 3, teacherId: 7,
      title: 'Python para Data Science e Machine Learning',
      description: 'Aprenda Python focado em análise de dados. Pandas, NumPy, Matplotlib, Scikit-learn e muito mais. Crie modelos de ML do zero com projetos reais.',
      category: 'Data Science', level: 'Iniciante ao Avançado',
      price: 139.90, rating: 4.7, studentsCount: 2105,
      thumb: 'python', duration: '65h', lessonsCount: 9,
      lessons: [
        { id: 1, title: 'Python Fundamentos', duration: '18min', type: 'video' },
        { id: 2, title: 'NumPy para Computação Numérica', duration: '30min', type: 'video' },
        { id: 3, title: 'Pandas: Manipulação de Dados', duration: '45min', type: 'video' },
        { id: 4, title: 'Visualização com Matplotlib e Seaborn', duration: '35min', type: 'video' },
        { id: 5, title: 'Estatística para Data Science', duration: '40min', type: 'video' },
        { id: 6, title: 'Machine Learning com Scikit-learn', duration: '55min', type: 'video' },
        { id: 7, title: 'Redes Neurais com TensorFlow', duration: '60min', type: 'video' },
        { id: 8, title: 'NLP: Processamento de Linguagem', duration: '50min', type: 'video' },
        { id: 9, title: 'Projeto: Análise de Sentimentos', duration: '90min', type: 'project' }
      ]
    },
    {
      id: 4, teacherId: 7,
      title: 'Design UI/UX Moderno com Figma',
      description: 'Domine o Figma e crie interfaces profissionais. Aprenda design system, prototipação, pesquisa UX, testes de usabilidade e entrega para devs.',
      category: 'Design', level: 'Todos os níveis',
      price: 79.90, rating: 4.6, studentsCount: 567,
      thumb: 'design', duration: '30h', lessonsCount: 6,
      lessons: [
        { id: 1, title: 'Introdução ao Design UI/UX', duration: '15min', type: 'video' },
        { id: 2, title: 'Figma do Zero', duration: '25min', type: 'video' },
        { id: 3, title: 'Design System e Componentes', duration: '35min', type: 'video' },
        { id: 4, title: 'Tipografia e Cores', duration: '20min', type: 'video' },
        { id: 5, title: 'Prototipação e Animações', duration: '30min', type: 'video' },
        { id: 6, title: 'Projeto: App de Finanças', duration: '70min', type: 'project' }
      ]
    },
    {
      id: 5, teacherId: 6,
      title: 'Node.js: APIs REST com Express e MongoDB',
      description: 'Construa back-ends poderosos com Node.js. APIs RESTful, autenticação JWT, banco de dados MongoDB, deploy na nuvem e boas práticas.',
      category: 'Back-End', level: 'Intermediário',
      price: 109.90, rating: 4.8, studentsCount: 921,
      thumb: 'node', duration: '48h', lessonsCount: 7,
      lessons: [
        { id: 1, title: 'Node.js e o Event Loop', duration: '20min', type: 'video' },
        { id: 2, title: 'Express.js: Roteamento e Middleware', duration: '28min', type: 'video' },
        { id: 3, title: 'MongoDB e Mongoose', duration: '35min', type: 'video' },
        { id: 4, title: 'Autenticação com JWT', duration: '32min', type: 'video' },
        { id: 5, title: 'Upload de Arquivos e Validação', duration: '25min', type: 'video' },
        { id: 6, title: 'Testes com Jest', duration: '30min', type: 'video' },
        { id: 7, title: 'Projeto: API de E-commerce', duration: '85min', type: 'project' }
      ]
    },
    {
      id: 6, teacherId: 7,
      title: 'SQL e Banco de Dados Relacionais na Prática',
      description: 'Aprenda SQL do básico ao avançado. Modelagem, queries complexas, índices, stored procedures, transações e otimização de performance com MySQL e PostgreSQL.',
      category: 'Banco de Dados', level: 'Iniciante',
      price: 69.90, rating: 4.5, studentsCount: 1489,
      thumb: 'sql', duration: '35h', lessonsCount: 6,
      lessons: [
        { id: 1, title: 'Fundamentos de Banco de Dados', duration: '18min', type: 'video' },
        { id: 2, title: 'DDL: Criando Estruturas', duration: '22min', type: 'video' },
        { id: 3, title: 'DML: CRUD Completo', duration: '28min', type: 'video' },
        { id: 4, title: 'JOINs e Subqueries', duration: '38min', type: 'video' },
        { id: 5, title: 'Índices e Performance', duration: '32min', type: 'video' },
        { id: 6, title: 'Projeto: Sistema de Vendas', duration: '60min', type: 'project' }
      ]
    }
  ],

  enrollments: [
    { userId: 1, courseId: 1, enrolledAt: '2024-03-01', progress: 71 },
    { userId: 1, courseId: 2, enrolledAt: '2024-03-20', progress: 37 },
    { userId: 1, courseId: 5, enrolledAt: '2024-04-10', progress: 14 },
    { userId: 2, courseId: 3, enrolledAt: '2024-02-25', progress: 88 },
    { userId: 2, courseId: 4, enrolledAt: '2024-03-10', progress: 50 },
    { userId: 3, courseId: 1, enrolledAt: '2024-03-15', progress: 100 },
    { userId: 3, courseId: 6, enrolledAt: '2024-04-01', progress: 60 },
    { userId: 4, courseId: 3, enrolledAt: '2024-03-22', progress: 25 },
    { userId: 4, courseId: 2, enrolledAt: '2024-04-05', progress: 12 },
    { userId: 5, courseId: 5, enrolledAt: '2024-04-08', progress: 43 },
    { userId: 5, courseId: 6, enrolledAt: '2024-04-15', progress: 80 }
  ],

  completedLessons: []
};

/* --- Storage helpers --- */
function loadDB() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function resetDB() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

let DB = loadDB();

/* --- User helpers --- */
function findUser(email, password) {
  return DB.users.find(u => u.email === email && u.password === password) || null;
}

function createUser(name, email, password, role) {
  if (DB.users.find(u => u.email === email)) return null;
  const user = {
    id: Date.now(),
    name, email, password, role,
    bio: '',
    joined: new Date().toISOString().split('T')[0],
    color: ['#6366f1','#ec4899','#f97316','#22c55e','#a855f7','#0ea5e9'][Math.floor(Math.random()*6)]
  };
  DB.users.push(user);
  saveDB(DB);
  return user;
}

function updateUser(id, data) {
  const idx = DB.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  DB.users[idx] = { ...DB.users[idx], ...data };
  saveDB(DB);
  return DB.users[idx];
}

/* --- Course helpers --- */
function getCourses() { return DB.courses; }

function getCourseById(id) { return DB.courses.find(c => c.id === id) || null; }

function getCoursesByTeacher(teacherId) {
  return DB.courses.filter(c => c.teacherId === teacherId);
}

function createCourse(data) {
  const course = {
    id: Date.now(),
    ...data,
    rating: 0,
    studentsCount: 0,
    lessonsCount: data.lessons ? data.lessons.length : 0
  };
  DB.courses.push(course);
  saveDB(DB);
  return course;
}

function updateCourse(id, data) {
  const idx = DB.courses.findIndex(c => c.id === id);
  if (idx === -1) return null;
  DB.courses[idx] = { ...DB.courses[idx], ...data, lessonsCount: data.lessons ? data.lessons.length : DB.courses[idx].lessonsCount };
  saveDB(DB);
  return DB.courses[idx];
}

function deleteCourse(id) {
  DB.courses = DB.courses.filter(c => c.id !== id);
  DB.enrollments = DB.enrollments.filter(e => e.courseId !== id);
  saveDB(DB);
}

/* --- Enrollment helpers --- */
function getEnrollmentsByUser(userId) {
  return DB.enrollments.filter(e => e.userId === userId);
}

function getEnrollmentsByCourse(courseId) {
  return DB.enrollments.filter(e => e.courseId === courseId);
}

function isEnrolled(userId, courseId) {
  return DB.enrollments.some(e => e.userId === userId && e.courseId === courseId);
}

function enroll(userId, courseId) {
  if (isEnrolled(userId, courseId)) return;
  DB.enrollments.push({ userId, courseId, enrolledAt: new Date().toISOString().split('T')[0], progress: 0 });
  const course = getCourseById(courseId);
  if (course) { course.studentsCount = (course.studentsCount || 0) + 1; }
  saveDB(DB);
}

function updateProgress(userId, courseId, progress) {
  const enrollment = DB.enrollments.find(e => e.userId === userId && e.courseId === courseId);
  if (enrollment) {
    enrollment.progress = progress;
    saveDB(DB);
  }
}

function markLessonComplete(userId, courseId, lessonId) {
  const key = `${userId}_${courseId}_${lessonId}`;
  if (!DB.completedLessons.includes(key)) {
    DB.completedLessons.push(key);
    // recalculate progress
    const course = getCourseById(courseId);
    if (course) {
      const total = course.lessons.length;
      const done = course.lessons.filter(l => DB.completedLessons.includes(`${userId}_${courseId}_${l.id}`)).length;
      updateProgress(userId, courseId, Math.round((done / total) * 100));
    }
    saveDB(DB);
  }
}

function isLessonComplete(userId, courseId, lessonId) {
  return DB.completedLessons.includes(`${userId}_${courseId}_${lessonId}`);
}

/* --- Stats helpers --- */
function getTeacherStats(teacherId) {
  const courses = getCoursesByTeacher(teacherId);
  const courseIds = courses.map(c => c.id);
  const allEnrollments = DB.enrollments.filter(e => courseIds.includes(e.courseId));
  const uniqueStudents = new Set(allEnrollments.map(e => e.userId)).size;
  const revenue = courses.reduce((sum, c) => {
    const enrolled = DB.enrollments.filter(e => e.courseId === c.id).length;
    return sum + (enrolled * (c.price || 0));
  }, 0);
  return { totalCourses: courses.length, totalStudents: uniqueStudents, totalRevenue: revenue };
}

function getStudentStats(userId) {
  const enrollments = getEnrollmentsByUser(userId);
  const completed = enrollments.filter(e => e.progress === 100).length;
  const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
  return { total: enrollments.length, completed, inProgress };
}

function getAllStudents() {
  return DB.users.filter(u => u.role === 'student');
}

function getTeacherStudentsData(teacherId) {
  const courses = getCoursesByTeacher(teacherId);
  const courseIds = courses.map(c => c.id);
  const enrollments = DB.enrollments.filter(e => courseIds.includes(e.courseId));
  return enrollments.map(e => {
    const user = DB.users.find(u => u.id === e.userId);
    const course = getCourseById(e.courseId);
    return { ...e, userName: user?.name, userEmail: user?.email, userColor: user?.color, courseName: course?.title };
  });
}
