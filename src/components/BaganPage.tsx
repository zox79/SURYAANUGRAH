import React from 'react';
import { 
  Network, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Grid3X3, 
  Layers, 
  Mountain, 
  Bath, 
  Package, 
  Phone,
  Bot
} from 'lucide-react';
import { InteractiveDiagram } from './InteractiveDiagram';
import { MainCategory } from '../types';
import { STORE_PHONE, STORE_WA_NUMBER, STORE_TAGLINE } from '../data/storeData';

interface BaganPageProps {
  onBackToPreview: () => void;
  onSelectDiagramNode: (category: MainCategory, subcategory: string, size?: string) => void;
  onOpenAi: () => void;
}

export const BaganPage: React.FC<BaganPageProps> = ({
  onBackToPreview,
  onSelectDiagramNode,
  onOpenAi,
}) => {
  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-8 sm:py-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-850">
          <button
            onClick={onBackToPreview}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 text-xs font-bold transition-all self-start"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Kembali ke Preview & Katalog Produk</span>
          </button>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Tanya AI tentang Bagan</span>
            </button>

            <a
              href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20tanya%20produk%20pada%20bagan%20toko`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Konsultasi WA ({STORE_PHONE})</span>
            </a>
          </div>
        </div>

        {/* Page Hero Title */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Network className="w-3.5 h-3.5 text-amber-400" />
            Halaman Tersendiri Bagan Struktur Toko
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Bagan Struktur Lengkap & Spesifikasi Produk
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Halaman ini menampilkan seluruh klasifikasi material resmi sesuai dokumen fisik toko <b>Surya Anugrah Keramik</b> & <b>UD. Khrisna Sakti</b> di Jombang. Klik setiap bagian bagan untuk langsung memfilter katalog preview ubin.
          </p>
        </div>

        {/* Summary Metric Cards for the 5 Main Branches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400">
              <Grid3X3 className="w-4 h-4" />
              <span className="font-extrabold text-xs">1. Lantai Keramik</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Keramik BS (12 ukuran), Kardusan (9 ukuran, KW A/B/C), Kukumacan.
            </p>
          </div>

          <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-sky-400">
              <Layers className="w-4 h-4" />
              <span className="font-extrabold text-xs">2. Granit</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Granit BS (homogen), Kardusan (Nano Polished & Rustic), List plint tangga/dinding.
            </p>
          </div>

          <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <Mountain className="w-4 h-4" />
              <span className="font-extrabold text-xs">3. Batu Alam</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Wall Cladding, RTM + RTA, List Profil, Koral Hias, Batu Acak taman.
            </p>
          </div>

          <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400">
              <Bath className="w-4 h-4" />
              <span className="font-extrabold text-xs">4. Sanitary</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Pintu Kamar Mandi, Kloset Duduk/Jongkok, Tandon Air, BCP+Sink, Kran.
            </p>
          </div>

          <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-purple-400">
              <Package className="w-4 h-4" />
              <span className="font-extrabold text-xs">5. Others / Lainnya</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Semen mortar, Nad ubin warna, Coating batu alam, WPC, Tempat Sabun.
            </p>
          </div>
        </div>

        {/* The Interactive Diagram Component */}
        <InteractiveDiagram
          onSelectSubcategory={(cat, subcat, size) => {
            onSelectDiagramNode(cat, subcat, size);
          }}
        />

        {/* Bottom Banner to jump back to Preview */}
        <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-950 p-6 rounded-3xl border border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-base text-white">
              Siap Melihat Preview Ubin yang Sesuai?
            </h4>
            <p className="text-xs text-stone-300">
              Kembali ke halaman utama untuk melihat foto, harga per dus, serta fitur pemesanan WhatsApp.
            </p>
          </div>

          <button
            onClick={onBackToPreview}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-102"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Buka Preview & Katalog Produk</span>
          </button>
        </div>

      </div>
    </div>
  );
};
