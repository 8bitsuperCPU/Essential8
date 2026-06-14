import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, Routes, Route, useParams, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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
const APP_VERSION = '2.4.0';
const iconMap = { Shield, Clock, FileCode, UserCheck, Lock, Monitor, KeyRound, Database };

const WORKFLOW_CONTROLS = [
  'patch_applications',
  'application_control',
  'restrict_macros',
  'user_application_hardening',
  'patch_operating_systems',
  'multi_factor_authentication',
  'restrict_admin_privileges',
  'regular_backups',
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
