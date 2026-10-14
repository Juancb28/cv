import { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

/* =========================
   Datos
   ========================= */
const EMAIL = 'juanarroyobaquerizo2812@gmail.com';
const PHONE_LABEL = '(+593) 99 580 6330';
const WHATSAPP_URL =
  'https://wa.me/593995806330?text=Hola%20Juan%20Carlos,%20vi%20tu%20portafolio%20y%20me%20gustaría%20contactarte.';
const GITHUB_URL = 'https://github.com/Juancb28';
const LINKEDIN_URL = 'https://linkedin.com'; // TODO: reemplazar por la URL real del perfil
/* Rutas de /public respetando el `base` de Vite ('/cv/' en GitHub Pages) */
const BASE = import.meta.env.BASE_URL;
const PROFILE_IMG = `${BASE}img20260804_10252243.png`;
const PLACEHOLDER_IMG = `${BASE}profile.jpeg`;

/* Viñetas visibles por trabajo antes de "Show more" */
const VISIBLE_BULLETS = 2;

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
  { id: 'experience', label: 'Experience', icon: '⚡', color: 'text-amber-600 dark:text-amber-400' },
  { id: 'education', label: 'Education', icon: '🎓', color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'skills', label: 'Tech Stack', icon: '💻', color: 'text-purple-600 dark:text-purple-400' },
  { id: 'certifications', label: 'Certifications', icon: '🛡️', color: 'text-rose-600 dark:text-rose-400' },
];

const JOBS = [
  {
    title: 'AI and Backend Development',
    period: 'Apr 2026 – Jun 2026',
    company: 'Vibratio EC S.A.S. (Pericles Project) • Quito, Ecuador',
    bullets: [
      'Built RAG pipelines and multi-format legal document ingestion into the Qdrant vector database.',
      'Cut system response latency from ~2 min to ~20 s and reduced LLM token consumption.',
      'Developed secure Python microservices with FastAPI, including API security and access control.',
      'Designed intent flows and block-based conversational memory with automatic executive summaries.',
      'Ran Web and WhatsApp integration tests and managed versions with Git/GitHub under agile practices.',
    ],
  },
  {
    title: 'Digital Literacy & Cybersecurity Trainer',
    period: 'Oct 2024 – Feb 2025',
    company: 'Digital Inclusion Project • Quito, Ecuador',
    bullets: [
      'Trained priority groups in digital literacy and personal data protection.',
      'Created guides on secure technology adoption and information privacy.',
    ],
  },
];

const EDUCATION = [
  {
    institution: 'Escuela Politécnica Nacional (EPN)',
    degree: 'B.S. in Software Engineering',
    period: '2023 – Present',
    description: 'Software architecture, AI & machine learning, databases and information security.',
  },
  {
    institution: 'Colegio Militar Nº1 "Eloy Alfaro"',
    degree: 'High School Diploma in General Sciences',
    period: '2018 – 2021',
    description: 'Quito, Ecuador',
  },
];

const CERTIFICATIONS = [
  {
    title: 'Fundamentals and Trends in Artificial Intelligence',
    description: 'JISIC 2025 XII, Escuela Politécnica Nacional.',
  },
  {
    title: 'Practical Cybersecurity Labs (TryHackMe)',
    description: 'Vulnerability analysis, network scanning and penetration testing in virtual environments.',
  },
];

/* Habilidades agrupadas: más fáciles de escanear que una lista plana */
const SKILL_GROUPS = [
  {
    title: 'AI & Data',
    items: ['RAG', 'LangChain', 'Gemini / Gemma', 'Qdrant', 'MongoDB', 'PostgreSQL'],
  },
  {
    title: 'Backend',
    items: ['Python (FastAPI)', 'Java (Spring Boot)', 'REST APIs', 'Microservices', 'Git', 'Docker'],
  },
  {
    title: 'Security & Infra',
    items: ['Cybersecurity', 'Vulnerability Analysis', 'Linux (Arch/Kali)', 'VMware'],
  },
];

/* Orden de las secciones en cada columna (vista Overview) */
const LEFT_SECTIONS = ['experience', 'education', 'certifications'];
const RIGHT_SECTIONS = ['skills'];

/* Clases reutilizables */
const BTN_PILL = 'px-4 py-2.5 rounded-xl neu-button text-sm font-semibold flex items-center gap-2';
const TEXT_MUTED = 'text-[#4a5568] dark:text-neutral-300';
const TEXT_SUBTLE = 'text-[#606f7b] dark:text-neutral-400';
const ACCENT = 'text-[#3182ce] dark:text-blue-300';

/* =========================
   Utilidades
   ========================= */
function getInitialDarkMode() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
  } catch {
    /* almacenamiento no disponible */
  }
  // Sin preferencia guardada: respeta la configuración del sistema
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function handleImgError(e) {
  const img = e.currentTarget;
  img.onerror = null; // evita bucle si el placeholder también falla
  img.src = PLACEHOLDER_IMG;
}

/* =========================
   Secciones de contenido
   ========================= */
function SectionTitle({ icon, children }) {
  return (
    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
      <span aria-hidden="true">{icon}</span> {children}
    </h3>
  );
}

function JobItem({ job }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = job.bullets.length - VISIBLE_BULLETS;
  const bullets = expanded ? job.bullets : job.bullets.slice(0, VISIBLE_BULLETS);

  return (
    <div className="relative pl-6 border-l-2 border-[#b8bec9] dark:border-neutral-700">
      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full neu-inset border-2 border-[#4a5568] dark:border-neutral-500"></div>
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
        <h4 className="font-bold text-base">{job.title}</h4>
        <span className={`text-xs font-bold whitespace-nowrap ${ACCENT}`}>{job.period}</span>
      </div>
      <p className={`text-xs font-semibold mb-3 ${TEXT_SUBTLE}`}>{job.company}</p>

      <ul className={`space-y-2 text-sm leading-relaxed ${TEXT_MUTED}`}>
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className={`font-bold ${ACCENT}`} aria-hidden="true">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={`mt-3 text-xs font-bold ${ACCENT} hover:underline`}
        >
          {expanded ? 'Show less ↑' : `Show ${hidden} more ↓`}
        </button>
      )}
    </div>
  );
}

function ExperienceSection() {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="⚡">Professional Experience</SectionTitle>
      <div className="space-y-8">
        {JOBS.map((job) => (
          <JobItem key={job.title} job={job} />
        ))}
      </div>
    </div>
  );
}

function EducationSection() {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="🎓">Education</SectionTitle>
      <div className="space-y-5">
        {EDUCATION.map((edu) => (
          <div key={edu.institution} className="p-4 rounded-2xl neu-inset">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h4 className="font-bold text-sm sm:text-base">{edu.institution}</h4>
                <p className={`text-sm font-semibold ${ACCENT}`}>{edu.degree}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg neu-flat-sm whitespace-nowrap">{edu.period}</span>
            </div>
            <p className={`text-sm mt-2 ${TEXT_MUTED}`}>{edu.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificationsSection() {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="🛡️">Certifications &amp; Training</SectionTitle>
      <div className="space-y-4">
        {CERTIFICATIONS.map((cert) => (
          <div key={cert.title} className="p-4 rounded-2xl neu-flat-sm">
            <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
            <p className={`text-sm ${TEXT_MUTED}`}>{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection() {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="💻">Technical Skills</SectionTitle>

      <div className="space-y-5 mb-6">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_SUBTLE}`}>{group.title}</h4>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span key={skill} className={`px-3 py-1.5 rounded-xl neu-flat-sm text-xs font-semibold ${TEXT_MUTED}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_SUBTLE}`}>Languages</h4>
      <p className={`text-sm ${TEXT_MUTED}`}>Spanish (Native) • English (B2)</p>
    </div>
  );
}

const SECTION_COMPONENTS = {
  experience: ExperienceSection,
  education: EducationSection,
  certifications: CertificationsSection,
  skills: SkillsSection,
};

/* =========================
   Componente principal
   ========================= */
export default function App() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashboardRef = useRef(null);
  const isFirstRender = useRef(true);

  // Sincroniza el tema con <html> y localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.classList.toggle('light', !darkMode);
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch {
      /* almacenamiento no disponible */
    }
  }, [darkMode]);

  // Al cambiar de pestaña, lleva la vista al dashboard (no en la carga inicial)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab]);

  // Modal: cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    if (!isModalOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsModalOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const featured = activeTab !== 'overview' ? activeTab : null;
  const FeaturedSection = featured ? SECTION_COMPONENTS[featured] : null;

  return (
    <div className="min-h-screen pb-16 bg-[#E4EBF5] text-[#2D3748] dark:bg-[#1e1e1e] dark:text-neutral-100 selection:bg-blue-500 selection:text-white">

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[#E4EBF5]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md px-6 py-4 shadow-[0_8px_16px_rgba(163,177,198,0.5),0_-8px_16px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.45)] mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full neu-inset flex items-center justify-center font-bold">
              JA
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">Juan Carlos Arroyo Baquerizo</h1>
              <p className={`text-xs font-medium ${TEXT_SUBTLE}`}>Junior Cybersecurity Analyst | AI Developer</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold flex items-center gap-2"
            >
              <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl neu-button text-xs font-bold"
            >
              Contact
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero Profile Section */}
        <section className="neu-flat rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl p-2 neu-inset">
              <img
                src={PROFILE_IMG}
                alt="Juan Carlos Arroyo Baquerizo"
                className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                onError={handleImgError}
              />
            </div>
            <span
              className="absolute bottom-4 right-4 w-4 h-4 bg-emerald-500 border-2 border-[#E4EBF5] dark:border-[#1e1e1e] rounded-full animate-pulse"
              title="Available for work"
            ></span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold neu-inset mb-3 ${TEXT_MUTED}`}>
              📍 Quito, Ecuador
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">Juan Carlos Arroyo Baquerizo</h2>
            <p className={`text-sm sm:text-base font-medium mb-6 max-w-xl mx-auto md:mx-0 ${TEXT_MUTED}`}>
              Cybersecurity analyst and AI developer building secure backends, RAG pipelines and LLM integrations.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a href={`mailto:${EMAIL}`} className={BTN_PILL}>
                <span aria-hidden="true">✉️</span> Email
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_PILL}
                aria-label={`Phone and WhatsApp ${PHONE_LABEL}`}
              >
                <FaPhoneAlt className={ACCENT} aria-hidden="true" />
                <FaWhatsapp className="text-base text-[#25D366]" aria-hidden="true" />
                <span>{PHONE_LABEL}</span>
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={BTN_PILL}>
                <span aria-hidden="true">🐙</span> GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={BTN_PILL}>
                <span aria-hidden="true">💼</span> LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* Navegación por secciones */}
        <nav ref={dashboardRef} className="mb-10 scroll-mt-32" aria-label="Portfolio sections">
          <div className="flex items-baseline justify-between gap-3 mb-4 px-2">
            <h3 className="text-lg font-bold">Explore my profile</h3>
            <p className={`hidden sm:block text-xs ${TEXT_SUBTLE}`}>Pick a section to focus on it</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id ? 'active neu-inset' : 'neu-button'
                }`}
              >
                <span className={`text-2xl ${tab.color}`} aria-hidden="true">{tab.icon}</span>
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Sección elegida: centrada debajo de la navegación */}
        {FeaturedSection && (
          <section key={featured} className="featured-section max-w-3xl mx-auto mb-12">
            <FeaturedSection />
          </section>
        )}

        {/* Vista completa: solo en Overview */}
        {!featured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-8 lg:col-span-2">
              {LEFT_SECTIONS.map((id) => {
                const Section = SECTION_COMPONENTS[id];
                return <Section key={id} />;
              })}
            </div>
            <div className="space-y-8">
              {RIGHT_SECTIONS.map((id) => {
                const Section = SECTION_COMPONENTS[id];
                return <Section key={id} />;
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal de contacto */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="neu-flat rounded-3xl p-6 sm:p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 rounded-full neu-flat-sm flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
            <h3 id="contact-title" className="text-lg font-bold mb-1">Let&apos;s talk</h3>
            <p className={`text-sm mb-6 ${TEXT_SUBTLE}`}>Choose how you&apos;d like to reach me.</p>

            <div className="space-y-4">
              <a href={`mailto:${EMAIL}`} className="block p-4 rounded-xl neu-inset hover:opacity-80 transition-opacity">
                <p className={`text-sm font-bold ${ACCENT}`}>✉️ Email</p>
                <p className={`text-xs break-all ${TEXT_SUBTLE}`}>{EMAIL}</p>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl neu-inset hover:opacity-80 transition-opacity">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <FaPhoneAlt aria-hidden="true" />
                  <FaWhatsapp className="text-base text-[#25D366]" aria-hidden="true" />
                  <span>Phone / WhatsApp</span>
                </p>
                <p className={`text-xs ${TEXT_SUBTLE}`}>{PHONE_LABEL}</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 text-center text-xs text-[#718096] dark:text-neutral-500">
        <p>© 2026 Juan Carlos Arroyo Baquerizo</p>
      </footer>
    </div>
  );
}