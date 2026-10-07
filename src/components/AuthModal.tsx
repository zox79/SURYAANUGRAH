import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Building2
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  initialMode?: 'member' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'member',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'member' | 'admin'>(initialMode);
  const [memberAction, setMemberAction] = useState<'register' | 'login'>('register');

  // Form states
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Nomor HP wajib diisi dengan benar (minimal 8 digit).');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = memberAction === 'register' ? '/api/auth/register-member' : '/api/auth/login';
      const payload = memberAction === 'register' 
        ? { phone: phone.trim(), name: name.trim() }
        : { identifier: phone.trim(), roleChoice: 'member' };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses autentikasi.');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setErrorMessage('Username dan Password Admin wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: adminUsername.trim(),
          password: adminPassword.trim(),
          roleChoice: 'admin',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password Admin salah.');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal login sebagai admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoMember = () => {
    setPhone('081234567890');
    setName('Pak Budi Hartono');
    setMemberAction('login');
    const demoUser: UserAccount = {
      id: 'usr-member-1',
      phone: '081234567890',
      name: 'Pak Budi Hartono',
      role: 'member',
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    const demoAdmin: UserAccount = {
      id: 'usr-admin',
      phone: '081240548750',
      name: 'Admin Surya Anugrah Keramik',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(demoAdmin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Sistem Masuk & Pendaftaran
              </h3>
              <p className="text-[11px] text-amber-300">
                Pilih Mode Member Pelanggan atau Mode Admin Toko
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('member');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'member'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mode Member</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-stone-900 text-amber-300 shadow ring-1 ring-amber-500/40'
                : 'bg-white text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Mode Admin Toko</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: MODE MEMBER */}
          {activeTab === 'member' && (
            <div className="space-y-4">
              
              {/* Sub-action: Daftar vs Masuk */}
              <div className="flex border-b border-stone-200 pb-2 gap-4 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setMemberAction('register')}
                  className={`pb-1 transition-all ${
                    memberAction === 'register'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Daftar Akun Member Baru
                </button>
                <button
                  type="button"
                  onClick={() => setMemberAction('login')}
                  className={`pb-1 transition-all ${
                    memberAction === 'login'
                      ? 'text-amber-700 border-b-2 border-amber-600'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Masuk Akun Terdaftar
                </button>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-stone-700 text-[11px] leading-relaxed">
                ℹ️ <b>Kemudahan Member:</b> Cukup mendaftar menggunakan <b>Nomor HP</b> Anda. Alamat pengiriman diwajibkan saat Anda melakukan order pesanan ubin!
              </div>

              <form onSubmit={handleMemberSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Nomor HP (WhatsApp) <span className="text-rose-600">*</span>:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 font-bold font-mono text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                {memberAction === 'register' && (
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Nama Lengkap Anda:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Hartono"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 font-bold text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
                >
                  <span>{memberAction === 'register' ? 'Daftar Sekarang & Masuk' : 'Masuk Akun Member'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Demo Login Member Button */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleQuickDemoMember}
                  className="w-full py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Klik Cepat: Masuk sebagai Demo Member (Pak Budi)</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: MODE ADMIN */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-stone-900 text-stone-200 p-3.5 rounded-xl border border-stone-800 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Portal Pengelola Toko Surya Anugrah Keramik</span>
                </div>
                <p className="text-stone-400">
                  Akses khusus untuk verifikasi pelunasan order, terbitkan resi pembelian resmi, dan setting database Google Apps Script.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Username / HP Admin:
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin atau 081240548750"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-bold text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Password Admin:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="admin123"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 font-mono text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">Default password: admin123</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs flex items-center justify-center gap-2 shadow transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Masuk ke Mode Admin</span>
                </button>
              </form>

              {/* 1-Click Demo Login Admin Button */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>1-Klik Cepat: Masuk Langsung Sebagai Admin Toko</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
