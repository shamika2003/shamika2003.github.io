// Run with: node .\INSTALL_NIRA_CASE_STUDY.mjs
// Makes narrow, backed-up edits to the user's CURRENT local App.jsx.
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = dirname(fileURLToPath(import.meta.url))
const appPath = join(repo, 'src', 'App.jsx')
for (const file of [appPath, join(repo, 'src', 'NiraCaseStudy.jsx'), join(repo, 'src', 'NiraCaseStudy.css')]) {
  if (!existsSync(file)) throw new Error(`Missing ${file}. Extract the ZIP into your portfolio root first.`)
}
let app = readFileSync(appPath, 'utf8')
if (app.includes("import NiraCaseStudy from './NiraCaseStudy.jsx'")) {
  console.log('NIRA case study is already integrated. No changes needed.')
  process.exit(0)
}
const expected = [
  "import PortfolioAssistant from './PortfolioAssistant.jsx'",
  '  const [menuOpen, setMenuOpen] = useState(false)',
  'function usePageEffects()',
  '  usePageEffects()',
  '  const go = () => setMenuOpen(false)',
  '      <main>',
  'onClick={() => setActiveProject(selectedProject)}',
  '      <ProjectDialog project={activeProject} onClose={closeProject} />',
]
for (const value of expected) if (!app.includes(value)) throw new Error(`Local App.jsx differs; no edits made. Expected: ${value}`)
if (!/<\/footer>\s*<ProjectDialog project=/.test(app)) throw new Error('Footer boundary differs; no edits made.')
const nl = app.includes('\r\n') ? '\r\n' : '\n'
function exactlyOnce(before, after) {
  const first = app.indexOf(before)
  if (first < 0 || app.indexOf(before, first + before.length) >= 0) throw new Error(`Expected exactly one matching anchor: ${before.slice(0, 75)}`)
  app = app.slice(0, first) + after + app.slice(first + before.length)
}
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '').replace('T', '_')
const backup = join(repo, `App_before_NIRA_case_study_${stamp}.jsx.bak`)
copyFileSync(appPath, backup)
exactlyOnce("import PortfolioAssistant from './PortfolioAssistant.jsx'", "import PortfolioAssistant from './PortfolioAssistant.jsx'" + nl + "import NiraCaseStudy from './NiraCaseStudy.jsx'")
exactlyOnce('function usePageEffects()', 'function usePageEffects(caseStudyOpen)')
exactlyOnce('  usePageEffects()', '  usePageEffects(caseStudyOpen)')
exactlyOnce('  }, [])' + nl + '}' + nl + nl + 'function App()', '  }, [caseStudyOpen])' + nl + '}' + nl + nl + 'function App()')
exactlyOnce('  const [menuOpen, setMenuOpen] = useState(false)', `  const [menuOpen, setMenuOpen] = useState(false)${nl}  const [caseStudyOpen, setCaseStudyOpen] = useState(() => window.location.hash === '#/projects/nira-agent')`)
const syncRoute = [
  '  useEffect(() => {',
  '    const syncCaseRoute = () => {',
  "      const showingCase = window.location.hash === '#/projects/nira-agent'",
  '      setCaseStudyOpen(showingCase)',
  '      setMenuOpen(false)',
  '      if (showingCase) window.scrollTo(0, 0)',
  "      else if (window.location.hash.startsWith('#')) {",
  '        const id = window.location.hash.slice(1)',
  '        requestAnimationFrame(() => requestAnimationFrame(() => {',
  "          document.getElementById(id)?.scrollIntoView({ behavior: 'auto' })",
  '        }))',
  '      }',
  '    }',
  "    window.addEventListener('hashchange', syncCaseRoute)",
  "    return () => window.removeEventListener('hashchange', syncCaseRoute)",
  '  }, [])',
  '',
  '  useEffect(() => { if (caseStudyOpen) window.scrollTo(0, 0) }, [caseStudyOpen])',
  '',
  '  const go = () => setMenuOpen(false)',
].join(nl)
exactlyOnce('  const go = () => setMenuOpen(false)', syncRoute)
exactlyOnce('      <main>', '      {caseStudyOpen ? <NiraCaseStudy /> : <>' + nl + '      <main>')
app = app.replace(/(<\/footer>)(\s*)(<ProjectDialog project=)/, `$1${nl}      </>}${nl}      $3`)
exactlyOnce('onClick={() => setActiveProject(selectedProject)}', "onClick={() => { if (selectedProject.id === 'nira-agent') window.location.hash = '#/projects/nira-agent'; else setActiveProject(selectedProject) }}")
writeFileSync(appPath, app, 'utf8')
console.log('NIRA case study integrated into your local App.jsx.')
console.log('Backup:', backup)
console.log('Next: npm.cmd run lint; npm.cmd run build; npm.cmd run dev')
