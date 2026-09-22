import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from './data/projects.js'
import Icon from './Icon.jsx'
import PortfolioAssistant from './PortfolioAssistant.jsx'
import './App.css'

const LINKS = {
  github: 'https://github.com/shamika2003',
  linkedin: 'https://www.linkedin.com/in/shamika-achinthya-23a12b262/',
  email: 'mailto:shamikaachintha9@gmail.com',
}

// Use the original eight filenames. The same four scenes switch with the theme.
const BACKGROUNDS = {
  hero: ['ai_chip_dark.png', 'ai_chip_light.png'],
  about: ['ai_girl_dark.png', 'ai_girl_light.png'],
  work: ['code_left_dark.png', 'code_left_light.png'],
  contact: ['code_right_dark.png', 'code_right_light.png'],
}

function initialTheme() {
  try { return localStorage.getItem('shamika-theme') === 'light' ? 'light' : 'dark' }
  catch { return 'dark' }
}

function Arrow({ down = false }) {
  return <span className="arrow" aria-hidden="true"><Icon name={down ? 'arrow-down' : 'arrow-up-right'} size={17} /></span>
}

function Scene({ scene, theme, priority = false }) {
  const [dark, light] = BACKGROUNDS[scene]
  return (
    <div className="scene" data-parallax aria-hidden="true">
      <img className={`scene-image ${theme === 'dark' ? 'is-active' : ''}`} src={`/backgrounds/${dark}`} alt="" loading={priority && theme === 'dark' ? 'eager' : 'lazy'} fetchPriority={priority && theme === 'dark' ? 'high' : 'auto'} />
      <img className={`scene-image ${theme === 'light' ? 'is-active' : ''}`} src={`/backgrounds/${light}`} alt="" loading={priority && theme === 'light' ? 'eager' : 'lazy'} fetchPriority={priority && theme === 'light' ? 'high' : 'auto'} />
      <div className="scene-shade" />
      <div className="scene-texture" />
    </div>
  )
}

function ProjectDialog({ project, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    if (!project) return undefined
    const oldOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll('.dialog button, .dialog a')]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = oldOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [project, onClose])
  if (!project) return null
  return (
    <div className="dialog-underlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-top"><span>PROJECT / {project.number} — {project.category}</span><button ref={closeRef} onClick={onClose} type="button">CLOSE <Icon name="close" size={17} /></button></div>
        <p className="dialog-eyebrow">SELECTED ENGINEERING WORK</p>
        <h2 id="dialog-title">{project.name}</h2>
        <p className="dialog-lead">{project.lead}</p>
        <p className="dialog-description">{project.description}</p>
        <div className="dialog-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div className="dialog-tail"><span>{project.status}</span><a href={LINKS.github} target="_blank" rel="noreferrer"><Icon name="github" size={17} /> GITHUB PROFILE <Arrow /></a></div>
      </section>
    </div>
  )
}

function usePageEffects() {
  useEffect(() => {
    const root = document.documentElement
    const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reveals = [...document.querySelectorAll('[data-reveal]')]
    let revealObserver
    if (motion && 'IntersectionObserver' in window) {
      // Hide only elements that are safely below the current viewport.
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * .87) el.classList.add('await-reveal')
      })
      revealObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        }
      }, { threshold: 0.09, rootMargin: '0px 0px -6% 0px' })
      reveals.forEach((el) => revealObserver.observe(el))
    }
    const sections = [...document.querySelectorAll('main > section[id]')]
    const backgrounds = [...document.querySelectorAll('[data-parallax]')]
    const navLinks = [...document.querySelectorAll('.nav a')]
    const progress = document.querySelector('.page-progress')
    let scheduled = false
    const update = () => {
      scheduled = false
      // Dynamic viewport units already handle most sizing; this supports compact-height layout.
      root.style.setProperty('--viewport-h', `${window.innerHeight}px`)
      root.style.setProperty('--viewport-w', `${window.innerWidth}px`)
      root.classList.toggle('compact-viewport', window.innerHeight < 720 && window.innerWidth > 760)
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      if (progress) progress.style.transform = `scaleX(${Math.min(1, window.scrollY / scrollable)})`
      if (motion && window.innerWidth > 760) {
        backgrounds.forEach((layer) => {
          const rect = layer.parentElement.getBoundingClientRect()
          if (rect.bottom > -80 && rect.top < window.innerHeight + 80) {
            const delta = Math.max(-65, Math.min(65, (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.065))
            layer.style.setProperty('--parallax', `${delta.toFixed(1)}px`)
          }
        })
      }
      sections.forEach((section) => {
        if (section.classList.contains('stage')) {
          const rect = section.getBoundingClientRect()
          const fraction = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
          section.style.setProperty('--scene-progress', String(fraction))
        }
      })
      const marker = window.innerHeight * .43
      const active = [...sections].reverse().find((s) => s.getBoundingClientRect().top <= marker)?.id || 'home'
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${active}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const requestUpdate = () => {
      if (!scheduled) { scheduled = true; window.requestAnimationFrame(update) }
    }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      revealObserver?.disconnect()
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])
}

function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState('nira-agent')
  const selectedProject = projects.find((project) => project.id === selectedProjectId) || projects[0]
  const closeProject = useCallback(() => setActiveProject(null), [])
  usePageEffects()

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('shamika-theme', theme) } catch { /* Private browsing. */ }
  }, [theme])

  const go = () => setMenuOpen(false)
  return (
    <div className={`site theme-${theme}`} id="top">
      <div className="page-progress" aria-hidden="true" />
      <div className="ambient-glow" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#home" onClick={go} aria-label="Shamika Achinthya — home"><span className="brand-crest">S<span>.</span>A</span><span className="brand-name">SHAMIKA ACHINTHYA<small>SOFTWARE / SYSTEMS / AUTOMATION</small></span></a>
        <nav id="site-nav" className={`nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          <a href="#home" onClick={go}>HOME</a><a href="#about" onClick={go}>ABOUT</a><a href="#work" onClick={go}>PROJECTS</a><a href="#experience" onClick={go}>EXPERIENCE</a><a href="#contact" onClick={go}>CONTACT</a>
        </nav>
        <div className="nav-actions"><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Switch to Halo light mode' : 'Switch to Eclipse dark mode'}><Icon name={theme === 'dark' ? 'moon' : 'sun'} size={17} /><span>{theme === 'dark' ? 'ECLIPSE' : 'HALO'}</span></button><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((open) => !open)}><Icon name={menuOpen ? 'close' : 'menu'} size={20} /><span>{menuOpen ? 'CLOSE' : 'MENU'}</span></button></div>
      </header>

      <main>
        <section className="stage stage-hero" id="home" aria-labelledby="hero-title"><Scene scene="hero" theme={theme} priority />
          <div className="stage-shell stage-shell-right"><div className="hero-copy">
            <p className="section-id hero-id" data-reveal><span className="signal-dot" /> OPEN TO IT & SOFTWARE OPPORTUNITIES <i>01 / 04</i></p>
            <p className="hero-subtitle" data-reveal>IT OFFICER · SOFTWARE ENGINEERING UNDERGRADUATE</p>
            <h1 id="hero-title" data-reveal>Engineering<br />what <em>matters.</em></h1>
            <p className="hero-description" data-reveal>I'm Shamika Achinthya. I build software, solve systems problems, and turn repetitive workflows into useful tools.</p>
            <div className="hero-actions" data-reveal><a className="button button-solid" href="#work">EXPLORE PROJECTS <Arrow /></a><a className="button button-line" href="#about">DISCOVER MORE <Arrow down /></a></div>
            <div className="hero-capabilities" data-reveal><span>JAVA / C# / PYTHON</span><span>IT OPERATIONS / AUTOMATION</span></div>
          </div></div>
          <span className="stage-edge" aria-hidden="true">001 — INTRODUCTION</span><a className="scroll-indicator" href="#about">SCROLL TO EXPLORE <Arrow down /></a>
        </section>

        <section className="stage stage-about" id="about" aria-labelledby="about-title"><Scene scene="about" theme={theme} />
          <div className="stage-shell stage-shell-left"><div className="editorial-block">
            <p className="section-id" data-reveal><span>02</span> / THE PERSON BEHIND THE CODE</p>
            <h2 id="about-title" data-reveal>Curiosity.<br />Applied <em>daily.</em></h2>
            <p className="section-statement" data-reveal>Useful technology begins with understanding the problem.</p>
            <p className="prose" data-reveal>At Samurdhi Bank, I support banking systems, network connectivity and day-to-day IT operations. I also develop internal automation to reduce repetitive work and make processes clearer.</p>
            <p className="prose" data-reveal>Outside my role, I explore enterprise Java, C#/.NET desktop applications, local AI, and Python-based research systems. I’m currently pursuing a BSc (Hons) in Software Engineering.</p>
            <a className="section-link" href="#experience" data-reveal>EXPERIENCE & EDUCATION <Arrow /></a>
          </div></div>
          <div className="scene-bottomline" data-reveal><span>BUILD <b>01</b></span><span>TEST <b>02</b></span><span>REFINE <b>03</b></span><span>REPEAT <b>∞</b></span></div>
        </section>

        <section className="stage stage-work" id="work" aria-labelledby="work-title"><Scene scene="work" theme={theme} />
          <div className="stage-shell stage-shell-right"><div className="editorial-block work-block work-console">
            <p className="section-id work-section-id" data-reveal><span>03</span> / SELECTED ENGINEERING WORK <i>04 SYSTEMS</i></p>
            <div className="work-head" data-reveal>
              <div><h2 id="work-title">Built for <em>real use.</em></h2><p className="work-intro">Software, AI and automation — selected work.</p></div>
              <div className="work-orbit" aria-hidden="true"><span /><span /><span /></div>
            </div>
            <div className="work-status" aria-hidden="true"><span className="status-spark" /> PORTFOLIO / PROJECT INDEX <span>01—04</span></div>
            <div className="project-list project-selector" aria-label="Select a project">
              {projects.map((project, index) => (
                <button className={`project-item ${project.id === selectedProjectId ? 'is-selected' : ''}`} key={project.id} type="button" data-reveal style={{'--reveal-delay': `${index * 65}ms`}} onClick={() => setSelectedProjectId(project.id)} aria-pressed={project.id === selectedProjectId} aria-controls="project-focus" aria-label={`Select ${project.name}`}>
                  <span className="project-number">{project.number}</span>
                  <span className="project-info"><small>{project.category}</small><strong>{project.name}</strong></span>
                  <span className="project-open" aria-hidden="true"><Icon name="arrow-up-right" size={19} /></span>
                </button>
              ))}
            </div>
            <div className="project-focus" id="project-focus" aria-live="polite" aria-atomic="true">
              <div className="focus-header"><span><span className="focus-led" /> IN FOCUS / {selectedProject.number}</span><span>{selectedProject.status}</span></div>
              <div className="focus-inner" key={selectedProject.id}>
                <h3>{selectedProject.lead}</h3>
                <p>{selectedProject.summary}</p>
                <div className="focus-bottom"><div className="focus-tags">{selectedProject.technologies.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div><button className="focus-detail" type="button" onClick={() => setActiveProject(selectedProject)}>READ CASE STUDY <Icon name="arrow-up-right" size={16}/></button></div>
              </div>
            </div>
            <div className="project-linkline" data-reveal><span>SELECT A PROJECT TO EXPLORE</span><a href={LINKS.github} target="_blank" rel="noreferrer"><Icon name="github" size={17} /> GITHUB <Arrow /></a></div>
          </div></div>
        </section>

        <section className="experience-section" id="experience" aria-labelledby="experience-title"><div className="experience-shell">
          <p className="section-id" data-reveal><span>04</span> / BACKGROUND & TECHNICAL RANGE</p>
          <div className="experience-head" data-reveal><h2 id="experience-title">Experience that<br /><em>informs the build.</em></h2><p>Practical IT support, formal software engineering study, and an appetite for systems that work reliably.</p></div>
          <div className="experience-columns"><div className="experience-column" data-reveal><p className="column-id">PROFESSIONAL EXPERIENCE / 01</p><p className="date">NOV 2024 — PRESENT</p><h3>Information Technology Officer</h3><p className="place">Samurdhi Bank · Hidogama</p><p>Banking systems support, hardware and network troubleshooting, and internal workflow automation.</p></div>
            <div className="experience-column" data-reveal><p className="column-id">EDUCATION / 02</p><p className="date">CURRENTLY STUDYING</p><h3>BSc (Hons) Software Engineering</h3><p className="place">Java Institute for Advanced Technology</p><div className="qualification"><p className="date">COMPLETED · 2025</p><h3>Professional Diploma in Software Engineering</h3><p className="place">Java Institute for Advanced Technology</p><p className="honors">Distinction: Object-Oriented Programming I<br />Distinction: Object-Oriented Systems Analysis & Design</p></div></div></div>
          <div className="stack-row" data-reveal><span>TECHNICAL RANGE</span><div>JAVA <b>·</b> C# <b>·</b> .NET <b>·</b> PYTHON <b>·</b> JAKARTA EE <b>·</b> MYSQL <b>·</b> NETWORKING</div></div>
        </div></section>

        <section className="stage stage-contact" id="contact" aria-labelledby="contact-title"><Scene scene="contact" theme={theme} />
          <div className="stage-shell stage-shell-left"><div className="editorial-block contact-copy">
            <p className="section-id" data-reveal><span>05</span> / OPEN CHANNEL</p>
            <h2 id="contact-title" data-reveal>Something to<br /><em>build together?</em></h2>
            <p className="section-statement" data-reveal>Good ideas start with a conversation.</p>
            <p className="prose" data-reveal>Open to software development, technical support and automation opportunities. Tell me what you're working on.</p>
            <a className="contact-mail" href={LINKS.email} data-reveal><Icon name="mail" size={22} /> shamikaachintha9@gmail.com <Arrow /></a>
            <div className="contact-socials" data-reveal><a href={LINKS.github} target="_blank" rel="noreferrer"><Icon name="github" size={18} /> GITHUB <Arrow /></a><a href={LINKS.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={18} /> LINKEDIN <Arrow /></a></div>
          </div></div>
        </section>
      </main>

      {/* Intentionally no background image in the footer. */}
      <footer className="site-footer"><div className="footer-inner"><div className="footer-signature">S<span>.</span>A <small>SHAMIKA ACHINTHYA</small></div><p>BUILD WITH PURPOSE.<br /><span>IMPROVE WITH EVERY ITERATION.</span></p><div className="footer-end"><span>© {new Date().getFullYear()} · SRI LANKA</span><a href="#home">BACK TO TOP <Icon name="arrow-up" size={16} /></a></div></div><div className="footer-accent" aria-hidden="true" /></footer>
      <ProjectDialog project={activeProject} onClose={closeProject} />
      <PortfolioAssistant />
    </div>
  )
}

export default App
