import { useState, useEffect, useMemo } from 'react';
import { Link, Routes, Route, useParams, Navigate } from 'react-router-dom';
import {
  Search, Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound,
  Moon, Sun, ChevronRight, ArrowLeft, X, ExternalLink, CheckCircle, AlertTriangle, Info, Database,
  Target, Wrench, Cpu, ClipboardCheck
} from 'lucide-react';
import Fuse from 'fuse.js';
import { strategies, type Requirement, type MaturityLevelData, type MitigationStrategy } from './data';

/* ═══════════════════════════════════════════════════════════════
   ICON MAP
   ═══════════════════════════════════════════════════════════════ */
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound, Database
};

/* ═══════════════════════════════════════════════════════════════
   SEARCH HOOK
   ═══════════════════════════════════════════════════════════════ */
function useSearch() {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => {
    const items: { type: string; strategyId: string; strategyName: string; maturityLevel?: number; title: string; text: string; reqId?: string }[] = [];
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
   HEADER
   ═══════════════════════════════════════════════════════════════ */
function Header({ darkMode, toggleDarkMode, onSearchClick }: { darkMode: boolean; toggleDarkMode: () => void; onSearchClick: () => void }) {
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
          <button onClick={onSearchClick} className="flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card px-3 py-2 text-sm text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors">
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline rounded bg-cyber-bg px-1.5 py-0.5 text-[10px] text-cyber-muted">⌘K</kbd>
          </button>
          <button onClick={toggleDarkMode} className="rounded-lg border border-cyber-border bg-cyber-card p-2 text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH MODAL
   ═══════════════════════════════════════════════════════════════ */
function SearchModal({ query, setQuery, results, onClose }: { query: string; setQuery: (q: string) => void; results: ReturnType<typeof useSearch>['results']; onClose: () => void }) {
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
        <p className="text-cyber-muted text-sm max-w-3xl mb-2">The ACSC Essential Eight is a set of prioritised mitigation strategies to help organisations protect against cyber threats. Each strategy is assessed across three maturity levels.</p>
        <p className="text-cyber-muted text-xs">Source: <a href="https://www.cyber.gov.au/sites/default/files/2023-11/PROTECT%20-%20Essential%20Eight%20Maturity%20Model%20%28November%202023%29.pdf" target="_blank" rel="noopener noreferrer" className="text-cyber-primary hover:underline">ACSC Essential Eight Maturity Model (November 2023) <ExternalLink size={10} className="inline" /></a></p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map((s, index) => <StrategyTile key={s.id} strategy={s} index={index} />)}
      </div>
    </div>
  );
}

function StrategyTile({ strategy, index }: { strategy: MitigationStrategy; index: number }) {
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

function MaturityCard({ strategyId, maturity }: { strategyId: string; maturity: MaturityLevelData }) {
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
function RequirementModal({ requirement, strategyName, maturityTitle, onClose }: { requirement: Requirement; strategyName: string; maturityTitle: string; onClose: () => void }) {
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

function ModalSection({ icon, title, content, color }: { icon: React.ReactNode; title: string; content: string; color: string }) {
  const iconColors: Record<string, string> = { 'cyber-primary': 'text-cyber-primary', 'cyber-secondary': 'text-cyber-secondary', 'cyber-success': 'text-cyber-success', 'cyber-warning': 'text-cyber-warning' };
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

function ModalListSection({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) {
  const dotColors: Record<string, string> = { 'cyber-primary': 'bg-cyber-primary', 'cyber-secondary': 'bg-cyber-secondary', 'cyber-success': 'bg-cyber-success', 'cyber-warning': 'bg-cyber-warning' };
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
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

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
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const search = useSearch();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(prev => !prev); }
      if (e.key === 'Escape') { setSearchOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-cyber-bg text-cyber-text">
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} onSearchClick={() => setSearchOpen(true)} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/strategy/:strategyId" element={<StrategyDetail />} />
          <Route path="/strategy/:strategyId/maturity/:level" element={<MaturityView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {searchOpen && <SearchModal query={search.query} setQuery={search.setQuery} results={search.results} onClose={() => { setSearchOpen(false); search.setQuery(''); }} />}
      </div>
    </div>
  );
}
