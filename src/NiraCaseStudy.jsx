import { useState } from 'react'
import Icon from './Icon.jsx'
import './NiraCaseStudy.css'

const IMAGE_PATH = '/case-studies/nira/'

const pillars = [
  { index: '01', title: 'Conversation', tag: 'LOCAL MODELS', description: 'A desktop-facing conversational interface designed around local language-model interaction, with behavior adapted to the task at hand.' },
  { index: '02', title: 'Semantic memory', tag: 'ONNX / EMBEDDINGS', description: 'An embedding-based approach to connecting relevant past context with a new interaction, rather than treating every message as a fresh start.' },
  { index: '03', title: 'PC awareness', tag: 'WINDOWS CONTEXT', description: 'A model of the desktop environment that helps the agent reason about the current situation before choosing a workflow.' },
  { index: '04', title: 'Tool workflows', tag: 'EXECUTION / FEEDBACK', description: 'Tool-driven task flows organized around checking state, taking an action, and observing the outcome. A work in progress—not a claim of unrestricted autonomy.' },
]

const shots = [
  { file: 'desktop-overview.png', code: 'VIEW 01', label: 'Desktop overview', detail: 'The NIRA application shell and desktop interface.', art: 'orb' },
  { file: 'conversation.png', code: 'VIEW 02', label: 'Conversation', detail: 'Conversation, assistance and human-centred interaction.', art: 'chat' },
  { file: 'memory-workflows.png', code: 'VIEW 03', label: 'Workflow activity', detail: 'Context, agent state and multi-step workflows.', art: 'flow' },
]

function Screenshot({ item }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <figure className={`ncs-shot ${loaded ? 'ncs-shot-loaded' : ''}`}>
      <div className={`ncs-shot-window ncs-art-${item.art}`}>
        <img src={`${IMAGE_PATH}${item.file}`} loading="lazy" alt={`${item.label} screenshot of Nira Agent`} onLoad={() => setLoaded(true)} onError={() => setLoaded(false)} />
        {!loaded && <div className="ncs-placeholder" aria-label={`${item.label} screenshot placeholder`}>
          <div className="ncs-placeholder-orbit"><i /><i /><i /></div>
          <div className="ncs-placeholder-caption"><span>SCREENSHOT SLOT</span><strong>{item.code}</strong><small>{item.file}</small></div>
        </div>}
      </div>
      <figcaption><span>{item.code} / {item.label}</span><small>{item.detail}</small></figcaption>
    </figure>
  )
}

export default function NiraCaseStudy() {
  return (
    <main className="ncs" id="nira-case-study">
      <div className="ncs-progress" aria-hidden="true" />
      <section className="ncs-hero" aria-labelledby="ncs-title">
        <div className="ncs-hero-grid" aria-hidden="true" />
        <div className="ncs-container ncs-hero-layout">
          <div className="ncs-hero-copy">
            <a className="ncs-back" href="#work"><Icon name="arrow-right" size={15} /> BACK TO SELECTED WORK</a>
            <p className="ncs-kicker"><span className="ncs-pip" /> ELVARA / SELECTED WORK / 01</p>
            <h1 id="ncs-title">NIRA<span>.</span><br /><em>AGENT</em></h1>
            <p className="ncs-hero-lead">A more natural way to work with a computer.</p>
            <p className="ncs-hero-text">An evolving Windows desktop AI agent combining conversation, semantic memory, desktop awareness and tool-driven workflows.</p>
            <div className="ncs-tags" aria-label="Technologies"><span>C# / .NET</span><span>WPF</span><span>ONNX</span><span>OLLAMA</span></div>
            <a href="#ncs-overview" className="ncs-scroll" onClick={(event) => { event.preventDefault(); document.getElementById('ncs-overview')?.scrollIntoView({ behavior: 'smooth' }) }}>EXPLORE THE PROJECT <Icon name="arrow-down" size={16}/></a>
          </div>
          <div className="ncs-hero-visual" aria-hidden="true">
            <div className="ncs-hero-side-note"><span>01 / NIRA AGENT</span><strong>PERSONAL INTELLIGENCE. BUILT TO ACT.</strong><small>DESKTOP PROJECT / IN DEVELOPMENT</small></div>
          </div>
        </div>
        <div className="ncs-hero-bottom ncs-container"><span>SHAMIKA → ELVARA → NIRA</span><span>ONGOING BUILD / NOT A FINISHED PRODUCT</span></div>
      </section>

      <section className="ncs-section ncs-overview" id="ncs-overview" aria-labelledby="ncs-overview-title">
        <div className="ncs-container ncs-overview-grid">
          <div className="ncs-overview-copy">
            <p className="ncs-kicker">01 / THE IDEA</p>
            <h2 id="ncs-overview-title">Not another<br /><em>chat window.</em></h2>
            <div className="ncs-body"><p>NIRA is Shamika’s ongoing desktop-agent project, exploring what happens when conversational AI can take a user's PC environment into account.</p><p>The aim: connect dialogue with memory, situational awareness and useful tool-driven workflows. The pieces are tested and refined as the build evolves.</p><div className="ncs-note"><span>ONE CHARACTER / TWO EXPERIENCES</span><p>The NIRA chatting on this website represents the same character. The full desktop application has its own runtime and PC-side capabilities.</p></div></div>
          </div>
          <div className="ncs-side-caption" aria-hidden="true"><span>ELVARA / NIRA</span><strong>THINK. REMEMBER. ACT.</strong></div>
        </div>
      </section>

      <section className="ncs-section ncs-system" id="ncs-system" aria-labelledby="ncs-system-title">
        <div className="ncs-container"><div className="ncs-section-head ncs-system-head"><div><p className="ncs-kicker">02 / SYSTEM THINKING</p><h2 id="ncs-system-title">From intent<br />to <em>action.</em></h2></div><p>A simplified conceptual flow. The real implementation evolves as the project develops.</p></div>
          <div className="ncs-architecture" role="img" aria-label="Conceptual flow: input and context, interpretation, semantic memory and PC context, decision, tool workflow, observation and response">
            <div className="ncs-arch-node ncs-arch-main"><span>01 / INPUT</span><strong>Conversation & context</strong><small>What is being asked? What is happening?</small></div>
            <div className="ncs-arch-link" aria-hidden="true"><i /></div>
            <div className="ncs-arch-middle"><div className="ncs-arch-node"><span>02 / CONTEXT</span><strong>Semantic memory</strong><small>Relevant prior information</small></div><div className="ncs-arch-node"><span>03 / SITUATION</span><strong>PC awareness</strong><small>Available environment signals</small></div></div>
            <div className="ncs-arch-link" aria-hidden="true"><i /></div>
            <div className="ncs-arch-node ncs-arch-main"><span>04 / DECISION</span><strong>Plan & tool workflow</strong><small>Choose the next useful step</small></div>
            <div className="ncs-arch-link" aria-hidden="true"><i /></div>
            <div className="ncs-arch-node ncs-arch-last"><span>05 / FEEDBACK</span><strong>Observe → respond → refine</strong><small>Use the outcome to inform the next interaction</small></div>
          </div>
        </div>
      </section>

      <section className="ncs-section ncs-capabilities" id="ncs-capabilities" aria-labelledby="ncs-capabilities-title"><div className="ncs-container"><div className="ncs-section-head ncs-capabilities-head"><div><p className="ncs-kicker">03 / ENGINEERING DIRECTIONS</p><h2 id="ncs-capabilities-title">Built as<br /><em>connected parts.</em></h2></div><p>Four areas of the ongoing work—not an assertion that every planned capability is production-ready.</p></div><div className="ncs-pillar-grid">{pillars.map((item) => <article className="ncs-pillar" key={item.index}><div className="ncs-pillar-head"><span>{item.index}</span><small>{item.tag}</small></div><h3>{item.title}</h3><p>{item.description}</p><div className="ncs-pillar-rule" /></article>)}</div></div></section>

      <section className="ncs-section ncs-gallery" id="ncs-gallery" aria-labelledby="ncs-gallery-title"><div className="ncs-container"><div className="ncs-section-head"><div><p className="ncs-kicker">04 / APPLICATION WINDOWS</p><h2 id="ncs-gallery-title">Inside<br /><em>the build.</em></h2></div><p>Real application screens live here. Designed placeholders appear until you add your approved screenshots.</p></div><div className="ncs-gallery-grid">{shots.map((shot) => <Screenshot key={shot.file} item={shot}/>)}</div><p className="ncs-gallery-foot">SELECTED SCREENS / DESKTOP PROJECT IN DEVELOPMENT</p></div></section>

      <section className="ncs-section ncs-finish"><div className="ncs-container ncs-finish-layout"><div><p className="ncs-kicker">05 / THE PROCESS</p><h2>Build with purpose.<br /><em>Improve with every iteration.</em></h2><p>The interesting part is not declaring an AI agent finished. It is making the pieces more reliable, one decision and one test at a time.</p></div><div className="ncs-finish-actions"><a className="ncs-primary" href="#work">BACK TO PROJECTS <Icon name="arrow-up-right" size={18}/></a><a className="ncs-secondary" href="#contact">GET IN TOUCH <Icon name="arrow-up-right" size={18}/></a></div></div><div className="ncs-container ncs-colophon"><span>CREATED BY SHAMIKA ACHINTHYA</span><span>ELVARA / HOME OF NIRA</span><span>© 2026 · SRI LANKA</span></div></section>
    </main>
  )
}
