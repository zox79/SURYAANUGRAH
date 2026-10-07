import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ShoppingCart, 
  Calculator, 
  Network, 
  Truck, 
  Bot,
  Grid3X3,
  User,
  ShieldCheck,
  FileText,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { STORE_PHONE, STORE_WA_NUMBER } from '../data/storeData';
import { MainCategory, PageView, UserAccount } from '../types';

interface NavbarProps {
  activePageView: PageView;
  onSelectPageView: (view: PageView) => void;
  activeCategory: MainCategory | 'All';
  onSelectCategory: (cat: MainCategory | 'All') => void;
  onOpenCalculator: () => void;
  onOpenInquiry: () => void;
  inquiryCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onScrollToSection: (sectionId: string) => void;
  // Auth & Mode Props
  currentUser: UserAccount | null;
  onOpenAuth: (mode?: 'member' | 'admin') => void;
  onOpenMyOrders: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePageView,
  onSelectPageView,
  activeCategory,
  onSelectCategory,
  onOpenCalculator,
  onOpenInquiry,
  inquiryCount,
  onScrollToSection,
  currentUser,
  onOpenAuth,
  onOpenMyOrders,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCategories: { id: MainCategory | 'All'; label: string }[] = [
    { id: 'All', label: 'Semua Produk' },
    { id: 'Lantai Keramik', label: 'Lantai Keramik' },
    { id: 'Granit', label: 'Granit' },
    { id: 'Batu Alam', label: 'Batu Alam' },
    { id: 'Sanitary', label: 'Sanitary' },
    { id: 'Others/Lainnya', label: 'Lainnya' },
  ];

  const isAdmin = currentUser?.role === 'admin';
  const isMember = currentUser?.role === 'member';

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-xl border-b border-stone-800">
      
      {/* 1. TOP BANNER: MODE SELECTOR & ACCOUNT QUICK BAR */}
      <div className="bg-amber-800 text-amber-50 text-xs px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-700/60 font-medium">
        
        {/* Left: Mode Badge & Physical Stores */}
        <div className="flex items-center gap-2.5 overflow-x-auto whitespace-nowrap py-0.5 text-[11px] sm:text-xs">
          {/* Dual Mode Switcher Indicator */}
          <div className="flex items-center bg-stone-950/40 p-0.5 rounded-lg border border-amber-500/30">
            <button
              onClick={() => {
                if (isAdmin) {
                  // Switch from admin to member view
                  onSelectPageView('preview');
                } else if (!isMember) {
                  onOpenAuth('member');
                }
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                isMember || (!isAdmin && !isMember)
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
              title="Mode Member: Katalog, Keranjang & Pesanan Langsung"
            >
              <User className="w-3 h-3" />
              <span>Mode Member</span>
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  onSelectPageView('admin');
                } else {
                  onOpenAuth('admin');
                }
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                isAdmin
                  ? 'bg-emerald-400 text-stone-950 shadow-sm'
                  : 'text-amber-200 hover:text-white'
              }`}
              title="Mode Admin: Verifikasi Pelunasan, Database Google Script, Cetak Resi Pembelian"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Mode Admin</span>
            </button>
          </div>

          <span className="hidden md:inline text-amber-300">|</span>

          {/* Physical Stores Location Badge */}
          <span className="hidden sm:flex items-center gap-1 text-stone-100">
            <MapPin className="w-3 h-3 text-amber-300" />
            <b>UD. Khrisna Sakti</b> (Perak) & <b>Surya Anugrah Keramik</b> (Diwek)
          </span>
        </div>

        {/* Right: Account Status / Login Buttons & WhatsApp */}
        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs ml-auto">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Member specific order button */}
              {isMember && (
                <button
                  onClick={onOpenMyOrders}
                  className="bg-amber-900/80 hover:bg-amber-900 text-amber-100 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 border border-amber-600/50 transition-colors"
                >
                  <FileText className="w-3 h-3 text-amber-300" />
                  <span>Pesanan & Resi Saya</span>
                </button>
              )}

              {/* Admin specific dashboard button */}
              {isAdmin && (
                <button
                  onClick={() => onSelectPageView('admin')}
                  className={`px-2.5 py-0.5 rounded-md font-extrabold flex items-center gap-1 transition-colors ${
                    activePageView === 'admin'
                      ? 'bg-emerald-500 text-stone-950 font-black'
                      : 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50 hover:bg-emerald-800'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Dashboard Admin</span>
                </button>
              )}

              <span className="text-amber-200 font-semibold hidden md:inline">
                {currentUser.name}
              </span>

              <button
                onClick={onLogout}
                className="text-stone-300 hover:text-white flex items-center gap-1 p-0.5"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-300" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('member')}
                className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1 transition-all"
                title="Cukup mendaftar dengan nomor HP"
              >
                <User className="w-3 h-3" />
                <span>Masuk Member</span>
              </button>

              <button
                onClick={() => onOpenAuth('admin')}
                className="bg-stone-900/80 hover:bg-stone-950 text-stone-200 font-bold px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span className="hidden xs:inline">Login Admin</span>
              </button>
            </div>
          )}

          <a
            href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20tanya%20produk%20dan%20harga`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 font-bold hover:text-white transition-colors pl-2 border-l border-amber-700"
          >
            <Phone className="w-3 h-3 text-emerald-300" />
            <span>WA: {STORE_PHONE}</span>
          </a>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <button 
            onClick={() => {
              onSelectPageView('preview');
              onSelectCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-2 shadow-md flex items-center justify-center text-white ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  SURYA ANUGRAH KERAMIK
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-400 font-medium tracking-wide">
                Indahkan Hunian Anda Bersama Kami
              </p>
            </div>
          </button>

          {/* Core Page Navigation Switcher (Preview vs Bagan vs Tanya AI vs Admin) */}
          <div className="hidden lg:flex items-center bg-stone-850 p-1 rounded-2xl border border-stone-750 gap-1">
            <button
              onClick={() => onSelectPageView('preview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activePageView === 'preview'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Preview & Katalog</span>
            </button>

            <button
              onClick={() => onSelectPageView('bagan')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activePageView === 'bagan'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Network className="w-4 h-4 text-amber-400" />
              <span>Halaman Bagan</span>
            </button>

            <button
              onClick={() => onSelectPageView('tanya-ai')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all relative ${
                activePageView === 'tanya-ai'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                  : 'text-amber-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>Tanya AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            {isAdmin && (
              <button
                onClick={() => onSelectPageView('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                  activePageView === 'admin'
                    ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                    : 'text-emerald-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Admin</span>
              </button>
            )}
          </div>

          {/* Quick Action Buttons (Calculator, Tanya AI, & Keranjang) */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 hover:text-white transition-all"
              title="Hitung Kebutuhan Dus Keramik & Ruangan"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span className="hidden xl:inline">Kalkulator Dus</span>
            </button>

            {/* Tanya AI Quick Trigger (for tablet) */}
            <button
              onClick={() => onSelectPageView('tanya-ai')}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-stone-800 text-amber-300 border border-amber-500/40"
            >
              <Bot className="w-4 h-4" />
              <span>Tanya AI</span>
            </button>

            {/* Tombol Keranjang (Menggantikan Estimasi) */}
            <button
              onClick={onOpenInquiry}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md shadow-amber-950/30 transition-all hover:scale-102"
              title="Buka Keranjang Belanja Material"
            >
              <ShoppingCart className="w-4 h-4 text-stone-950" />
              <span>Keranjang</span>
              {inquiryCount > 0 && (
                <span className="bg-stone-950 text-amber-300 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-inner">
                  {inquiryCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Keranjang Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => onSelectPageView('tanya-ai')}
              className="p-2 rounded-lg bg-stone-800 text-amber-300 border border-amber-500/40"
              aria-label="Tanya AI"
            >
              <Bot className="w-5 h-5" />
            </button>

            {/* Tombol Keranjang Mobile */}
            <button
              onClick={onOpenInquiry}
              className="relative p-2 rounded-lg bg-amber-500 text-stone-950 font-bold"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-950 text-amber-300 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {inquiryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Page Switcher Bar for Mobile Screens */}
        <div className="grid grid-cols-3 gap-1.5 pb-3 lg:hidden">
          <button
            onClick={() => onSelectPageView('preview')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
              activePageView === 'preview'
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                : 'bg-stone-800/80 text-stone-300 border-stone-700'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => onSelectPageView('bagan')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
              activePageView === 'bagan'
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                : 'bg-stone-800/80 text-stone-300 border-stone-700'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Bagan</span>
          </button>

          <button
            onClick={() => onSelectPageView('tanya-ai')}
            className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
              activePageView === 'tanya-ai'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 border-amber-400 font-black'
                : 'bg-stone-800/80 text-amber-300 border-amber-500/40'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Tanya AI</span>
          </button>
        </div>

        {/* Category Horizontal Navigation Scrollbar (Only on Preview page) */}
        {activePageView === 'preview' && (
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-stone-800/80 text-xs font-medium scrollbar-none">
            {navCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onScrollToSection('katalog-section');
                  }}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-3 pl-3 text-stone-400 text-xs border-l border-stone-800">
              <button
                onClick={() => onScrollToSection('tokofisik-section')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Lokasi Toko</span>
              </button>
              <button
                onClick={() => onScrollToSection('armada-section')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Armada Kirim</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-stone-900 border-t border-stone-800 px-4 pt-3 pb-6 space-y-3">
          
          {/* User Account / Mode inside mobile menu */}
          <div className="bg-stone-850 p-3 rounded-2xl border border-stone-750 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Status Akun & Mode
              </span>
              {currentUser && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isAdmin ? 'bg-emerald-500 text-stone-950' : 'bg-amber-400 text-stone-950'
                }`}>
                  {isAdmin ? 'Admin' : 'Member'}
                </span>
              )}
            </div>

            {currentUser ? (
              <div className="space-y-2">
                <div className="text-xs text-white font-bold">
                  {currentUser.name} ({currentUser.phone})
                </div>

                {isMember && (
                  <button
                    onClick={() => {
                      onOpenMyOrders();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat Riwayat & Resi Pesanan</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => {
                      onSelectPageView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Buka Dashboard Admin</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-1.5 text-rose-400 text-xs font-bold text-center"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onOpenAuth('member');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Daftar / Masuk</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-2.5 bg-stone-800 border border-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Login Admin</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-xs uppercase tracking-wider text-amber-400 font-bold px-1">
            Navigasi Halaman Utama
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => {
                onSelectPageView('preview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activePageView === 'preview' ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Preview & Katalog Produk
              </span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">Utama</span>
            </button>

            <button
              onClick={() => {
                onSelectPageView('bagan');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activePageView === 'bagan' ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Network className="w-4 h-4 text-amber-400" />
                Halaman Bagan Struktur (Bagan Toko)
              </span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">3 Halaman</span>
            </button>

            <button
              onClick={() => {
                onSelectPageView('tanya-ai');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                activePageView === 'tanya-ai' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black' : 'bg-stone-800 text-amber-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Tanya AI Asisten Keramik
              </span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">Online</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 space-y-2">
            <button
              onClick={() => {
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-stone-800 text-stone-100 text-xs font-semibold"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              Kalkulator Dus Keramik
            </button>

            <button
              onClick={() => {
                onScrollToSection('tokofisik-section');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-stone-800 text-stone-100 text-xs font-semibold"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              2 Toko Fisik (Perak & Diwek)
            </button>

            <button
              onClick={() => {
                onScrollToSection('armada-section');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-stone-800 text-stone-100 text-xs font-semibold"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              Armada Pengiriman Sendiri
            </button>
          </div>

          <div className="pt-2">
            <a
              href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20konsultasi%20stok%20dan%20harga`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
            >
              <Phone className="w-4 h-4" />
              Chat WhatsApp Langsung ({STORE_PHONE})
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
