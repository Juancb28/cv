import { useState, useEffect, useRef } from 'react';
import {
  FaWhatsapp, FaBrain, FaLink, FaRobot, FaDatabase,
  FaExchangeAlt, FaCubes, FaBug, FaDownload, FaChevronDown,
  FaCheck, FaFilePdf,
} from 'react-icons/fa';
import {
  SiPython, SiSpringboot, SiMongodb, SiPostgresql, SiGit, SiDocker,
  SiKalilinux, SiArchlinux, SiVmware,
} from 'react-icons/si';
import { SpainFlag, USFlag } from './components/Flags.jsx';
import { translations } from './translations.js';

/* =========================
   Datos generales y rutas
   ========================= */
const EMAIL = 'juanarroyobaquerizo2812@gmail.com';
const PHONE_LABEL = '(+593) 99 580 6330';
const GITHUB_URL = 'https://github.com/Juancb28';
const LINKEDIN_URL = 'https://linkedin.com';

/* Rutas de /public respetando el `base` de Vite ('/cv/' en producción / GitHub Pages) */
const BASE = import.meta.env.BASE_URL;
const PROFILE_IMG = `${BASE}profile.jpeg`;
const PLACEHOLDER_IMG = `${BASE}profile.jpeg`;
const CV_ES_PATH = `${BASE}CV_Juan_Carlos_Arroyo_Baquerizo_ES.pdf`;
const CV_EN_PATH = `${BASE}CV_Juan_Carlos_Arroyo_Baquerizo_EN.pdf`;

/* Viñetas visibles por trabajo antes de "Show more" */
const VISIBLE_BULLETS = 2;

const TAB_DEFS = [
  { id: 'overview', icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
  { id: 'experience', icon: '⚡', color: 'text-amber-600 dark:text-amber-400' },
  { id: 'education', icon: '🎓', color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'skills', icon: '💻', color: 'text-purple-600 dark:text-purple-400' },
  { id: 'certifications', icon: '🛡️', color: 'text-rose-600 dark:text-rose-400' },
];

/* Habilidades agrupadas con soporte para traducción */
const SKILL_GROUPS = [
  {
    groupKey: 'aiData',
    items: [
      { name: 'RAG', Icon: FaBrain, color: '#D53F8C' },
      { name: 'LangChain', Icon: FaLink, color: '#1C8C6E' },
      { name: 'Gemini / Gemma', Icon: FaRobot, color: '#8E75F2' },
      { name: 'Qdrant', Icon: FaDatabase, color: '#DC244C' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
    ],
  },
  {
    groupKey: 'backend',
    items: [
      { name: 'Python (FastAPI)', Icon: SiPython, color: '#3776AB' },
      { name: 'Java (Spring Boot)', Icon: SiSpringboot, color: '#6DB33F' },
      { name: 'REST APIs', Icon: FaExchangeAlt, color: '#3182CE' },
      { nameKey: 'Microservices', defaultName: 'Microservices', Icon: FaCubes, color: '#DD6B20' },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
    ],
  },
  {
    groupKey: 'securityInfra',
    items: [
      { nameKey: 'Cybersecurity', defaultName: 'Cybersecurity', Icon: SiKalilinux, color: '#557C94' },
      { nameKey: 'Vulnerability Analysis', defaultName: 'Vulnerability Analysis', Icon: FaBug, color: '#E53E3E' },
      { name: 'Linux (Arch/Kali)', Icon: SiArchlinux, color: '#1793D1' },
      { name: 'VMware', Icon: SiVmware, color: '#718096' },
    ],
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
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* almacenamiento no disponible */
  }
  const browserLang = window.navigator?.language?.toLowerCase() ?? '';
  return browserLang.startsWith('es') ? 'es' : 'en';
}

function handleImgError(e) {
  const img = e.currentTarget;
  img.onerror = null;
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

function JobItem({ job, t }) {
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
          className={`mt-3 text-xs font-bold ${ACCENT} hover:underline cursor-pointer`}
        >
          {expanded ? t.experience.showLess : t.experience.showMore(hidden)}
        </button>
      )}
    </div>
  );
}

function ExperienceSection({ t }) {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="⚡">{t.experience.title}</SectionTitle>
      <div className="space-y-8">
        {t.experience.jobs.map((job) => (
          <JobItem key={job.title} job={job} t={t} />
        ))}
      </div>
    </div>
  );
}

function EducationSection({ t }) {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="🎓">{t.education.title}</SectionTitle>
      <div className="space-y-5">
        {t.education.items.map((edu) => (
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

function CertificationsSection({ t }) {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="🛡️">{t.certifications.title}</SectionTitle>
      <div className="space-y-4">
        {t.certifications.items.map((cert) => (
          <div key={cert.title} className="p-4 rounded-2xl neu-flat-sm">
            <h4 className="font-bold text-sm mb-1">{cert.title}</h4>
            <p className={`text-sm ${TEXT_MUTED}`}>{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ t }) {
  return (
    <div className="neu-flat rounded-3xl p-6 sm:p-8">
      <SectionTitle icon="💻">{t.skills.title}</SectionTitle>

      <div className="space-y-5 mb-6">
        {SKILL_GROUPS.map((group) => {
          const groupTitle = t.skills.groups[group.groupKey] || group.groupKey;
          return (
            <div key={group.groupKey}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_SUBTLE}`}>{groupTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {group.items.map(({ name, nameKey, defaultName, Icon, color }) => {
                  const displayName = nameKey ? (t.skills.names[nameKey] || defaultName) : name;
                  return (
                    <span
                      key={displayName}
                      className={`px-3 py-1.5 rounded-xl neu-flat-sm text-xs font-semibold flex items-center gap-1.5 ${TEXT_MUTED}`}
                    >
                      <Icon className="text-sm shrink-0" style={{ color }} aria-hidden="true" />
                      {displayName}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${TEXT_SUBTLE}`}>{t.skills.languagesHeading}</h4>
      <p className={`text-sm ${TEXT_MUTED}`}>{t.skills.languagesContent}</p>
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
  const [lang, setLang] = useState(getInitialLanguage);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCvMenuOpen, setIsCvMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const dashboardRef = useRef(null);
  const isFirstRender = useRef(true);
  const cvDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const t = translations[lang] || translations.es;

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

  // Sincroniza el idioma con <html> y localStorage
  useEffect(() => {
    try {
      localStorage.setItem('language', lang);
    } catch {
      /* almacenamiento no disponible */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // Cierra los menús desplegables al hacer clic afuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (cvDropdownRef.current && !cvDropdownRef.current.contains(event.target)) {
        setIsCvMenuOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsCvMenuOpen(false);
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full neu-inset flex items-center justify-center font-bold">
              JA
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">Juan Carlos Arroyo Baquerizo</h1>
              <p className={`text-xs font-medium ${TEXT_SUBTLE}`}>{t.meta.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Botón de tema claro / oscuro */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? t.nav.ariaLight : t.nav.ariaDark}
              className="px-3 py-2 rounded-xl neu-button text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? t.nav.lightMode : t.nav.darkMode}</span>
            </button>

            {/* Botón de descarga de CV con menú emergente localizado */}
            <div className="relative" ref={cvDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCvMenuOpen((prev) => !prev);
                  setIsLangMenuOpen(false);
                }}
                aria-expanded={isCvMenuOpen}
                aria-haspopup="true"
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCvMenuOpen ? 'neu-inset' : 'neu-button'
                }`}
              >
                <FaDownload className="text-xs text-[#3182ce] dark:text-blue-300" aria-hidden="true" />
                <span>{t.nav.downloadCv}</span>
                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 ${isCvMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Menú emergente de opciones de CV (no difumina la pantalla) */}
              {isCvMenuOpen && (
                <div
                  className="absolute right-0 sm:left-0 top-full mt-2 w-64 neu-flat rounded-2xl p-2.5 z-50 shadow-xl border border-black/5 dark:border-white/10"
                  role="menu"
                  aria-label={t.nav.downloadCv}
                >
                  <div className="px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#606f7b] dark:text-neutral-400 flex items-center justify-between border-b border-[#b8bec9]/40 dark:border-neutral-700 pb-1.5">
                    <span>{t.nav.selectVersion}</span>
                    <FaFilePdf className="text-rose-500 text-xs" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {/* CV en Español */}
                    <a
                      href={CV_ES_PATH}
                      download="CV_Juan_Carlos_Arroyo_Baquerizo_ES.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsCvMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 p-2.5 rounded-xl neu-flat-sm hover:neu-inset transition-all cursor-pointer group"
                    >
                      <SpainFlag className="w-6 h-4 rounded-sm shadow-xs shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#2D3748] dark:text-neutral-100 group-hover:text-[#3182ce] dark:group-hover:text-blue-300 transition-colors">
                          {t.nav.cvSpanish}
                        </p>
                        <p className="text-[10px] text-[#606f7b] dark:text-neutral-400">{t.nav.cvSpanishDesc}</p>
                      </div>
                      <FaDownload
                        className="text-xs text-[#606f7b] dark:text-neutral-400 group-hover:text-[#3182ce] dark:group-hover:text-blue-300 transition-colors shrink-0"
                        aria-hidden="true"
                      />
                    </a>

                    {/* CV en Inglés */}
                    <a
                      href={CV_EN_PATH}
                      download="CV_Juan_Carlos_Arroyo_Baquerizo_EN.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsCvMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-3 p-2.5 rounded-xl neu-flat-sm hover:neu-inset transition-all cursor-pointer group"
                    >
                      <USFlag className="w-6 h-4 rounded-sm shadow-xs shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#2D3748] dark:text-neutral-100 group-hover:text-[#3182ce] dark:group-hover:text-blue-300 transition-colors">
                          {t.nav.cvEnglish}
                        </p>
                        <p className="text-[10px] text-[#606f7b] dark:text-neutral-400">{t.nav.cvEnglishDesc}</p>
                      </div>
                      <FaDownload
                        className="text-xs text-[#606f7b] dark:text-neutral-400 group-hover:text-[#3182ce] dark:group-hover:text-blue-300 transition-colors shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Contact */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold cursor-pointer"
            >
              {t.nav.contact}
            </button>

            {/* Botón de selección de idioma (a la derecha de Contact) */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsLangMenuOpen((prev) => !prev);
                  setIsCvMenuOpen(false);
                }}
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
                aria-label={t.nav.selectLanguage}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLangMenuOpen ? 'neu-inset' : 'neu-button'
                }`}
              >
                {lang === 'es' ? (
                  <SpainFlag className="w-4 h-3 rounded-xs shrink-0" />
                ) : (
                  <USFlag className="w-4 h-3 rounded-xs shrink-0" />
                )}
                <span>{lang.toUpperCase()}</span>
                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Menú de idiomas */}
              {isLangMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 neu-flat rounded-2xl p-2 z-50 shadow-xl border border-black/5 dark:border-white/10"
                  role="menu"
                  aria-label={t.nav.selectLanguage}
                >
                  <div className="px-2 py-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-[#606f7b] dark:text-neutral-400 border-b border-[#b8bec9]/40 dark:border-neutral-700 pb-1.5">
                    <span>{t.nav.language}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {/* Español */}
                    <button
                      type="button"
                      onClick={() => {
                        setLang('es');
                        setIsLangMenuOpen(false);
                      }}
                      role="menuitem"
                      className={`flex items-center justify-between w-full p-2.5 rounded-xl transition-all cursor-pointer ${
                        lang === 'es'
                          ? 'neu-inset text-[#3182ce] dark:text-blue-300 font-bold'
                          : 'neu-flat-sm hover:neu-inset text-[#2D3748] dark:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SpainFlag className="w-5 h-3.5 rounded-xs shrink-0" />
                        <span className="text-xs">Español</span>
                        <span className="text-[10px] text-[#606f7b] dark:text-neutral-400 font-semibold">(ES)</span>
                      </div>
                      {lang === 'es' && (
                        <FaCheck className="text-xs text-[#3182ce] dark:text-blue-300" aria-hidden="true" />
                      )}
                    </button>

                    {/* Inglés */}
                    <button
                      type="button"
                      onClick={() => {
                        setLang('en');
                        setIsLangMenuOpen(false);
                      }}
                      role="menuitem"
                      className={`flex items-center justify-between w-full p-2.5 rounded-xl transition-all cursor-pointer ${
                        lang === 'en'
                          ? 'neu-inset text-[#3182ce] dark:text-blue-300 font-bold'
                          : 'neu-flat-sm hover:neu-inset text-[#2D3748] dark:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <USFlag className="w-5 h-3.5 rounded-xs shrink-0" />
                        <span className="text-xs">English</span>
                        <span className="text-[10px] text-[#606f7b] dark:text-neutral-400 font-semibold">(EN)</span>
                      </div>
                      {lang === 'en' && (
                        <FaCheck className="text-xs text-[#3182ce] dark:text-blue-300" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              title={t.meta.available}
            ></span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold neu-inset mb-3 ${TEXT_MUTED}`}>
              {t.meta.location}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">Juan Carlos Arroyo Baquerizo</h2>
            <p className={`text-sm sm:text-base font-medium mb-6 max-w-xl mx-auto md:mx-0 ${TEXT_MUTED}`}>
              {t.meta.bio}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a href={`mailto:${EMAIL}`} className={BTN_PILL}>
                <span aria-hidden="true">✉️</span> {t.hero.email}
              </a>
              <a
                href={t.hero.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_PILL}
                aria-label={t.hero.whatsappAria}
              >
                <FaWhatsapp className="text-base text-[#25D366]" aria-hidden="true" />
                <span>{PHONE_LABEL}</span>
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={BTN_PILL}>
                <span aria-hidden="true">🐙</span> {t.hero.github}
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={BTN_PILL}>
                <span aria-hidden="true">💼</span> {t.hero.linkedin}
              </a>
            </div>
          </div>
        </section>

        {/* Navegación por secciones */}
        <nav ref={dashboardRef} className="mb-10 scroll-mt-32" aria-label={t.tabs.heading}>
          <div className="flex items-baseline justify-between gap-3 mb-4 px-2">
            <h3 className="text-lg font-bold">{t.tabs.heading}</h3>
            <p className={`hidden sm:block text-xs ${TEXT_SUBTLE}`}>{t.tabs.subheading}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {TAB_DEFS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id ? 'active neu-inset' : 'neu-button'
                }`}
              >
                <span className={`text-2xl ${tab.color}`} aria-hidden="true">{tab.icon}</span>
                <span className="text-xs font-semibold">{t.tabs[tab.id]}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Sección elegida: centrada debajo de la navegación */}
        {FeaturedSection && (
          <section key={featured} className="featured-section max-w-3xl mx-auto mb-12">
            <FeaturedSection t={t} />
          </section>
        )}

        {/* Vista completa: solo en Overview */}
        {!featured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-8 lg:col-span-2">
              {LEFT_SECTIONS.map((id) => {
                const Section = SECTION_COMPONENTS[id];
                return <Section key={id} t={t} />;
              })}
            </div>
            <div className="space-y-8">
              {RIGHT_SECTIONS.map((id) => {
                const Section = SECTION_COMPONENTS[id];
                return <Section key={id} t={t} />;
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
              aria-label={t.contactModal.close}
              className="absolute top-4 right-4 w-8 h-8 rounded-full neu-flat-sm flex items-center justify-center text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 id="contact-title" className="text-lg font-bold mb-1">{t.contactModal.title}</h3>
            <p className={`text-sm mb-6 ${TEXT_SUBTLE}`}>{t.contactModal.subtitle}</p>

            <div className="space-y-4">
              <a href={`mailto:${EMAIL}`} className="block p-4 rounded-xl neu-inset hover:opacity-80 transition-opacity">
                <p className={`text-sm font-bold ${ACCENT}`}>✉️ {t.contactModal.email}</p>
                <p className={`text-xs break-all ${TEXT_SUBTLE}`}>{EMAIL}</p>
              </a>
              <a
                href={t.hero.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl neu-inset hover:opacity-80 transition-opacity"
              >
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <FaWhatsapp className="text-base text-[#25D366]" aria-hidden="true" />
                  <span>{t.contactModal.phone}</span>
                </p>
                <p className={`text-xs ${TEXT_SUBTLE}`}>{PHONE_LABEL}</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 text-center text-xs text-[#718096] dark:text-neutral-500">
        <p>{t.footer.copyright}</p>
      </footer>
    </div>
  );
}