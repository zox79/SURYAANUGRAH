import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  X, 
  RotateCcw, 
  Sparkles, 
  Grid3X3, 
  Layers, 
  Mountain, 
  Bath, 
  Package, 
  Search,
  Network,
  ChevronDown
} from 'lucide-react';
import { MainCategory, ProductItem } from '../types';
import { 
  CATEGORIES, 
  PRODUCTS_CATALOG, 
  ALL_SIZES, 
  SURFACE_FINISHES, 
  GRADE_OPTIONS 
} from '../data/storeData';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products?: ProductItem[];
  activeCategory: MainCategory | 'All';
  onSelectCategory: (cat: MainCategory | 'All') => void;
  selectedSubcategory: string | 'All';
  onSelectSubcategory: (subcat: string | 'All') => void;
  selectedSize: string | 'All';
  onSelectSize: (size: string | 'All') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onViewProductDetails: (product: ProductItem) => void;
  onOrderClick: (product: ProductItem) => void;
  onOpenCalculatorWithSize: (size: string) => void;
  onAddToInquiry: (product: ProductItem) => void;
  inquiryProductIds: Set<string>;
  onOpenDiagram: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  selectedSize,
  onSelectSize,
  searchQuery,
  onSearchChange,
  onViewProductDetails,
  onOrderClick,
  onOpenCalculatorWithSize,
  onAddToInquiry,
  inquiryProductIds,
  onOpenDiagram,
}) => {
  const catalogItems = products && products.length > 0 ? products : PRODUCTS_CATALOG;
  const [selectedFinish, setSelectedFinish] = useState<'All' | 'Glossy' | 'Matte'>('All');
  const [selectedGrade, setSelectedGrade] = useState<'All' | 'KW A' | 'KW B' | 'KW C'>('All');
  const [showFilterDrawerMobile, setShowFilterDrawerMobile] = useState(false);

  // Available subcategories based on current active category
  const currentCategoryInfo = useMemo(() => {
    if (activeCategory === 'All') return null;
    return CATEGORIES.find((c) => c.id === activeCategory);
  }, [activeCategory]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return catalogItems.filter((p) => {
      // Category match
      if (activeCategory !== 'All' && p.category !== activeCategory) {
        return false;
      }
      // Subcategory match
      if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
        return false;
      }
      // Size match
      if (selectedSize !== 'All') {
        if (!p.sizes || !p.sizes.includes(selectedSize)) {
          return false;
        }
      }
      // Finish match
      if (selectedFinish !== 'All') {
        if (!p.surfaceFinish || !p.surfaceFinish.includes(selectedFinish)) {
          return false;
        }
      }
      // Grade match
      if (selectedGrade !== 'All') {
        if (!p.grades || !p.grades.includes(selectedGrade)) {
          return false;
        }
      }
      // Search Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSubcat = p.subcategory.toLowerCase().includes(q);
        const matchesSize = p.sizes?.some((s) => s.toLowerCase().includes(q));
        const matchesGrade = p.grades?.some((g) => g.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSubcat && !matchesSize && !matchesGrade) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, selectedSubcategory, selectedSize, selectedFinish, selectedGrade, searchQuery]);

  const hasActiveFilters = 
    activeCategory !== 'All' || 
    selectedSubcategory !== 'All' || 
    selectedSize !== 'All' || 
    selectedFinish !== 'All' || 
    selectedGrade !== 'All' ||
    searchQuery.trim() !== '';

  const resetAllFilters = () => {
    onSelectCategory('All');
    onSelectSubcategory('All');
    onSelectSize('All');
    setSelectedFinish('All');
    setSelectedGrade('All');
    onSearchChange('');
  };

  const getCategoryIcon = (id: MainCategory) => {
    switch (id) {
      case 'Lantai Keramik':
        return <Grid3X3 className="w-4 h-4" />;
      case 'Granit':
        return <Layers className="w-4 h-4" />;
      case 'Batu Alam':
        return <Mountain className="w-4 h-4" />;
      case 'Sanitary':
        return <Bath className="w-4 h-4" />;
      case 'Others/Lainnya':
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <section id="katalog-section" className="py-12 bg-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Bagan callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Katalog Lengkap Sesuai Bagan Toko
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Pilihan Keramik, Granit, Batu Alam & Sanitary
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Navigasi terstruktur sesuai rincian bagan resmi. Pilih kategori, sub-kategori, ukuran dimensi, hingga grade KW A/B/C.
            </p>
          </div>

          {/* Quick Diagram Button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={onOpenDiagram}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Network className="w-4 h-4 text-amber-400" />
              <span>Buka Bagan Hierarki</span>
            </button>
          </div>
        </div>

        {/* 1. Main Category Tabs */}
        <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectSubcategory('All');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeCategory === 'All'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span>Semua Produk</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">
              {catalogItems.length}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = catalogItems.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onSelectSubcategory('All');
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Subcategory Pills (if specific category selected) */}
        {currentCategoryInfo && (
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-stone-200/90 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
              <span>Sub-Kategori untuk {currentCategoryInfo.name}:</span>
              <span className="text-[11px] text-amber-700">{currentCategoryInfo.shortDesc}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectSubcategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedSubcategory === 'All'
                    ? 'bg-stone-900 text-white shadow'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                Semua di {currentCategoryInfo.name}
              </button>

              {currentCategoryInfo.subcategories.map((subcat) => {
                const isActive = selectedSubcategory === subcat;
                const count = catalogItems.filter(
                  (p) => p.category === activeCategory && p.subcategory === subcat
                ).length;
                return (
                  <button
                    key={subcat}
                    onClick={() => onSelectSubcategory(subcat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{subcat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-black/20' : 'bg-stone-200 text-stone-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Deep Filters Bar (Sizes, Finish, Grade, Reset) */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Filter Spesifikasi Bagan:</span>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            
            {/* Filter: Ukuran (Dimensions from diagram) */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Ukuran Dimensi
              </label>
              <select
                value={selectedSize}
                onChange={(e) => onSelectSize(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">Semua Ukuran (25x25 s/d 80x80)</option>
                {ALL_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    Ukuran {sz} cm
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Permukaan Finish */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Permukaan (Finish)
              </label>
              <select
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">Semua Permukaan</option>
                <option value="Glossy">Glossy (Kilap Mewah)</option>
                <option value="Matte">Matte / Doff (Anti Selip)</option>
              </select>
            </div>

            {/* Filter: Grade Kualitas */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Pilihan Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="All">Semua Grade</option>
                <option value="KW A">KW A (Kualitas Utama / Super)</option>
                <option value="KW B">KW B (Standar)</option>
                <option value="KW C">KW C (Paling Ekonomis)</option>
              </select>
            </div>

            {/* Quick Search in catalog */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Kata Kunci / Motif
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Contoh: marmer, andesit, tandon..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

          </div>

          {/* Quick Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
              <span className="text-[11px] text-stone-500 font-medium">Filter aktif:</span>
              
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                  Kategori: {activeCategory}
                  <button onClick={() => onSelectCategory('All')} className="hover:text-amber-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubcategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold">
                  Sub: {selectedSubcategory}
                  <button onClick={() => onSelectSubcategory('All')} className="hover:text-stone-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSize !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                  Ukuran: {selectedSize}
                  <button onClick={() => onSelectSize('All')} className="hover:text-emerald-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedFinish !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 text-xs font-semibold">
                  Finish: {selectedFinish}
                  <button onClick={() => setSelectedFinish('All')} className="hover:text-sky-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedGrade !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold">
                  Grade: {selectedGrade}
                  <button onClick={() => setSelectedGrade('All')} className="hover:text-purple-700">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold">
                  Pencarian: "{searchQuery}"
                  <button onClick={() => onSearchChange('')} className="hover:text-stone-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 4. Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1 text-xs text-stone-500 font-semibold">
            <span>Menampilkan <b>{filteredProducts.length}</b> varian produk</span>
            <span className="text-stone-400">Siap kirim via armada toko</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">
                  Tidak ditemukan produk dengan filter tersebut
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Coba ubah kombinasi ukuran, grade, atau reset filter untuk melihat katalog lengkap Surya Anugrah Keramik.
                </p>
              </div>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProductDetails}
                  onOrderClick={onOrderClick}
                  onAddToCart={onAddToInquiry}
                  isInCart={inquiryProductIds.has(product.id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
