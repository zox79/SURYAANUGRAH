import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Truck, 
  Sparkles, 
  Clock, 
  Calculator, 
  Network 
} from 'lucide-react';
import { 
  STORE_BRANCHES, 
  STORE_PHONE, 
  STORE_WA_NUMBER, 
  STORE_TAGLINE, 
  CATEGORIES 
} from '../data/storeData';
import { MainCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: MainCategory) => void;
  onOpenDiagram: () => void;
  onOpenCalculator: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenDiagram,
  onOpenCalculator,
  onScrollToSection,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight block">
                  SURYA ANUGRAH KERAMIK
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  {STORE_TAGLINE}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Pusat grosir & retail keramik lantai BS, kardusan resmi KW A/B/C, granit marmer, batu alam dinding & taman, perlengkapan sanitary komplit, serta bahan bangunan perekat di Jombang.
            </p>

            <div className="bg-stone-900 rounded-xl p-3.5 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Punya Armada Pengiriman Sendiri</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-normal">
                Truk & Pick-Up toko siap antar langsung ke lokasi rumah atau proyek Anda di Perak, Diwek, dan seluruh kecamatan Jombang.
              </p>
            </div>
          </div>

          {/* 2 Physical Branches Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              2 Lokasi Toko Fisik Kami
            </h4>

            <div className="space-y-3">
              {STORE_BRANCHES.map((b) => (
                <div key={b.id} className="bg-stone-900/80 p-3 rounded-xl border border-stone-850 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{b.name}</span>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-600/30">
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 flex items-start gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-1 text-xs">
              <span className="text-stone-400 block mb-1">WhatsApp & Hubungi Kami:</span>
              <a
                href={`https://wa.me/${STORE_WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-sm hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>{STORE_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Navigation & Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
              Kategori Bagan
            </h4>

            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onScrollToSection('katalog-section');
                    }}
                    className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-stone-850 space-y-2 text-xs">
              <button
                onClick={onOpenDiagram}
                className="text-amber-300 hover:text-white flex items-center gap-1.5"
              >
                <Network className="w-3.5 h-3.5 text-amber-400" />
                <span>Bagan Struktur Produk</span>
              </button>
              <button
                onClick={onOpenCalculator}
                className="text-stone-300 hover:text-white flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Kalkulator Dus Keramik</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Surya Anugrah Keramik & UD. Khrisna Sakti. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Temuwulan, Perak, Jombang</span>
            <span>•</span>
            <span>Balongbesuk, Diwek, Jombang</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">{STORE_TAGLINE}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
