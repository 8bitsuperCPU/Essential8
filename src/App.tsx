import { useState, useEffect, useMemo } from 'react';
import { Link, Routes, Route, useParams, Navigate } from 'react-router-dom';
import {
  Search, Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound,
  Moon, Sun, ChevronRight, ArrowLeft, X, ExternalLink, CheckCircle, AlertTriangle, Info, Database,
  Target, Wrench, Cpu, ClipboardCheck, FileUp, Trash2, Check, XCircle, AlertCircle, Palette
} from 'lucide-react';
import Fuse from 'fuse.js';
import { strategies, type Requirement, type MaturityLevelData, type MitigationStrategy } from './data';
import { ThemeProvider, useTheme, themes, type ThemeName } from './ThemeContext';

const API = '/api';
const APP_VERSION = '1.2.0';

/* ═══════════════════════════════════════════════════════════════
   ICON MAP
   ═══════════════════════════════════════════════════════════════ */
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound, Database
};

/* ═══════════════════════════════════════════════════════════════
   API HELPERS
   ═══════════════════════════════════════════════════════════════ */
async function apiFetch(path, opts = {}) {
  const isFormData = opts.body instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${API}${path}`, { headers, ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH HOOK
   ═══════════════════════════════════════════════════════════════ */
function useSearch() {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => {
    const items = [];
    strategies.forEach((s) => {
      items.push({ type: 'strategy', strategyId: s.id, strategyName: s.name, title: s.name, text: s.description });
      s.maturityLevels.forEach((ml) => {
        ml.requirements.forEach((req) => {
          items.push({ type: 'requirement', strategyId: s.id, strategyName: s.name, maturityLevel: ml.level, title: `${s.name} — ML${ml.level}`, text: req.text, reqId: req.id });
        });
      });
    });
    return new Fuse(items, { keys: ['title', 'text', 'strategyName'], threshold: 0.3 });
  }, []);
  const results = query.length >= 2 ? fuse.search(query).map(r => r.item) : [];
  return { query, setQuery, results };
}

/* ═══════════════════════════════════════════════════════════════
   THEME SWITCHER
   ═══════════════════════════════════════════════════════════════ */
function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeIcons: Record<ThemeName, React.ReactNode> = {
    cyber: <Shield size={14} />,
    spotify: <Moon size={14} />,
    light: <Sun size={14} />,
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-lg border border-cyber-border bg-cyber-card p-2 text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors" title="Change theme">
        <Palette size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 rounded-lg border border-cyber-border bg-cyber-card py-1 min-w-[140px] shadow-xl">
            {Object.values(themes).map(t => (
              <button
                key={t.name}
                onClick={() => { setTheme(t.name); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors ${themeName === t.name ? 'text-cyber-primary bg-cyber-primary/10' : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/30'}`}
              >
                {themeIcons[t.name]}
                {t.label}
                {themeName === t.name && <Check size={12} className="ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════ */
function Header({ onSearchClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 group-hover:bg-cyber-primary/20 transition-colors">
            <Shield className="text-cyber-primary" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-cyber-text leading-tight">Essential Eight</h1>
            <p className="text-[10px] text-cyber-muted uppercase tracking-widest">ACSC Maturity Model</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/audit" className="flex items-center gap-2 rounded-lg border border-cyber-secondary/30 bg-cyber-secondary/10 px-3 py-2 text-sm text-cyber-secondary hover:bg-cyber-secondary/20 transition-colors">
            <ClipboardCheck size={16} />
            <span className="hidden sm:inline">Audit</span>
          </Link>
          <button onClick={onSearchClick} className="flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card px-3 py-2 text-sm text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors">
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline rounded bg-cyber-bg px-1.5 py-0.5 text-[10px] text-cyber-muted">⌘K</kbd>
          </button>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH MODAL
   ═══════════════════════════════════════════════════════════════ */
function SearchModal({ query, setQuery, results, onClose }) {
  return (
    <div className="fixed inset-0 z-50 modal-overlay flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4 rounded-xl border border-cyber-border bg-cyber-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-cyber-border px-4 py-3">
          <Search className="text-cyber-primary" size={20} />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search strategies, requirements..." className="flex-1 bg-transparent text-cyber-text placeholder-cyber-muted outline-none text-sm" />
          <button onClick={onClose} className="text-cyber-muted hover:text-cyber-text"><X size={18} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length < 2 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">Type at least 2 characters to search...</p>}
          {query.length >= 2 && results.length === 0 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">No results found for &ldquo;{query}&rdquo;</p>}
          {results.map((r, i) => (
            <Link key={i} to={r.type === 'strategy' ? `/strategy/${r.strategyId}` : `/strategy/${r.strategyId}/maturity/${r.maturityLevel}?req=${r.reqId}`} onClick={onClose} className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-cyber-primary/5 transition-colors">
              <div className={`mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${r.type === 'strategy' ? 'bg-cyber-secondary/20 text-cyber-secondary' : 'bg-cyber-primary/20 text-cyber-primary'}`}>
                {r.type === 'strategy' ? 'Strategy' : `ML${r.maturityLevel}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cyber-text truncate">{r.title}</p>
                <p className="text-xs text-cyber-muted truncate">{r.strategyName} — {r.text}</p>
              </div>
              <ChevronRight size={14} className="mt-1 text-cyber-muted shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyber-text mb-2">Essential Eight Maturity Model</h2>
        <p className="text-cyber-muted text-sm max-w-3xl mb-2">The ACSC Essential Eight is a set of prioritised mitigation strategies to help organisations protect against cyber threats.</p>
        <p className="text-cyber-muted text-xs">Source: <a href="https://www.cyber.gov.au/sites/default/files/2023-11/PROTECT%20-%20Essential%20Eight%20Maturity%20Model%20%28November%202023%29.pdf" target="_blank" rel="noopener noreferrer" className="text-cyber-primary hover:underline">ACSC Essential Eight Maturity Model (November 2023) <ExternalLink size={10} className="inline" /></a></p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((s, index) => <StrategyTile key={s.id} strategy={s} index={index} />)}
      </div>
    </div>
  );
}

function StrategyTile({ strategy, index }) {
  const Icon = iconMap[strategy.icon];
  return (
    <Link to={`/strategy/${strategy.id}`} className="glass-card rounded-xl p-5 group animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 group-hover:bg-cyber-primary/20 transition-colors">
          {Icon && <Icon className="text-cyber-primary" size={20} />}
        </div>
        <ChevronRight size={16} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-1" />
      </div>
      <h3 className="text-sm font-semibold text-cyber-text mb-1 group-hover:text-cyber-primary transition-colors">{strategy.name}</h3>
      <p className="text-xs text-cyber-muted line-clamp-2 mb-3">{strategy.description}</p>
      <div className="flex items-center gap-2 text-[10px] text-cyber-muted">
        <span className="rounded bg-cyber-success/10 text-cyber-success px-1.5 py-0.5 font-medium">ML1: {strategy.maturityLevels[0].requirements.length}</span>
        <span className="rounded bg-cyber-warning/10 text-cyber-warning px-1.5 py-0.5 font-medium">ML2: {strategy.maturityLevels[1].requirements.length}</span>
        <span className="rounded bg-cyber-danger/10 text-cyber-danger px-1.5 py-0.5 font-medium">ML3: {strategy.maturityLevels[2].requirements.length}</span>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STRATEGY DETAIL
   ═══════════════════════════════════════════════════════════════ */
function StrategyDetail() {
  const { strategyId } = useParams();
  const strategy = strategies.find(s => s.id === strategyId);
  if (!strategy) return <Navigate to="/" replace />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back to Dashboard</Link>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyber-text mb-2">{strategy.name}</h2>
        <p className="text-cyber-muted text-sm max-w-3xl">{strategy.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategy.maturityLevels.map(ml => <MaturityCard key={ml.level} strategyId={strategy.id} maturity={ml} />)}
      </div>
    </div>
  );
}

function MaturityCard({ strategyId, maturity }) {
  const colors = ['border-cyber-success/30', 'border-cyber-warning/30', 'border-cyber-danger/30'];
  const textColors = ['text-cyber-success', 'text-cyber-warning', 'text-cyber-danger'];
  const bgColors = ['bg-cyber-success/10', 'bg-cyber-warning/10', 'bg-cyber-danger/10'];
  return (
    <Link to={`/strategy/${strategyId}/maturity/${maturity.level}`} className={`glass-card rounded-xl p-6 border-l-4 ${colors[maturity.level - 1]} group hover:scale-[1.02] transition-all`}>
      <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${bgColors[maturity.level - 1]} ${textColors[maturity.level - 1]} mb-3`}>
        {maturity.level === 1 && <CheckCircle size={12} />}
        {maturity.level === 2 && <AlertTriangle size={12} />}
        {maturity.level === 3 && <Info size={12} />}
        {maturity.title}
      </div>
      <p className="text-sm text-cyber-muted mb-4">{maturity.requirements.length} requirement{maturity.requirements.length !== 1 ? 's' : ''}</p>
      <div className="space-y-2">
        {maturity.requirements.slice(0, 3).map((r) => <div key={r.id} className="text-xs text-cyber-muted truncate">• {r.text.substring(0, 80)}...</div>)}
        {maturity.requirements.length > 3 && <div className="text-xs text-cyber-primary">+{maturity.requirements.length - 3} more</div>}
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REQUIREMENT DETAIL MODAL
   ═══════════════════════════════════════════════════════════════ */
function RequirementModal({ requirement, strategyName, maturityTitle, onClose }) {
  return (
    <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-cyber-border bg-cyber-card shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-cyber-border bg-cyber-card px-6 py-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{requirement.id.toUpperCase()}</span>
              <span className="text-xs text-cyber-muted">{strategyName} / {maturityTitle}</span>
            </div>
            <h3 className="text-base font-bold text-cyber-text leading-snug">{requirement.text}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-cyber-muted hover:bg-cyber-border hover:text-cyber-text transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-4 space-y-5">
          <ModalSection icon={<Target size={16} />} title="Purpose" content={requirement.purpose} color="cyber-primary" />
          <ModalSection icon={<Wrench size={16} />} title="Implementation Guidance" content={requirement.implementation} color="cyber-secondary" />
          <ModalListSection icon={<Cpu size={16} />} title="Technical Examples" items={requirement.examples} color="cyber-success" />
          <ModalListSection icon={<ClipboardCheck size={16} />} title="Audit Evidence" items={requirement.evidence} color="cyber-warning" />
        </div>
      </div>
    </div>
  );
}

function ModalSection({ icon, title, content, color }) {
  const iconColors = { 'cyber-primary': 'text-cyber-primary', 'cyber-secondary': 'text-cyber-secondary', 'cyber-success': 'text-cyber-success', 'cyber-warning': 'text-cyber-warning' };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={iconColors[color] || 'text-cyber-primary'}>{icon}</span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4>
      </div>
      <p className="text-sm text-cyber-text leading-relaxed pl-6">{content}</p>
    </div>
  );
}

function ModalListSection({ icon, title, items, color }) {
  const dotColors = { 'cyber-primary': 'bg-cyber-primary', 'cyber-secondary': 'bg-cyber-secondary', 'cyber-success': 'bg-cyber-success', 'cyber-warning': 'bg-cyber-warning' };
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={dotColors[color]?.replace('bg-', 'text-') || 'text-cyber-primary'}>{icon}</span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4>
      </div>
      <ul className="space-y-1.5 pl-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-cyber-text">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[color] || 'bg-cyber-primary'}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MATURITY VIEW — Grid of requirement cards
   ═══════════════════════════════════════════════════════════════ */
function MaturityView() {
  const { strategyId, level } = useParams();
  const strategy = strategies.find(s => s.id === strategyId);
  const maturity = strategy?.maturityLevels.find(m => m.level === Number(level));
  const [selectedReq, setSelectedReq] = useState(null);
  if (!strategy || !maturity) return <Navigate to="/" replace />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to={`/strategy/${strategyId}`} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back to {strategy.name}</Link>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyber-text mb-1">{strategy.name}</h2>
        <p className="text-cyber-primary font-medium">{maturity.title}</p>
        <p className="text-cyber-muted text-sm mt-1">{maturity.requirements.length} requirements from ACSC Essential Eight Maturity Model (Nov 2023)</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {maturity.requirements.map((req, index) => (
          <button key={req.id} onClick={() => setSelectedReq(req)} className="glass-card rounded-xl p-5 text-left group hover:scale-[1.02] hover:border-cyber-primary/40 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{req.id.toUpperCase()}</span>
              <ChevronRight size={14} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-0.5" />
            </div>
            <p className="text-sm text-cyber-text leading-relaxed line-clamp-3">{req.text}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] text-cyber-muted">
              <Target size={10} /> Click for guidance
            </div>
          </button>
        ))}
      </div>
      {selectedReq && <RequirementModal requirement={selectedReq} strategyName={strategy.name} maturityTitle={maturity.title} onClose={() => setSelectedReq(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT HOME — Identifier entry, new/recall audit
   ═══════════════════════════════════════════════════════════════ */
function AuditHome() {
  const [identifier, setIdentifier] = useState('');
  const [existingAudit, setExistingAudit] = useState(null);
  const [error, setError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    apiFetch('/audits/summary').then(setAudits).catch(() => {});
  }, []);

  async function lookupIdentifier() {
    if (!identifier.trim()) { setError('Please enter an identifier'); return; }
    setError('');
    try {
      const audit = await apiFetch(`/audits?identifier=${encodeURIComponent(identifier.trim())}`);
      setExistingAudit(audit);
      setShowNew(false);
    } catch {
      setExistingAudit(null);
      setShowNew(true);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back to Dashboard</Link>
      <h2 className="text-2xl font-bold text-cyber-text mb-2">Compliance Audit</h2>
      <p className="text-cyber-muted text-sm mb-8">Enter your unique identifier to start a new audit or recall an existing one.</p>

      <div className="glass-card rounded-xl p-6 mb-8">
        <label className="block text-sm font-medium text-cyber-text mb-2">Your Unique Identifier</label>
        <div className="flex gap-3">
          <input value={identifier} onChange={e => setIdentifier(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupIdentifier()} placeholder="e.g., ACME-CORP-2024, MY-AUDIT-001" className="flex-1 rounded-lg border border-cyber-border bg-cyber-bg px-4 py-2.5 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 transition-colors" />
          <button onClick={lookupIdentifier} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-6 py-2.5 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Look Up</button>
        </div>
        {error && <p className="mt-2 text-xs text-cyber-danger">{error}</p>}
      </div>

      {existingAudit && (
        <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-warning/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-cyber-warning" size={18} />
            <h3 className="text-sm font-bold text-cyber-text">Existing Audit Found</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="text-cyber-muted">Identifier:</span> <span className="text-cyber-text font-medium">{existingAudit.identifier}</span></div>
            <div><span className="text-cyber-muted">Status:</span> <span className={`font-medium ${existingAudit.status === 'completed' ? 'text-cyber-success' : 'text-cyber-warning'}`}>{existingAudit.status}</span></div>
            <div><span className="text-cyber-muted">Control:</span> <span className="text-cyber-text">{strategies.find(s => s.id === existingAudit.control_id)?.name || existingAudit.control_id}</span></div>
            <div><span className="text-cyber-muted">Maturity Level:</span> <span className="text-cyber-text">ML{existingAudit.maturity_level}</span></div>
          </div>
          <div className="flex gap-3">
            <Link to={`/audit/${existingAudit.id}`} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Continue Audit</Link>
            <Link to={`/audit/${existingAudit.id}/report`} className="rounded-lg border border-cyber-border px-4 py-2 text-sm font-medium text-cyber-muted hover:text-cyber-text hover:border-cyber-primary/30 transition-colors">View Report</Link>
          </div>
        </div>
      )}

      {showNew && <NewAuditForm identifier={identifier.trim()} onCreated={setExistingAudit} />}

      {audits.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-cyber-text mb-4">All Audits</h3>
          <div className="space-y-3">
            {audits.map(a => (
              <div key={a.identifier} className="glass-card rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cyber-text">{a.identifier}</p>
                  <p className="text-xs text-cyber-muted">{strategies.find(s => s.id === a.control_id)?.name} — ML{a.maturity_level} • {a.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  {a.total_requirements > 0 && <span className="text-xs text-cyber-muted">{a.compliant_count}/{a.total_requirements} compliant</span>}
                  <Link to={`/audit/${a.id}`} className="text-xs text-cyber-primary hover:underline">Open</Link>
                  <Link to={`/audit/${a.id}/report`} className="text-xs text-cyber-secondary hover:underline">Report</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NEW AUDIT FORM
   ═══════════════════════════════════════════════════════════════ */
function NewAuditForm({ identifier, onCreated }) {
  const [controlId, setControlId] = useState('');
  const [maturityLevel, setMaturityLevel] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    if (!controlId) { setError('Please select a control'); return; }
    setCreating(true);
    setError('');
    try {
      const audit = await apiFetch('/audits', { method: 'POST', body: JSON.stringify({ identifier, controlId, maturityLevel }) });
      onCreated(audit);
    } catch (e) {
      setError(e.message);
    }
    setCreating(false);
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-success/30">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="text-cyber-success" size={18} />
        <h3 className="text-sm font-bold text-cyber-text">Start New Audit</h3>
      </div>
      <p className="text-xs text-cyber-muted mb-4">Identifier: <span className="text-cyber-text font-medium">{identifier}</span></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-cyber-muted mb-1">Control</label>
          <select value={controlId} onChange={e => setControlId(e.target.value)} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text outline-none focus:border-cyber-primary/50">
            <option value="">Select a control...</option>
            {strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-cyber-muted mb-1">Maturity Level</label>
          <select value={maturityLevel} onChange={e => setMaturityLevel(Number(e.target.value))} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text outline-none focus:border-cyber-primary/50">
            <option value={1}>Maturity Level One</option>
            <option value={2}>Maturity Level Two</option>
            <option value={3}>Maturity Level Three</option>
          </select>
        </div>
      </div>
      {error && <p className="mb-3 text-xs text-cyber-danger">{error}</p>}
      <button onClick={handleCreate} disabled={creating || !controlId} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-6 py-2.5 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 disabled:opacity-50 transition-colors">
        {creating ? 'Creating...' : 'Start Audit'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT WORKFLOW — Step-by-step requirement assessment
   ═══════════════════════════════════════════════════════════════ */
function AuditWorkflow({ auditId }) {
  const [audit, setAudit] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [evidence, setEvidence] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('step') || '0');
  });

  const strategy = audit ? strategies.find(s => s.id === audit.control_id) : null;
  const maturity = strategy?.maturityLevels.find(m => m.level === audit?.maturity_level);
  const reqs = maturity?.requirements || [];
  const currentReq = reqs[currentStep];

  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('step', currentStep.toString());
    window.history.replaceState({}, '', url);
  }, [currentStep]);

  useEffect(() => { loadAudit(); }, [auditId]);

  async function loadAudit() {
    try {
      const [a, s, e] = await Promise.all([
        apiFetch(`/audits/${auditId}`),
        apiFetch(`/audits/${auditId}/requirements`),
        apiFetch(`/audits/${auditId}/evidence`)
      ]);
      setAudit(a);
      const sm = {};
      s.forEach(rs => { sm[rs.requirement_id] = rs; });
      setStatuses(sm);
      const em = {};
      e.forEach(ev => { if (!em[ev.requirement_id]) em[ev.requirement_id] = []; em[ev.requirement_id].push(ev); });
      setEvidence(em);
    } catch (err) { console.error('Failed to load audit:', err); }
  }

  async function setCompliant(requirementId, compliant, notes = '') {
    setSaving(true);
    try {
      const status = await apiFetch(`/audits/${auditId}/requirements/${requirementId}`, { method: 'PUT', body: JSON.stringify({ compliant, notes }) });
      setStatuses(prev => ({ ...prev, [requirementId]: status }));
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function uploadEvidence(requirementId, evidenceType, description, file) {
    const formData = new FormData();
    formData.append('requirementId', requirementId);
    formData.append('evidenceType', evidenceType);
    formData.append('description', description);
    if (file) formData.append('file', file);
    try {
      await fetch(`${API}/audits/${auditId}/evidence`, { method: 'POST', body: formData });
      const updated = await apiFetch(`/audits/${auditId}/evidence?requirementId=${requirementId}`);
      setEvidence(prev => ({ ...prev, [requirementId]: updated }));
    } catch (err) { console.error(err); }
  }

  async function removeEvidence(evId) {
    try { await apiFetch(`/evidence/${evId}`, { method: 'DELETE' }); loadAudit(); } catch (err) { console.error(err); }
  }

  async function completeAudit() {
    await apiFetch(`/audits/${auditId}/status`, { method: 'PUT', body: JSON.stringify({ status: 'completed' }) });
    window.location.href = `/audit/${auditId}/report`;
  }

  if (!audit || !maturity) return <div className="p-8 text-cyber-muted">Loading audit...</div>;

  const compliantCount = Object.values(statuses).filter(s => s.compliant === 1).length;
  const totalCount = reqs.length;
  const progress = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/audit" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back to Audits</Link>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-cyber-text">{strategy.name} — {maturity.title}</h2>
        <p className="text-sm text-cyber-muted">Audit: {audit.identifier}</p>
      </div>
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-cyber-text">Progress: {compliantCount}/{totalCount} compliant</span>
          <span className="text-sm font-medium text-cyber-primary">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-cyber-border overflow-hidden">
          <div className="h-full rounded-full bg-cyber-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-1 mt-3">
          {reqs.map((req, i) => (
            <button key={req.id} onClick={() => setCurrentStep(i)} className={`h-2 flex-1 rounded-full transition-colors ${i === currentStep ? 'bg-cyber-primary' : statuses[req.id]?.compliant ? 'bg-cyber-success' : statuses[req.id] ? 'bg-cyber-danger' : 'bg-cyber-border'}`} />
          ))}
        </div>
      </div>
      {currentReq && (
        <RequirementAssessment
          requirement={currentReq}
          status={statuses[currentReq.id]}
          evidence={evidence[currentReq.id] || []}
          onCompliant={(c, n) => setCompliant(currentReq.id, c, n)}
          onEvidence={(type, desc, file) => uploadEvidence(currentReq.id, type, desc, file)}
          onRemoveEvidence={removeEvidence}
          saving={saving}
        />
      )}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text disabled:opacity-30 transition-colors">Previous</button>
        <span className="text-xs text-cyber-muted">Requirement {currentStep + 1} of {totalCount}</span>
        {currentStep < totalCount - 1 ? (
          <button onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Next</button>
        ) : (
          <button onClick={completeAudit} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-4 py-2 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 transition-colors">Complete Audit</button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REQUIREMENT ASSESSMENT CARD
   ═══════════════════════════════════════════════════════════════ */
function RequirementAssessment({ requirement, status, evidence, onCompliant, onEvidence, onRemoveEvidence, saving }) {
  const [notes, setNotes] = useState(status?.notes || '');
  const [evidenceType, setEvidenceType] = useState('screenshot');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [file, setFile] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);

  const isCompliant = status?.compliant === 1;
  const isNonCompliant = status?.compliant === 0;

  const evidenceTypes = [
    { value: 'screenshot', label: 'Screenshot' },
    { value: 'config_export', label: 'Configuration Export' },
    { value: 'policy_document', label: 'Policy Document' },
    { value: 'scan_report', label: 'Scan Report' },
    { value: 'log_export', label: 'Log Export' },
    { value: 'photo', label: 'Photo' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{requirement.id.toUpperCase()}</span>
          <h3 className="text-sm font-bold text-cyber-text mt-2 leading-snug">{requirement.text}</h3>
        </div>
        {isCompliant && <CheckCircle className="text-cyber-success shrink-0" size={20} />}
        {isNonCompliant && <XCircle className="text-cyber-danger shrink-0" size={20} />}
      </div>
      <div className="flex gap-3 mb-4">
        <button onClick={() => onCompliant(true, notes)} disabled={saving} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${isCompliant ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success' : 'border-cyber-border text-cyber-muted hover:border-cyber-success/30 hover:text-cyber-success'}`}><Check size={14} className="inline mr-1.5" /> Compliant</button>
        <button onClick={() => onCompliant(false, notes)} disabled={saving} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${isNonCompliant ? 'bg-cyber-danger/20 border-cyber-danger/40 text-cyber-danger' : 'border-cyber-border text-cyber-muted hover:border-cyber-danger/30 hover:text-cyber-danger'}`}><XCircle size={14} className="inline mr-1.5" /> Not Compliant</button>
      </div>
      {isNonCompliant && (
        <div className="rounded-lg bg-cyber-danger/10 border border-cyber-danger/20 p-3 mb-4">
          <p className="text-xs text-cyber-danger flex items-center gap-1.5"><AlertCircle size={12} /> Marking this as non-compliant means you fail to meet this control requirement. Consider uploading evidence or adding notes explaining the gap.</p>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-xs font-medium text-cyber-muted mb-1">Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => { if (!saving) onCompliant(isCompliant, notes); }} placeholder="Add notes about this requirement..." rows={2} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 resize-none" />
      </div>
      <div className="border-t border-cyber-border pt-4">
        <button onClick={() => setShowEvidence(!showEvidence)} className="flex items-center gap-2 text-sm font-medium text-cyber-text mb-3"><FileUp size={14} /> Evidence ({evidence.length}) <ChevronRight size={12} className={`transition-transform ${showEvidence ? 'rotate-90' : ''}`} /></button>
        {showEvidence && (
          <>
            <div className="rounded-lg border border-cyber-border p-3 mb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select value={evidenceType} onChange={e => setEvidenceType(e.target.value)} className="rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text outline-none">
                  {evidenceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-xs text-cyber-muted file:mr-2 file:rounded file:border-0 file:bg-cyber-primary/10 file:px-2 file:py-1 file:text-xs file:text-cyber-primary" />
              </div>
              <input value={evidenceDesc} onChange={e => setEvidenceDesc(e.target.value)} placeholder="Description (optional)" className="w-full rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text placeholder-cyber-muted outline-none" />
              <button onClick={() => { onEvidence(evidenceType, evidenceDesc, file); setFile(null); setEvidenceDesc(''); }} className="rounded bg-cyber-primary/20 border border-cyber-primary/30 px-3 py-1.5 text-xs font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Add Evidence</button>
            </div>
            {evidence.length > 0 ? (
              <div className="space-y-2">
                {evidence.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between rounded-lg border border-cyber-border p-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="rounded bg-cyber-bg px-1.5 py-0.5 text-[9px] font-medium text-cyber-muted uppercase">{ev.evidence_type}</span>
                      <span className="text-xs text-cyber-text truncate">{ev.file_name || ev.description || 'No description'}</span>
                    </div>
                    <button onClick={() => onRemoveEvidence(ev.id)} className="text-cyber-muted hover:text-cyber-danger transition-colors"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-cyber-muted">No evidence uploaded yet.</p>}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT REPORT
   ═══════════════════════════════════════════════════════════════ */
function AuditReport({ auditId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiFetch(`/audits/${auditId}/report`).then(setReport).catch(console.error).finally(() => setLoading(false)); }, [auditId]);

  if (loading) return <div className="p-8 text-cyber-muted">Generating report...</div>;
  if (!report) return <div className="p-8 text-cyber-danger">Failed to load report</div>;

  const { audit, statuses, evidence, summary } = report;
  const strategy = strategies.find(s => s.id === audit.control_id);
  const maturity = strategy?.maturityLevels.find(m => m.level === audit.maturity_level);
  const reqs = maturity?.requirements || [];
  const nonCompliant = statuses.filter(s => s.compliant === 0);
  const compliant = statuses.filter(s => s.compliant === 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to={`/audit/${auditId}`} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back to Audit</Link>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyber-text mb-1">Compliance Report</h2>
        <p className="text-sm text-cyber-muted">{strategy?.name} — {maturity?.title}</p>
        <p className="text-xs text-cyber-muted">Audit: {audit.identifier} • {new Date(audit.created_at).toLocaleDateString()}</p>
      </div>
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-cyber-text mb-4">Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="text-center"><div className="text-2xl font-bold text-cyber-primary">{summary.compliancePercent}%</div><div className="text-xs text-cyber-muted">Compliance</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-success">{summary.compliant}</div><div className="text-xs text-cyber-muted">Compliant</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-danger">{summary.nonCompliant}</div><div className="text-xs text-cyber-muted">Non-Compliant</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-secondary">{summary.evidenceItems}</div><div className="text-xs text-cyber-muted">Evidence Items</div></div>
        </div>
        <div className="h-3 rounded-full bg-cyber-border overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyber-danger via-cyber-warning to-cyber-success transition-all" style={{ width: `${summary.compliancePercent}%` }} />
        </div>
      </div>
      {nonCompliant.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-danger/30">
          <h3 className="text-lg font-bold text-cyber-danger mb-4 flex items-center gap-2"><XCircle size={18} /> Non-Compliant ({nonCompliant.length})</h3>
          <div className="space-y-4">
            {nonCompliant.map(ns => {
              const req = reqs.find(r => r.id === ns.requirement_id);
              if (!req) return null;
              return (
                <div key={ns.id} className="rounded-lg border border-cyber-danger/20 bg-cyber-danger/5 p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="rounded bg-cyber-danger/10 px-1.5 py-0.5 text-[9px] font-bold text-cyber-danger">{req.id.toUpperCase()}</span>
                    <p className="text-sm text-cyber-text flex-1">{req.text}</p>
                  </div>
                  {ns.notes && <p className="text-xs text-cyber-muted mb-2 italic">Note: {ns.notes}</p>}
                  <div className="rounded bg-cyber-bg/50 p-3 mt-2">
                    <p className="text-xs font-bold text-cyber-secondary mb-1">Recommendation:</p>
                    <p className="text-xs text-cyber-text">{req.implementation}</p>
                    <p className="text-xs text-cyber-muted mt-1">Examples: {req.examples.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {compliant.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-success/30">
          <h3 className="text-lg font-bold text-cyber-success mb-4 flex items-center gap-2"><CheckCircle size={18} /> Compliant ({compliant.length})</h3>
          <div className="space-y-2">
            {compliant.map(cs => {
              const req = reqs.find(r => r.id === cs.requirement_id);
              if (!req) return null;
              return (
                <div key={cs.id} className="flex items-start gap-2 rounded-lg border border-cyber-success/10 bg-cyber-success/5 p-3">
                  <CheckCircle size={14} className="text-cyber-success mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-cyber-success">{req.id.toUpperCase()}</span>
                    <p className="text-xs text-cyber-text">{req.text}</p>
                    {cs.notes && <p className="text-[10px] text-cyber-muted italic mt-0.5">{cs.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {evidence.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyber-text mb-4">Evidence Collected ({evidence.length})</h3>
          <div className="space-y-2">
            {evidence.map(ev => (
              <div key={ev.id} className="flex items-center gap-3 rounded-lg border border-cyber-border p-2">
                <span className="rounded bg-cyber-bg px-1.5 py-0.5 text-[9px] font-medium text-cyber-muted uppercase">{ev.evidence_type}</span>
                <span className="text-xs text-cyber-text flex-1 truncate">{ev.file_name || ev.description || 'No description'}</span>
                <span className="text-[10px] text-cyber-muted">{ev.requirement_id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const search = useSearch();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(prev => !prev); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <ThemeProvider>
      <AppInner searchOpen={searchOpen} setSearchOpen={setSearchOpen} search={search} />
    </ThemeProvider>
  );
}

function AppInner({ searchOpen, setSearchOpen, search }) {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <Header onSearchClick={() => setSearchOpen(true)} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/strategy/:strategyId" element={<StrategyDetail />} />
        <Route path="/strategy/:strategyId/maturity/:level" element={<MaturityView />} />
        <Route path="/audit" element={<AuditHome />} />
        <Route path="/audit/:auditId" element={<AuditWorkflowWrapper />} />
        <Route path="/audit/:auditId/report" element={<AuditReportWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {searchOpen && <SearchModal query={search.query} setQuery={search.setQuery} results={search.results} onClose={() => { setSearchOpen(false); search.setQuery(''); }} />}
      <div className="fixed bottom-3 left-3 z-30">
        <span className="rounded bg-cyber-card/80 border border-cyber-border px-2 py-1 text-[10px] text-cyber-muted backdrop-blur-sm">v{APP_VERSION}</span>
      </div>
    </div>
  );
}

function AuditWorkflowWrapper() { const { auditId } = useParams(); return <AuditWorkflow auditId={parseInt(auditId)} />; }
function AuditReportWrapper() { const { auditId } = useParams(); return <AuditReport auditId={parseInt(auditId)} />; }
