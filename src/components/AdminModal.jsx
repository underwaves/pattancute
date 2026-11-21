import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  BarChart3,
  Store,
  Camera,
  Music,
  Layers,
  Share2,
  MessageSquare,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  RotateCcw,
  LogOut,
  ExternalLink,
  Save,
  Plus,
  Volume2,
  ShieldCheck,
  Heart,
  Eye,
  EyeOff,
  KeyRound,
  Tag,
} from 'lucide-react';
import { defaultSettings, defaultPricing } from '../config';

export function AdminModal({
  isOpen,
  onClose,
  settings,
  stats,
  onSettingsUpdated,
  onLogoUpdated,
  onReviewDeleted,
}) {
  const [token, setToken] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'content' | 'logo' | 'music' | 'bento' | 'contacts' | 'reviews'

  // Draft form settings state
  const [form, setForm] = useState(defaultSettings);
  const [newQuoteInput, setNewQuoteInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [adminAppId, setAdminAppId] = useState('netflix');

  // Logo Tab State
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  // Reviews Tab State
  const [reviewsList, setReviewsList] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Authentication & Security Tab State
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Sync settings prop into local form draft
  useEffect(() => {
    if (settings) {
      setForm((prev) => ({
        ...prev,
        ...settings,
        pricing: Array.isArray(settings.pricing) && settings.pricing.length > 0
          ? settings.pricing
          : (prev.pricing || defaultPricing),
        music: { ...prev.music, ...(settings.music || {}) },
        bento: { ...prev.bento, ...(settings.bento || {}) },
        contacts: {
          ...prev.contacts,
          ...(settings.contacts || {}),
          line: { ...prev.contacts.line, ...(settings.contacts?.line || {}) },
          instagram: { ...prev.contacts.instagram, ...(settings.contacts?.instagram || {}) },
          facebook: { ...prev.contacts.facebook, ...(settings.contacts?.facebook || {}) },
          tiktok: { ...prev.contacts.tiktok, ...(settings.contacts?.tiktok || {}) },
        },
      }));
    }
  }, [settings]);

  // Auto-dismiss status message after 3.5s
  useEffect(() => {
    if (!statusMessage.text) return;
    const timer = setTimeout(() => {
      setStatusMessage({ text: '', type: '' });
    }, 3500);
    return () => clearTimeout(timer);
  }, [statusMessage.text]);

  // Auto-dismiss password message after 3.5s
  useEffect(() => {
    if (!passwordMsg.text) return;
    const timer = setTimeout(() => {
      setPasswordMsg({ text: '', type: '' });
    }, 3500);
    return () => clearTimeout(timer);
  }, [passwordMsg.text]);

  // Load saved token from localStorage whenever modal opens
  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem('admin_token') || '';
    if (saved) {
      setToken(saved);
      setIsAuthed(true);
    }
  }, [isOpen]);

  // Fetch reviews when reviews tab is active or modal opened
  useEffect(() => {
    if (!isOpen || !isAuthed) return;
    loadReviews();
  }, [isOpen, isAuthed]);

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await fetch('/api/reviews?limit=50');
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data.reviews || []);
      }
    } catch (e) {
      console.warn('Failed to load reviews for admin:', e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้งค่ะ');
      }

      localStorage.setItem('admin_token', token.trim());
      setIsAuthed(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsAuthed(false);
    setLoginError('');
  };

  // Change Admin Password Handler
  const handleChangePassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (!newPassword.trim()) {
      setPasswordMsg({ text: 'กรุณากรอกรหัสผ่านใหม่ที่ต้องการค่ะ', type: 'error' });
      return;
    }

    if (newPassword.trim().length < 4) {
      setPasswordMsg({ text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษรค่ะ', type: 'error' });
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setPasswordMsg({ text: 'รหัสผ่านใหม่กับยืนยันรหัสผ่านไม่ตรงกันค่ะ', type: 'error' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');

      const updated = data.newToken || newPassword.trim();
      setToken(updated);
      localStorage.setItem('admin_token', updated);
      setPasswordMsg({
        text: 'เปลี่ยนรหัสผ่านหลังบ้านเรียบร้อยแล้วค่ะ! ครั้งถัดไปใช้รหัสใหม่นี้เข้าสู่ระบบได้เลยค่ะ 🌸✨',
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ text: err.message, type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 1. Save All Settings to Backend
  const handleSaveAll = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStatusMessage({ text: '', type: '' });
    setIsSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({ settings: form }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'บันทึกการตั้งค่าไม่สำเร็จ');

      setStatusMessage({
        text: 'บันทึกการตั้งค่าร้านทั้งหมดเรียบร้อยแล้วค่ะ! 🌸✨',
        type: 'success',
      });
      if (onSettingsUpdated) onSettingsUpdated(data.settings);

      setTimeout(() => {
        setStatusMessage({ text: '', type: '' });
      }, 4000);
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Logo Upload Handlers
  const handleLogoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type.toLowerCase())) {
      setStatusMessage({ text: 'รองรับเฉพาะไฟล์รูปภาพ JPG, PNG หรือ WebP ค่ะ', type: 'error' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ text: 'ขนาดไฟล์ต้องไม่เกิน 5MB ค่ะ', type: 'error' });
      return;
    }

    setStatusMessage({ text: '', type: '' });
    setSelectedLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!selectedLogoFile) {
      setStatusMessage({ text: 'กรุณาเลือกไฟล์รูปภาพก่อนค่ะ', type: 'error' });
      return;
    }

    setIsUploadingLogo(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('logo', selectedLogoFile);

      const res = await fetch('/api/logo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'อัปโหลดโลโก้ไม่สำเร็จ');

      setStatusMessage({ text: 'เปลี่ยนรูปโลโก้ร้านสำเร็จแล้วค่ะ! 🌸', type: 'success' });
      setForm((prev) => ({ ...prev, logoUrl: data.logoUrl }));
      if (onLogoUpdated) onLogoUpdated(data.logoUrl);
      setSelectedLogoFile(null);
      setLogoPreviewUrl('');
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleResetLogo = async () => {
    setIsUploadingLogo(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/logo', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'รีเซ็ตโลโก้ไม่สำเร็จ');

      setStatusMessage({ text: 'รีเซ็ตโลโก้กลับเป็นค่าเริ่มต้นเรียบร้อยแล้วค่ะ', type: 'success' });
      setForm((prev) => ({ ...prev, logoUrl: '/logo.png' }));
      if (onLogoUpdated) onLogoUpdated('/logo.png');
      setSelectedLogoFile(null);
      setLogoPreviewUrl('');
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // 3. Delete Review Handler (Spam Moderation)
  const handleDeleteReview = async (id) => {
    setDeletingReviewId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ลบรีวิวไม่สำเร็จ');

      setReviewsList((prev) => prev.filter((r) => r.id !== id));
      setStatusMessage({ text: 'ลบรีวิวสแปมเรียบร้อยแล้วค่ะ', type: 'success' });
      if (onReviewDeleted) onReviewDeleted();
    } catch (err) {
      setStatusMessage({ text: err.message, type: 'error' });
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Mascot quotes management
  const handleAddQuote = () => {
    const trimmed = newQuoteInput.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      mascotQuotes: [...(prev.mascotQuotes || []), trimmed],
    }));
    setNewQuoteInput('');
  };

  const handleRemoveQuote = (index) => {
    setForm((prev) => ({
      ...prev,
      mascotQuotes: (prev.mascotQuotes || []).filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl border border-white/80 dark:border-slate-800 flex flex-col overflow-hidden relative">
        
        {/* 1. Dashboard Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pattan-blue to-pattan-pink text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-pattan-blue-deep dark:text-white leading-tight">
                  ระบบจัดการหลังบ้าน (Admin Dashboard)
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[10px] font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ออนไลน์ปกติ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {form.shopSubtitle || 'Pattancute.shop'} • จัดการข้อมูลและปรับแต่งหน้าร้าน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthed && (
              <>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pattan-blue transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ดูหน้าเว็บจริง</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <button
                  onClick={handleLogout}
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition flex items-center gap-1.5"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
              aria-label="ปิดหน้าต่างแดชบอร์ด"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Normal & Clean Floating Toast Notification */}
        {statusMessage.text && (
          <div className="absolute top-16 left-1/2 z-50 animate-toast max-w-md w-[92%] sm:w-auto pointer-events-auto">
            <div
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-lg bg-white dark:bg-slate-800 border ${
                statusMessage.type === 'success'
                  ? 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/60 shadow-emerald-500/10'
                  : 'text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700/60 shadow-rose-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="truncate">{statusMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage({ text: '', type: '' })}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer shrink-0"
                aria-label="ปิดการแจ้งเตือน"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Authentication View (if not logged in) */}
        {!isAuthed ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#FCFAF6] to-white dark:from-slate-900 dark:to-slate-950">
            <div className="card-bento w-full max-w-sm p-7 text-center shadow-lg bg-white dark:bg-slate-800">
              <div className="w-14 h-14 rounded-3xl bg-pattan-blue/10 dark:bg-slate-700 mx-auto flex items-center justify-center text-pattan-blue mb-4 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-pattan-blue-deep dark:text-white mb-1.5">
                เข้าสู่ระบบแดชบอร์ด
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                กรุณากรอกรหัสผ่าน Admin Token เพื่อเข้าสู่ระบบจัดการและแก้ไขข้อมูลทั้งเว็บไซต์ค่ะ
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2 text-left">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}
                <input
                  type="password"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="กรอกรหัส Admin Token หลังบ้าน"
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-pattan-blue/30"
                />
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="btn-jelly w-full h-11 rounded-full bg-gradient-to-r from-pattan-blue to-pattan-pink text-white font-bold text-sm shadow-jelly flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoggingIn ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* 3. Logged-in Full Dashboard Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/60 dark:bg-slate-950/60">
            
            {/* Sidebar / Tabs (Desktop: Left column, Mobile: Horizontal scroll) */}
            <div className="w-full md:w-60 md:shrink-0 bg-white/70 dark:bg-slate-900/70 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-2 md:p-3 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 shrink-0">
              {[
                { id: 'overview', label: 'ภาพรวมระบบ', icon: BarChart3, desc: 'สถิติและสถานะร้าน' },
                { id: 'content', label: 'ข้อมูลร้าน & ข้อความ', icon: Store, desc: 'ชื่อร้าน คำโปรย น้องลิง' },
                { id: 'pricing', label: 'เรทราคาแอพ', icon: Tag, desc: 'แพ็กเกจและราคาแอพ' },
                { id: 'logo', label: 'โลโก้ร้าน', icon: Camera, desc: 'อัปโหลดรูปโลโก้' },
                { id: 'music', label: 'เพลงพื้นหลัง', icon: Music, desc: 'YouTube และระดับเสียง' },
                { id: 'bento', label: 'การ์ด Bento ไฮไลท์', icon: Layers, desc: 'การันตี และคำขอบคุณ' },
                { id: 'contacts', label: 'ช่องทางติดต่อ', icon: Share2, desc: 'LINE, IG, FB, TikTok' },
                { id: 'reviews', label: 'จัดการรีวิวลูกค้า', icon: MessageSquare, desc: 'ลบรีวิวสแปม' },
                { id: 'security', label: 'เปลี่ยนรหัสผ่าน', icon: KeyRound, desc: 'ตั้งรหัสผ่านใหม่' },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-left transition-all whitespace-nowrap md:whitespace-normal shrink-0 ${
                      active
                        ? 'bg-gradient-to-r from-pattan-blue to-[#6A94DC] text-white shadow-sm font-bold scale-[1.01]'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <span className="block text-xs leading-none">{tab.label}</span>
                      <span className={`hidden md:block text-[10px] mt-0.5 leading-none opacity-75`}>
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

                {/* TAB 1: OVERVIEW & STATS */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        ภาพรวมสถิติร้านค้า (Overview)
                      </h3>
                      <p className="text-xs text-slate-500">
                        สถิติความพึงพอใจและสถานะการตั้งค่าปัจจุบันของ Pattancute.shop
                      </p>
                    </div>

                    {/* Bento Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-100 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                          คะแนนเฉลี่ย
                        </span>
                        <div className="text-3xl font-black text-amber-900 dark:text-white font-display">
                          {stats?.average?.toFixed(1) || '5.0'}
                          <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-slate-800 border border-pink-100 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-pink-800 dark:text-pink-300 block mb-1">
                          รีวิวทั้งหมด
                        </span>
                        <div className="text-3xl font-black text-pink-900 dark:text-white font-display">
                          {stats?.total || 0}
                          <span className="text-xs text-slate-400 font-normal"> รายการ</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block mb-1">
                          เพลงพื้นหลัง
                        </span>
                        <div className="text-sm font-bold text-blue-900 dark:text-white truncate">
                          {form.music?.enabled ? 'เปิดใช้งาน' : 'ปิด'}
                        </div>
                        <span className="text-[10px] text-slate-400">YouTube Lofi</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                        <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                          ช่องทางติดต่อ
                        </span>
                        <div className="text-sm font-bold text-emerald-900 dark:text-white">
                          LINE หลัก
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {form.contacts?.line?.id || '@078yzbej'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Setting Summary Bento */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        สรุปการทำงานของระบบหลังบ้าน
                      </h4>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>
                            <strong>ข้อมูลทั้งหมดบันทึกลง Cloudflare D1:</strong> ปลอดภัย รวดเร็ว และอัปเดตหน้าเว็บทันที
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>
                            <strong>รูปภาพโลโก้เก็บใน Cloudflare R2:</strong> โหลดเร็วระดับ CDN ทั่วโลก
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-pattan-blue shrink-0" />
                          <span>
                            <strong>การันตีความโปร่งใส:</strong> รีวิวลูกค้าเก็บตรงจากผู้ซื้อจริง ไม่สามารถแก้ไขเนื้อหาได้ เพื่อความน่าเชื่อถือสูงสุดค่ะ
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 2: STORE CONTENT */}
                {activeTab === 'content' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        ข้อมูลร้าน & ข้อความหน้าเว็บ
                      </h3>
                      <p className="text-xs text-slate-500">
                        แก้ไขชื่อร้าน สโลแกน ป้ายต้อนรับ และคำโปรยหัวเว็บได้ตามต้องการ
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          ชื่อร้านค้า (Shop Name)
                        </label>
                        <input
                          type="text"
                          value={form.shopName || ''}
                          onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          โดเมน / ข้อความใต้ชื่อ (Domain / Subtitle)
                        </label>
                        <input
                          type="text"
                          value={form.shopSubtitle || ''}
                          onChange={(e) => setForm({ ...form, shopSubtitle: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          หัวข้อหลักกลางหน้าเว็บ (Hero Title)
                        </label>
                        <input
                          type="text"
                          value={form.heroTitle || ''}
                          placeholder={form.shopName || 'Pattancute'}
                          onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          ตัวหนังสือชื่อร้านขนาดใหญ่ตรงกลางหน้าเว็บ
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                          <span>ข้อความป้ายทักทายใต้โลโก้ (Greeting Bubble)</span>
                          <span className="text-emerald-500 font-normal text-[10px]">🟢 ป้ายใต้โลโก้</span>
                        </label>
                        <input
                          type="text"
                          value={form.welcomeBubble || ''}
                          placeholder="ยินดีต้อนรับน้า~ ✨"
                          onChange={(e) => setForm({ ...form, welcomeBubble: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          ข้อความในป้ายกลมสีขาวใต้โลโก้ เช่น "ยินดีต้อนรับน้า~ ✨"
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        ข้อความป้ายต้อนรับด้านบน (Welcome Banner Chip)
                      </label>
                      <input
                        type="text"
                        value={form.welcomeChip || ''}
                        onChange={(e) => setForm({ ...form, welcomeChip: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        คำโปรยบรรยายใต้หัวข้อ (Hero Tagline)
                      </label>
                      <input
                        type="text"
                        value={form.heroSubtitle || ''}
                        onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                        ข้อความปุ่มกดรีวิวหลัก (CTA Button Text)
                      </label>
                      <input
                        type="text"
                        value={form.heroCtaText || ''}
                        onChange={(e) => setForm({ ...form, heroCtaText: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                      />
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          ข้อความป้ายการันตี 1 (Badge 1)
                        </label>
                        <input
                          type="text"
                          value={form.badgeTrust1 || ''}
                          onChange={(e) => setForm({ ...form, badgeTrust1: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          ข้อความป้ายการันตี 2 (Badge 2)
                        </label>
                        <input
                          type="text"
                          value={form.badgeTrust2 || ''}
                          onChange={(e) => setForm({ ...form, badgeTrust2: e.target.value })}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Mascot Quotes Manager */}
                    <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700">
                      <label className="block text-xs font-bold text-pattan-pink-deep dark:text-pattan-pink mb-2">
                        คำพูดน้องลิง Pattancute (สุ่มพูดเมื่อลูกค้าแตะเล่น)
                      </label>
                      
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newQuoteInput}
                          onChange={(e) => setNewQuoteInput(e.target.value)}
                          placeholder="พิมพ์ข้อความใหม่ให้น้องลิง..."
                          className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddQuote();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddQuote}
                          className="px-3 py-1.5 rounded-xl bg-pattan-pink text-white text-xs font-bold flex items-center gap-1 hover:opacity-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เพิ่ม</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(form.mascotQuotes || []).map((q, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs border border-pink-200/80 shadow-2xs"
                          >
                            <span>{q}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuote(idx)}
                              className="text-slate-400 hover:text-rose-500 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: LOGO & BRANDING */}
                {activeTab === 'logo' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        โลโก้และภาพแบรนด์ (Logo & Branding)
                      </h3>
                      <p className="text-xs text-slate-500">
                        อัปโหลดเปลี่ยนรูปโลโก้ร้านเพื่อนำไปแสดงผลทุกจุดบนเว็บไซต์
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      {/* Circular Live Preview */}
                      <div className="w-32 h-32 rounded-full p-2 bg-white shadow-bento border-4 border-white overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={logoPreviewUrl || form.logoUrl || '/logo.png'}
                          alt="Logo Preview"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>

                      <div className="flex-1 space-y-3 text-center sm:text-left">
                        <div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                            {logoPreviewUrl ? 'ตัวอย่างโลโก้ที่เลือก (ยังไม่ได้บันทึก)' : 'โลโก้ปัจจุบันที่ใช้งานอยู่'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            รองรับไฟล์ JPG, PNG, WebP ขนาดไม่เกิน 5MB
                          </span>
                        </div>

                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleLogoFileSelect}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pattan-blue/10 file:text-pattan-blue hover:file:bg-pattan-blue/20 cursor-pointer"
                        />

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleUploadLogo}
                            disabled={isUploadingLogo || !selectedLogoFile}
                            className="btn-jelly px-5 py-2 rounded-full bg-gradient-to-r from-pattan-blue to-pattan-pink text-white font-bold text-xs shadow-jelly flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isUploadingLogo ? 'กำลังอัปโหลด...' : 'บันทึกโลโก้ใหม่'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetLogo}
                            disabled={isUploadingLogo}
                            className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-rose-500 flex items-center gap-1 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>ใช้โลโก้เริ่มต้น (/logo.png)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MUSIC & SOUND */}
                {activeTab === 'music' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        เพลงพื้นหลัง (Background Music)
                      </h3>
                      <p className="text-xs text-slate-500">
                        ตั้งค่าเพลง YouTube ที่จะเล่นคลอเบา ๆ เมื่อมีลูกค้าเข้ามาเยี่ยมชมร้าน
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Enable Switch */}
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            เปิดใช้งานเพลงพื้นหลังในเว็บ
                          </span>
                          <span className="text-[11px] text-slate-500">
                            แสดงปุ่มเล่นเพลงน่ารัก ๆ ที่มุมขวาล่างของหน้าจอ
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={form.music?.enabled ?? true}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              music: { ...(form.music || {}), enabled: e.target.checked },
                            })
                          }
                          className="w-5 h-5 accent-pattan-pink rounded cursor-pointer"
                        />
                      </label>

                      {/* YouTube Link */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          ลิงก์เพลง YouTube (YouTube URL)
                        </label>
                        <input
                          type="url"
                          value={form.music?.youtubeUrl || ''}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              music: { ...(form.music || {}), youtubeUrl: e.target.value },
                            })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          รองรับลิงก์เพลง YouTube ทุกรูปแบบ (เช่น youtube.com/watch?v=..., youtu.be/...)
                        </span>
                      </div>

                      {/* Autoplay Toggle */}
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            เล่นเพลงอัตโนมัติ (Autoplay)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            เล่นเพลงทันทีเมื่อเข้าเว็บ หรือเมื่อลูกค้าแตะ/เลื่อนหน้าจอครั้งแรก
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={form.music?.autoplay ?? true}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              music: { ...(form.music || {}), autoplay: e.target.checked },
                            })
                          }
                          className="w-5 h-5 accent-pattan-blue rounded cursor-pointer"
                        />
                      </label>

                      {/* Volume Slider */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4 text-pattan-blue" />
                            <span>ระดับความดังเริ่มต้น</span>
                          </label>
                          <span className="text-xs font-mono font-bold text-pattan-blue">
                            {Math.round((form.music?.defaultVolume ?? 0.4) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="1.0"
                          step="0.05"
                          value={form.music?.defaultVolume ?? 0.4}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              music: {
                                ...(form.music || {}),
                                defaultVolume: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-pattan-pink cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: BENTO CARDS */}
                {activeTab === 'bento' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        การ์ด Bento & ไฮไลท์ร้าน
                      </h3>
                      <p className="text-xs text-slate-500">
                        ปรับแต่งเนื้อหาการ์ดรับประกันความน่าเชื่อถือ และการ์ดขอบคุณลูกค้า
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Guarantee Card Toggle */}
                      <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                            แสดงการ์ดการันตีความน่าเชื่อถือ
                          </span>
                          <span className="text-[11px] text-slate-500">
                            เปิด/ปิดการแสดงการ์ดการันตีในหน้าหลัก (ปิดไว้เพื่อความคลีน มินิมอล)
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={form.bento?.showGuarantee ?? false}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              bento: { ...(form.bento || {}), showGuarantee: e.target.checked },
                            })
                          }
                          className="w-5 h-5 accent-pattan-pink rounded cursor-pointer"
                        />
                      </label>

                      {/* Guarantee Card */}
                      {form.bento?.showGuarantee && (
                        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-3">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>การ์ดการันตีความน่าเชื่อถือ (Bento Card 3)</span>
                          </span>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              หัวข้อการ์ด
                            </label>
                            <input
                              type="text"
                              value={form.bento?.guaranteeTitle || ''}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  bento: { ...(form.bento || {}), guaranteeTitle: e.target.value },
                                })
                              }
                              className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                              เนื้อหาบรรยาย
                            </label>
                            <textarea
                              rows={2}
                              value={form.bento?.guaranteeDesc || ''}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  bento: { ...(form.bento || {}), guaranteeDesc: e.target.value },
                                })
                              }
                              className="w-full p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Thank You Card */}
                      <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800 border border-pink-100 dark:border-slate-700 space-y-3">
                        <span className="text-xs font-bold text-pink-800 dark:text-pink-300 flex items-center gap-1.5">
                          <Heart className="w-4 h-4" />
                          <span>การ์ดขอบคุณลูกค้า (Bento Card 4)</span>
                        </span>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            หัวข้อการ์ด
                          </label>
                          <input
                            type="text"
                            value={form.bento?.thankYouTitle || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                bento: { ...(form.bento || {}), thankYouTitle: e.target.value },
                              })
                            }
                            className="w-full h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                            เนื้อหาบรรยาย
                          </label>
                          <textarea
                            rows={2}
                            value={form.bento?.thankYouDesc || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                bento: { ...(form.bento || {}), thankYouDesc: e.target.value },
                              })
                            }
                            className="w-full p-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: CONTACTS & SOCIALS */}
                {activeTab === 'contacts' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        ช่องทางติดต่อและโซเชียลมีเดีย
                      </h3>
                      <p className="text-xs text-slate-500">
                        เปิด/ปิด และแก้ไขลิงก์ LINE, Instagram, Facebook และ TikTok
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Badge Text */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                          ข้อความป้ายหัวข้อส่วนติดต่อ (Contact Header Badge)
                        </label>
                        <input
                          type="text"
                          value={form.contacts?.badgeText || ''}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              contacts: { ...(form.contacts || {}), badgeText: e.target.value },
                            })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                        />
                      </div>

                      {/* LINE */}
                      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            🟢 LINE Official Account (ช่องทางหลัก)
                          </span>
                          <input
                            type="checkbox"
                            checked={form.contacts?.line?.enabled ?? true}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  line: {
                                    ...(form.contacts?.line || {}),
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.contacts?.line?.id || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  line: { ...(form.contacts?.line || {}), id: e.target.value },
                                },
                              })
                            }
                            placeholder="LINE ID เช่น @078yzbej"
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                          <input
                            type="url"
                            value={form.contacts?.line?.url || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  line: { ...(form.contacts?.line || {}), url: e.target.value },
                                },
                              })
                            }
                            placeholder="ลิงก์ LINE เช่น https://line.me/R/ti/p/@078yzbej"
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>

                      {/* Instagram */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            📸 Instagram
                          </span>
                          <input
                            type="checkbox"
                            checked={form.contacts?.instagram?.enabled ?? false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  instagram: {
                                    ...(form.contacts?.instagram || {}),
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 accent-pattan-pink rounded cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.contacts?.instagram?.handle || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  instagram: {
                                    ...(form.contacts?.instagram || {}),
                                    handle: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="IG Handle เช่น @pattancute"
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                          <input
                            type="url"
                            value={form.contacts?.instagram?.url || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  instagram: {
                                    ...(form.contacts?.instagram || {}),
                                    url: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="ลิงก์ Instagram เช่น https://instagram.com/..."
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>

                      {/* Facebook */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            📘 Facebook Page
                          </span>
                          <input
                            type="checkbox"
                            checked={form.contacts?.facebook?.enabled ?? false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  facebook: {
                                    ...(form.contacts?.facebook || {}),
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 accent-pattan-blue rounded cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.contacts?.facebook?.handle || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  facebook: {
                                    ...(form.contacts?.facebook || {}),
                                    handle: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="ชื่อเพจ Facebook"
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                          <input
                            type="url"
                            value={form.contacts?.facebook?.url || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  facebook: {
                                    ...(form.contacts?.facebook || {}),
                                    url: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="ลิงก์ Facebook เช่น https://facebook.com/..."
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>

                      {/* TikTok */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            🎵 TikTok
                          </span>
                          <input
                            type="checkbox"
                            checked={form.contacts?.tiktok?.enabled ?? false}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  tiktok: {
                                    ...(form.contacts?.tiktok || {}),
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="w-4 h-4 accent-slate-800 rounded cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={form.contacts?.tiktok?.handle || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  tiktok: {
                                    ...(form.contacts?.tiktok || {}),
                                    handle: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="TikTok Handle เช่น @pattancute"
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                          <input
                            type="url"
                            value={form.contacts?.tiktok?.url || ''}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                contacts: {
                                  ...(form.contacts || {}),
                                  tiktok: {
                                    ...(form.contacts?.tiktok || {}),
                                    url: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="ลิงก์ TikTok เช่น https://tiktok.com/@..."
                            className="h-9 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: APP PRICING (เรทราคาแยกเป็นแอพ) */}
                {activeTab === 'pricing' && (() => {
                  const pricingList = Array.isArray(form.pricing) && form.pricing.length > 0
                    ? form.pricing
                    : defaultPricing;
                  
                  const activeApp = pricingList.find((a) => a.id === adminAppId) || pricingList[0] || {};
                  const activeIndex = pricingList.findIndex((a) => a.id === (activeApp.id || adminAppId));

                  const updateActiveApp = (updatedFields) => {
                    const next = [...pricingList];
                    if (activeIndex >= 0) {
                      next[activeIndex] = { ...next[activeIndex], ...updatedFields };
                      setForm({ ...form, pricing: next });
                    }
                  };

                  const updatePlan = (planIdx, updatedFields) => {
                    const currentPlans = [...(activeApp.plans || [])];
                    currentPlans[planIdx] = { ...currentPlans[planIdx], ...updatedFields };
                    updateActiveApp({ plans: currentPlans });
                  };

                  const deletePlan = (planIdx) => {
                    const currentPlans = (activeApp.plans || []).filter((_, idx) => idx !== planIdx);
                    updateActiveApp({ plans: currentPlans });
                  };

                  const addPlan = () => {
                    const currentPlans = [...(activeApp.plans || [])];
                    const newPlan = {
                      id: `${activeApp.id}-plan-${Date.now()}`,
                      name: 'แพ็กเกจใหม่ 30 วัน',
                      price: '99',
                      originalPrice: '',
                      period: '30 วัน',
                      badge: 'ยอดนิยม 🔥',
                      features: ['รองรับทุกอุปกรณ์', 'ความชัดระดับคมชัดสูงสุด', 'มีประกันดูแลตลอดการใช้งาน'],
                    };
                    updateActiveApp({ plans: [...currentPlans, newPlan] });
                  };

                  const addNewApp = () => {
                    const newId = `app-${Date.now()}`;
                    const newApp = {
                      id: newId,
                      name: 'แอพใหม่',
                      category: 'ความบันเทิง',
                      icon: '📱',
                      color: '#5B86C8',
                      badge: 'ใหม่ ✨',
                      description: 'คำอธิบายแพ็กเกจแอพพรีเมียม',
                      plans: [
                        {
                          id: `${newId}-30d`,
                          name: '30 วัน พรีเมียม',
                          price: '59',
                          originalPrice: '89',
                          period: '30 วัน',
                          badge: 'แนะนำ',
                          features: ['ใช้งานได้ทันที', 'ไม่มีสะดุด', 'ดูแลตลอด 30 วัน'],
                        },
                      ],
                    };
                    const next = [...pricingList, newApp];
                    setForm({ ...form, pricing: next });
                    setAdminAppId(newId);
                  };

                  const deleteApp = (appId) => {
                    if (pricingList.length <= 1) {
                      alert('ต้องมีแอพอย่างน้อย 1 แอพในระบบค่ะ');
                      return;
                    }
                    if (window.confirm(`ยืนยันการลบแอพ "${activeApp.name}" พร้อมแพ็กเกจทั้งหมดใช่หรือไม่คะ?`)) {
                      const next = pricingList.filter((a) => a.id !== appId);
                      setForm({ ...form, pricing: next });
                      setAdminAppId(next[0]?.id || 'netflix');
                    }
                  };

                  const resetToDefault = () => {
                    if (window.confirm('ต้องการรีเซ็ตเรทราคาแอพทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่คะ? (การแก้ไขก่อนหน้าจะถูกแทนที่)')) {
                      setForm({ ...form, pricing: defaultPricing });
                      setAdminAppId('netflix');
                    }
                  };

                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-pattan-pink" />
                            <span>จัดการเรทราคาแอพ (App Pricing)</span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            แก้ไขราคา แพ็กเกจ โปรโมชั่น และเพิ่ม/ลบแอพได้ตามต้องการค่ะ
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={addNewApp}
                            className="btn-jelly px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>เพิ่มแอพใหม่</span>
                          </button>

                          <button
                            type="button"
                            onClick={resetToDefault}
                            className="px-3 py-1.5 rounded-full text-slate-500 hover:text-rose-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            title="คืนค่าเรทราคาเป็นค่าเริ่มต้น"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">คืนค่าเริ่มต้น</span>
                          </button>
                        </div>
                      </div>

                      {/* App Tabs Selector in Admin */}
                      <div className="card-bento p-3 overflow-x-auto scrollbar-none">
                        <div className="flex items-center gap-2 min-w-max">
                          {pricingList.map((app) => {
                            const isSelected = app.id === (activeApp.id || adminAppId);
                            return (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => setAdminAppId(app.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-pattan-blue text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/60 dark:border-slate-700'
                                }`}
                              >
                                <span className="text-base">{app.icon || '📱'}</span>
                                <span>{app.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                }`}>
                                  {app.plans?.length || 0}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active App Basic Info */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <span>ข้อมูลแอพ: {activeApp.name}</span>
                            <span className="text-xs font-normal text-slate-400">({activeApp.id})</span>
                          </h4>
                          {pricingList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteApp(activeApp.id)}
                              className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ลบแอพนี้</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                              ชื่อแอพ (App Name)
                            </label>
                            <input
                              type="text"
                              value={activeApp.name || ''}
                              onChange={(e) => updateActiveApp({ name: e.target.value })}
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                              ไอคอนอิโมจิ (Emoji Icon)
                            </label>
                            <input
                              type="text"
                              value={activeApp.icon || ''}
                              onChange={(e) => updateActiveApp({ icon: e.target.value })}
                              placeholder="เช่น 🍿, ▶️, 🏰, 🎵"
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-center"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                              หมวดหมู่ (Category)
                            </label>
                            <input
                              type="text"
                              value={activeApp.category || ''}
                              onChange={(e) => updateActiveApp({ category: e.target.value })}
                              placeholder="เช่น ภาพยนตร์ & ซีรีส์"
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                              รหัสสีธีม (Accent Color Hex)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={activeApp.color || '#5B86C8'}
                                onChange={(e) => updateActiveApp({ color: e.target.value })}
                                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                              />
                              <input
                                type="text"
                                value={activeApp.color || '#5B86C8'}
                                onChange={(e) => updateActiveApp({ color: e.target.value })}
                                className="flex-1 h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                              ป้ายกำกับบนแท็บ (Badge)
                            </label>
                            <input
                              type="text"
                              value={activeApp.badge || ''}
                              onChange={(e) => updateActiveApp({ badge: e.target.value })}
                              placeholder="เช่น ยอดนิยม 🔥, ขายดี, แนะนำ"
                              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                            คำบรรยายสั้น ๆ ใต้ชื่อแอพ (Description)
                          </label>
                          <input
                            type="text"
                            value={activeApp.description || ''}
                            onChange={(e) => updateActiveApp({ description: e.target.value })}
                            placeholder="เช่น คมชัดระดับ 4K Ultra HD ดูได้ทุกอุปกรณ์"
                            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                          />
                        </div>
                      </div>

                      {/* Plans List for this App */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <span>แพ็กเกจราคาของ {activeApp.name} ({activeApp.plans?.length || 0} รายการ)</span>
                          </h4>
                          <button
                            type="button"
                            onClick={addPlan}
                            className="btn-jelly px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pattan-pink to-[#E26698] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>เพิ่มแพ็กเกจราคา</span>
                          </button>
                        </div>

                        {(activeApp.plans || []).map((plan, pIdx) => {
                          const featuresText = Array.isArray(plan.features) ? plan.features.join('\n') : '';

                          return (
                            <div
                              key={plan.id || pIdx}
                              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-3.5 shadow-xs relative"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                                <span className="text-xs font-black text-pattan-blue dark:text-pattan-blue-light">
                                  แพ็กเกจที่ {pIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => deletePlan(pIdx)}
                                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                                  title="ลบแพ็กเกจนี้"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>ลบ</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    ชื่อแพ็กเกจ (Package Title)
                                  </label>
                                  <input
                                    type="text"
                                    value={plan.name || ''}
                                    onChange={(e) => updatePlan(pIdx, { name: e.target.value })}
                                    placeholder="เช่น 30 วัน จอหาร (Ultra HD 4K)"
                                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    ระยะเวลา (Period)
                                  </label>
                                  <input
                                    type="text"
                                    value={plan.period || ''}
                                    onChange={(e) => updatePlan(pIdx, { period: e.target.value })}
                                    placeholder="เช่น 7 วัน, 30 วัน, 1 ปี"
                                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    ราคาขายจริง ฿ (Price)
                                  </label>
                                  <input
                                    type="text"
                                    value={plan.price || ''}
                                    onChange={(e) => updatePlan(pIdx, { price: e.target.value })}
                                    placeholder="เช่น 119"
                                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-black text-emerald-600 dark:text-emerald-400"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    ราคาเต็มขีดฆ่า ฿ (Original Price)
                                  </label>
                                  <input
                                    type="text"
                                    value={plan.originalPrice || ''}
                                    onChange={(e) => updatePlan(pIdx, { originalPrice: e.target.value })}
                                    placeholder="เช่น 149 (เว้นว่างได้)"
                                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-400"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                    ป้ายเด่น (Badge)
                                  </label>
                                  <input
                                    type="text"
                                    value={plan.badge || ''}
                                    onChange={(e) => updatePlan(pIdx, { badge: e.target.value })}
                                    placeholder="เช่น ขายดีสุด 🔥, เมลเดิม"
                                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                                  จุดเด่น / รายละเอียดแพ็กเกจ (1 บรรทัด = 1 ข้อ)
                                </label>
                                <textarea
                                  rows={3}
                                  value={featuresText}
                                  onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    updatePlan(pIdx, { features: lines });
                                  }}
                                  placeholder="พิมพ์จุดเด่นบรรทัดละ 1 ข้อ เช่น&#10;ความชัดระดับ Ultra HD 4K&#10;ดูได้ทุกอุปกรณ์&#10;รับประกันตลอด 30 วัน"
                                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs leading-relaxed font-sans resize-y"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* TAB 7: REVIEW MODERATION ("ยกเว้นรีวิวลูกค้า") */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white">
                        จัดการรีวิวลูกค้า (Review Moderation)
                      </h3>
                      <p className="text-xs text-slate-500">
                        ตรวจสอบรีวิวทั้งหมด สามารถลบรีวิวสแปมหรือข้อความไม่เหมาะสมได้
                      </p>
                    </div>

                    {/* Transparency Notice Alert */}
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>นโยบายความน่าเชื่อถือและความโปร่งใส (100% Transparency):</strong>
                        <p className="text-[11px] mt-0.5 opacity-90">
                          ระบบไม่อนุญาตให้แก้ไขข้อความหรือดาวของลูกค้า เพื่อคงความจริงใจและน่าเชื่อถือของร้าน Pattancute แต่สามารถลบรีวิวที่เป็นสแปมหรือข้อความไม่สุภาพได้ค่ะ
                        </p>
                      </div>
                    </div>

                    {isLoadingReviews ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        กำลังโหลดรายการรีวิว...
                      </div>
                    ) : reviewsList.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        ยังไม่มีรายการรีวิวในระบบค่ะ
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {reviewsList.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-pattan-blue-deep dark:text-white truncate">
                                  {rev.name}
                                </span>
                                <span className="text-amber-500 font-bold">
                                  ★ {rev.rating}/5
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(rev.created_at).toLocaleDateString('th-TH')}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                                {rev.comment}
                              </p>
                              {rev.images && rev.images.length > 0 && (
                                <div className="flex gap-1.5 pt-1">
                                  {rev.images.map((imgUrl, i) => (
                                    <img
                                      key={i}
                                      src={imgUrl}
                                      alt="review"
                                      className="w-9 h-9 object-cover rounded-lg border border-slate-200"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => setReviewToDelete(rev)}
                              disabled={deletingReviewId === rev.id}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition shrink-0 cursor-pointer"
                              title="ลบรีวิวนี้ออกจากระบบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 8: CHANGE PASSWORD (SECURITY) */}
                {activeTab === 'security' && (
                  <div className="space-y-6 max-w-xl">
                    <div>
                      <h3 className="text-lg font-black text-pattan-blue-deep dark:text-white flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-pattan-blue" />
                        <span>เปลี่ยนรหัสผ่านหลังบ้าน (Change Admin Password)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        ตั้งรหัสผ่านใหม่ที่คุณต้องการและจำได้ง่าย สำหรับเข้าจัดการระบบหลังบ้านในครั้งถัดไปค่ะ
                      </p>
                    </div>

                    {/* Password Status Message */}
                    {passwordMsg.text && (
                      <div
                        className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs ${
                          passwordMsg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {passwordMsg.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{passwordMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {/* Current Token Display */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          รหัสผ่านปัจจุบันที่กำลังใช้งาน (Active Token)
                        </label>
                        <div className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate select-all bg-white dark:bg-slate-700 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600">
                          {token}
                        </div>
                      </div>

                      {/* New Password Input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                          รหัสผ่านใหม่ที่ต้องการตั้ง
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="ระบุรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                            className="w-full h-11 px-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pattan-blue/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password Input */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                          ยืนยันรหัสผ่านใหม่อีกครั้ง
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="พิมพ์รหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pattan-blue/30"
                        />
                      </div>

                      {/* Notice */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
                        💡 <strong>คำแนะนำ:</strong> เมื่อกดบันทึกแล้ว ระบบจะอัปเดตและจดจำรหัสผ่านใหม่ให้อัตโนมัติในเครื่องนี้ทันที และครั้งถัดไปสามารถใช้รหัสผ่านใหม่นี้ในการเข้าใช้งานหลังบ้านได้เลยค่ะ
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="btn-jelly w-full h-11 rounded-full bg-gradient-to-r from-pattan-blue via-[#6A94DC] to-pattan-pink text-white font-bold text-xs shadow-jelly flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>{isChangingPassword ? 'กำลังบันทึกรหัสใหม่...' : '💾 บันทึกรหัสผ่านใหม่'}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* 4. Bottom Sticky Action Bar (Save All Button) */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  แก้ไขข้อมูลได้ทุกหมวด แล้วกดบันทึกที่นี่
                </span>

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    ปิดหน้าต่าง
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="btn-jelly px-6 py-2.5 rounded-full bg-gradient-to-r from-pattan-blue to-pattan-pink text-white font-bold text-xs shadow-jelly flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลงทั้งหมด'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* In-Website Custom Confirmation Modal Popup */}
        {reviewToDelete && (
          <div 
            onClick={() => setReviewToDelete(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-white/80 dark:border-slate-700 animate-modal-pop mx-auto"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-4 shadow-xs">
                <Trash2 className="w-7 h-7" />
              </div>

              <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">
                ยืนยันการลบรีวิวนี้ใช่หรือไม่?
              </h3>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-750 text-xs text-slate-600 dark:text-slate-300 mb-4 text-left border border-slate-100 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-white truncate mb-0.5">
                  {reviewToDelete.name}
                </div>
                <p className="line-clamp-2 text-slate-500 dark:text-slate-400">
                  "{reviewToDelete.comment}"
                </p>
              </div>

              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold mb-5">
                การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลและรูปภาพจะถูกลบถาวรค่ะ
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewToDelete(null)}
                  className="h-10 px-4 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer"
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = reviewToDelete.id;
                    setReviewToDelete(null);
                    handleDeleteReview(id);
                  }}
                  disabled={deletingReviewId === reviewToDelete.id}
                  className="h-10 px-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {deletingReviewId === reviewToDelete.id ? 'กำลังลบ...' : 'ยืนยันลบ'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
