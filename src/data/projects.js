export const projects = [
  {
    id: 'nira-agent',
    number: '01',
    name: 'Nira Agent',
    category: 'LOCAL AI / DESKTOP SOFTWARE',
    lead: 'An AI companion that lives on your computer.',
    summary: 'A C# desktop agent exploring local language models, semantic memory, voice, and tool-driven PC workflows.',
    description:
      'An ongoing Windows desktop-agent project built around conversational interaction, semantic memory, voice responses, awareness of PC state, and tools that can carry out multi-step tasks. The focus is on making the assistant useful inside an actual desktop workflow, not just a chat window.',
    technologies: ['C#', '.NET', 'WPF', 'ONNX', 'Ollama'],
    status: 'IN DEVELOPMENT',
  },
  {
    id: 'globaltrade',
    number: '02',
    name: 'GlobalTrade Logistics',
    category: 'ENTERPRISE JAVA / BACKEND',
    lead: 'Connected workflows for a complex logistics system.',
    summary: 'An enterprise Java application for shipments, inventory, customs, vendors, and route optimization.',
    description:
      'A modular Jakarta EE application with enterprise components for shipment tracking, inventory management, customs processing, vendor management, and risk-informed route recommendations. The architecture uses role-based security, scheduled processing, transaction management, and audit logging.',
    technologies: ['Java 17', 'Jakarta EE', 'EJB', 'Payara', 'MySQL'],
    status: 'ACADEMIC PROJECT',
  },
  {
    id: 'tradeai',
    number: '03',
    name: 'TradeAI System',
    category: 'PYTHON / MACHINE LEARNING',
    lead: 'Research, validation, and risk before execution.',
    summary: 'Trading research and paper execution with feature engineering, model evaluation, and risk controls.',
    description:
      'A Python research and paper-execution project integrating market-data workflows, feature engineering, model validation, forward evaluation, backtesting, and risk-management logic. It is presented as a research system; no investment performance or live returns are claimed.',
    technologies: ['Python', 'Machine Learning', 'MetaTrader 5', 'Backtesting'],
    status: 'RESEARCH PROJECT',
  },
  {
    id: 'customer-message',
    number: '04',
    name: 'CustomerMessageTool',
    category: 'C# / WORKFLOW AUTOMATION',
    lead: 'Less repetition. Clearer operational workflows.',
    summary: 'A Windows application for customer-record workflows and SMS communication processing.',
    description:
      'A WPF application combining browser automation, customer-record retrieval, recipient selection, and SMS progress tracking for banking-related workflows. The public portfolio does not expose customer information, internal endpoints, credentials, or proprietary system details.',
    technologies: ['C#', 'WPF', 'Playwright', 'API Integration'],
    status: 'INTERNAL WORKFLOW PROJECT',
  },
]
