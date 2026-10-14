import { useState, useEffect } from 'react';

/* =========================
   Datos
   ========================= */
const EMAIL = 'juanarroyobaquerizo2812@gmail.com';
const WHATSAPP_URL =
  'https://wa.me/593995806330?text=Hola%20Juan%20Carlos,%20vi%20tu%20portafolio%20y%20me%20gustaría%20contactarte.';
const PLACEHOLDER_IMG = 'https://placehold.co/400x400/E4EBF5/2D3748?text=JAB';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
  { id: 'experience', label: 'Experience', icon: '⚡', color: 'text-amber-600 dark:text-amber-400' },
  { id: 'education', label: 'Education', icon: '🎓', color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'skills', label: 'Tech Stack', icon: '💻', color: 'text-purple-600 dark:text-purple-400' },
  { id: 'certifications', label: 'Certifications', icon: '🛡️', color: 'text-rose-600 dark:text-rose-400' },
  { id: 'contact', label: 'API Contact', icon: '📨', color: 'text-indigo-600 dark:text-indigo-400' },
];

const JOBS = [
  {
    title: 'AI and Backend Development',
    period: 'April 2026 – June 2026',
    company: 'Vibratio EC S.A.S. (Pericles Project) • Quito, Ecuador',
    bullets: [
      'Designed and developed Retrieval-Augmented Generation (RAG) pipelines and mass multi-format legal document ingestion into the Qdrant vector database.',
      'Refactored processing pipelines and queries, reducing system response latency from ~2 min to ~20 seconds and optimizing LLM token consumption.',
      'Built robust Python microservices using FastAPI, implementing security mechanisms for API consumption and access control management.',
      'Constructed intent flows and block-based conversational memory with automatic executive summaries within a microservices architecture.',
      'Executed integration testing (Web and WhatsApp) and version control using Git and GitHub under agile methodologies.',
    ],
  },
  {
    title: 'Digital Literacy & Cybersecurity Trainer',
    period: 'October 2024 – February 2025',
    company: 'Digital Inclusion Project • Quito, Ecuador',
    bullets: [
      'Provided personalized training in digital literacy and basic cybersecurity best practices for personal data protection to priority groups.',
      'Created methodological guides focused on secure technology adoption and information privacy.',
    ],
  },
];

const EDUCATION = [
  {
    institution: 'Escuela Politécnica Nacional (EPN)',
    degree: 'B.S. in Software Engineering',
    period: '2023 – Present',
    description:
      'Quito, Ecuador • Focus on software architecture, algorithms, artificial intelligence and machine learning, databases, and information security.',
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
    title: 'Self-taught Training and Practical Labs in Cybersecurity',
    description:
      'Virtual environments, vulnerability analysis, network scanning, and penetration testing labs on TryHackMe.',
  },
];

const SKILLS = [
  'Python (FastAPI)', 'Java (Spring Boot)', 'RAG', 'Qdrant', 'MongoDB',
  'PostgreSQL', 'LangChain', 'Gemini / Gemma', 'Cybersecurity',
  'Vulnerability Analysis', 'Git', 'Docker', 'Linux (Arch/Kali)',
  'VMware', 'REST APIs', 'Microservices',
];

/* =========================
   Utilidades
   ========================= */
function getInitialDarkMode() {
  try {
    return localStorage.getItem('theme') === 'dark';
  } catch {
    return false;
  }
}

function handleImgError(e) {
  const img = e.currentTarget;
  img.onerror = null; // evita bucle si el placeholder también falla
  img.src = PLACEHOLDER_IMG;
}

/* =========================
   Componente principal
   ========================= */
export default function App() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado del formulario
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

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

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus(null);

    setTimeout(() => {
      setSubmitting(false);
      if (formName && formEmail && formMessage) {
        setFormStatus({
          success: true,
          text: 'Success! Message processed by Express.js API and saved to MongoDB.',
        });
        setFormName('');
        setFormEmail('');
        setFormMessage('');
      } else {
        setFormStatus({ success: false, text: 'Error: Please fill in all required fields.' });
      }
    }, 1000);
  };

  const showPane = (paneId) => activeTab === 'overview' || activeTab === paneId;

  return (
    <div className="min-h-screen pb-16 bg-[#E4EBF5] text-[#2D3748] dark:bg-[#0f172a] dark:text-slate-100 selection:bg-blue-500 selection:text-white">

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#E4EBF5]/90 dark:bg-[#0f172a]/90 backdrop-blur-md px-6 py-4 shadow-[0_8px_16px_rgba(163,177,198,0.5),0_-8px_16px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.5)] mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full neu-inset flex items-center justify-center font-bold">
              JA
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight">Juan Carlos Arroyo Baquerizo</h1>
              <p className="text-xs text-[#606f7b] dark:text-slate-400 font-medium">
                Junior Cybersecurity Analyst | AI Developer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3.5 py-2 rounded-xl neu-button text-xs font-bold flex items-center gap-2"
            >
              <span>{darkMode ? '☀️' : '🌙'}</span>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl neu-button text-xs font-bold"
            >
              Quick Contact
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero Profile Section */}
        <section className="neu-flat rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl p-2 neu-inset">
              <img
                src="/img20260804_10252243.png"
                alt="Juan Carlos Arroyo Baquerizo"
                className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                onError={handleImgError}
              />
            </div>
            <span className="absolute bottom-4 right-4 w-4 h-4 bg-emerald-500 border-2 border-[#E4EBF5] dark:border-[#1a202c] rounded-full animate-pulse"></span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold neu-inset text-[#4a5568] dark:text-slate-300 mb-3">
              Quito, Ecuador
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-2">Juan Carlos Arroyo Baquerizo</h2>
            <p className="text-sm sm:text-base font-medium text-[#4a5568] dark:text-slate-300 mb-6">
              Junior Cybersecurity Analyst &amp; AI Developer specializing in secure software architectures,
              Retrieval-Augmented Generation (RAG) pipelines, and LLM integrations.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a href={`mailto:${EMAIL}`} className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold flex items-center gap-2">
                ✉️ Email Me
              </a>
              <a href="https://github.com/Juancb28" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold flex items-center gap-2">
                🐙 GitHub: Juancb28
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold flex items-center gap-2">
                💼 LinkedIn
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl neu-button text-xs font-bold flex items-center gap-2">
                📞 (+593) 99 580 6330
              </a>
            </div>
          </div>
        </section>

        {/* Interactive Neumorphic Navigation Controller */}
        <section className="mb-10">
          <h3 className="text-lg font-bold mb-4 px-2">Interactive Dashboard</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id ? 'active neu-inset' : 'neu-button'
                }`}
              >
                <span className={`text-2xl ${tab.color}`}>{tab.icon}</span>
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Main Content Pane */}
          <div className="lg:col-span-2 space-y-8">

            {/* Experience Pane */}
            {showPane('experience') && (
              <div className="neu-flat rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>⚡</span> Professional Experience
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full neu-inset">Active</span>
                </div>

                <div className="space-y-8">
                  {JOBS.map((job) => (
                    <div key={job.title} className="relative pl-6 border-l-2 border-[#b8bec9] dark:border-slate-700">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full neu-inset border-2 border-[#4a5568]"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <h4 className="font-bold text-base">{job.title}</h4>
                        <span className="text-xs font-bold text-[#3182ce] dark:text-blue-400">{job.period}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#4a5568] dark:text-slate-400 mb-3">{job.company}</p>
                      <ul className="space-y-2 text-xs text-[#4a5568] dark:text-slate-300 leading-relaxed">
                        {job.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <span className="text-[#3182ce] font-bold">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Pane */}
            {showPane('education') && (
              <div className="neu-flat rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>🎓</span> Education
                </h3>
                <div className="space-y-6">
                  {EDUCATION.map((edu) => (
                    <div key={edu.institution} className="p-4 rounded-2xl neu-inset">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base">{edu.institution}</h4>
                          <p className="text-xs text-[#3182ce] dark:text-blue-400 font-semibold">{edu.degree}</p>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg neu-flat-sm">{edu.period}</span>
                      </div>
                      <p className="text-xs text-[#4a5568] dark:text-slate-300 mt-2">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Pane */}
            {showPane('certifications') && (
              <div className="neu-flat rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>🛡️</span> Certifications &amp; Training
                </h3>
                <div className="space-y-4">
                  {CERTIFICATIONS.map((cert) => (
                    <div key={cert.title} className="p-4 rounded-2xl neu-flat-sm">
                      <h4 className="font-bold text-xs sm:text-sm mb-1">{cert.title}</h4>
                      <p className="text-xs text-[#4a5568] dark:text-slate-300">{cert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar Pane */}
          <div className="space-y-8">

            {/* Tech Stack & Skills */}
            {showPane('skills') && (
              <div className="neu-flat rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>💻</span> Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {SKILLS.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl neu-flat-sm text-xs font-semibold text-[#4a5568] dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>

                <h4 className="font-bold text-sm mb-3">Languages &amp; Interests</h4>
                <div className="space-y-3 text-xs text-[#4a5568] dark:text-slate-300">
                  <p><strong>Languages:</strong> Spanish (Native), English (Intermediate - B2).</p>
                  <p>
                    <strong>Interests:</strong> Fiction and philosophical literature, handheld GPS navigation for
                    hiking and mountaineering, offensive/defensive cybersecurity.
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Express API Contact Form */}
            {showPane('contact') && (
              <div className="neu-flat rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <span>📨</span> Express Backend Contact
                </h3>
                <p className="text-xs text-[#606f7b] dark:text-slate-400 mb-6">
                  Send a message directly to simulated Node.js/Express API endpoint.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contactName" className="block text-xs font-bold text-[#4a5568] dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl neu-inset border-none text-xs focus:outline-none bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-xs font-bold text-[#4a5568] dark:text-slate-300 mb-1">
                      Your Email
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl neu-inset border-none text-xs focus:outline-none bg-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactMessage" className="block text-xs font-bold text-[#4a5568] dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="contactMessage"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      rows={3}
                      required
                      placeholder="Let's collaborate on AI or Cybersecurity..."
                      className="w-full px-4 py-3 rounded-xl neu-inset border-none text-xs focus:outline-none resize-none bg-transparent"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl neu-button text-xs font-bold"
                  >
                    {submitting ? 'Transmitting to Server...' : 'Submit via Express API'}
                  </button>

                  {formStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold ${
                        formStatus.success
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                      }`}
                    >
                      {formStatus.text}
                    </div>
                  )}
                </form>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Quick Modal Dialog */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="neu-flat rounded-3xl p-6 sm:p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full neu-flat-sm flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">Hello Friend!</h3>
            <p className="text-xs text-[#606f7b] dark:text-slate-400 mb-6">
              Enter your details and connect instantly with Juan Carlos Arroyo Baquerizo.
            </p>

            <div className="space-y-4 mb-6">
              <a href={`mailto:${EMAIL}`} className="block p-3 rounded-xl neu-inset hover:opacity-80 transition-opacity">
                <p className="text-xs font-bold text-[#3182ce] dark:text-blue-400">✉️ Email</p>
                <p className="text-xs text-[#606f7b] dark:text-slate-300">{EMAIL}</p>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl neu-inset hover:opacity-80 transition-opacity">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">📞 Phone / WhatsApp</p>
                <p className="text-xs text-[#606f7b] dark:text-slate-300">(+593) 99 580 6330 • Quito, Ecuador</p>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-xl neu-button text-xs font-bold"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 text-center text-xs text-[#718096] dark:text-slate-500">
        <p>© 2026 Juan Carlos Arroyo Baquerizo • Built with React, Vite, Tailwind CSS &amp; Neumorphism</p>
      </footer>
    </div>
  );
}