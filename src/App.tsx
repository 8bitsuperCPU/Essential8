import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Search, Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound,
  Moon, Sun, ChevronRight, ArrowLeft, X, ExternalLink, CheckCircle, AlertTriangle, Info, Database,
  Target, Wrench, Cpu, ClipboardCheck, FileUp, Trash2, Check, XCircle, AlertCircle, Palette,
  BarChart3, Trash, Lock as LockIcon, Unlock, Play, FileText, Waves
} from 'lucide-react';
import Fuse from 'fuse.js';
import { strategies, type Requirement, type MaturityLevelData, type MitigationStrategy } from './data';
import { ThemeProvider, useTheme, themes, type ThemeName } from './ThemeContext';

const API = '/api';
const APP_VERSION = '2.0.0';
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = { Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound, Database };

async function apiFetch(path, opts = {}) {
  const isFormData = opts.body instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(`${API}${path}`, { headers, ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

function useSearch() {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => {
    const items = [];
    strategies.forEach((s) => {
      items.push({ type: 'strategy', strategyId: s.id, strategyName: s.name, title: s.name, text: s.description });
      s.maturityLevels.forEach((ml) => { ml.requirements.forEach((req) => { items.push({ type: 'requirement', strategyId: s.id, strategyName: s.name, maturityLevel: ml.level, title: `${s.name} — ML${ml.level}`, text: req.text, reqId: req.id }); }); });
    });
    return new Fuse(items, { keys: ['title', 'text', 'strategyName'], threshold: 0.3 });
  }, []);
  const results = query.length >= 2 ? fuse.search(query).map(r => r.item) : [];
  return { query, setQuery, results };
}

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const icons: Record<ThemeName, React.ReactNode> = { cyber: <Shield size={14} />, spotify: <Moon size={14} />, light: <Sun size={14} />, ocean: <Waves size={14} />, paper: <FileText size={14} /> };
  return (<div className="relative"><button onClick={() => setOpen(!open)} className="rounded-lg border border-cyber-border bg-cyber-card p-2 text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors"><Palette size={16} /></button>{open && (<><div className="fixed inset-0 z-40" onClick={() => setOpen(false)} /><div className="absolute right-0 top-full mt-2 z-50 rounded-lg border border-cyber-border bg-cyber-card py-1 min-w-[140px] shadow-xl">{Object.values(themes).map(t => (<button key={t.name} onClick={() => { setTheme(t.name); setOpen(false); }} className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors ${themeName === t.name ? 'text-cyber-primary bg-cyber-primary/10' : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/30'}`}>{icons[t.name]}{t.label}{themeName === t.name && <Check size={12} className="ml-auto" />}</button>))}</div></>)}</div>);
}

function Header({ onSearchClick }) {
  return (<header className="sticky top-0 z-40 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><Link to="/" className="flex items-center gap-3 group"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 group-hover:bg-cyber-primary/20 transition-colors"><Shield className="text-cyber-primary" size={20} /></div><div><h1 className="text-lg font-bold text-cyber-text leading-tight">Essential Eight</h1><p className="text-[10px] text-cyber-muted uppercase tracking-widest">ACSC Maturity Model</p></div></Link><div className="flex items-center gap-2"><Link to="/audit" className="flex items-center gap-2 rounded-lg border border-cyber-secondary/30 bg-cyber-secondary/10 px-3 py-2 text-sm text-cyber-secondary hover:bg-cyber-secondary/20 transition-colors"><ClipboardCheck size={16} /><span className="hidden sm:inline">Audit</span></Link><button onClick={onSearchClick} className="flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card px-3 py-2 text-sm text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors"><Search size={16} /><span className="hidden sm:inline">Search</span></button><ThemeSwitcher /></div></div></header>);
}

function SearchModal({ query, setQuery, results, onClose }) {
  return (<div className="fixed inset-0 z-50 modal-overlay flex items-start justify-center pt-[10vh]" onClick={onClose}><div className="w-full max-w-2xl mx-4 rounded-xl border border-cyber-border bg-cyber-card shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-cyber-border px-4 py-3"><Search className="text-cyber-primary" size={20} /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent text-cyber-text placeholder-cyber-muted outline-none text-sm" /><button onClick={onClose} className="text-cyber-muted hover:text-cyber-text"><X size={18} /></button></div><div className="max-h-[60vh] overflow-y-auto p-2">{query.length < 2 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">Type at least 2 characters...</p>}{query.length >= 2 && results.length === 0 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">No results</p>}{results.map((r, i) => (<Link key={i} to={r.type === 'strategy' ? `/strategy/${r.strategyId}` : `/strategy/${r.strategyId}/maturity/${r.maturityLevel}?req=${r.reqId}`} onClick={onClose} className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-cyber-primary/5 transition-colors"><div className={`mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${r.type === 'strategy' ? 'bg-cyber-secondary/20 text-cyber-secondary' : 'bg-cyber-primary/20 text-cyber-primary'}`}>{r.type === 'strategy' ? 'Strategy' : `ML${r.maturityLevel}`}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-cyber-text truncate">{r.title}</p><p className="text-xs text-cyber-muted truncate">{r.strategyName} — {r.text}</p></div><ChevronRight size={14} className="mt-1 text-cyber-muted shrink-0" /></Link>))}</div></div></div>);
}

function Dashboard() {
  return (<div className="mx-auto max-w-7xl px-4 py-8"><div className="mb-8"><h2 className="text-2xl font-bold text-cyber-text mb-2">Essential Eight Maturity Model</h2><p className="text-cyber-muted text-sm max-w-3xl mb-2">The ACSC Essential Eight is a set of prioritised mitigation strategies to help organisations protect against cyber threats.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{strategies.map((s, i) => <StrategyTile key={s.id} strategy={s} index={i} />)}</div></div>);
}

function StrategyTile({ strategy, index }) {
  const Icon = iconMap[strategy.icon];
  return (<Link to={`/strategy/${strategy.id}`} className="glass-card rounded-xl p-5 group animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}><div className="flex items-start justify-between mb-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 group-hover:bg-cyber-primary/20 transition-colors">{Icon && <Icon className="text-cyber-primary" size={20} />}</div><ChevronRight size={16} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-1" /></div><h3 className="text-sm font-semibold text-cyber-text mb-1 group-hover:text-cyber-primary transition-colors">{strategy.name}</h3><p className="text-xs text-cyber-muted line-clamp-2 mb-3">{strategy.description}</p><div className="flex items-center gap-2 text-[10px] text-cyber-muted"><span className="rounded bg-cyber-success/10 text-cyber-success px-1.5 py-0.5 font-medium">ML1: {strategy.maturityLevels[0].requirements.length}</span><span className="rounded bg-cyber-warning/10 text-cyber-warning px-1.5 py-0.5 font-medium">ML2: {strategy.maturityLevels[1].requirements.length}</span><span className="rounded bg-cyber-danger/10 text-cyber-danger px-1.5 py-0.5 font-medium">ML3: {strategy.maturityLevels[2].requirements.length}</span></div></Link>);
}

function StrategyDetail() {
  const { strategyId } = useParams();
  const strategy = strategies.find(s => s.id === strategyId);
  if (!strategy) return <Navigate to="/" replace />;
  return (<div className="mx-auto max-w-7xl px-4 py-8"><Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link><div className="mb-8"><h2 className="text-2xl font-bold text-cyber-text mb-2">{strategy.name}</h2><p className="text-cyber-muted text-sm max-w-3xl">{strategy.description}</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{strategy.maturityLevels.map(ml => <MaturityCard key={ml.level} strategyId={strategy.id} maturity={ml} />)}</div></div>);
}

function MaturityCard({ strategyId, maturity }) {
  const colors = ['border-cyber-success/30', 'border-cyber-warning/30', 'border-cyber-danger/30'];
  const textColors = ['text-cyber-success', 'text-cyber-warning', 'text-cyber-danger'];
  const bgColors = ['bg-cyber-success/10', 'bg-cyber-warning/10', 'bg-cyber-danger/10'];
  return (<Link to={`/strategy/${strategyId}/maturity/${maturity.level}`} className={`glass-card rounded-xl p-6 border-l-4 ${colors[maturity.level - 1]} group hover:scale-[1.02] transition-all`}><div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${bgColors[maturity.level - 1]} ${textColors[maturity.level - 1]} mb-3`}>{maturity.level === 1 && <CheckCircle size={12} />}{maturity.level === 2 && <AlertTriangle size={12} />}{maturity.level === 3 && <Info size={12} />}{maturity.title}</div><p className="text-sm text-cyber-muted mb-4">{maturity.requirements.length} requirement{maturity.requirements.length !== 1 ? 's' : ''}</p><div className="space-y-2">{maturity.requirements.slice(0, 3).map((r) => <div key={r.id} className="text-xs text-cyber-muted truncate">• {r.text.substring(0, 80)}...</div>)}{maturity.requirements.length > 3 && <div className="text-xs text-cyber-primary">+{maturity.requirements.length - 3} more</div>}</div></Link>);
}

function RequirementModal({ requirement, strategyName, maturityTitle, onClose }) {
  return (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={onClose}><div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-cyber-border bg-cyber-card shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}><div className="sticky top-0 z-10 flex items-start justify-between border-b border-cyber-border bg-cyber-card px-6 py-4"><div><div className="flex items-center gap-2 mb-1"><span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{requirement.id.toUpperCase()}</span><span className="text-xs text-cyber-muted">{strategyName} / {maturityTitle}</span></div><h3 className="text-base font-bold text-cyber-text leading-snug">{requirement.text}</h3></div><button onClick={onClose} className="rounded-lg p-1 text-cyber-muted hover:bg-cyber-border hover:text-cyber-text transition-colors"><X size={20} /></button></div><div className="px-6 py-4 space-y-5"><ModalSection icon={<Target size={16} />} title="Purpose" content={requirement.purpose} color="cyber-primary" /><ModalSection icon={<Wrench size={16} />} title="Implementation Guidance" content={requirement.implementation} color="cyber-secondary" /><ModalListSection icon={<Cpu size={16} />} title="Technical Examples" items={requirement.examples} color="cyber-success" /><ModalListSection icon={<ClipboardCheck size={16} />} title="Audit Evidence" items={requirement.evidence} color="cyber-warning" /></div></div></div>);
}

function ModalSection({ icon, title, content, color }) {
  const c = { 'cyber-primary': 'text-cyber-primary', 'cyber-secondary': 'text-cyber-secondary', 'cyber-success': 'text-cyber-success', 'cyber-warning': 'text-cyber-warning' };
  return (<div><div className="flex items-center gap-2 mb-2"><span className={c[color] || 'text-cyber-primary'}>{icon}</span><h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4></div><p className="text-sm text-cyber-text leading-relaxed pl-6">{content}</p></div>);
}

function ModalListSection({ icon, title, items, color }) {
  const d = { 'cyber-primary': 'bg-cyber-primary', 'cyber-secondary': 'bg-cyber-secondary', 'cyber-success': 'bg-cyber-success', 'cyber-warning': 'bg-cyber-warning' };
  return (<div><div className="flex items-center gap-2 mb-2"><span className={d[color]?.replace('bg-', 'text-') || 'text-cyber-primary'}>{icon}</span><h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4></div><ul className="space-y-1.5 pl-6">{items.map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-cyber-text"><span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${d[color] || 'bg-cyber-primary'}`} />{item}</li>))}</ul></div>);
}

function MaturityView() {
  const { strategyId, level } = useParams();
  const strategy = strategies.find(s => s.id === strategyId);
  const maturity = strategy?.maturityLevels.find(m => m.level === Number(level));
  const [selectedReq, setSelectedReq] = useState(null);
  if (!strategy || !maturity) return <Navigate to="/" replace />;
  return (<div className="mx-auto max-w-7xl px-4 py-8"><Link to={`/strategy/${strategyId}`} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link><div className="mb-8"><h2 className="text-2xl font-bold text-cyber-text mb-1">{strategy.name}</h2><p className="text-cyber-primary font-medium">{maturity.title}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{maturity.requirements.map((req, i) => (<button key={req.id} onClick={() => setSelectedReq(req)} className="glass-card rounded-xl p-5 text-left group hover:scale-[1.02] hover:border-cyber-primary/40 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}><div className="flex items-start justify-between mb-3"><span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{req.id.toUpperCase()}</span><ChevronRight size={14} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-0.5" /></div><p className="text-sm text-cyber-text leading-relaxed line-clamp-3">{req.text}</p></button>))}</div>{selectedReq && <RequirementModal requirement={selectedReq} strategyName={strategy.name} maturityTitle={maturity.title} onClose={() => setSelectedReq(null)} />}</div>);
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT HOME — New multi-control workflow
   ═══════════════════════════════════════════════════════════════ */
function AuditHome() {
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState('');
  const [foundAudit, setFoundAudit] = useState(null);
  const [error, setError] = useState('');
  const [audits, setAudits] = useState([]);
  const [lastAudit, setLastAudit] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('updated_at');
  const [sortDir, setSortDir] = useState('desc');

  function refresh() { apiFetch('/audits/summary').then(setAudits).catch(() => {}); apiFetch('/audits/last').then(setLastAudit).catch(() => {}); }
  useEffect(() => { refresh(); }, [refreshKey]);

  const filteredAudits = useMemo(() => {
    let result = [...audits];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.identifier.toLowerCase().includes(q) ||
        (strategies.find(s => s.id === a.control_id)?.name || '').toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q) ||
        String(a.maturity_level).includes(q)
      );
    }
    result.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [audits, searchQuery, sortField, sortDir]);

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  function sortIcon(field) {
    if (sortField !== field) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  }

  async function lookupCatalogue() {
    if (!catalogue.trim()) { setError('Please enter an audit name'); return; }
    setError('');
    try { const a = await apiFetch(`/audits?identifier=${encodeURIComponent(catalogue.trim())}`); setFoundAudit(a); setShowNew(false); }
    catch { setFoundAudit(null); setShowNew(true); }
  }

  async function deleteAudit(id) {
    if (!confirm('Delete this audit and all evidence?')) return;
    await apiFetch(`/audits/${id}`, { method: 'DELETE' });
    setRefreshKey(k => k + 1);
    if (foundAudit?.id === id) setFoundAudit(null);
  }

  async function deleteAllAudits() {
    if (!confirm('Delete ALL audits? This cannot be undone.')) return;
    await apiFetch('/audits', { method: 'DELETE' });
    setRefreshKey(k => k + 1);
    setFoundAudit(null);
    setDeleteConfirm(null);
  }

  function handleLastAuditClick() {
    if (!lastAudit) return;
    if (lastAudit.status === 'completed') {
      navigate(`/audit/${lastAudit.id}/report`);
    } else {
      navigate(`/audit/${lastAudit.id}`);
    }
  }

  const statusBadge = (status, locked) => {
    const base = "rounded px-2 py-0.5 text-[10px] font-bold uppercase";
    if (locked) return <span className={`${base} bg-cyber-warning/15 text-cyber-warning`}>🔒 Locked</span>;
    if (status === 'completed') return <span className={`${base} bg-cyber-success/15 text-cyber-success`}>Completed</span>;
    return <span className={`${base} bg-cyber-primary/15 text-cyber-primary`}>In Progress</span>;
  };

  const formatDate = (d) => {
    if (!d)  return '—';
    try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link>
      <h2 className="text-2xl font-bold text-cyber-text mb-2">Compliance Audit</h2>
      <p className="text-cyber-muted text-sm mb-8">Start a new audit or look up an existing one.</p>

      {/* New Audit Button */}
      <div className="mb-6"><button onClick={() => { setShowNew(true); setFoundAudit(null); setCatalogue(''); }} className="flex items-center gap-2 rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-5 py-3 text-sm font-bold text-cyber-success hover:bg-cyber-success/30 transition-colors"><Play size={18} />Start New Audit</button></div>

      {/* Audit Catalogue Lookup */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-cyber-text mb-2">Audit Catalogue</label>
        <div className="flex gap-3"><input value={catalogue} onChange={e => setCatalogue(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupCatalogue()} placeholder="Enter audit name to look up..." className="flex-1 rounded-lg border border-cyber-border bg-cyber-bg px-4 py-2.5 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 transition-colors" /><button onClick={lookupCatalogue} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-6 py-2.5 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Look Up</button></div>
        {error && <p className="mt-2 text-xs text-cyber-danger">{error}</p>}
      </div>

      {/* Last Audit */}
      {lastAudit && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-secondary/30">
          <div className="flex items-center justify-between">
            <div><h3 className="text-sm font-bold text-cyber-text flex items-center gap-2"><Clock size={16} className="text-cyber-secondary" />Last Audit</h3><p className="text-xs text-cyber-muted mt-1">{lastAudit.identifier} • {strategies.find(s => s.id === lastAudit.control_id)?.name} • ML{lastAudit.maturity_level} • {lastAudit.status}{lastAudit.locked ? ' • 🔒 Locked' : ''}</p></div>
            <button onClick={handleLastAuditClick} className="rounded-lg bg-cyber-secondary/20 border border-cyber-secondary/30 px-4 py-2 text-sm font-medium text-cyber-secondary hover:bg-cyber-secondary/20 transition-colors flex items-center gap-1">{lastAudit.status === 'completed' ? <><BarChart3 size={14} />Overall Report</> : <><FileText size={14} />Continue</>}</button>
          </div>
        </div>
      )}

      {/* Found Audit */}
      {foundAudit && !showNew && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-warning/30">
          <div className="flex items-center gap-2 mb-3"><AlertCircle className="text-cyber-warning" size={18} /><h3 className="text-sm font-bold text-cyber-text">Audit Found</h3></div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="text-cyber-muted">Name:</span> <span className="text-cyber-text font-medium">{foundAudit.identifier}</span></div>
            <div><span className="text-cyber-muted">Status:</span> <span className={`font-medium ${foundAudit.status === 'completed' ? 'text-cyber-success' : 'text-cyber-warning'}`}>{foundAudit.status}{foundAudit.locked ? ' • 🔒' : ''}</span></div>
            <div><span className="text-cyber-muted">Control:</span> <span className="text-cyber-text">{strategies.find(s => s.id === foundAudit.control_id)?.name}</span></div>
            <div><span className="text-cyber-muted">Maturity:</span> <span className="text-cyber-text">ML{foundAudit.maturity_level}</span></div>
          </div>
          <div className="flex gap-3">
            <Link to={`/audit/${foundAudit.id}`} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">{foundAudit.status === 'completed' ? 'View' : 'Continue'}</Link>
            <Link to={`/audit/${foundAudit.id}/report`} className="rounded-lg border border-cyber-border px-4 py-2 text-sm font-medium text-cyber-muted hover:text-cyber-text transition-colors">Report</Link>
            <button onClick={() => deleteAudit(foundAudit.id)} className="rounded-lg border border-cyber-danger/30 px-4 py-2 text-sm font-medium text-cyber-danger hover:bg-cyber-danger/10 transition-colors flex items-center gap-1"><Trash2 size={14} />Delete</button>
          </div>
        </div>
      )}

      {/* New Audit Form */}
      {showNew && <NewAuditForm onCreated={(a) => { setRefreshKey(k => k + 1); setFoundAudit(a); setShowNew(false); setCatalogue(a.identifier); }} />}

      {/* Audit Catalogue Table */}
      {audits.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-cyber-text">Audit Catalogue <span className="text-cyber-muted font-normal text-sm">({audits.length})</span></h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search audits..." className="rounded-lg border border-cyber-border bg-cyber-bg pl-9 pr-3 py-1.5 text-xs text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 w-52 transition-colors" />
              </div>
              <button onClick={() => setDeleteConfirm('all')} className="rounded-lg border border-cyber-danger/30 px-3 py-1.5 text-xs font-medium text-cyber-danger hover:bg-cyber-danger/10 transition-colors flex items-center gap-1"><Trash size={12} />Delete All</button>
            </div>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyber-border bg-cyber-bg/50">
                    <th className="text-left px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('identifier')}>
                      <span className="flex items-center gap-1">Audit Name <span className="text-[10px]">{sortIcon('identifier')}</span></span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('created_at')}>
                      <span className="flex items-center gap-1">Date <span className="text-[10px]">{sortIcon('created_at')}</span></span>
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('control_id')}>
                      <span className="flex items-center gap-1">Control <span className="text-[10px]">{sortIcon('control_id')}</span></span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('maturity_level')}>
                      <span className="flex items-center justify-center gap-1">ML <span className="text-[10px]">{sortIcon('maturity_level')}</span></span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('status')}>
                      <span className="flex items-center justify-center gap-1">Status <span className="text-[10px]">{sortIcon('status')}</span></span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider cursor-pointer hover:text-cyber-text select-none" onClick={() => toggleSort('compliant_count')}>
                      <span className="flex items-center justify-center gap-1">Compliance <span className="text-[10px]">{sortIcon('compliant_count')}</span></span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider">
                      Evidence
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-cyber-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map((a) => {
                    const control = strategies.find(s => s.id === a.control_id);
                    const pct = a.total_requirements > 0 ? Math.round((a.compliant_count / a.total_requirements) * 100) : 0;
                    return (
                      <tr key={a.identifier} className="border-b border-cyber-border/30 hover:bg-cyber-primary/5 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-medium text-cyber-text flex items-center gap-1.5">
                            {a.locked ? <LockIcon size={11} className="text-cyber-warning" /> : null}
                            {a.identifier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-cyber-muted text-xs">{formatDate(a.created_at)}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="text-cyber-text">{control?.name || a.control_id}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs">
                          <span className="rounded bg-cyber-primary/10 px-1.5 py-0.5 text-cyber-primary font-medium">ML{a.maturity_level}</span>
                        </td>
                        <td className="px-4 py-3 text-center">{statusBadge(a.status, a.locked)}</td>
                        <td className="px-4 py-3 text-center">
                          {a.total_requirements > 0 ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-cyber-border overflow-hidden">
                                <div className={`h-full rounded-full ${pct === 100 ? 'bg-cyber-success' : pct >= 50 ? 'bg-cyber-warning' : 'bg-cyber-danger'}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-cyber-muted w-8 text-right">{a.compliant_count}/{a.total_requirements}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-cyber-muted">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {a.evidence_count > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded bg-cyber-secondary/10 px-1.5 py-0.5 text-[10px] text-cyber-secondary">
                              <FileUp size={10} />{a.evidence_count}
                            </span>
                          ) : (
                            <span className="text-[10px] text-cyber-muted">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/audit/${a.id}`} className="rounded border border-cyber-border px-2 py-1 text-[10px] text-cyber-muted hover:text-cyber-text hover:border-cyber-primary/40 transition-colors">Open</Link>
                            <Link to={`/audit/${a.id}/report`} className="rounded border border-cyber-secondary/30 px-2 py-1 text-[10px] text-cyber-secondary hover:bg-cyber-secondary/10 transition-colors">Report</Link>
                            <button onClick={() => deleteAudit(a.id)} className="rounded border border-cyber-danger/30 px-2 py-1 text-[10px] text-cyber-danger hover:bg-cyber-danger/10 transition-colors"><Trash2 size={10} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredAudits.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-cyber-muted">
                {searchQuery ? 'No audits match your search.' : 'No audits yet.'}
              </div>
            )}
          </div>
        </div>
      )}

      {deleteConfirm === 'all' && (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"><div className="glass-card rounded-xl p-6 max-w-sm w-full border border-cyber-danger/30"><h3 className="text-lg font-bold text-cyber-danger mb-2">Delete All Audits?</h3><p className="text-sm text-cyber-muted mb-4">This will permanently delete all {audits.length} audits and evidence.</p><div className="flex gap-3"><button onClick={deleteAllAudits} className="rounded-lg bg-cyber-danger/20 border border-cyber-danger/30 px-4 py-2 text-sm font-medium text-cyber-danger hover:bg-cyber-danger/30 transition-colors">Delete All</button><button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text transition-colors">Cancel</button></div></div></div>)}
    </div>
  );
}

function NewAuditForm({ onCreated }) {
  const [auditName, setAuditName] = useState('');
  const [currentControl, setCurrentControl] = useState(0);
  const [maturityLevel, setMaturityLevel] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdAudits, setCreatedAudits] = useState([]);

  const control = strategies[currentControl];
  const isLast = currentControl === strategies.length - 1;

  async function createAudit() {
    if (!auditName.trim()) { setError('Please enter an audit name'); return; }
    setCreating(true); setError('');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const identifier = `${dateStr}-${auditName.trim()}`;
    try {
      const a = await apiFetch('/audits', { method: 'POST', body: JSON.stringify({ identifier, controlId: control.id, maturityLevel }) });
      const newAudits = [...createdAudits, a];
      setCreatedAudits(newAudits);
      if (isLast) {
        // All controls done — go to the first audit
        onCreated(newAudits[0]);
      } else {
        setCurrentControl(c => c + 1);
      }
    } catch (e) { setError(e.message); }
    setCreating(false);
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-success/30">
      <div className="flex items-center gap-2 mb-4"><Play className="text-cyber-success" size={18} /><h3 className="text-sm font-bold text-cyber-text">New Audit — Control {currentControl + 1} of 8</h3></div>
      {createdAudits.length > 0 && <div className="mb-4 rounded-lg bg-cyber-bg/50 p-3"><p className="text-xs font-medium text-cyber-muted mb-1">Created so far:</p>{createdAudits.map(a => (<p key={a.id} className="text-xs text-cyber-text">✓ {a.identifier} — {strategies.find(s => s.id === a.control_id)?.name} ML{a.maturity_level}</p>))}</div>}
      {currentControl === 0 && !createdAudits.length && (<div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-1">Audit Name</label><input value={auditName} onChange={e => setAuditName(e.target.value)} placeholder="e.g., Q1-2025-Assessment" className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50" /><p className="text-[10px] text-cyber-muted mt-1">Will be saved as: {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}-{auditName || '...'}</p></div>)}
      <div className="mb-4"><div className="flex items-center gap-2 mb-2">{(() => { const Icon = iconMap[control.icon]; return Icon ? <Icon className="text-cyber-primary" size={20} /> : null; })()}<div><h4 className="text-sm font-bold text-cyber-text">{control.name}</h4><p className="text-xs text-cyber-muted">{control.description}</p></div></div></div>
      <div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-1">Maturity Level</label><select value={maturityLevel} onChange={e => setMaturityLevel(Number(e.target.value))} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text outline-none focus:border-cyber-primary/50"><option value={1}>Maturity Level One</option><option value={2}>Maturity Level Two</option><option value={3}>Maturity Level Three</option></select></div>
      {error && <p className="mb-3 text-xs text-cyber-danger">{error}</p>}
      <button onClick={createAudit} disabled={creating || !auditName.trim()} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-6 py-2.5 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 disabled:opacity-50 transition-colors">{creating ? 'Creating...' : isLast ? 'Create & Start Audit' : 'Create & Continue →'}</button>
    </div>
  );
}

function AuditWorkflow({ auditId }) {
  const [audit, setAudit] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [evidence, setEvidence] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [lockError, setLockError] = useState('');
  const loadedRef = useRef(false);

  const strategy = audit ? strategies.find(s => s.id === audit.control_id) : null;
  const maturity = strategy?.maturityLevels.find(m => m.level === audit?.maturity_level);
  const reqs = maturity?.requirements || [];
  const currentReq = reqs[currentStep];

  const loadAudit = useCallback(async () => {
    try {
      const [a, s, e] = await Promise.all([apiFetch(`/audits/${auditId}`), apiFetch(`/audits/${auditId}/requirements`), apiFetch(`/audits/${auditId}/evidence`)]);
      setAudit(a);
      const sm = {}; s.forEach(rs => { sm[rs.requirement_id] = rs; }); setStatuses(sm);
      const em = {}; e.forEach(ev => { if (!em[ev.requirement_id]) em[ev.requirement_id] = []; em[ev.requirement_id].push(ev); }); setEvidence(em);
    } catch (err) { console.error(err); }
  }, [auditId]);

  useEffect(() => { if (!loadedRef.current) { loadedRef.current = true; loadAudit(); } }, [loadAudit]);

  async function setCompliant(reqId, compliant, notes = '') {
    if (audit?.locked) return;
    setSaving(true);
    try { const s = await apiFetch(`/audits/${auditId}/requirements/${reqId}`, { method: 'PUT', body: JSON.stringify({ compliant, notes }) }); setStatuses(p => ({ ...p, [reqId]: s })); } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function uploadEvidence(reqId, type, desc, file) {
    if (audit?.locked) return;
    const fd = new FormData(); fd.append('requirementId', reqId); fd.append('evidenceType', type); fd.append('description', desc); if (file) fd.append('file', file);
    try { await fetch(`${API}/audits/${auditId}/evidence`, { method: 'POST', body: fd }); const u = await apiFetch(`/audits/${auditId}/evidence?requirementId=${reqId}`); setEvidence(p => ({ ...p, [reqId]: u })); } catch (err) { console.error(err); }
  }

  async function removeEvidence(evId) { if (audit?.locked) return; try { await apiFetch(`/evidence/${evId}`, { method: 'DELETE' }); loadAudit(); } catch (err) { console.error(err); } }

  async function completeAudit() {
    await apiFetch(`/audits/${auditId}/status`, { method: 'PUT', body: JSON.stringify({ status: 'completed' }) });
    const updated = await apiFetch(`/audits/${auditId}`);
    setAudit(updated);
    setShowLockModal(true);
  }

  async function lockAudit() {
    if (!lockPassword.trim()) { setLockError('Password required'); return; }
    try { await apiFetch(`/audits/${auditId}/lock`, { method: 'PUT', body: JSON.stringify({ password: lockPassword }) }); setShowLockModal(false); loadAudit(); } catch (e) { setLockError(e.message); }
  }

  if (!audit || !maturity) return <div className="p-8 text-cyber-muted">Loading...</div>;
  const cc = Object.values(statuses).filter(s => s.compliant === 1).length;
  const tc = reqs.length;
  const pct = tc > 0 ? Math.round((cc / tc) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/audit" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link>
      <div className="flex items-center justify-between mb-6"><div><h2 className="text-xl font-bold text-cyber-text">{strategy.name} — {maturity.title}</h2><p className="text-sm text-cyber-muted">{audit.identifier}{audit.locked ? <span className="ml-2 text-cyber-warning flex items-center gap-1"><LockIcon size={12} />Locked</span> : null}</p></div>
        {audit.status === 'completed' && !audit.locked && <button onClick={() => setShowLockModal(true)} className="rounded-lg border border-cyber-warning/30 px-3 py-1.5 text-xs font-medium text-cyber-warning hover:bg-cyber-warning/10 transition-colors flex items-center gap-1"><LockIcon size={12} />Lock Audit</button>}
      </div>
      <div className="glass-card rounded-xl p-4 mb-6"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-cyber-text">{cc}/{tc} compliant</span><span className="text-sm font-medium text-cyber-primary">{pct}%</span></div><div className="h-2 rounded-full bg-cyber-border overflow-hidden"><div className="h-full rounded-full bg-cyber-primary transition-all" style={{ width: `${pct}%` }} /></div><div className="flex gap-1 mt-3">{reqs.map((req, i) => (<button key={req.id} onClick={() => setCurrentStep(i)} className={`h-2 flex-1 rounded-full transition-colors ${i === currentStep ? 'bg-cyber-primary' : statuses[req.id]?.compliant ? 'bg-cyber-success' : statuses[req.id] ? 'bg-cyber-danger' : 'bg-cyber-border'}`} />))}</div></div>
      {currentReq && <RequirementAssessment requirement={currentReq} status={statuses[currentReq.id]} evidence={evidence[currentReq.id] || []} onCompliant={(c, n) => setCompliant(currentReq.id, c, n)} onEvidence={(t, d, f) => uploadEvidence(currentReq.id, t, d, f)} onRemoveEvidence={removeEvidence} saving={saving} locked={!!audit.locked} />}
      <div className="flex items-center justify-between mt-6"><button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text disabled:opacity-30 transition-colors">Previous</button><span className="text-xs text-cyber-muted">{currentStep + 1} of {tc}</span>{currentStep < tc - 1 ? <button onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Next</button> : audit.status !== 'completed' ? <button onClick={completeAudit} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-4 py-2 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 transition-colors">Complete Audit</button> : <Link to={`/audit/${auditId}/report`} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">View Report</Link>}</div>

      {showLockModal && (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"><div className="glass-card rounded-xl p-6 max-w-sm w-full border border-cyber-warning/30"><h3 className="text-lg font-bold text-cyber-warning mb-2 flex items-center gap-2"><LockIcon size={18} />Lock Audit</h3><p className="text-xs text-cyber-muted mb-4">Once locked, this audit cannot be edited. You can unlock it later with this password.</p><input type="password" value={lockPassword} onChange={e => setLockPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-warning/50 mb-2" />{lockError && <p className="mb-2 text-xs text-cyber-danger">{lockError}</p>}<div className="flex gap-3"><button onClick={lockAudit} className="rounded-lg bg-cyber-warning/20 border border-cyber-warning/30 px-4 py-2 text-sm font-medium text-cyber-warning hover:bg-cyber-warning/30 transition-colors">Lock</button><button onClick={() => setShowLockModal(false)} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text transition-colors">Cancel</button></div></div></div>)}
    </div>
  );
}

function RequirementAssessment({ requirement, status, evidence, onCompliant, onEvidence, onRemoveEvidence, saving, locked }) {
  const [notes, setNotes] = useState(status?.notes || '');
  const [evType, setEvType] = useState('screenshot');
  const [evDesc, setEvDesc] = useState('');
  const [file, setFile] = useState(null);
  const [showEv, setShowEv] = useState(false);
  const isC = status?.compliant === 1;
  const isNC = status?.compliant === 0;
  const evTypes = [{ v: 'screenshot', l: 'Screenshot' }, { v: 'config_export', l: 'Config Export' }, { v: 'policy_document', l: 'Policy Doc' }, { v: 'scan_report', l: 'Scan Report' }, { v: 'log_export', l: 'Log Export' }, { v: 'photo', l: 'Photo' }, { v: 'other', l: 'Other' }];

  return (<div className="glass-card rounded-xl p-6"><div className="flex items-start justify-between mb-4"><div><span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{requirement.id.toUpperCase()}</span><h3 className="text-sm font-bold text-cyber-text mt-2">{requirement.text}</h3></div>{isC && <CheckCircle className="text-cyber-success shrink-0" size={20} />}{isNC && <XCircle className="text-cyber-danger shrink-0" size={20} />}</div>
    {!locked && <div className="flex gap-3 mb-4"><button onClick={() => onCompliant(true, notes)} disabled={saving} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${isC ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success' : 'border-cyber-border text-cyber-muted hover:border-cyber-success/30'}`}><Check size={14} className="inline mr-1.5" />Compliant</button><button onClick={() => onCompliant(false, notes)} disabled={saving} className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${isNC ? 'bg-cyber-danger/20 border-cyber-danger/40 text-cyber-danger' : 'border-cyber-border text-cyber-muted hover:border-cyber-danger/30'}`}><XCircle size={14} className="inline mr-1.5" />Not Compliant</button></div>}
    {locked && <div className="rounded-lg bg-cyber-warning/10 border border-cyber-warning/20 p-3 mb-4"><p className="text-xs text-cyber-warning flex items-center gap-1.5"><LockIcon size={12} />This audit is locked and cannot be edited.</p></div>}
    {isNC && <div className="rounded-lg bg-cyber-danger/10 border border-cyber-danger/20 p-3 mb-4"><p className="text-xs text-cyber-danger flex items-center gap-1.5"><AlertCircle size={12} /> This requirement will be marked as failed.</p></div>}
    <div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-1">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => { if (!saving && !locked) onCompliant(isC, notes); }} placeholder="Optional notes..." rows={2} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 resize-none" /></div>
    <div className="border-t border-cyber-border pt-4"><button onClick={() => setShowEv(!showEv)} className="flex items-center gap-2 text-sm font-medium text-cyber-text mb-3"><FileUp size={14} />Evidence ({evidence.length})<ChevronRight size={12} className={`transition-transform ${showEv ? 'rotate-90' : ''}`} /></button>
    {showEv && (<><div className="rounded-lg border border-cyber-border p-3 mb-3 space-y-2"><div className="grid grid-cols-2 gap-2"><select value={evType} onChange={e => setEvType(e.target.value)} className="rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text outline-none">{evTypes.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select><input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-xs text-cyber-muted file:mr-2 file:rounded file:border-0 file:bg-cyber-primary/10 file:px-2 file:py-1 file:text-xs file:text-cyber-primary" /></div><input value={evDesc} onChange={e => setEvDesc(e.target.value)} placeholder="Description" className="w-full rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text placeholder-cyber-muted outline-none" /><button onClick={() => { onEvidence(evType, evDesc, file); setFile(null); setEvDesc(''); }} className="rounded bg-cyber-primary/20 border border-cyber-primary/30 px-3 py-1.5 text-xs font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Add</button></div>
    {evidence.length > 0 ? <div className="space-y-2">{evidence.map(ev => (<div key={ev.id} className="flex items-center justify-between rounded-lg border border-cyber-border p-2"><div className="flex items-center gap-2 min-w-0"><span className="rounded bg-cyber-bg px-1.5 py-0.5 text-[9px] font-medium text-cyber-muted uppercase">{ev.evidence_type}</span><span className="text-xs text-cyber-text truncate">{ev.file_name || ev.description || '—'}</span></div><button onClick={() => onRemoveEvidence(ev.id)} className="text-cyber-muted hover:text-cyber-danger"><Trash2 size={12} /></button></div>))}</div> : <p className="text-xs text-cyber-muted">No evidence yet.</p>}</>)}</div></div>);
}

function AuditReport({ auditId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiFetch(`/audits/${auditId}/report`).then(setReport).catch(console.error).finally(() => setLoading(false)); }, [auditId]);
  if (loading) return <div className="p-8 text-cyber-muted">Loading...</div>;
  if (!report) return <div className="p-8 text-cyber-danger">Failed</div>;
  const { audit, statuses, evidence, summary } = report;
  const strategy = strategies.find(s => s.id === audit.control_id);
  const maturity = strategy?.maturityLevels.find(m => m.level === audit.maturity_level);
  const reqs = maturity?.requirements || [];
  const nc = statuses.filter(s => s.compliant === 0);
  const c = statuses.filter(s => s.compliant === 1);

  return (<div className="mx-auto max-w-4xl px-4 py-8"><Link to={`/audit/${auditId}`} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link><div className="mb-8"><h2 className="text-2xl font-bold text-cyber-text mb-1">Compliance Report</h2><p className="text-sm text-cyber-muted">{strategy?.name} — {maturity?.title}</p><p className="text-xs text-cyber-muted">{audit.identifier} • {new Date(audit.created_at).toLocaleDateString()}</p></div><div className="glass-card rounded-xl p-6 mb-6"><h3 className="text-lg font-bold text-cyber-text mb-4">Summary</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div className="text-center"><div className="text-2xl font-bold text-cyber-primary">{summary.compliancePercent}%</div><div className="text-xs text-cyber-muted">Compliance</div></div><div className="text-center"><div className="text-2xl font-bold text-cyber-success">{summary.compliant}</div><div className="text-xs text-cyber-muted">Compliant</div></div><div className="text-center"><div className="text-2xl font-bold text-cyber-danger">{summary.nonCompliant}</div><div className="text-xs text-cyber-muted">Non-Compliant</div></div><div className="text-center"><div className="text-2xl font-bold text-cyber-secondary">{summary.evidenceItems}</div><div className="text-xs text-cyber-muted">Evidence</div></div></div><div className="h-3 rounded-full bg-cyber-border overflow-hidden"><div className={`h-full rounded-full transition-all ${summary.compliancePercent === 100 ? 'bg-cyber-success' : summary.compliancePercent >= 50 ? 'bg-cyber-warning' : 'bg-cyber-danger'}`} style={{ width: `${summary.compliancePercent}%` }} /></div></div>
    {nc.length > 0 && <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-danger/30"><h3 className="text-lg font-bold text-cyber-danger mb-4 flex items-center gap-2"><XCircle size={18} /> Non-Compliant ({nc.length})</h3><div className="space-y-4">{nc.map(ns => { const req = reqs.find(r => r.id === ns.requirement_id); if (!req) return null; return (<div key={ns.id} className="rounded-lg border border-cyber-danger/20 bg-cyber-danger/5 p-4"><div className="flex items-start gap-2 mb-2"><span className="rounded bg-cyber-danger/10 px-1.5 py-0.5 text-[9px] font-bold text-cyber-danger">{req.id.toUpperCase()}</span><p className="text-sm text-cyber-text flex-1">{req.text}</p></div>{ns.notes && <p className="text-xs text-cyber-muted mb-2 italic">{ns.notes}</p>}<div className="rounded bg-cyber-bg/50 p-3 mt-2"><p className="text-xs font-bold text-cyber-secondary mb-1">Recommendation:</p><p className="text-xs text-cyber-text">{req.implementation}</p></div></div>); })}</div></div>}
    {c.length > 0 && <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-success/30"><h3 className="text-lg font-bold text-cyber-success mb-4 flex items-center gap-2"><CheckCircle size={18} /> Compliant ({c.length})</h3><div className="space-y-2">{c.map(cs => { const req = reqs.find(r => r.id === cs.requirement_id); if (!req) return null; return (<div key={cs.id} className="flex items-start gap-2 rounded-lg border border-cyber-success/10 bg-cyber-success/5 p-3"><CheckCircle size={14} className="text-cyber-success mt-0.5 shrink-0" /><div><span className="text-[9px] font-bold text-cyber-success">{req.id.toUpperCase()}</span><p className="text-xs text-cyber-text">{req.text}</p></div></div>); })}</div></div>}
    {evidence.length > 0 && <div className="glass-card rounded-xl p-6"><h3 className="text-lg font-bold text-cyber-text mb-4">Evidence ({evidence.length})</h3><div className="space-y-2">{evidence.map(ev => (<div key={ev.id} className="flex items-center gap-3 rounded-lg border border-cyber-border p-2"><span className="rounded bg-cyber-bg px-1.5 py-0.5 text-[9px] font-medium text-cyber-muted uppercase">{ev.evidence_type}</span><span className="text-xs text-cyber-text flex-1 truncate">{ev.file_name || ev.description || '—'}</span></div>))}</div></div>}</div>);
}

function DynIcon({ name, className, size }) {
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} size={size} /> : null;
}

function RiskReportCard({ cs }) {
  return (
    <div className="glass-card rounded-xl p-6 border-l-4 border-cyber-danger/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-danger/10 border border-cyber-danger/20">
            <DynIcon name={cs.icon} className="text-cyber-danger" size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-cyber-text">{cs.name}</h4>
            <p className="text-xs text-cyber-muted">ML{cs.highestLevel} • {cs.compliant}/{cs.total} ({cs.pct}%)</p>
          </div>
        </div>
        <span className="rounded-full bg-cyber-danger/10 px-3 py-1 text-xs font-bold text-cyber-danger">{100 - cs.pct}% at risk</span>
      </div>
      <div className="h-2 rounded-full bg-cyber-border overflow-hidden mb-4">
        <div className="h-full rounded-full bg-cyber-danger transition-all" style={{ width: `${cs.pct}%` }} />
      </div>
      <h5 className="text-xs font-bold uppercase tracking-wider text-cyber-muted mb-2">Missing Requirements ({cs.missingReqs.length})</h5>
      <div className="space-y-3">
        {cs.missingReqs.map((mr, i) => (
          <div key={i} className="rounded-lg border border-cyber-danger/20 bg-cyber-danger/5 p-3">
            <div className="flex items-start gap-2 mb-1">
              <XCircle size={14} className="text-cyber-danger mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-cyber-text">{mr.text}</p>
            </div>
            {mr.notes && <p className="text-[10px] text-cyber-muted italic mb-1 ml-5">Note: {mr.notes}</p>}
            <div className="ml-5 mt-2 rounded bg-cyber-bg/50 p-2">
              <p className="text-[10px] font-bold text-cyber-secondary mb-0.5">Recommendation:</p>
              <p className="text-[10px] text-cyber-text">{mr.implementation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverallComplianceReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  useEffect(() => { apiFetch('/audits/overall-report').then(setData).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="p-8 text-cyber-muted">Loading...</div>;
  if (!data) return <div className="p-8 text-cyber-danger">Failed</div>;

  const controlMap = {};
  for (const s of strategies) { controlMap[s.id] = { name: s.name, icon: s.icon, levels: { 1: null, 2: null, 3: null } }; }
  for (const a of data) {
    if (a.status !== 'completed') continue;
    const existing = controlMap[a.control_id]?.levels[a.maturity_level];
    if (!existing || a.compliant_count > existing.compliant_count) { if (controlMap[a.control_id]) controlMap[a.control_id].levels[a.maturity_level] = a; }
  }

  let totalCompliant = 0, totalReqs = 0;
  const controlSummaries = Object.entries(controlMap).map(([id, c]) => {
    const assessed = Object.entries(c.levels).filter(([l, a]) => a !== null);
    const highestLevel = assessed.length > 0 ? Math.max(...assessed.map(([l]) => parseInt(l))) : 0;
    const audit = highestLevel > 0 ? c.levels[highestLevel] : null;
    const compliant = audit ? audit.compliant_count : 0;
    const total = audit ? audit.total_requirements : 0;
    totalCompliant += compliant; totalReqs += total;
    const pct = total > 0 ? Math.round((compliant / total) * 100) : 0;
    const missingReqs = (audit?.nonCompliantReqs || []).map(nc => {
      const s = strategies.find(x => x.id === id); const ml = s?.maturityLevels.find(m => m.level === highestLevel); const req = ml?.requirements.find(r => r.id === nc.requirement_id);
      return { id: nc.requirement_id, text: req?.text || nc.requirement_id, notes: req?.notes, implementation: req?.implementation || '' };
    });
    return { id, name: c.name, icon: c.icon, highestLevel, audit, compliant, total, pct, hasAudit: !!audit, isCompliant: pct === 100, missingReqs };
  });
  const overallPct = totalReqs > 0 ? Math.round((totalCompliant / totalReqs) * 100) : 0;
  const ncControls = controlSummaries.filter(c => c.hasAudit && !c.isCompliant);
  const cControls = controlSummaries.filter(c => c.hasAudit && c.isCompliant);
  const uControls = controlSummaries.filter(c => !c.hasAudit);

  async function generatePDF() {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Helper: add page if needed
      function checkPageBreak(needed) {
        if (y + needed > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
      }

      // Title
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Essential Eight — Overall Compliance Report', margin, y);
      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`, margin, y);
      y += 10;

      // Summary box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Executive Summary', margin + 4, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Overall Compliance: ${overallPct}%`, margin + 4, y + 12);
      doc.text(`Compliant Requirements: ${totalCompliant} / ${totalReqs}`, margin + 4, y + 17);
      doc.text(`Controls Assessed: ${controlSummaries.filter(c => c.hasAudit).length} / 8`, margin + 70, y + 12);
      doc.text(`Incomplete Controls: ${ncControls.length}`, margin + 70, y + 17);
      doc.text(`Fully Compliant: ${cControls.length}`, margin + 130, y + 12);
      doc.text(`Not Assessed: ${uControls.length}`, margin + 130, y + 17);
      y += 34;

      // Compliance by Control table
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Compliance by Control', margin, y);
      y += 6;
      autoTable(doc, {
        startY: y,
        head: [['Control', 'Maturity Level', 'Compliant', 'Total', 'Compliance %']],
        body: controlSummaries.map(cs => [
          cs.name,
          cs.hasAudit ? `ML${cs.highestLevel}` : 'Not Assessed',
          cs.hasAudit ? String(cs.compliant) : '—',
          cs.hasAudit ? String(cs.total) : '—',
          cs.hasAudit ? `${cs.pct}%` : '—',
        ]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [30, 45, 80], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        didParseCell: (hookData) => {
          if (hookData.section === 'body' && hookData.column.index === 4) {
            const val = hookData.cell.raw;
            if (val === '100%') hookData.cell.styles.textColor = [0, 150, 0];
            else if (val !== '—') {
              const pctVal = parseInt(val);
              if (pctVal < 50) hookData.cell.styles.textColor = [200, 0, 0];
              else hookData.cell.styles.textColor = [200, 150, 0];
            }
          }
        },
      });
      y = doc.lastAutoTable.finalY + 10;

      // Risk Report — Non-compliant controls
      if (ncControls.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(180, 0, 0);
        doc.text(`Risk Report — Incomplete Controls (${ncControls.length})`, margin, y);
        y += 8;

        for (const cs of ncControls) {
          checkPageBreak(30);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`${cs.name} — ML${cs.highestLevel} (${cs.pct}% compliant)`, margin, y);
          y += 6;

          if (cs.missingReqs.length > 0) {
            autoTable(doc, {
              startY: y,
              head: [['Requirement ID', 'Description', 'Recommendation']],
              body: cs.missingReqs.map(mr => [mr.id.toUpperCase(), mr.text.substring(0, 120), mr.implementation.substring(0, 120)]),
              margin: { left: margin, right: margin },
              styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
              headStyles: { fillColor: [180, 50, 50], textColor: 255, fontStyle: 'bold' },
              columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 75 }, 2: { cellWidth: 'auto' } },
            });
            y = doc.lastAutoTable.finalY + 8;
          }
        }
      }

      // Fully Compliant Controls
      if (cControls.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(0, 150, 0);
        doc.text(`Fully Compliant Controls (${cControls.length})`, margin, y);
        y += 6;
        autoTable(doc, {
          startY: y,
          head: [['Control', 'Maturity Level', 'Compliance']],
          body: cControls.map(cs => [cs.name, `ML${cs.highestLevel}`, '100%']),
          margin: { left: margin, right: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [50, 130, 50], textColor: 255, fontStyle: 'bold' },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Not Assessed
      if (uControls.length > 0) {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(120, 120, 120);
        doc.text(`Not Assessed (${uControls.length})`, margin, y);
        y += 6;
        autoTable(doc, {
          startY: y,
          head: [['Control', 'Status']],
          body: uControls.map(cs => [cs.name, 'No audit conducted']),
          margin: { left: margin, right: margin },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [120, 120, 120], textColor: 255, fontStyle: 'bold' },
        });
        y = doc.lastAutoTable.finalY + 10;
      }

      // Footer on each page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(`Essential Eight Compliance Report — Page ${i} of ${totalPages}`, margin, doc.internal.pageSize.getHeight() - 8);
        doc.text('ACSC Essential Eight Maturity Model', pageWidth - margin, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
      }

      doc.save(`essential-eight-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF: ' + err.message);
    }
    setGenerating(false);
  }

  return (<div className="mx-auto max-w-5xl px-4 py-8"><Link to="/audit" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link>
    <div className="flex items-center justify-between mb-2"><h2 className="text-2xl font-bold text-cyber-text">Overall Compliance Report</h2><button onClick={generatePDF} disabled={generating} className="flex items-center gap-2 rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 disabled:opacity-50 transition-colors">{generating ? 'Generating...' : 'Download PDF'}</button></div>
    <p className="text-cyber-muted text-sm mb-8">Compliance across all 8 Essential Eight controls by maturity level</p>
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-primary/30"><h3 className="text-lg font-bold text-cyber-text mb-4">Summary</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div className="text-center"><div className="text-3xl font-bold text-cyber-primary">{overallPct}%</div><div className="text-xs text-cyber-muted">Overall</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-success">{totalCompliant}</div><div className="text-xs text-cyber-muted">Compliant</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-text">{totalReqs}</div><div className="text-xs text-cyber-muted">Assessed</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-secondary">{controlSummaries.filter(c => c.hasAudit).length}/8</div><div className="text-xs text-cyber-muted">Controls</div></div></div><div className="h-3 rounded-full bg-cyber-border overflow-hidden"><div className={`h-full rounded-full transition-all ${overallPct === 100 ? 'bg-cyber-success' : overallPct >= 50 ? 'bg-cyber-warning' : 'bg-cyber-danger'}`} style={{ width: `${overallPct}%` }} /></div></div>
    {ncControls.length > 0 && (
      <div className="mb-8">
        <h3 className="text-lg font-bold text-cyber-danger mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Risk Report — Incomplete Controls ({ncControls.length})</h3>
        <div className="space-y-6">{ncControls.map(cs => <RiskReportCard key={cs.id} cs={cs} />)}</div>
      </div>
    )}
    {cControls.length > 0 && <div className="mb-8"><h3 className="text-lg font-bold text-cyber-success mb-4 flex items-center gap-2"><CheckCircle size={18} /> Fully Compliant ({cControls.length})</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{cControls.map(cs => (<div key={cs.id} className="glass-card rounded-xl p-4 border-l-4 border-cyber-success/30"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-success/10 border border-cyber-success/20"><DynIcon name={cs.icon} className="text-cyber-success" size={16} /></div><div className="flex-1"><h4 className="text-sm font-bold text-cyber-text">{cs.name}</h4><p className="text-xs text-cyber-muted">ML{cs.highestLevel} • 100%</p></div><CheckCircle className="text-cyber-success" size={18} /></div></div>))}</div></div>}
    {uControls.length > 0 && <div><h3 className="text-lg font-bold text-cyber-muted mb-4 flex items-center gap-2"><AlertCircle size={18} /> Not Assessed ({uControls.length})</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{uControls.map(cs => (<div key={cs.id} className="glass-card rounded-xl p-4 opacity-50"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-border/30"><DynIcon name={cs.icon} className="text-cyber-muted" size={16} /></div><div><h4 className="text-sm font-medium text-cyber-muted">{cs.name}</h4><p className="text-xs text-cyber-muted">No audit</p></div></div></div>))}</div></div>}
  </div>);
}

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const search = useSearch();
  useEffect(() => { const h = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(p => !p); } if (e.key === 'Escape') setSearchOpen(false); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
  return (<ThemeProvider><AppInner searchOpen={searchOpen} setSearchOpen={setSearchOpen} search={search} /></ThemeProvider>);
}

function AppInner({ searchOpen, setSearchOpen, search }) {
  return (<div className="min-h-screen bg-cyber-bg text-cyber-text"><Header onSearchClick={() => setSearchOpen(true)} /><Routes><Route path="/" element={<Dashboard />} /><Route path="/strategy/:strategyId" element={<StrategyDetail />} /><Route path="/strategy/:strategyId/maturity/:level" element={<MaturityView />} /><Route path="/audit" element={<AuditHome />} /><Route path="/audit/:auditId" element={<AuditWorkflowWrapper />} /><Route path="/audit/:auditId/report" element={<AuditReportWrapper />} /><Route path="/audit/overall-report" element={<OverallComplianceReport />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>{searchOpen && <SearchModal query={search.query} setQuery={search.setQuery} results={search.results} onClose={() => { setSearchOpen(false); search.setQuery(''); }} />}<div className="fixed bottom-3 left-3 z-30"><span className="rounded bg-cyber-card/80 border border-cyber-border px-2 py-1 text-[10px] text-cyber-muted backdrop-blur-sm">v{APP_VERSION}</span></div></div>);
}
function AuditWorkflowWrapper() { const { auditId } = useParams(); return <AuditWorkflow auditId={parseInt(auditId)} />; }
function AuditReportWrapper() { const { auditId } = useParams(); return <AuditReport auditId={parseInt(auditId)} />; }
