import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { projects } from './data/projects.js'
import './PortfolioAssistant.css'

const API_URL = (import.meta.env.VITE_PORTFOLIO_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8787' : '')).replace(/\/$/, '')
const HELLO = 'Hey, it’s me, NIRA. Shamika built all this, and apparently I’m the one explaining it. Lucky for you, I’m good at that. What caught your eye?'
const STARTERS = ['What is Nira Agent?', 'Show me his projects', 'What can Shamika build?', 'How do I reach him?']
const NAV = [
  { label: 'Projects', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

function localAnswer(text) {
  const q = text.toLowerCase().trim()
  // Answer personal identity questions before project name matching: "Who are you, NIRA?"
  // is about NIRA herself, not the desktop Nira Agent project.
  if (/\b(who are you|who r u|what(?:'s| is) your name|tell me about yourself|what are you|are you nira|who is nira)\b/.test(q) && !/\bnira agent\b/.test(q)) {
    return 'Hey, it’s me, NIRA. I’m the one you’re talking to, not Shamika in disguise. He builds the things; I tell you what’s interesting about them.'
  }
  if (/\b(orb|particle body|desktop body)\b/.test(q)) {
    return 'That little symbol is just my chat icon here. The full desktop Nira Agent has the animated particle body; this website conversation is text-only.'
  }
  if (/^(hi|hey|hello|yo|sup|hiya)[!?. ]*$/.test(q)) return 'Hey. It’s me, NIRA. What caught your eye?'
  const project = projects.find((item) =>
    q.includes(item.name.toLowerCase()) ||
    (item.id === 'nira-agent' && /\bnira\b/.test(q)) ||
    (item.id === 'globaltrade' && /global\s*trade|logistics/.test(q)) ||
    (item.id === 'tradeai' && /trade\s*ai|trading/.test(q)) ||
    (item.id === 'customer-message' && /customer\s*message|sms/.test(q))
  )
  if (project) return `${project.name}: ${project.description} Technologies: ${project.technologies.join(', ')}. Status: ${project.status.toLowerCase()}. Explore the Projects section to learn more.`
  if (/contact|email|reach|hire|available/.test(q)) return 'You can contact Shamika at shamikaachintha9@gmail.com. His LinkedIn and GitHub links are also in the Contact section.'
  if (/skill|stack|technolog|language|program|java|python|c#|network|support/.test(q)) return 'Shamika works with Java, C#, Python, .NET, WPF, Jakarta EE, MySQL and React, alongside banking IT support, networking, troubleshooting and workflow automation.'
  if (/experience|bank|job|work|career|role/.test(q)) return 'Shamika has worked as an Information Technology Officer at Samurdhi Bank, Hidogama, since November 2024. His work includes banking-system support, networking, troubleshooting and internal workflow automation.'
  if (/education|study|degree|diploma|institute|qualification/.test(q)) return 'Shamika is pursuing a BSc (Hons) in Software Engineering at Java Institute for Advanced Technology. He completed a Professional Diploma in Software Engineering in 2025, with distinctions in Object-Oriented Programming I and Object-Oriented Systems Analysis & Design.'
  if (/projects|portfolio|built|make|create/.test(q)) return `His featured projects are ${projects.map((item) => item.name).join(', ')}. Ask me about any project by name, or open the Projects section.`
  if (/\bnira\b|\belvara\b/.test(q) && !/agent|project/.test(q)) return 'It’s me, NIRA. I’m here to talk, not read you a corporate brochure. Ask me what you actually want to know.'
  if (/who|about|shamika|hello|hi\b/.test(q)) return 'Shamika is an IT Officer and Software Engineering undergraduate. He builds practical software and automation, including Nira Agent and GlobalTrade. Want a specific project?'
  return 'The live model isn’t connected, so I’m sticking to the public portfolio notes. Try Nira Agent, GlobalTrade, TradeAI, or Shamika’s experience.'
}

function AssistantMark({ small = false }) {
  return <span className={`assistant-mark ${small ? 'assistant-mark-small' : ''}`} aria-hidden="true"><span className="assistant-core"/><span className="assistant-ring assistant-ring-one"/><span className="assistant-ring assistant-ring-two"/></span>
}

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(API_URL ? 'checking' : 'guide')
  const [messages, setMessages] = useState([{ role: 'assistant', text: HELLO, mode: 'guide' }])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const cancelRef = useRef(null)
  const nextMessageId = useRef(0)

  useEffect(() => {
    if (!open) return undefined
    if (!API_URL) return undefined
    const controller = new AbortController()
    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Offline')))
      .then((data) => setStatus(data.configured ? 'online' : 'guide'))
      .catch(() => { if (!controller.signal.aborted) setStatus('guide') })
    return () => controller.abort()
  }, [open])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => { if (open && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight }, [messages, busy, open])
  useEffect(() => {
    if (!open) return undefined
    const closeWithEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeWithEscape)
    return () => window.removeEventListener('keydown', closeWithEscape)
  }, [open])
  useEffect(() => () => cancelRef.current?.abort(), [])

  async function ask(question) {
    const text = question.trim().slice(0, 500)
    if (!text || busy) return
    const previous = messages.filter((message) => message.role === 'assistant' || message.role === 'user')
    setMessages((list) => [...list, { role: 'user', text }])
    setDraft('')
    setError('')
    if (status !== 'online' || !API_URL) {
      setMessages((list) => [...list, { role: 'assistant', text: localAnswer(text), mode: 'guide' }])
      return
    }
    const controller = new AbortController()
    cancelRef.current = controller
    const timeout = setTimeout(() => controller.abort(), 23000)
    setBusy(true)
    let received = ''
    let messageId = null
    try {
      const history = previous.slice(-8).map((message) => ({ role: message.role, content: message.text.slice(0, 850) }))
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, stream: true }),
        signal: controller.signal,
      })
      if (!response.ok) {
        if (response.status === 429) throw new Error('I’ve hit my request limit. Give me a moment.')
        if (response.status === 503) { setStatus('guide'); throw new Error('The live model isn’t connected. I can still use the portfolio notes.') }
        throw new Error('The live model is unavailable. Try again in a moment.')
      }
      const contentType = response.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('I didn’t get a reply that time.')
        received = data.reply.slice(0, 2400)
        setMessages((list) => [...list, { role: 'assistant', text: received, mode: 'ai' }])
      } else {
        if (!response.body) throw new Error('Your browser could not open the reply stream.')
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        messageId = ++nextMessageId.current
        setMessages((list) => [...list, { id: messageId, role: 'assistant', text: '', mode: 'ai' }])
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          received += decoder.decode(value, { stream: true })
          if (received.length > 2400) received = received.slice(0, 2400)
          const textSoFar = received
          setMessages((list) => list.map((m) => m.id === messageId ? { ...m, text: textSoFar } : m))
        }
        if (!received.trim()) throw new Error('The connection ended before I could answer.')
      }
    } catch (err) {
      if (controller.signal.aborted && cancelRef.current !== controller) return
      setError(err.name === 'AbortError' ? 'That took too long. Try again.' : err.message)
      if (!received.trim()) {
        setMessages((list) => [...list.filter((m) => m.id !== messageId), { role: 'assistant', text: localAnswer(text), mode: 'guide' }])
      }
    } finally {
      clearTimeout(timeout)
      if (cancelRef.current === controller) cancelRef.current = null
      setBusy(false)
    }
  }

  function reset() {
    const previousRequest = cancelRef.current
    cancelRef.current = null
    previousRequest?.abort()
    setBusy(false)
    setMessages([{ role: 'assistant', text: HELLO, mode: 'guide' }])
    setDraft('')
    setError('')
  }

  return (
    <aside className={`portfolio-assistant ${open ? 'assistant-open' : ''}`} aria-label="NIRA by ELVARA portfolio assistant">
      {open && <section className="assistant-panel" aria-label="Chat with NIRA">
        <header className="assistant-header">
          <AssistantMark small />
          <div className="assistant-identity"><strong>NIRA <span>· ELVARA</span></strong><small><i className={`assistant-status-dot ${status === 'online' ? 'is-online' : ''}`} /> {status === 'online' ? 'LIVE · FAST MODEL' : status === 'checking' ? 'CONNECTING' : 'PORTFOLIO NOTES · OFFLINE'}</small></div>
          <button type="button" className="assistant-header-button" onClick={reset} aria-label="Start new conversation" title="New chat"><Icon name="refresh-ccw" size={17}/></button>
          <button type="button" className="assistant-header-button" onClick={() => setOpen(false)} aria-label="Minimize assistant" title="Minimize"><Icon name="minus" size={19}/></button>
        </header>
        <div className="assistant-messages" ref={messagesRef} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
          <p className="assistant-transcript-label">PORTFOLIO / CONVERSATION</p>
          {messages.map((message, index) => <div className={`assistant-message assistant-${message.role}`} key={`${index}-${message.role}`}>
            {message.role === 'assistant' && <span className="assistant-msg-mark" aria-hidden="true">N</span>}
            <div className="assistant-message-content"><p>{message.text}</p>{message.mode === 'guide' && index > 0 && <small>PUBLIC PORTFOLIO NOTES</small>}</div>
          </div>)}
          {busy && !messages.some((m) => m.id && m.text.trim()) && <div className="assistant-thinking" role="status"><span/><span/><span/><small>THINKING</small></div>}
        </div>
        {messages.length < 4 && <div className="assistant-prompts" aria-label="Suggested questions">{STARTERS.map((question) => <button type="button" key={question} onClick={() => ask(question)} disabled={busy}>{question}<Icon name="arrow-up-right" size={13}/></button>)}</div>}
        {error && <p className="assistant-error" role="alert">{error}</p>}
        <form className="assistant-composer" onSubmit={(event) => { event.preventDefault(); ask(draft) }}>
          <label htmlFor="assistant-input" className="visually-hidden">Message</label>
          <textarea ref={inputRef} id="assistant-input" placeholder="Ask NIRA something..." value={draft} maxLength={500} rows={1} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); ask(draft) } }} disabled={busy}/>
          <button type="submit" disabled={!draft.trim() || busy} aria-label="Send message"><Icon name="send" size={17}/></button>
        </form>
        <div className="assistant-foot"><span>NIRA BY ELVARA · PUBLIC PORTFOLIO</span><div>{NAV.map((nav) => <a key={nav.href} href={nav.href} onClick={() => setOpen(false)}>{nav.label}</a>)}</div></div>
      </section>}
      <button type="button" className="assistant-fab" aria-label={open ? 'Close NIRA' : 'Talk to NIRA'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <Icon name="close" size={21}/> : <AssistantMark />}
        {!open && <span className="assistant-fab-caption">ASK NIRA</span>}
      </button>
    </aside>
  )
}
