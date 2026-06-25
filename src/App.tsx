import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Search, Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound,
  Moon, Sun, ChevronRight, ArrowLeft, X, ExternalLink, CheckCircle, AlertTriangle, Info, Database,
  Target, Wrench, Cpu, ClipboardCheck, FileUp, Trash2, Check, XCircle, AlertCircle, Palette,
  BarChart3, Trash, Lock as LockIcon, Unlock, Play, PlayCircle, FileText, Waves
} from 'lucide-react';
import Fuse from 'fuse.js';
import { strategies, type Requirement, type MaturityLevelData, type MitigationStrategy } from './data';
import { ThemeProvider, useTheme, themes, type ThemeName } from './ThemeContext';

const API = '/api';
const APP_VERSION = '2.4.0';
const iconMap = { Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound, Database };

const WORKFLOW_CONTROLS = [
  'patch-applications', 'application-control', 'restrict-microsoft-office-macros', 'user-application-hardening',
  'patch-operating-systems', 'multi-factor-authentication', 'restrict-administrative-privileges', 'regular-backups',
];

async function apiFetch(path, opts) {
  opts = opts || {};
  const isFormData = opts.body instanceof FormData;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const res = await fetch(API + path, Object.assign({ headers }, opts));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}

function ThemeSwitcher() {
  const { themeName, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const icons = { cyber: <Shield size={14} />, spotify: <Moon size={14} />, light: <Sun size={14} />, ocean: <Waves size={14} />, paper: <FileText size={14} /> };
  return (<div className="relative"><button onClick={() => setOpen(!open)} className="rounded-lg border border-cyber-border bg-cyber-card p-2 text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors"><Palette size={16} /></button>{open && (<><div className="fixed inset-0 z-40" onClick={() => setOpen(false)} /><div className="absolute right-0 top-full mt-2 z-50 rounded-lg border border-cyber-border bg-cyber-card py-1 min-w-[140px] shadow-xl">{Object.values(themes).map(t => (<button key={t.name} onClick={() => { setTheme(t.name); setOpen(false); }} className={"flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors " + (themeName === t.name ? 'text-cyber-primary bg-cyber-primary/10' : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-border/30')}>{icons[t.name]}{t.label}{themeName === t.name && <Check size={12} className="ml-auto" />}</button>))}</div></>)}</div>);
}

function useSearch() {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => {
    const items = [];
    strategies.forEach((s) => {
      items.push({ type: 'strategy', strategyId: s.id, strategyName: s.name, title: s.name, text: s.description });
      s.maturityLevels.forEach((ml) => ml.requirements.forEach((req) => { items.push({ type: 'requirement', strategyId: s.id, strategyName: s.name, maturityLevel: ml.level, title: s.name + ' \u2014 ML' + ml.level, text: req.text, reqId: req.id }); }));
    });
    return new Fuse(items, { keys: ['title', 'text', 'strategyName'], threshold: 0.3 });
  }, []);
  return { query, setQuery, results: query.length >= 2 ? fuse.search(query).map(r => r.item) : [] };
}

function SearchModal({ query, setQuery, results, onClose }) {
  return (<div className="fixed inset-0 z-50 modal-overlay flex items-start justify-center pt-[10vh]" onClick={onClose}><div className="w-full max-w-2xl mx-4 rounded-xl border border-cyber-border bg-cyber-card shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-cyber-border px-4 py-3"><Search className="text-cyber-primary" size={20} /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent text-cyber-text placeholder-cyber-muted outline-none text-sm" /><button onClick={onClose} className="text-cyber-muted hover:text-cyber-text"><X size={18} /></button></div><div className="max-h-[60vh] overflow-y-auto p-2">{query.length < 2 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">Type at least 2 characters...</p>}{query.length >= 2 && results.length === 0 && <p className="px-3 py-8 text-center text-sm text-cyber-muted">No results</p>}{results.map((r, i) => (<Link key={i} to={r.type === 'strategy' ? '/strategy/' + r.strategyId : '/strategy/' + r.strategyId + '/maturity/' + r.maturityLevel + '?req=' + r.reqId} onClick={onClose} className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-cyber-primary/5 transition-colors"><div className={"mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase " + (r.type === 'strategy' ? 'bg-cyber-secondary/20 text-cyber-secondary' : 'bg-cyber-primary/20 text-cyber-primary')}>{r.type === 'strategy' ? 'Strategy' : 'ML' + r.maturityLevel}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-cyber-text truncate">{r.title}</p><p className="text-xs text-cyber-muted truncate">{r.strategyName} \u2014 {r.text}</p></div><ChevronRight size={14} className="mt-1 text-cyber-muted shrink-0" /></Link>))}</div></div></div>);
}

function Header({ onSearchClick }) {
  return (<header className="sticky top-0 z-40 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><Link to="/" className="flex items-center gap-3 group"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/30 group-hover:bg-cyber-primary/20 transition-colors"><Shield className="text-cyber-primary" size={20} /></div><div><h1 className="text-lg font-bold text-cyber-text leading-tight">Essential Eight</h1><p className="text-[10px] text-cyber-muted uppercase tracking-widest">ACSC Maturity Model</p></div></Link><div className="flex items-center gap-2"><Link to="/audit" className="flex items-center gap-2 rounded-lg border border-cyber-secondary/30 bg-cyber-secondary/10 px-3 py-2 text-sm text-cyber-secondary hover:bg-cyber-secondary/20 transition-colors"><ClipboardCheck size={16} /><span className="hidden sm:inline">Audit</span></Link><button onClick={onSearchClick} className="flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card px-3 py-2 text-sm text-cyber-muted hover:border-cyber-primary/40 hover:text-cyber-text transition-colors"><Search size={16} /><span className="hidden sm:inline">Search</span></button><ThemeSwitcher /></div></div></header>);
}

function Dashboard() {
  return (<div className="mx-auto max-w-7xl px-4 py-8"><h2 className="text-2xl font-bold text-cyber-text mb-2">Essential Eight Maturity Model</h2><p className="text-cyber-muted text-sm max-w-3xl mb-8">The ACSC Essential Eight is a set of prioritised mitigation strategies to help organisations protect against cyber threats.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{strategies.map((s, i) => <StrategyTile key={s.id} strategy={s} index={i} />)}</div></div>);
}

function StrategyTile({ strategy, index }) {
  const Icon = iconMap[strategy.icon];
  return (<Link to={'/strategy/' + strategy.id} className="glass-card rounded-xl p-5 group animate-fade-in-up" style={{ animationDelay: index * 60 + 'ms' }}><div className="flex items-start justify-between mb-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 group-hover:bg-cyber-primary/20 transition-colors">{Icon && <Icon className="text-cyber-primary" size={20} />}</div><ChevronRight size={16} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-1" /></div><h3 className="text-sm font-semibold text-cyber-text mb-1 group-hover:text-cyber-primary transition-colors">{strategy.name}</h3><p className="text-xs text-cyber-muted line-clamp-2 mb-3">{strategy.description}</p><div className="flex items-center gap-2 text-[10px] text-cyber-muted"><span className="rounded bg-cyber-success/10 text-cyber-success px-1.5 py-0.5 font-medium">ML1: {strategy.maturityLevels[0].requirements.length}</span><span className="rounded bg-cyber-warning/10 text-cyber-warning px-1.5 py-0.5 font-medium">ML2: {strategy.maturityLevels[1].requirements.length}</span><span className="rounded bg-cyber-danger/10 text-cyber-danger px-1.5 py-0.5 font-medium">ML3: {strategy.maturityLevels[2].requirements.length}</span></div></Link>);
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
  return (<Link to={'/strategy/' + strategyId + '/maturity/' + maturity.level} className={"glass-card rounded-xl p-6 border-l-4 " + colors[maturity.level - 1] + " group hover:scale-[1.02] transition-all"}><div className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold " + bgColors[maturity.level - 1] + " " + textColors[maturity.level - 1] + " mb-3"}>{maturity.level === 1 && <CheckCircle size={12} />}{maturity.level === 2 && <AlertTriangle size={12} />}{maturity.level === 3 && <Info size={12} />}{maturity.title}</div><p className="text-sm text-cyber-muted mb-4">{maturity.requirements.length} requirement{maturity.requirements.length !== 1 ? 's' : ''}</p><div className="space-y-2">{maturity.requirements.slice(0, 3).map((r) => <div key={r.id} className="text-xs text-cyber-muted truncate">• {r.text.substring(0, 80)}...</div>)}{maturity.requirements.length > 3 && <div className="text-xs text-cyber-primary">+{maturity.requirements.length - 3} more</div>}</div></Link>);
}

function RequirementModal({ requirement, strategyName, maturityTitle, onClose }) {
  return (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4" onClick={onClose}><div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-cyber-border bg-cyber-card shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}><div className="sticky top-0 z-10 flex items-start justify-between border-b border-cyber-border bg-cyber-card px-6 py-4"><div><div className="flex items-center gap-2 mb-1"><span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{requirement.id.toUpperCase()}</span><span className="text-xs text-cyber-muted">{strategyName} / {maturityTitle}</span></div><h3 className="text-base font-bold text-cyber-text leading-snug">{requirement.text}</h3></div><button onClick={onClose} className="rounded-lg p-1 text-cyber-muted hover:bg-cyber-border hover:text-cyber-text transition-colors"><X size={20} /></button></div><div className="px-6 py-4 space-y-5"><ModalSection icon={<Target size={16} />} title="Purpose" content={requirement.purpose} color="primary" /><ModalSection icon={<Wrench size={16} />} title="Implementation Guidance" content={requirement.implementation} color="secondary" /><ModalListSection icon={<Cpu size={16} />} title="Technical Examples" items={requirement.examples} color="success" /><ModalListSection icon={<ClipboardCheck size={16} />} title="Audit Evidence" items={requirement.evidence} color="warning" /></div></div></div>);
}

function ModalSection({ icon, title, content, color }) {
  const c = { primary: 'text-cyber-primary', secondary: 'text-cyber-secondary', success: 'text-cyber-success', warning: 'text-cyber-warning' };
  return (<div><div className="flex items-center gap-2 mb-2"><span className={c[color] || 'text-cyber-primary'}>{icon}</span><h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4></div><p className="text-sm text-cyber-text leading-relaxed pl-6">{content}</p></div>);
}

function ModalListSection({ icon, title, items, color }) {
  const d = { primary: 'bg-cyber-primary', secondary: 'bg-cyber-secondary', success: 'bg-cyber-success', warning: 'bg-cyber-warning' };
  return (<div><div className="flex items-center gap-2 mb-2"><span className={(d[color] || 'bg-cyber-primary').replace('bg-', 'text-')}>{icon}</span><h4 className="text-xs font-bold uppercase tracking-wider text-cyber-muted">{title}</h4></div><ul className="space-y-1.5 pl-6">{items.map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-cyber-text"><span className={"mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 " + (d[color] || 'bg-cyber-primary')} />{item}</li>))}</ul></div>);
}

function MaturityView() {
  const { strategyId, level } = useParams();
  const strategy = strategies.find(s => s.id === strategyId);
  const maturity = strategy?.maturityLevels.find(m => m.level === Number(level));
  const [selectedReq, setSelectedReq] = useState(null);
  if (!strategy || !maturity) return <Navigate to="/" replace />;
  return (<div className="mx-auto max-w-7xl px-4 py-8"><Link to={'/strategy/' + strategyId} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link><div className="mb-8"><h2 className="text-2xl font-bold text-cyber-text mb-1">{strategy.name}</h2><p className="text-cyber-primary font-medium">{maturity.title}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{maturity.requirements.map((req, i) => (<button key={req.id} onClick={() => setSelectedReq(req)} className="glass-card rounded-xl p-5 text-left group hover:scale-[1.02] hover:border-cyber-primary/40 transition-all animate-fade-in-up" style={{ animationDelay: i * 40 + 'ms' }}><div className="flex items-start justify-between mb-3"><span className="rounded bg-cyber-primary/10 px-2 py-0.5 text-[10px] font-bold text-cyber-primary">{req.id.toUpperCase()}</span><ChevronRight size={14} className="text-cyber-muted group-hover:text-cyber-primary transition-colors mt-0.5" /></div><p className="text-sm text-cyber-text leading-relaxed line-clamp-3">{req.text}</p></button>))}</div>{selectedReq && <RequirementModal requirement={selectedReq} strategyName={strategy.name} maturityTitle={maturity.title} onClose={() => setSelectedReq(null)} />}</div>);
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT HOME — Catalogue with grouped audits
   ═══════════════════════════════════════════════════════════════ */
function AuditHome() {
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState('');
  const [error, setError] = useState('');
  const [audits, setAudits] = useState([]);
  const [lastAudit, setLastAudit] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function refresh() {
    apiFetch('/audits/summary').then(setAudits).catch(() => {});
    apiFetch('/audits/last').then(d => { setLastAudit(d || null); }).catch(() => { setLastAudit(null); });
  }
  useEffect(() => { refresh(); }, [refreshKey]);

  const groupedAudits = useMemo(() => {
    const groups = {};
    const standalone = [];
    for (const a of audits) {
      if (a.audit_group) {
        if (!groups[a.audit_group]) groups[a.audit_group] = [];
        groups[a.audit_group].push(a);
      } else standalone.push(a);
    }
    const groupList = Object.entries(groups).map(([groupId, items]) => {
      items.sort((a, b) => a.maturity_level - b.maturity_level || WORKFLOW_CONTROLS.indexOf(a.control_id) - WORKFLOW_CONTROLS.indexOf(b.control_id));
      const latest = items.reduce((m, i) => i.updated_at > m.updated_at ? i : m, items[0]);
      const completedCount = items.filter(i => i.status === 'completed').length;
      const isFullyComplete = completedCount === items.length;
      const currentItem = items.find(i => i.status !== 'completed') || items[items.length - 1];
      return { groupId, items, latest, completedCount, totalCount: items.length, isFullyComplete, currentItem };
    }).sort((a, b) => b.latest.updated_at.localeCompare(a.latest.updated_at));
    return { groups: groupList, standalone };
  }, [audits]);

  async function lookupCatalogue() {
    if (!catalogue.trim()) { setError('Please enter an audit name'); return; }
    setError('');
    const found = audits.find(a => a.identifier === catalogue.trim());
    if (found) {
      if (found.audit_group) navigate('/audit/workflow/' + found.audit_group);
      else navigate('/audit/' + found.id);
      return;
    }
    setShowNew(true);
  }

  async function deleteAuditGroup(groupId) {
    if (!confirm('Delete this entire audit group and all evidence?')) return;
    const group = groupedAudits.groups.find(g => g.groupId === groupId);
    if (!group) return;
    for (const item of group.items) await apiFetch('/audits/' + item.id, { method: 'DELETE' });
    setLastAudit(null);
    setRefreshKey(k => k + 1);
  }

  async function deleteAllAudits() {
    if (!confirm('Delete ALL audits? This cannot be undone.')) return;
    await apiFetch('/audits', { method: 'DELETE' });
    setLastAudit(null);
    setDeleteConfirm(null);
    setRefreshKey(k => k + 1);
  }

  function handleLastAuditClick() {
    if (!lastAudit) return;
    if (lastAudit.audit_group) navigate('/audit/workflow/' + lastAudit.audit_group);
    else if (lastAudit.status === 'completed') navigate('/audit/' + lastAudit.id + '/report');
    else navigate('/audit/' + lastAudit.id);
  }

  const fmtDate = (d) => { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link>
      <h2 className="text-2xl font-bold text-cyber-text mb-2">Compliance Audit</h2>
      <p className="text-cyber-muted text-sm mb-8">Start a new multi-control audit or resume an existing one.</p>

      <div className="mb-6">
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-5 py-3 text-sm font-bold text-cyber-success hover:bg-cyber-success/30 transition-colors"><Play size={18} />Start New Audit</button>
        <p className="text-xs text-cyber-muted mt-2 ml-1">Runs through all 8 controls at ML1, then ML2, then ML3 sequentially.</p>
      </div>

      <div className="glass-card rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-cyber-text mb-2">Audit Lookup</label>
        <div className="flex gap-3">
          <input value={catalogue} onChange={e => setCatalogue(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookupCatalogue()} placeholder="Enter audit name..." className="flex-1 rounded-lg border border-cyber-border bg-cyber-bg px-4 py-2.5 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 transition-colors" />
          <button onClick={lookupCatalogue} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-6 py-2.5 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Look Up</button>
        </div>
        {error && <p className="mt-2 text-xs text-cyber-danger">{error}</p>}
      </div>

      {lastAudit && (
        <div className="glass-card rounded-xl p-6 mb-6 border-l-4 border-cyber-secondary/30">
          <div className="flex items-center justify-between">
            <div><h3 className="text-sm font-bold text-cyber-text flex items-center gap-2"><Clock size={16} className="text-cyber-secondary" />Last Audit</h3><p className="text-xs text-cyber-muted mt-1">{lastAudit.identifier} \u2022 {strategies.find(s => s.id === lastAudit.control_id)?.name} \u2022 ML{lastAudit.maturity_level} \u2022 {lastAudit.status}{lastAudit.locked ? ' \u2022 \uD83D\uDD12 Locked' : ''}</p></div>
            <button onClick={handleLastAuditClick} className="rounded-lg bg-cyber-secondary/20 border border-cyber-secondary/30 px-4 py-2 text-sm font-medium text-cyber-secondary hover:bg-cyber-secondary/20 transition-colors flex items-center gap-1">{lastAudit.status === 'completed' ? <><BarChart3 size={14} />Report</> : <><FileText size={14} />Continue</>}</button>
          </div>
        </div>
      )}

      {showNew && <NewAuditForm onCreated={(groupId) => { setRefreshKey(k => k + 1); setShowNew(false); window.open('#/audit/workflow/' + groupId, '_blank', 'width=900,height=700'); }} />}

      {groupedAudits.groups.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-cyber-text">Audit Groups <span className="text-cyber-muted font-normal text-sm">({groupedAudits.groups.length})</span></h3><button onClick={() => setDeleteConfirm('all')} className="rounded-lg border border-cyber-danger/30 px-3 py-1.5 text-xs font-medium text-cyber-danger hover:bg-cyber-danger/10 transition-colors flex items-center gap-1"><Trash size={12} />Delete All</button></div>
          <div className="space-y-4">
            {groupedAudits.groups.map(group => {
              const progressPct = Math.round((group.completedCount / group.totalCount) * 100);
              const currentControl = strategies.find(s => s.id === group.currentItem?.control_id);
              return (
                <div key={group.groupId} className="glass-card rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-cyber-text flex items-center gap-2">{group.isFullyComplete ? <CheckCircle size={14} className="text-cyber-success" /> : <Play size={14} className="text-cyber-primary" />}{(group.items[0]?.identifier || '').split('_')[0] || group.groupId.substring(0, 8)}</h4>
                      <p className="text-xs text-cyber-muted mt-0.5">Created {fmtDate(group.latest.created_at)} \u2022 {group.completedCount}/{group.totalCount} assessments{!group.isFullyComplete && currentControl && ' \u2022 Current: ' + currentControl.name + ' ML' + group.currentItem.maturity_level}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate('/audit/workflow/' + group.groupId)} className={"rounded-lg px-4 py-1.5 text-xs font-medium transition-colors " + (group.isFullyComplete ? 'bg-cyber-secondary/20 border border-cyber-secondary/30 text-cyber-secondary hover:bg-cyber-secondary/30' : 'bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-primary hover:bg-cyber-primary/30')}>{group.isFullyComplete ? 'View' : 'Continue'}</button>
                      <button onClick={() => deleteAuditGroup(group.groupId)} className="rounded-lg border border-cyber-danger/30 px-3 py-1.5 text-xs text-cyber-danger hover:bg-cyber-danger/10 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map(ml => {
                      const mlItems = group.items.filter(i => i.maturity_level === ml);
                      const mlDone = mlItems.filter(i => i.status === 'completed').length;
                      const mlPct = mlItems.length > 0 ? Math.round((mlDone / mlItems.length) * 100) : 0;
                      return (<div key={ml} className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-[9px] font-bold text-cyber-muted uppercase">ML{ml}</span><span className="text-[9px] text-cyber-muted">{mlDone}/{mlItems.length}</span></div><div className="h-1.5 rounded-full bg-cyber-border overflow-hidden"><div className={"h-full rounded-full transition-all " + (mlPct === 100 ? 'bg-cyber-success' : 'bg-cyber-primary')} style={{ width: mlPct + '%' }} /></div></div>);
                    })}
                    <div className="ml-3 text-xs font-bold text-cyber-text w-10 text-right">{progressPct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {deleteConfirm === 'all' && (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"><div className="glass-card rounded-xl p-6 max-w-sm w-full border border-cyber-danger/30"><h3 className="text-lg font-bold text-cyber-danger mb-2">Delete All Audits?</h3><p className="text-sm text-cyber-muted mb-4">This will permanently delete all audits and evidence.</p><div className="flex gap-3"><button onClick={deleteAllAudits} className="rounded-lg bg-cyber-danger/20 border border-cyber-danger/30 px-4 py-2 text-sm font-medium text-cyber-danger hover:bg-cyber-danger/30 transition-colors">Delete All</button><button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text transition-colors">Cancel</button></div></div></div>)}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   NEW AUDIT FORM — Creates a group
   ═══════════════════════════════════════════════════════════════ */
function NewAuditForm({ onCreated }) {
  const [auditName, setAuditName] = useState('');
  const [maturityLevel, setMaturityLevel] = useState('all');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  async function createGroup() {
    if (!auditName.trim()) { setError('Please enter an audit name'); return; }
    setCreating(true); setError('');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const identifier = dateStr + '-' + auditName.trim();
    try {
      const result = await apiFetch('/audits/group', {
        method: 'POST',
        body: JSON.stringify({ identifier, controlIds: WORKFLOW_CONTROLS, startLevel: maturityLevel }),
      });
      onCreated(result.groupId);
    } catch (e) { setError(e.message); }
    setCreating(false);
  }

  const levels = maturityLevel === 'all' ? [1, 2, 3] : [Number(maturityLevel)];

  return (
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-success/30">
      <div className="flex items-center gap-2 mb-4"><Play className="text-cyber-success" size={18} /><h3 className="text-sm font-bold text-cyber-text">New Multi-Control Audit</h3></div>
      <p className="text-xs text-cyber-muted mb-4">This creates an assessment covering all 8 Essential Eight controls. Select which maturity level(s) to assess.</p>
      <div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-1">Audit Name</label><input value={auditName} onChange={e => setAuditName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createGroup()} placeholder="e.g., Q1-2025-Assessment" className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50" /><p className="text-[10px] text-cyber-muted mt-1">Saved as: {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}-{auditName || '...'}</p></div>
      <div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-2">Maturity Level</label><div className="flex gap-2">{[{ v: 'all', l: 'All (ML1 → ML2 → ML3)' }, { v: '1', l: 'Maturity Level 1 only' }, { v: '2', l: 'Maturity Level 2 only' }, { v: '3', l: 'Maturity Level 3 only' }].map(opt => (<button key={opt.v} onClick={() => setMaturityLevel(opt.v)} className={"flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors " + (maturityLevel === opt.v ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success' : 'border-cyber-border text-cyber-muted hover:border-cyber-primary/30')}>{opt.l}</button>))}</div></div>
      <div className="rounded-lg bg-cyber-bg/50 p-3 mb-4"><p className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider mb-2">Assessment Order</p>{levels.map(ml => (<div key={ml} className="mb-1"><span className="text-[10px] font-bold text-cyber-primary">Maturity Level {ml}:</span><span className="text-[10px] text-cyber-muted ml-2">{WORKFLOW_CONTROLS.map(cid => strategies.find(s => s.id === cid)?.name).join(' → ')}</span></div>))}</div>
      {error && <p className="mb-3 text-xs text-cyber-danger">{error}</p>}
      <button onClick={createGroup} disabled={creating || !auditName.trim()} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-6 py-2.5 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 disabled:opacity-50 transition-colors">{creating ? 'Creating...' : 'Create & Start Workflow'}</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT WORKFLOW PAGE — Multi-control walkthrough
   ═══════════════════════════════════════════════════════════════ */
function AuditWorkflowPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupAudits, setGroupAudits] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroup = useCallback(async () => {
    try {
      const data = await apiFetch('/audits/group/' + groupId + '/progress');
      if (!data || !data.length) { setError('Audit group not found or empty'); setLoading(false); return; }
      setGroupAudits(data);
      const idx = data.findIndex(a => a.status !== 'completed');
      setCurrentIndex(idx >= 0 ? idx : data.length - 1);
    } catch (err) { setError(err.message); }
    setLoading(false);
  }, [groupId]);

  useEffect(() => { loadGroup(); }, [loadGroup]);

  useEffect(() => {
    const handler = () => { try { window.opener && window.opener.postMessage({ type: 'audit-workflow-closed' }, '*'); } catch {} };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  if (loading) return <div className="min-h-screen bg-cyber-bg text-cyber-text flex items-center justify-center"><div className="text-cyber-muted">Loading assessment...</div></div>;
  if (error) return <div className="min-h-screen bg-cyber-bg text-cyber-text flex items-center justify-center"><div className="text-cyber-danger">{error}<br /><button onClick={() => window.close()} className="mt-4 text-xs text-cyber-muted border border-cyber-border px-3 py-1 rounded">Close</button></div></div>;
  if (!groupAudits.length) return <div className="min-h-screen bg-cyber-bg text-cyber-text flex items-center justify-center"><div className="text-cyber-danger">No audits in group</div></div>;

  const currentAudit = groupAudits[currentIndex];
  if (!currentAudit) return <div className="min-h-screen bg-cyber-bg text-cyber-text flex items-center justify-center"><div className="text-cyber-muted">No current audit</div></div>;

  const strategy = strategies.find(s => s.id === currentAudit.control_id);
  const maturity = strategy?.maturityLevels.find(m => m.level === currentAudit.maturity_level);
  const totalSteps = groupAudits.length;
  const completedSteps = groupAudits.filter(a => a.status === 'completed').length;
  const allComplete = groupAudits.every(a => a.status === 'completed');

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-cyber-text">Essential Eight Assessment</h2><p className="text-xs text-cyber-muted mt-0.5">{completedSteps}/{totalSteps} assessments complete</p></div>
          <button onClick={() => { try { window.close(); } catch {} navigate('/audit'); }} className="text-xs text-cyber-muted hover:text-cyber-text px-3 py-1.5 rounded border border-cyber-border hover:border-cyber-primary/40 transition-colors">Close Window</button>
        </div>
        <div className="glass-card rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3].map(ml => {
              const mlAudits = groupAudits.filter(a => a.maturity_level === ml);
              const mlDone = mlAudits.filter(a => a.status === 'completed').length;
              return (<div key={ml} className="flex items-center gap-1"><span className={"text-xs font-bold " + (currentAudit.maturity_level === ml ? 'text-cyber-primary' : 'text-cyber-muted')}>ML{ml}</span><div className="h-1.5 w-20 rounded-full bg-cyber-border overflow-hidden"><div className={"h-full rounded-full " + (mlDone === mlAudits.length ? 'bg-cyber-success' : 'bg-cyber-primary')} style={{ width: (mlAudits.length > 0 ? (mlDone / mlAudits.length) * 100 : 0) + '%' }} /></div><span className="text-[9px] text-cyber-muted">{mlDone}/{mlAudits.length}</span></div>);
            })}
          </div>
          <div className="flex gap-0.5">{groupAudits.map((a, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={"h-2 flex-1 rounded-full transition-colors " + (i === currentIndex ? 'bg-cyber-primary' : a.status === 'completed' ? 'bg-cyber-success' : 'bg-cyber-border')} title={(strategies.find(s => s.id === a.control_id)?.name || a.control_id) + ' ML' + a.maturity_level} />))}</div>
        </div>
        {allComplete ? (
          <div className="glass-card rounded-xl p-8 text-center border-l-4 border-cyber-success/30">
            <CheckCircle className="text-cyber-success mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-cyber-success mb-2">All Assessments Complete!</h3>
            <p className="text-sm text-cyber-muted mb-6">All {totalSteps} assessments across ML1, ML2, and ML3 are done.</p>
            <button onClick={() => { try { window.close(); } catch {} navigate('/audit'); }} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-6 py-2.5 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 transition-colors">Close & Return to Catalogue</button>
          </div>
        ) : maturity && strategy ? (
          <AuditWorkflowSingle audit={currentAudit} strategy={strategy} maturity={maturity} onComplete={loadGroup} onPrev={() => setCurrentIndex(Math.max(0, currentIndex - 1))} onNext={() => setCurrentIndex(Math.min(totalSteps - 1, currentIndex + 1))} canPrev={currentIndex > 0} canNext={currentIndex < totalSteps - 1} />
        ) : (
          <div className="glass-card rounded-xl p-8 text-center border-l-4 border-cyber-warning/30">
            <AlertTriangle className="text-cyber-warning mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-cyber-warning mb-2">Unable to Load Assessment</h3>
            <p className="text-sm text-cyber-muted mb-4">Control: {currentAudit.control_id} (ML{currentAudit.maturity_level})</p>
            <p className="text-xs text-cyber-muted">This control may not have data defined in the application.</p>
          </div>
        )}
      </div>
    </div>
  );
}


/* SINGLE AUDIT WORKFLOW (inner component for workflow page) */
function AuditWorkflowSingle({ audit, strategy, maturity, onComplete, onPrev, onNext, canPrev, canNext }) {
  const [statuses, setStatuses] = useState({});
  const [evidence, setEvidence] = useState({});
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const loadedRef = useRef(false);
  const reqs = maturity.requirements || [];
  const currentReq = reqs[currentStep];
  const loadAudit = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([apiFetch('/audits/' + audit.id + '/requirements'), apiFetch('/audits/' + audit.id + '/evidence')]);
      const sm = {}; (s || []).forEach(rs => { sm[rs.requirement_id] = rs; }); setStatuses(sm);
      const em = {}; (e || []).forEach(ev => { if (!em[ev.requirement_id]) em[ev.requirement_id] = []; em[ev.requirement_id].push(ev); }); setEvidence(em);
    } catch (err) { console.error(err); }
  }, [audit.id]);
  useEffect(() => { if (!loadedRef.current) { loadedRef.current = true; loadAudit(); } }, [loadAudit]);
  async function setCompliant(reqId, compliant, notes) {
    notes = notes || '';
    setSaving(true);
    try {
      const s = await apiFetch('/audits/' + audit.id + '/requirements/' + reqId, { method: 'PUT', body: JSON.stringify({ compliant, notes }) });
      setStatuses(p => ({ ...p, [reqId]: s }));
      // Auto-advance to next requirement after short delay
      if (currentStep < tc - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  }
  async function uploadEvidence(reqId, type, desc, file) {
    const fd = new FormData(); fd.append('requirementId', reqId); fd.append('evidenceType', type); fd.append('description', desc);
    if (file) fd.append('file', file);
    try { await fetch(API + '/audits/' + audit.id + '/evidence', { method: 'POST', body: fd }); const u = await apiFetch('/audits/' + audit.id + '/evidence?requirementId=' + reqId); setEvidence(p => ({ ...p, [reqId]: u })); } catch (err) { console.error(err); }
  }
  async function removeEvidence(evId) { try { await apiFetch('/evidence/' + evId, { method: 'DELETE' }); loadAudit(); } catch (err) { console.error(err); } }
  async function completeThisAudit() { await apiFetch('/audits/' + audit.id + '/status', { method: 'PUT', body: JSON.stringify({ status: 'completed' }) }); onComplete(); }
  const cc = Object.values(statuses).filter(s => s.compliant === 1).length;
  const tc = reqs.length;
  const pct = tc > 0 ? Math.round((cc / tc) * 100) : 0;
  return (
    <div>
      <div className="glass-card rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-primary/10 border border-cyber-primary/20">{(() => { const I = iconMap[strategy.icon]; return I ? <I className="text-cyber-primary" size={20} /> : null; })()}</div>
        <div className="flex-1"><h3 className="text-sm font-bold text-cyber-text">{strategy.name} — {maturity.title}</h3><p className="text-xs text-cyber-muted">{audit.identifier}</p></div>
        {audit.locked && <span className="text-xs text-cyber-warning flex items-center gap-1"><LockIcon size={12} />Locked</span>}
      </div>
      {strategy.id === 'patch-applications' && <div onClick={() => window.open('/patch-apps-humour-v2-narrated.mp4', '_blank', 'width=900,height=600')} className="mb-6 cursor-pointer rounded-xl border border-cyber-border bg-cyber-bg/50 p-4 hover:border-cyber-primary/40 transition-colors"><div className="flex items-center gap-3"><PlayCircle className="text-cyber-primary shrink-0" size={32} /><div><h4 className="text-sm font-bold text-cyber-text">Patch Applications Training Video</h4><p className="text-xs text-cyber-muted">Click to watch: Patch Applications Humour v2 Narrated</p></div></div></div>}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-cyber-text">{cc}/{tc} compliant</span><span className="text-sm font-medium text-cyber-primary">{pct}%</span></div>
        <div className="h-2 rounded-full bg-cyber-border overflow-hidden mb-3"><div className="h-full rounded-full bg-cyber-primary transition-all" style={{ width: pct + '%' }} /></div>
        <div className="flex gap-1">{reqs.map((req, i) => (<button key={req.id} onClick={() => setCurrentStep(i)} className={"h-2 flex-1 rounded-full transition-colors " + (i === currentStep ? 'bg-cyber-primary' : statuses[req.id]?.compliant ? 'bg-cyber-success' : statuses[req.id] ? 'bg-cyber-danger' : 'bg-cyber-border')} />))}</div>
      </div>
      {currentReq && <RequirementAssessment requirement={currentReq} status={statuses[currentReq.id]} evidence={evidence[currentReq.id] || []} onCompliant={(c, n) => setCompliant(currentReq.id, c, n)} onEvidence={(t, d, f) => uploadEvidence(currentReq.id, t, d, f)} onRemoveEvidence={removeEvidence} saving={saving} locked={!!audit.locked} />}
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text disabled:opacity-30 transition-colors">Previous</button>
        <span className="text-xs text-cyber-muted">{currentStep + 1} of {tc}</span>
        {currentStep < tc - 1 ? (<button onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Next</button>) : audit.status !== 'completed' ? (<button onClick={completeThisAudit} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-4 py-2 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 transition-colors">Complete &amp; Continue</button>) : (<span className="text-sm text-cyber-success font-medium flex items-center gap-1"><CheckCircle size={14} />Complete</span>)}
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyber-border">
        <button onClick={onPrev} disabled={!canPrev} className="text-xs text-cyber-muted hover:text-cyber-text disabled:opacity-30 transition-colors flex items-center gap-1"><ArrowLeft size={12} />Prev Control</button>
        <button onClick={onNext} disabled={!canNext} className="text-xs text-cyber-primary hover:text-cyber-text disabled:opacity-30 transition-colors flex items-center gap-1">Next Control<ChevronRight size={12} /></button>
      </div>
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
    {!locked && <div className="flex gap-3 mb-4"><button onClick={() => onCompliant(true, notes)} disabled={saving} className={"flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors " + (isC ? 'bg-cyber-success/20 border-cyber-success/40 text-cyber-success' : 'border-cyber-border text-cyber-muted hover:border-cyber-success/30')}><Check size={14} className="inline mr-1.5" />Compliant</button><button onClick={() => onCompliant(false, notes)} disabled={saving} className={"flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors " + (isNC ? 'bg-cyber-danger/20 border-cyber-danger/40 text-cyber-danger' : 'border-cyber-border text-cyber-muted hover:border-cyber-danger/30')}><XCircle size={14} className="inline mr-1.5" />Not Compliant</button></div>}
    {locked && <div className="rounded-lg bg-cyber-warning/10 border border-cyber-warning/20 p-3 mb-4"><p className="text-xs text-cyber-warning flex items-center gap-1.5"><LockIcon size={12} />This audit is locked and cannot be edited.</p></div>}
    {isNC && <div className="rounded-lg bg-cyber-danger/10 border border-cyber-danger/20 p-3 mb-4"><p className="text-xs text-cyber-danger flex items-center gap-1.5"><AlertCircle size={12} /> This requirement will be marked as failed.</p></div>}
    <div className="mb-4"><label className="block text-xs font-medium text-cyber-muted mb-1">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => { if (!saving && !locked) onCompliant(isC, notes); }} placeholder="Optional notes..." rows={2} className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-primary/50 resize-none" /></div>
    <div className="border-t border-cyber-border pt-4"><button onClick={() => setShowEv(!showEv)} className="flex items-center gap-2 text-sm font-medium text-cyber-text mb-3"><FileUp size={14} />Evidence ({evidence.length})<ChevronRight size={12} className={"transition-transform " + (showEv ? 'rotate-90' : '')} /></button>
    {showEv && (<><div className="rounded-lg border border-cyber-border p-3 mb-3 space-y-2"><div className="grid grid-cols-2 gap-2"><select value={evType} onChange={e => setEvType(e.target.value)} className="rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text outline-none">{evTypes.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}</select><input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-xs text-cyber-muted file:mr-2 file:rounded file:border-0 file:bg-cyber-primary/10 file:px-2 file:py-1 file:text-xs file:text-cyber-primary" /></div><input value={evDesc} onChange={e => setEvDesc(e.target.value)} placeholder="Description" className="w-full rounded border border-cyber-border bg-cyber-bg px-2 py-1.5 text-xs text-cyber-text placeholder-cyber-muted outline-none" /><button onClick={() => { onEvidence(evType, evDesc, file); setFile(null); setEvDesc(''); }} className="rounded bg-cyber-primary/20 border border-cyber-primary/30 px-3 py-1.5 text-xs font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Add</button></div>
    {evidence.length > 0 ? <div className="space-y-2">{evidence.map(ev => (<div key={ev.id} className="flex items-center justify-between rounded-lg border border-cyber-border p-2"><div className="flex items-center gap-2 min-w-0"><span className="rounded bg-cyber-bg px-1.5 py-0.5 text-[9px] font-medium text-cyber-muted uppercase">{ev.evidence_type}</span><span className="text-xs text-cyber-text truncate">{ev.file_name || ev.description || '—'}</span></div><button onClick={() => onRemoveEvidence(ev.id)} className="text-cyber-muted hover:text-cyber-danger"><Trash2 size={12} /></button></div>))}</div> : <p className="text-xs text-cyber-muted">No evidence yet.</p>}</>)}</div></div>);
}


function AuditReport({ auditId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  useEffect(() => {
    apiFetch('/audits/' + auditId + '/report')
      .then(d => { setReport(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [auditId]);
  if (loading) return <div className="p-8 text-cyber-muted">Loading report...</div>;
  if (error) return <div className="p-8 text-cyber-danger">Error: {error}</div>;
  if (!report || !report.audit) return <div className="p-8 text-cyber-danger">No report data found</div>;
  const { audit, statuses, evidence, summary } = report;
  const strategy = strategies.find(s => s.id === audit.control_id);
  const maturity = strategy?.maturityLevels.find(m => m.level === audit.maturity_level);
  const reqs = maturity?.requirements || [];
  const nc = (statuses || []).filter(s => s.compliant === 0);
  const c = (statuses || []).filter(s => s.compliant === 1);
  const allEvidence = evidence || [];

  async function generatePDF() {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = doc.internal.pageSize.getWidth(); const m = 15; const cw = pw - m * 2; let y = m;
      function check(needed) { if (y + needed > doc.internal.pageSize.getHeight() - m) { doc.addPage(); y = m; } }
      doc.setFontSize(16); doc.setTextColor(0, 0, 0);
      doc.text('Essential Eight Compliance Report', m, y); y += 7;
      doc.setFontSize(10); doc.setTextColor(80, 80, 80);
      doc.text(`${strategy?.name || audit.control_id} - ${maturity?.title || 'ML' + audit.maturity_level}`, m, y); y += 5;
      doc.text(`Audit: ${audit.identifier} | Generated: ${new Date().toLocaleDateString('en-GB')}`, m, y); y += 10;
      doc.setFontSize(11); doc.setTextColor(0, 0, 0); doc.text('Summary', m, y); y += 5;
      doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      doc.text(`Compliance: ${summary.compliancePercent}% | Compliant: ${summary.compliant} | Non-Compliant: ${summary.nonCompliant} | Evidence Items: ${summary.evidenceItems}`, m, y); y += 10;
      if (nc.length > 0) {
        check(20); doc.setFontSize(12); doc.setTextColor(180, 0, 0); doc.text(`Non-Compliant Requirements (${nc.length})`, m, y); y += 6;
        for (const ns of nc) {
          check(20);
          const req = reqs.find(r => r.id === ns.requirement_id);
          if (!req) continue;
          doc.setFontSize(8); doc.setTextColor(0, 0, 0);
          const lines = doc.splitTextToSize(req.text, cw - 6);
          doc.text(`${req.id.toUpperCase()}:`, m + 3, y); y += 4;
          doc.text(lines, m + 6, y); y += lines.length * 3.5;
          if (ns.notes) { doc.setTextColor(100, 100, 0); doc.text(`Note: ${ns.notes.substring(0, 120)}`, m + 6, y); y += 4; }
          doc.setTextColor(180, 80, 0);
          const recLines = doc.splitTextToSize(req.implementation || '', cw - 12);
          doc.text('Mitigation:', m + 6, y); y += 3.5;
          doc.text(recLines, m + 9, y); y += recLines.length * 3.5 + 4;
        }
      }
      if (c.length > 0) {
        check(10); doc.setFontSize(12); doc.setTextColor(0, 150, 0); doc.text(`Compliant Requirements (${c.length})`, m, y); y += 6;
        autoTable(doc, { startY: y, head: [['ID', 'Requirement']], body: c.map(cs => { const req = reqs.find(r => r.id === cs.requirement_id); return [req?.id.toUpperCase() || cs.requirement_id, (req?.text || '').substring(0, 100)]; }), margin: { left: m, right: m }, styles: { fontSize: 7, cellPadding: 2 }, headStyles: { fillColor: [50, 130, 50], textColor: 255 } });
        y = doc.lastAutoTable.finalY + 8;
      }
      if (allEvidence.length > 0) {
        check(10); doc.setFontSize(12); doc.setTextColor(0, 0, 0); doc.text(`Evidence (${allEvidence.length})`, m, y); y += 6;
        autoTable(doc, { startY: y, head: [['Type', 'Description', 'File']], body: allEvidence.map(ev => [ev.evidence_type, (ev.description || '').substring(0, 80), ev.file_name || '-']), margin: { left: m, right: m }, styles: { fontSize: 7, cellPadding: 2 }, headStyles: { fillColor: [30, 45, 80], textColor: 255 } });
        y = doc.lastAutoTable.finalY + 8;
      }
      const tp = doc.getNumberOfPages();
      for (let i = 1; i <= tp; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(150, 150, 150); doc.text(`Essential Eight Report - Page ${i} of ${tp}`, m, doc.internal.pageSize.getHeight() - 8); }
      doc.save(`audit-report-${audit.identifier.replace(/[^a-z0-9]/gi, '-')}.pdf`);
    } catch (err) { console.error('PDF failed:', err); alert('Failed: ' + err.message); }
    setGenerating(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to={'/audit' + (audit.audit_group ? '/workflow/' + audit.audit_group : '/' + auditId)} className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary transition-colors"><ArrowLeft size={14} /> Back</Link>
        <button onClick={generatePDF} disabled={generating} className="flex items-center gap-2 rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 disabled:opacity-50 transition-colors">{generating ? 'Generating...' : 'Download PDF'}</button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cyber-text mb-1">Compliance Report</h2>
        <p className="text-sm text-cyber-muted">{strategy?.name} — {maturity?.title}</p>
        <p className="text-xs text-cyber-muted">{audit.identifier} • {new Date(audit.created_at).toLocaleDateString()}</p>
      </div>
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-cyber-text mb-4">Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="text-center"><div className="text-2xl font-bold text-cyber-primary">{summary.compliancePercent}%</div><div className="text-xs text-cyber-muted">Compliance</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-success">{summary.compliant}</div><div className="text-xs text-cyber-muted">Compliant</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-danger">{summary.nonCompliant}</div><div className="text-xs text-cyber-muted">Non-Compliant</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-cyber-secondary">{summary.evidenceItems}</div><div className="text-xs text-cyber-muted">Evidence</div></div>
        </div>
        <div className="h-3 rounded-full bg-cyber-border overflow-hidden">
          <div className={"h-full rounded-full transition-all " + (summary.compliancePercent === 100 ? 'bg-cyber-success' : summary.compliancePercent >= 50 ? 'bg-cyber-warning' : 'bg-cyber-danger')} style={{ width: summary.compliancePercent + '%' }} />
        </div>
      </div>
      {nc.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-cyber-danger mb-4 flex items-center gap-2"><XCircle size={18} /> Non-Compliant Requirements ({nc.length})</h3>
          <div className="space-y-4">
            {nc.map(ns => {
              const req = reqs.find(r => r.id === ns.requirement_id);
              if (!req) return null;
              const reqEvidence = allEvidence.filter(ev => ev.requirement_id === ns.requirement_id);
              return (
                <div key={ns.id} className="glass-card rounded-xl p-5 border-l-4 border-cyber-danger/30">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="rounded bg-cyber-danger/10 px-2 py-0.5 text-[10px] font-bold text-cyber-danger">{req.id.toUpperCase()}</span>
                    <p className="text-sm text-cyber-text flex-1">{req.text}</p>
                  </div>
                  {ns.notes && <div className="rounded-lg bg-cyber-warning/5 border border-cyber-warning/20 p-3 mb-3"><p className="text-xs text-cyber-warning flex items-center gap-1.5"><AlertCircle size={12} /> {ns.notes}</p></div>}
                  <div className="rounded-lg bg-cyber-danger/5 border border-cyber-danger/20 p-3 mb-3">
                    <p className="text-xs font-bold text-cyber-secondary mb-1">Risk & Mitigation:</p>
                    <p className="text-xs text-cyber-text">{req.implementation}</p>
                  </div>
                  {reqEvidence.length > 0 && (
                    <div className="rounded-lg bg-cyber-bg/50 border border-cyber-border p-3">
                      <p className="text-xs font-bold text-cyber-muted mb-2">Evidence ({reqEvidence.length}):</p>
                      <div className="space-y-1.5">
                        {reqEvidence.map(ev => (
                          <div key={ev.id} className="flex items-center gap-2 text-xs">
                            <span className="rounded bg-cyber-primary/10 text-cyber-primary px-1.5 py-0.5 text-[9px] font-medium uppercase">{ev.evidence_type}</span>
                            <span className="text-cyber-text truncate flex-1">{ev.file_name || ev.description || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {c.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-cyber-success mb-4 flex items-center gap-2"><CheckCircle size={18} /> Compliant Requirements ({c.length})</h3>
          <div className="space-y-2">
            {c.map(cs => {
              const req = reqs.find(r => r.id === cs.requirement_id);
              if (!req) return null;
              const reqEvidence = allEvidence.filter(ev => ev.requirement_id === cs.requirement_id);
              return (
                <div key={cs.id} className="glass-card rounded-xl p-4 border-l-4 border-cyber-success/30">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-cyber-success mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-cyber-success">{req.id.toUpperCase()}</span>
                      <p className="text-xs text-cyber-text">{req.text}</p>
                    </div>
                  </div>
                  {reqEvidence.length > 0 && (
                    <div className="mt-2 ml-6 flex flex-wrap gap-1.5">
                      {reqEvidence.map(ev => (
                        <span key={ev.id} className="inline-flex items-center gap-1 rounded bg-cyber-success/10 text-cyber-success px-1.5 py-0.5 text-[9px]">
                          <FileUp size={8} />{ev.file_name || ev.description || ev.evidence_type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {nc.length === 0 && c.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <CheckCircle className="text-cyber-success mx-auto mb-3" size={40} />
          <p className="text-sm text-cyber-muted">No requirements have been assessed yet for this control.</p>
        </div>
      )}
    </div>
  );
}

function DynIcon({ name, className, size }) { const Icon = iconMap[name]; return Icon ? <Icon className={className} size={size} /> : null; }

function RiskReportCard({ cs }) {
  return (<div className="glass-card rounded-xl p-6 border-l-4 border-cyber-danger/30"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-danger/10 border border-cyber-danger/20"><DynIcon name={cs.icon} className="text-cyber-danger" size={20} /></div><div><h4 className="text-sm font-bold text-cyber-text">{cs.name}</h4><p className="text-xs text-cyber-muted">ML{cs.highestLevel} \u2022 {cs.compliant}/{cs.total} ({cs.pct}%)</p></div></div><span className="rounded-full bg-cyber-danger/10 px-3 py-1 text-xs font-bold text-cyber-danger">{100 - cs.pct}% at risk</span></div><div className="h-2 rounded-full bg-cyber-border overflow-hidden mb-4"><div className="h-full rounded-full bg-cyber-danger transition-all" style={{ width: cs.pct + '%' }} /></div><h5 className="text-xs font-bold uppercase tracking-wider text-cyber-muted mb-2">Missing Requirements ({cs.missingReqs.length})</h5><div className="space-y-3">{cs.missingReqs.map((mr, i) => (<div key={i} className="rounded-lg border border-cyber-danger/20 bg-cyber-danger/5 p-3"><div className="flex items-start gap-2 mb-1"><XCircle size={14} className="text-cyber-danger mt-0.5 shrink-0" /><p className="text-xs font-medium text-cyber-text">{mr.text}</p></div>{mr.notes && <p className="text-[10px] text-cyber-muted italic mb-1 ml-5">Note: {mr.notes}</p>}<div className="ml-5 mt-2 rounded bg-cyber-bg/50 p-2"><p className="text-[10px] font-bold text-cyber-secondary mb-0.5">Recommendation:</p><p className="text-[10px] text-cyber-text">{mr.implementation}</p></div></div>))}</div></div>);
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
    const missingReqs = (audit?.nonCompliantReqs || []).map(nc => { const s = strategies.find(x => x.id === id); const ml = s?.maturityLevels.find(m => m.level === highestLevel); const req = ml?.requirements.find(r => r.id === nc.requirement_id); return { id: nc.requirement_id, text: req?.text || nc.requirement_id, notes: req?.notes, implementation: req?.implementation || '' }; });
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
      const pw = doc.internal.pageSize.getWidth(); const m = 15; const cw = pw - m * 2; let y = m;
      function check(needed) { if (y + needed > doc.internal.pageSize.getHeight() - m) { doc.addPage(); y = m; } }
      doc.setFontSize(18); doc.setTextColor(0, 0, 0); doc.text('Essential Eight - Overall Compliance Report', m, y); y += 8;
      doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text('Generated: ' + new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'), m, y); y += 10;
      doc.setFillColor(245, 245, 245); doc.roundedRect(m, y, cw, 28, 2, 2, 'F');
      doc.setFontSize(11); doc.setTextColor(0, 0, 0); doc.text('Executive Summary', m + 4, y + 6);
      doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      doc.text('Overall Compliance: ' + overallPct + '%', m + 4, y + 12);
      doc.text('Compliant: ' + totalCompliant + ' / ' + totalReqs, m + 4, y + 17);
      doc.text('Controls Assessed: ' + controlSummaries.filter(c => c.hasAudit).length + ' / 8', m + 70, y + 12);
      doc.text('Incomplete: ' + ncControls.length, m + 70, y + 17);
      doc.text('Fully Compliant: ' + cControls.length, m + 130, y + 12);
      doc.text('Not Assessed: ' + uControls.length, m + 130, y + 17);
      y += 34;
      check(20); doc.setFontSize(12); doc.setTextColor(0, 0, 0); doc.text('Compliance by Control', m, y); y += 6;
      autoTable(doc, { startY: y, head: [['Control', 'ML', 'Compliant', 'Total', '%']], body: controlSummaries.map(cs => [cs.name, cs.hasAudit ? 'ML' + cs.highestLevel : 'N/A', cs.hasAudit ? String(cs.compliant) : '-', cs.hasAudit ? String(cs.total) : '-', cs.hasAudit ? cs.pct + '%' : '-']), margin: { left: m, right: m }, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [30, 45, 80], textColor: 255, fontStyle: 'bold' }, alternateRowStyles: { fillColor: [245, 247, 250] } });
      y = doc.lastAutoTable.finalY + 10;
      if (ncControls.length > 0) {
        check(20); doc.setFontSize(12); doc.setTextColor(180, 0, 0); doc.text('Risk Report - Incomplete Controls (' + ncControls.length + ')', m, y); y += 8;
        for (const cs of ncControls) {
          check(30); doc.setFontSize(10); doc.setTextColor(0, 0, 0); doc.text(cs.name + ' - ML' + cs.highestLevel + ' (' + cs.pct + '%)', m, y); y += 6;
          if (cs.missingReqs.length > 0) { autoTable(doc, { startY: y, head: [['ID', 'Description', 'Recommendation']], body: cs.missingReqs.map(mr => [mr.id.toUpperCase(), mr.text.substring(0, 120), mr.implementation.substring(0, 120)]), margin: { left: m, right: m }, styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' }, headStyles: { fillColor: [180, 50, 50], textColor: 255, fontStyle: 'bold' }, columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 75 }, 2: { cellWidth: 'auto' } } }); y = doc.lastAutoTable.finalY + 8; }
        }
      }
      if (cControls.length > 0) { check(20); doc.setFontSize(12); doc.setTextColor(0, 150, 0); doc.text('Fully Compliant (' + cControls.length + ')', m, y); y += 6; autoTable(doc, { startY: y, head: [['Control', 'ML', 'Status']], body: cControls.map(cs => [cs.name, 'ML' + cs.highestLevel, '100%']), margin: { left: m, right: m }, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [50, 130, 50], textColor: 255, fontStyle: 'bold' } }); y = doc.lastAutoTable.finalY + 10; }
      if (uControls.length > 0) { check(20); doc.setFontSize(12); doc.setTextColor(120, 120, 120); doc.text('Not Assessed (' + uControls.length + ')', m, y); y += 6; autoTable(doc, { startY: y, head: [['Control', 'Status']], body: uControls.map(cs => [cs.name, 'No audit']), margin: { left: m, right: m }, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [120, 120, 120], textColor: 255, fontStyle: 'bold' } }); y = doc.lastAutoTable.finalY + 10; }
      const tp = doc.getNumberOfPages();
      for (let i = 1; i <= tp; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(150, 150, 150); doc.text('Essential Eight Compliance Report - Page ' + i + ' of ' + tp, m, doc.internal.pageSize.getHeight() - 8); doc.text('ACSC Essential Eight', pw - m, doc.internal.pageSize.getHeight() - 8, { align: 'right' }); }
      doc.save('essential-eight-report-' + new Date().toISOString().slice(0, 10) + '.pdf');
    } catch (err) { console.error('PDF failed:', err); alert('Failed: ' + err.message); }
    setGenerating(false);
  }
  return (<div className="mx-auto max-w-5xl px-4 py-8"><Link to="/audit" className="inline-flex items-center gap-1 text-sm text-cyber-muted hover:text-cyber-primary mb-6 transition-colors"><ArrowLeft size={14} /> Back</Link>
    <div className="flex items-center justify-between mb-2"><h2 className="text-2xl font-bold text-cyber-text">Overall Compliance Report</h2><button onClick={generatePDF} disabled={generating} className="flex items-center gap-2 rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 disabled:opacity-50 transition-colors">{generating ? 'Generating...' : 'Download PDF'}</button></div>
    <p className="text-cyber-muted text-sm mb-8">Compliance across all 8 Essential Eight controls by maturity level</p>
    <div className="glass-card rounded-xl p-6 mb-8 border-l-4 border-cyber-primary/30"><h3 className="text-lg font-bold text-cyber-text mb-4">Summary</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><div className="text-center"><div className="text-3xl font-bold text-cyber-primary">{overallPct}%</div><div className="text-xs text-cyber-muted">Overall</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-success">{totalCompliant}</div><div className="text-xs text-cyber-muted">Compliant</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-text">{totalReqs}</div><div className="text-xs text-cyber-muted">Assessed</div></div><div className="text-center"><div className="text-3xl font-bold text-cyber-secondary">{controlSummaries.filter(c => c.hasAudit).length}/8</div><div className="text-xs text-cyber-muted">Controls</div></div></div><div className="h-3 rounded-full bg-cyber-border overflow-hidden"><div className={"h-full rounded-full transition-all " + (overallPct === 100 ? 'bg-cyber-success' : overallPct >= 50 ? 'bg-cyber-warning' : 'bg-cyber-danger')} style={{ width: overallPct + '%' }} /></div></div>
    {ncControls.length > 0 && (<div className="mb-8"><h3 className="text-lg font-bold text-cyber-danger mb-4 flex items-center gap-2"><AlertTriangle size={18} /> Risk Report ({ncControls.length})</h3><div className="space-y-6">{ncControls.map(cs => <RiskReportCard key={cs.id} cs={cs} />)}</div></div>)}
    {cControls.length > 0 && <div className="mb-8"><h3 className="text-lg font-bold text-cyber-success mb-4 flex items-center gap-2"><CheckCircle size={18} /> Fully Compliant ({cControls.length})</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{cControls.map(cs => (<div key={cs.id} className="glass-card rounded-xl p-4 border-l-4 border-cyber-success/30"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-success/10 border border-cyber-success/20"><DynIcon name={cs.icon} className="text-cyber-success" size={16} /></div><div className="flex-1"><h4 className="text-sm font-bold text-cyber-text">{cs.name}</h4><p className="text-xs text-cyber-muted">ML{cs.highestLevel} \u2022 100%</p></div><CheckCircle className="text-cyber-success" size={18} /></div></div>))}</div></div>}
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
  useEffect(() => {
    const handler = (e) => { if (e.data && e.data.type === 'audit-workflow-closed') { } };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  return (<div className="min-h-screen bg-cyber-bg text-cyber-text"><Header onSearchClick={() => setSearchOpen(true)} /><Routes><Route path="/" element={<Dashboard />} /><Route path="/strategy/:strategyId" element={<StrategyDetail />} /><Route path="/strategy/:strategyId/maturity/:level" element={<MaturityView />} /><Route path="/audit" element={<AuditHome />} /><Route path="/audit/workflow/:groupId" element={<AuditWorkflowPage />} /><Route path="/audit/overall-report" element={<OverallComplianceReport />} /><Route path="/audit/:auditId/report" element={<AuditReportWrapper />} /><Route path="/audit/:auditId" element={<AuditWorkflowWrapper />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>{searchOpen && <SearchModal query={search.query} setQuery={search.setQuery} results={search.results} onClose={() => { setSearchOpen(false); search.setQuery(''); }} />}<div className="fixed bottom-3 left-3 z-30"><span className="rounded bg-cyber-card/80 border border-cyber-border px-2 py-1 text-[10px] text-cyber-muted backdrop-blur-sm">v{APP_VERSION}</span></div></div>);
}
function AuditWorkflowWrapper() { const { auditId } = useParams(); return <AuditWorkflow auditId={parseInt(auditId)} />; }
function AuditReportWrapper() { const { auditId } = useParams(); return <AuditReport auditId={parseInt(auditId)} />; }


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
      const [a, s, e] = await Promise.all([apiFetch('/audits/' + auditId), apiFetch('/audits/' + auditId + '/requirements'), apiFetch('/audits/' + auditId + '/evidence')]);
      setAudit(a);
      const sm = {}; s.forEach(rs => { sm[rs.requirement_id] = rs; }); setStatuses(sm);
      const em = {}; e.forEach(ev => { if (!em[ev.requirement_id]) em[ev.requirement_id] = []; em[ev.requirement_id].push(ev); }); setEvidence(em);
    } catch (err) { console.error(err); }
  }, [auditId]);
  useEffect(() => { if (!loadedRef.current) { loadedRef.current = true; loadAudit(); } }, [loadAudit]);
  async function setCompliant(reqId, compliant, notes) {
    if (audit?.locked) return; setSaving(true);
    try { const s = await apiFetch('/audits/' + auditId + '/requirements/' + reqId, { method: 'PUT', body: JSON.stringify({ compliant, notes }) }); setStatuses(p => ({ ...p, [reqId]: s })); if (currentStep < tc - 1) setTimeout(() => setCurrentStep(prev => prev + 1), 300); } catch (err) { console.error(err); }
    setSaving(false);
  }
  async function uploadEvidence(reqId, type, desc, file) {
    if (audit?.locked) return;
    const fd = new FormData(); fd.append('requirementId', reqId); fd.append('evidenceType', type); fd.append('description', desc); if (file) fd.append('file', file);
    try { await fetch(API + '/audits/' + auditId + '/evidence', { method: 'POST', body: fd }); const u = await apiFetch('/audits/' + auditId + '/evidence?requirementId=' + reqId); setEvidence(p => ({ ...p, [reqId]: u })); } catch (err) { console.error(err); }
  }
  async function removeEvidence(evId) { if (audit?.locked) return; try { await apiFetch('/evidence/' + evId, { method: 'DELETE' }); loadAudit(); } catch (err) { console.error(err); } }
  async function completeAuditFn() {
    await apiFetch('/audits/' + auditId + '/status', { method: 'PUT', body: JSON.stringify({ status: 'completed' }) });
    const updated = await apiFetch('/audits/' + auditId); setAudit(updated); setShowLockModal(true);
  }
  async function lockAuditFn() {
    if (!lockPassword.trim()) { setLockError('Password required'); return; }
    try { await apiFetch('/audits/' + auditId + '/lock', { method: 'PUT', body: JSON.stringify({ password: lockPassword }) }); setShowLockModal(false); loadAudit(); } catch (e) { setLockError(e.message); }
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
      <div className="glass-card rounded-xl p-4 mb-6"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-cyber-text">{cc}/{tc} compliant</span><span className="text-sm font-medium text-cyber-primary">{pct}%</span></div><div className="h-2 rounded-full bg-cyber-border overflow-hidden"><div className="h-full rounded-full bg-cyber-primary transition-all" style={{ width: pct + '%' }} /></div><div className="flex gap-1 mt-3">{reqs.map((req, i) => (<button key={req.id} onClick={() => setCurrentStep(i)} className={"h-2 flex-1 rounded-full transition-colors " + (i === currentStep ? 'bg-cyber-primary' : statuses[req.id]?.compliant ? 'bg-cyber-success' : statuses[req.id] ? 'bg-cyber-danger' : 'bg-cyber-border')} />))}</div></div>
      {currentReq && <RequirementAssessment requirement={currentReq} status={statuses[currentReq.id]} evidence={evidence[currentReq.id] || []} onCompliant={(c, n) => setCompliant(currentReq.id, c, n)} onEvidence={(t, d, f) => uploadEvidence(currentReq.id, t, d, f)} onRemoveEvidence={removeEvidence} saving={saving} locked={!!audit.locked} />}
      <div className="flex items-center justify-between mt-6"><button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text disabled:opacity-30 transition-colors">Previous</button><span className="text-xs text-cyber-muted">{currentStep + 1} of {tc}</span>{currentStep < tc - 1 ? (<button onClick={() => setCurrentStep(currentStep + 1)} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">Next</button>) : audit.status !== 'completed' ? (<button onClick={completeAuditFn} className="rounded-lg bg-cyber-success/20 border border-cyber-success/30 px-4 py-2 text-sm font-medium text-cyber-success hover:bg-cyber-success/30 transition-colors">Complete Audit</button>) : (<Link to={'/audit/' + auditId + '/report'} className="rounded-lg bg-cyber-primary/20 border border-cyber-primary/30 px-4 py-2 text-sm font-medium text-cyber-primary hover:bg-cyber-primary/30 transition-colors">View Report</Link>)}</div>
      {showLockModal && (<div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"><div className="glass-card rounded-xl p-6 max-w-sm w-full border border-cyber-warning/30"><h3 className="text-lg font-bold text-cyber-warning mb-2 flex items-center gap-2"><LockIcon size={18} />Lock Audit</h3><p className="text-xs text-cyber-muted mb-4">Once locked, this audit cannot be edited.</p><input type="password" value={lockPassword} onChange={e => setLockPassword(e.target.value)} placeholder="Enter password" className="w-full rounded-lg border border-cyber-border bg-cyber-bg px-3 py-2 text-sm text-cyber-text placeholder-cyber-muted outline-none focus:border-cyber-warning/50 mb-2" />{lockError && <p className="mb-2 text-xs text-cyber-danger">{lockError}</p>}<div className="flex gap-3"><button onClick={lockAuditFn} className="rounded-lg bg-cyber-warning/20 border border-cyber-warning/30 px-4 py-2 text-sm font-medium text-cyber-warning hover:bg-cyber-warning/30 transition-colors">Lock</button><button onClick={() => setShowLockModal(false)} className="rounded-lg border border-cyber-border px-4 py-2 text-sm text-cyber-muted hover:text-cyber-text transition-colors">Cancel</button></div></div></div>)}
    </div>
  );
}
