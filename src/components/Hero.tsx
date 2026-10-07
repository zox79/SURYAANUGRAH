import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  MapPin, 
  PhoneCall, 
  Calculator, 
  Network, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Bot,
  Grid3X3,
  Layers,
  Tag
} from 'lucide-react';
import { STORE_TAGLINE, STORE_PHONE, STORE_WA_NUMBER, STORE_BRANCHES, PRODUCTS_CATALOG } from '../data/storeData';
import { MainCategory, PageView, ProductItem } from '../types';

interface HeroProps {
  onOpenDiagramPage: () => void;
  onOpenAiPage: () => void;
  onOpenCalculator: () => void;
  onSelectCategory: (cat: MainCategory) => void;
  onScrollToCatalog: () => void;
  onViewProductDetails: (product: ProductItem) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenDiagramPage,
  onOpenAiPage,
  onOpenCalculator,
  onSelectCategory,
  onScrollToCatalog,
  onViewProductDetails,
}) => {
  // 4 Featured Preview Showcase Products across categories
  const previewProducts = [
    PRODUCTS_CATALOG[0], // Keramik BS Polos & Corak 40x40
    PRODUCTS_CATALOG[3], // Keramik Kardusan Platinum KW A/B/C
    PRODUCTS_CATALOG[7], // Granit Marmer Carrara 60x60
    PRODUCTS_CATALOG[10], // Batu Alam Wall Cladding
  ].filter(Boolean);

  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const currentPreview = previewProducts[activePreviewIdx] || PRODUCTS_CATALOG[0];

  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Background Subtle Accent Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{STORE_TAGLINE}</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Preview Lengkap <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  Keramik, Granit & Batu Alam
                </span>
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pusat ubin <b>Keramik BS ekonomis</b>, ubin <b>Kardusan (KW A, B, C)</b>, <b>Granit mewah</b>, <b>Batu Alam</b> asli, dan <b>Sanitary</b> komplit di Jombang. Lengkap dengan armada pengiriman mandiri sampai lokasi proyek.
              </p>
            </div>

            {/* Store & Fleet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {STORE_BRANCHES.map((branch) => (
                <div 
                  key={branch.id} 
                  className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-3 text-left flex items-start gap-2.5 backdrop-blur-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-100 block">{branch.name}</span>
                    <p className="text-[11px] text-amber-300 font-medium truncate">{branch.address}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Facility Banner: Punya Armada Pengiriman Sendiri */}
            <div className="bg-gradient-to-r from-amber-950/70 to-stone-850/80 border border-amber-600/30 rounded-xl p-3 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <Truck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Punya Armada Pengiriman Sendiri
                  </h4>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                    Siap Kirim Jombang
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 truncate">
                  Truk Colt Diesel & Pick-up siap antar material langsung ke alamat Anda.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all hover:scale-102"
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Jelajahi Preview Produk</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAiPage}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 flex items-center gap-2 transition-all hover:border-amber-400 shadow-md"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Tanya AI Asisten</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              <button
                onClick={onOpenDiagramPage}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 flex items-center gap-2 transition-all hover:text-white"
              >
                <Network className="w-4 h-4 text-amber-400" />
                <span>Buka Halaman Bagan</span>
              </button>
            </div>

          </div>

          {/* Right Column: Direct Product Preview Showcase (Calon konsumen langsung disuguhkan preview produk) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-stone-800/90 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
              
              {/* Card Header with tabs */}
              <div className="p-4 bg-stone-850 border-b border-stone-750 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wider block">
                    Preview Produk Unggulan
                  </span>
                  <h3 className="font-extrabold text-sm text-white">
                    {currentPreview.subcategory} - {currentPreview.category}
                  </h3>
                </div>

                <div className="flex gap-1">
                  {previewProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePreviewIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        activePreviewIdx === idx
                          ? 'bg-amber-500 text-stone-950 font-black scale-105'
                          : 'bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                      title={p.name}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Photo Preview */}
              <div className="relative h-56 sm:h-64 w-full bg-stone-900 overflow-hidden group">
                <img
                  src={currentPreview.image}
                  alt={currentPreview.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-90" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow">
                    {currentPreview.subcategory}
                  </span>
                  {currentPreview.grades && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Grade {currentPreview.grades.join('/')}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug line-clamp-1">
                    {currentPreview.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-amber-300 font-bold">
                      {currentPreview.estimatedPriceRange || 'Harga Langsung Toko'}
                    </span>
                    <span className="text-[11px] text-stone-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      Ukuran: {currentPreview.defaultSize || 'Pilihan Lengkap'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Details & Actions */}
              <div className="p-4 space-y-3 bg-stone-850">
                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {currentPreview.description}
                </p>

                {/* Available sizes strip */}
                {currentPreview.sizes && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px]">
                    <span className="text-stone-400 shrink-0 font-medium">Ukuran ubin:</span>
                    {currentPreview.sizes.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="bg-stone-800 text-stone-200 border border-stone-700 px-2 py-0.5 rounded font-mono font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onViewProductDetails(currentPreview)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Detail & Spek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onScrollToCatalog}
                    className="py-2.5 px-3 rounded-xl bg-stone-750 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-stone-650"
                  >
                    <span>Katalog Lengkap</span>
                  </button>
                </div>
              </div>

            </div>

            {/* AI Assistant Quick Pill under Preview */}
            <button
              onClick={onOpenAiPage}
              className="w-full bg-stone-850/90 hover:bg-stone-800 border border-stone-700 hover:border-amber-400/60 rounded-2xl p-3 flex items-center justify-between transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors block">
                    Bingung pilih keramik atau hitung ruangan?
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Tanya AI Surya Keramik untuk konsultasi instan & rekomendasi motif
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
