import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Maximize2, 
  ChevronRight,
  Info,
  Grid
} from 'lucide-react';
import { MainCategory } from '../types';
import { 
  SIZES_KERAMIK_BS, 
  SIZES_KERAMIK_KARDUSAN, 
  SURFACE_FINISHES, 
  CUTTING_OPTIONS, 
  GRADE_OPTIONS 
} from '../data/storeData';

interface InteractiveDiagramProps {
  onSelectSubcategory: (category: MainCategory, subcategory: string, size?: string) => void;
  onCloseModal?: () => void;
  isModalView?: boolean;
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({
  onSelectSubcategory,
  onCloseModal,
  isModalView = false,
}) => {
  const [activeTab, setActiveTab] = useState<MainCategory>('Lantai Keramik');
  const [selectedSpecSize, setSelectedSpecSize] = useState<string | null>(null);

  const tabs: { id: MainCategory; label: string; count: string }[] = [
    { id: 'Lantai Keramik', label: '1. Lantai Keramik', count: 'BS • Kardus • Bonbon' },
    { id: 'Granit', label: '2. Granit', count: 'BS • Kardus • List' },
    { id: 'Batu Alam', label: '3. Batu Alam', count: '5 Varian Alami' },
    { id: 'Sanitary', label: '4. Sanitary', count: '6 Perlengkapan' },
    { id: 'Others/Lainnya', label: '5. Others/Lainnya', count: '5 Bahan Pendukung' },
  ];

  const handleNodeClick = (cat: MainCategory, subcat: string, size?: string) => {
    onSelectSubcategory(cat, subcat, size);
    if (onCloseModal) {
      onCloseModal();
    }
    // Smooth scroll to catalog
    const catalogEl = document.getElementById('katalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl ${isModalView ? 'p-4 sm:p-6' : 'my-8 p-4 sm:p-8'}`}>
      
      {/* Header bar of Diagram */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Network className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Bagan Struktur Produk Interaktif
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Visualisasi bagan hierarki resmi toko. Klik pada bagian bagan untuk langsung memfilter katalog produk di bawah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Klik Node untuk Filter Cepat
          </span>
        </div>
      </div>

      {/* Diagram Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-stone-800 scrollbar-none text-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all flex flex-col items-start gap-0.5 border ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-stone-800/80 text-stone-300 border-stone-700/80 hover:bg-stone-750 hover:text-white'
              }`}
            >
              <span className="text-xs font-extrabold">{tab.label}</span>
              <span className={`text-[10px] ${isActive ? 'text-stone-900/80 font-semibold' : 'text-stone-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Content Area based on Selected Category */}
      <div className="pt-6">

        {/* 1. LANTAI KERAMIK BAGAN (Page 1 in PDF) */}
        {activeTab === 'Lantai Keramik' && (
          <div className="space-y-6">
            <div className="bg-stone-850/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span><b>Bagan Halaman 1:</b> Lantai Keramik terbagi menjadi 3 cabang utama (Keramik BS, Kardusan, Kukumacan).</span>
              <span className="text-amber-400 font-medium hidden sm:inline">Pilihan Permukaan & Ukuran Lengkap</span>
            </div>

            {/* Tree Branch Visual Representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

              {/* Branch 1: Keramik BS */}
              <div className="bg-gradient-to-b from-stone-800 to-stone-850 rounded-2xl p-5 border border-amber-500/30 relative flex flex-col justify-between shadow-lg hover:border-amber-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-600/30">
                      Sub-Kategori 1
                    </span>
                    <span className="text-[10px] text-stone-400">Harga Terhemat</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">Keramik BS</h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Kualitas Bukan Standar (BS) dengan fisik prima untuk kebutuhan hemat proyek, gudang, dan renovasi.
                    </p>
                  </div>

                  {/* Level 2: Pilihan Ukuran */}
                  <div className="space-y-2 pt-2 border-t border-stone-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Pilihan Ukuran (12 Ukuran)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SIZES_KERAMIK_BS.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleNodeClick('Lantai Keramik', 'Keramik BS', sz)}
                          className="px-2 py-1 bg-stone-750 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-[11px] font-semibold rounded border border-stone-600/60 transition-colors"
                          title={`Cari Keramik BS ukuran ${sz}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level 3: Pilihan Permukaan */}
                  <div className="space-y-2 pt-2 border-t border-stone-700/60">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Pilihan Permukaan & Cutting
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-750/70 p-2 rounded-lg border border-stone-700">
                        <span className="block text-[10px] text-stone-400 uppercase">Tekstur:</span>
                        <span className="font-bold text-white">Glossy / Matte</span>
                      </div>
                      <div className="bg-stone-750/70 p-2 rounded-lg border border-stone-700">
                        <span className="block text-[10px] text-stone-400 uppercase">Pinggiran:</span>
                        <span className="font-bold text-white">Cutting / Non Cutting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-700/60">
                  <button
                    onClick={() => handleNodeClick('Lantai Keramik', 'Keramik BS')}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <span>Lihat Koleksi Keramik BS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Branch 2: Kardusan */}
              <div className="bg-gradient-to-b from-stone-800 to-stone-850 rounded-2xl p-5 border border-sky-500/30 relative flex flex-col justify-between shadow-lg hover:border-sky-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-600/30">
                      Sub-Kategori 2
                    </span>
                    <span className="text-[10px] text-stone-400">Dus Resmi Pabrik</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">Kardusan</h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Keramik dus pabrikan resmi dengan opsi Grade KW A (Super presisi), KW B, dan KW C.
                    </p>
                  </div>

                  {/* Level 2: Pilihan Ukuran Kardusan */}
                  <div className="space-y-2 pt-2 border-t border-stone-700/60">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Pilihan Ukuran (9 Ukuran)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SIZES_KERAMIK_KARDUSAN.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleNodeClick('Lantai Keramik', 'Kardusan', sz)}
                          className="px-2 py-1 bg-stone-750 hover:bg-sky-400 hover:text-stone-950 text-stone-200 text-[11px] font-semibold rounded border border-stone-600/60 transition-colors"
                          title={`Cari Keramik Kardusan ukuran ${sz}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level 3: Pilihan Permukaan */}
                  <div className="space-y-2 pt-2 border-t border-stone-700/60">
                    <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Permukaan & Cutting
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-750/70 p-2 rounded-lg border border-stone-700">
                        <span className="block text-[10px] text-stone-400 uppercase">Tekstur:</span>
                        <span className="font-bold text-white">Glossy / Matte</span>
                      </div>
                      <div className="bg-stone-750/70 p-2 rounded-lg border border-stone-700">
                        <span className="block text-[10px] text-stone-400 uppercase">Pinggiran:</span>
                        <span className="font-bold text-white">Cutting / Non Cutting</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 4: Pilihan Grade (KW A, KW B, KW C) */}
                  <div className="space-y-2 pt-2 border-t border-stone-700/60">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Pilihan Grade
                    </span>
                    <div className="flex gap-2">
                      {GRADE_OPTIONS.map((grd) => (
                        <button
                          key={grd}
                          onClick={() => handleNodeClick('Lantai Keramik', 'Kardusan')}
                          className="flex-1 py-1.5 px-2 bg-stone-750 hover:bg-amber-500 hover:text-stone-950 rounded text-center font-bold text-xs text-amber-300 border border-stone-700 transition-colors"
                        >
                          {grd}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-700/60">
                  <button
                    onClick={() => handleNodeClick('Lantai Keramik', 'Kardusan')}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <span>Lihat Koleksi Kardusan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Branch 3: Kukumacan */}
              <div className="bg-gradient-to-b from-stone-800 to-stone-850 rounded-2xl p-5 border border-purple-500/30 relative flex flex-col justify-between shadow-lg hover:border-purple-400 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-600/30">
                      Sub-Kategori 3
                    </span>
                    <span className="text-[10px] text-stone-400">Step Nosing Sudut</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">Kukumacan</h3>
                    <p className="text-xs text-stone-300 mt-1">
                      Bon-bon profil pelindung tepi tangga & pinggiran keramik meja kompor agar tidak tajam atau rawan gompal.
                    </p>
                  </div>

                  {/* Level: Pilihan Grade */}
                  <div className="space-y-3 pt-3 border-t border-stone-700/60">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Pilihan Grade Kukumacan:
                    </span>
                    <div className="space-y-2">
                      {GRADE_OPTIONS.map((grd) => (
                        <div 
                          key={grd}
                          onClick={() => handleNodeClick('Lantai Keramik', 'Kukumacan')}
                          className="cursor-pointer bg-stone-750/80 hover:bg-stone-700 p-2.5 rounded-xl border border-stone-700 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-extrabold text-xs text-white">{grd}</span>
                            <span className="text-[11px] text-stone-400 ml-2">
                              {grd === 'KW A' ? 'Kualitas Utama Terbaik' : grd === 'KW B' ? 'Pilihan Standar' : 'Paling Ekonomis'}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-700/60">
                  <button
                    onClick={() => handleNodeClick('Lantai Keramik', 'Kukumacan')}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <span>Lihat Kukumacan KW A, B, C</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. GRANIT BAGAN (Page 2 in PDF) */}
        {activeTab === 'Granit' && (
          <div className="space-y-6">
            <div className="bg-stone-850/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span><b>Bagan Halaman 2:</b> Granit terbagi menjadi 3 cabang pilihan (Keramik BS, Kardusan, List).</span>
              <span className="text-amber-400 font-medium">Glazed Polished & Matte</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Granit BS */}
              <div 
                onClick={() => handleNodeClick('Granit', 'Keramik BS')}
                className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 rounded-2xl p-5 border border-stone-700 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-stone-900 px-2 py-0.5 rounded">
                      Granit Cabang 1
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">Hemat Rasa Mewah</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Keramik BS (Granit BS)</h3>
                  <p className="text-xs text-stone-300 mt-2">
                    Granit bodi berat homogeneus non-standar. Efisiensi luar biasa untuk lantai ruko, showroom, dan rumah bernuansa marmer.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-stone-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Ukuran 60x60 & 80x80
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Motif marmer mewah & abu minimalis
                    </li>
                  </ul>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Lihat Produk Granit BS</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Granit Kardusan */}
              <div 
                onClick={() => handleNodeClick('Granit', 'Kardusan')}
                className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 rounded-2xl p-5 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded">
                      Granit Cabang 2
                    </span>
                    <span className="text-xs font-semibold text-amber-400">Paling Populer</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Kardusan (Dus Resmi)</h3>
                  <p className="text-xs text-stone-300 mt-2">
                    Granit glazed polished kemasan dus asli pabrikan. Kualitas super KW A tahan gores, nano polished kilap kaca, dan motif marmer continuous.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-stone-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Pilihan Glossy / Nano Polished
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Pilihan Rustic Matte Stone
                    </li>
                  </ul>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Lihat Granit Dus Resmi</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Granit List */}
              <div 
                onClick={() => handleNodeClick('Granit', 'List')}
                className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 rounded-2xl p-5 border border-stone-700 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-900 px-2 py-0.5 rounded">
                      Granit Cabang 3
                    </span>
                    <span className="text-xs font-semibold text-stone-300">Finishing Interior</span>
                  </div>
                  <h3 className="text-lg font-black text-white">List Granit & Step Nosing</h3>
                  <p className="text-xs text-stone-300 mt-2">
                    Plint skirting bawah dinding dan lis trap tangga bergaris anti-selip. Menjaga dinding dari kotoran alat pel serta mempercantik tangga.
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-stone-400">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      List dinding plint 10x60
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      Step Nosing tangga 30x60 anti slip
                    </li>
                  </ul>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Lihat List Granit</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. BATU ALAM BAGAN (Page 2 in PDF) */}
        {activeTab === 'Batu Alam' && (
          <div className="space-y-6">
            <div className="bg-stone-850/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span><b>Bagan Halaman 2:</b> 5 Cabang Batu Alam (Wall Cladding, RTM + RTA, List, Koral Hias, Batu Acak).</span>
              <span className="text-amber-400 font-medium">Bahan Asli Tambang Pilihan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {[
                { name: 'Wall Cladding', desc: 'Susun sirih & panel dinding 3D relief untuk pilar & fasad.', subcat: 'Wall Cladding' },
                { name: 'RTM + RTA', desc: 'Rata Mesin & Rata Alam andesit, candi, dan paras Jogja.', subcat: 'RTM + RTA' },
                { name: 'List', desc: 'List profil batu alam pembatas bidang dan mahkota pilar.', subcat: 'List' },
                { name: 'Koral Hias', desc: 'Koral sikat putih kupang, hitam alor, & panca warna taman.', subcat: 'Koral Hias' },
                { name: 'Batu Acak', desc: 'Lempeng acak rustic untuk jalan setapak taman & carport.', subcat: 'Batu Acak' },
              ].map((item, idx) => (
                <div
                  key={item.name}
                  onClick={() => handleNodeClick('Batu Alam', item.subcat)}
                  className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 p-4 rounded-xl border border-stone-700 hover:border-amber-400 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                      Cabang #{idx + 1}
                    </div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>Lihat Varian</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SANITARY BAGAN (Page 2 in PDF) */}
        {activeTab === 'Sanitary' && (
          <div className="space-y-6">
            <div className="bg-stone-850/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span><b>Bagan Halaman 2:</b> 6 Cabang Sanitary (Pintu KM, Kloset, Tandon, BCP+Sink, Kran, Others/Lainnya).</span>
              <span className="text-amber-400 font-medium">Perlengkapan Kamar Mandi & Dapur</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Pintu Kamar Mandi', subcat: 'Pintu Kamar Mandi', desc: 'Pintu PVC tebal dan aluminium kokoh anti lapuk lengkap aksesoris kunci.' },
                { name: 'Kloset', subcat: 'Kloset', desc: 'Kloset duduk modern dual flush hemat air & kloset jongkok keramik porselen halus.' },
                { name: 'Tandon', subcat: 'Tandon', desc: 'Tandon / tangki air anti lumut teknologi 3 lapis kapasitas 300L hingga 1200L.' },
                { name: 'BCP + Sink', subcat: 'BCP+Sink', desc: 'Bak Cuci Piring (Kitchen Sink) stainless sus tebal 1 & 2 lubang plus sayap tirisan.' },
                { name: 'Kran', subcat: 'Kran', desc: 'Kran wastafel up-down, kran dapur leher fleksibel, kran cabang, dan shower set.' },
                { name: 'Others / Lainnya', subcat: 'Others/Lainnya', desc: 'Floor drain stainless magnetic anti-bau, jet washer bidet, dan afur pembuangan.' },
              ].map((item, idx) => (
                <div
                  key={item.name}
                  onClick={() => handleNodeClick('Sanitary', item.subcat)}
                  className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 p-4 rounded-xl border border-stone-700 hover:border-amber-400 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="text-[10px] font-mono text-sky-400 font-bold mb-1">
                      Sanitary #{idx + 1}
                    </div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>Lihat Produk Sanitary</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. OTHERS/LAINNYA BAGAN (Page 3 in PDF) */}
        {activeTab === 'Others/Lainnya' && (
          <div className="space-y-6">
            <div className="bg-stone-850/60 rounded-xl p-3 border border-stone-800 flex items-center justify-between text-xs text-stone-300">
              <span><b>Bagan Halaman 3:</b> 5 Cabang Produk Lainnya (Semen, Nad, Coating, WPC, Tempat Sabun).</span>
              <span className="text-amber-400 font-medium">Bahan Bangunan & Aksesoris Finishing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {[
                { name: 'Semen', subcat: 'Semen', desc: 'Semen perekat keramik & granit anti popping / kopong.' },
                { name: 'Nad', subcat: 'Nad', desc: 'Pengisi rongga nat ubin kedap air & anti jamur aneka warna.' },
                { name: 'Coating', subcat: 'Coating', desc: 'Pelapis batu alam kilap (wet look) & doff pelindung cuaca.' },
                { name: 'WPC', subcat: 'WPC', desc: 'Wood Plastic Composite wall panel kisi-kisi kayu estetis.' },
                { name: 'Tempat Sabun', subcat: 'Tempat Sabun', desc: 'Wadah sabun keramik tempel tanam & gantung stainless.' },
              ].map((item, idx) => (
                <div
                  key={item.name}
                  onClick={() => handleNodeClick('Others/Lainnya', item.subcat)}
                  className="cursor-pointer bg-stone-800/90 hover:bg-stone-750 p-4 rounded-xl border border-stone-700 hover:border-amber-400 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                      Kategori #{idx + 1}
                    </div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] font-bold text-amber-400">
                    <span>Pilih Bahan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
