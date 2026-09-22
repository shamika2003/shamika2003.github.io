import { useEffect, useState } from 'react'
import { projects } from './data/projects.js'
import './App.css'

const links = {
  github: 'https://github.com/shamika2003',
  linkedin: 'https://www.linkedin.com/in/shamika-achinthya-23a12b262/',
  email: 'mailto:shamikaachintha9@gmail.com',
}

const scenes = {
  hero: ['ai_chip_dark.png', 'ai_chip_light.png'],
  about: ['ai_girl_dark.png', 'ai_girl_light.png'],
  work: ['code_left_dark.png', 'code_left_light.png'],
  contact: ['code_right_dark.png', 'code_right_light.png'],
}

function savedTheme() {
  try { return localStorage.getItem('shamika-theme') === 'light' ? 'light' : 'dark' }
  catch { return 'dark' }
}

function Scene({ name, theme, eager = false }) {
  const [dark, light] = scenes[name]
  const activeImage = theme === 'dark' ? dark : light
  return (
    <div className="scene" aria-hidden="true">
      <img className="scene-img" src={`/backgrounds/${activeImage}`} alt="" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} />
      <div className="scene-wash" />
      <div className="scene-grid" />
    </div>
  )
}

function SmallArrow() { return <span aria-hidden="true">↗</span> }

function ThemeToggle({ theme, onClick }) {
  return <button type="button" className="theme-control" onClick={onClick} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title={theme === 'dark' ? 'Light theme' : 'Dark theme'}>
    <span className="theme-control-track"><span className="theme-control-thumb" /></span>
    <span className="theme-control-label">{theme === 'dark' ? 'ECLIPSE' : 'HALO'}</span>
  </button>
}

function ProjectDialog({ project, close }) {
  useEffect(() => {
    if (!project) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(event) { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [project, close])

  if (!project) return null
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <section className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
        <div className="dialog-header"><span>PROJECT FILE / {project.number}</span><button type="button" onClick={close} aria-label="Close project details">CLOSE ×</button></div>
        <p className="dialog-kicker">{project.category}</p>
        <h2 id="project-dialog-title">{project.name}</h2>
        <p className="dialog-lead">{project.lead}</p>
        <p className="dialog-description">{project.description}</p>
        <div className="dialog-tech">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
        <div className="dialog-bottom"><span>STATUS / {project.status}</span><a href={links.github} target="_blank" rel="noreferrer">GITHUB PROFILE <SmallArrow /></a></div>
      </section>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState(savedTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('shamika-theme', theme) } catch { /* privacy mode */ }
  }, [theme])

  const closeProject = () => setActiveProject(null)
  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')
  const closeMenu = () => setMenuOpen(false)

  return <div className={`site theme-${theme}`} id="top">
    <header className="site-header">
      <a className="brand" href="#top" onClick={closeMenu} aria-label="Shamika Achinthya, back to top"><span className="brand-symbol">S<span>/</span>A</span><span className="brand-text">SHAMIKA ACHINTHYA<small>SOFTWARE · SYSTEMS · AUTOMATION</small></span></a>
      <nav id="site-navigation" className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        <a href="#about" onClick={closeMenu}>ABOUT</a>
        <a href="#work" onClick={closeMenu}>WORK</a>
        <a href="#experience" onClick={closeMenu}>EXPERIENCE</a>
        <a href="#contact" onClick={closeMenu}>CONTACT</a>
      </nav>
      <div className="header-actions"><ThemeToggle theme={theme} onClick={toggleTheme} /><button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'CLOSE ×' : 'MENU ≡'}</button></div>
    </header>

    <main>
      <section className="panel panel-hero" id="home" aria-labelledby="hero-heading"><Scene name="hero" theme={theme} eager />
        <div className="panel-inner align-right hero-layout"><div className="hero-content">
          <div className="micro-line"><span className="live-dot" /> INDEPENDENT DEVELOPER / SRI LANKA <span className="micro-index">001 / 004</span></div>
          <p className="mini-overline">IT OFFICER & SOFTWARE ENGINEERING UNDERGRADUATE</p>
          <h1 id="hero-heading">Building<br />what <em>matters.</em></h1>
          <p className="hero-lead">I’m Shamika Achinthya. I work where software, systems and real-world problems meet — building useful tools, thoughtful automation and reliable digital experiences.</p>
          <div className="button-row"><a className="action action-primary" href="#work">EXPLORE MY WORK <SmallArrow /></a><a className="action action-outline" href="#about">DISCOVER MORE <span aria-hidden="true">↓</span></a></div>
          <div className="hero-meta"><span>JAVA / C# / PYTHON</span><span>IT OPERATIONS / AUTOMATION</span></div>
        </div></div>
        <div className="vertical-index" aria-hidden="true">01 — INTRODUCTION</div><div className="edge-scroll" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="panel panel-about" id="about" aria-labelledby="about-heading"><Scene name="about" theme={theme} />
        <div className="panel-inner align-left about-layout"><div className="glass-content about-content">
          <p className="section-kicker"><span>02</span> / THE PERSON BEHIND THE CODE</p>
          <h2 id="about-heading">Curiosity meets<br /><em>execution.</em></h2>
          <p className="section-lead">Good technology should make complicated things feel simpler.</p>
          <p className="section-copy">I support banking systems, networking and daily IT operations at Samurdhi Bank while developing automation to improve internal workflows. Beyond that work, I build applications across enterprise Java, C#/.NET, desktop AI and Python-based research.</p>
          <p className="section-copy">I’m currently studying BSc (Hons) Software Engineering and hold a Professional Diploma in Software Engineering from the Java Institute for Advanced Technology.</p>
          <a className="text-link" href="#experience">MORE ABOUT MY BACKGROUND <SmallArrow /></a>
        </div></div>
        <div className="about-bottom-strip"><div><span>WHAT DRIVES ME</span><strong>BUILD / TEST / REFINE</strong></div><div><span>CURRENT FOCUS</span><strong>ENGINEERING · AI · AUTOMATION</strong></div><div><span>BASED IN</span><strong>ANURADHAPURA, SRI LANKA</strong></div></div>
      </section>

      <section className="panel panel-work" id="work" aria-labelledby="work-heading"><Scene name="work" theme={theme} />
        <div className="panel-inner align-right work-layout"><div className="work-content">
          <p className="section-kicker"><span>03</span> / SELECTED ENGINEERING WORK</p>
          <h2 id="work-heading">Not just ideas.<br /><em>Built systems.</em></h2>
          <p className="work-intro">Different disciplines. One goal: software that does something useful.</p>
          <div className="project-list">{projects.map((project) => <button type="button" className="project-row" key={project.id} onClick={() => setActiveProject(project)} aria-label={`Read details of ${project.name}`}>
            <span className="project-num">{project.number}</span><span className="project-text"><span className="project-category">{project.category}</span><strong>{project.name}</strong><span className="project-summary">{project.summary}</span></span><span className="project-arrow" aria-hidden="true">↗</span>
          </button>)}</div>
          <div className="work-bottom"><span>PROJECT DETAILS OPEN ON CLICK</span><a href={links.github} target="_blank" rel="noreferrer">GITHUB PROFILE <SmallArrow /></a></div>
        </div></div>
      </section>

      <section className="experience-band" id="experience" aria-labelledby="experience-heading"><div className="experience-shell">
        <div className="band-heading"><p className="section-kicker"><span>04</span> / BACKGROUND & CAPABILITIES</p><h2 id="experience-heading">The work behind <em>the work.</em></h2></div>
        <div className="experience-grid"><div className="experience-column"><p className="column-header">PROFESSIONAL EXPERIENCE <span>01</span></p><p className="date-line">NOV 2024 — PRESENT</p><h3>Information Technology Officer</h3><p className="place-line">Samurdhi Bank · Hidogama</p><p>Support banking systems, troubleshoot hardware and network issues, and develop internal automation to simplify operational workflows.</p></div>
        <div className="experience-column"><p className="column-header">EDUCATION <span>02</span></p><p className="date-line">IN PROGRESS</p><h3>BSc (Hons) Software Engineering</h3><p className="place-line">Java Institute for Advanced Technology</p><p className="date-line second-date">COMPLETED · 2025</p><h3>Professional Diploma in Software Engineering</h3><p className="place-line">Java Institute for Advanced Technology</p><p className="academic-line">DISTINCTIONS / OOP I · OOSAD</p></div></div>
        <div className="skill-footer"><span>TECHNICAL RANGE</span><p>JAVA <i>/</i> C# <i>/</i> PYTHON <i>/</i> .NET <i>/</i> JAKARTA EE <i>/</i> WPF <i>/</i> REACT <i>/</i> MYSQL <i>/</i> NETWORKING</p></div>
      </div></section>

      <section className="panel panel-contact" id="contact" aria-labelledby="contact-heading"><Scene name="contact" theme={theme} />
        <div className="panel-inner align-left contact-layout"><div className="glass-content contact-content">
          <p className="section-kicker"><span>05</span> / WHAT'S NEXT?</p><h2 id="contact-heading">Let’s build<br /><em>something useful.</em></h2>
          <p className="section-lead">Have a role, a project or a problem worth solving? I’d like to hear about it.</p>
          <a className="contact-email" href={links.email}>shamikaachintha9@gmail.com <SmallArrow /></a>
          <div className="contact-social"><a href={links.github} target="_blank" rel="noreferrer">GITHUB <SmallArrow /></a><a href={links.linkedin} target="_blank" rel="noreferrer">LINKEDIN <SmallArrow /></a></div>
        </div></div>
        <footer className="footer-bar"><span>© {new Date().getFullYear()} SHAMIKA ACHINTHYA ABESEKARA</span><span>DESIGNED WITH INTENTION · BUILT WITH REACT</span><a href="#top">BACK TO TOP ↑</a></footer>
      </section>
    </main>
    <ProjectDialog project={activeProject} close={closeProject} />
  </div>
}

export default App
