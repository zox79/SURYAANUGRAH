import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Phone, 
  Calculator, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ProductItem } from '../types';
import { STORE_WA_NUMBER, STORE_PHONE, STORE_BRANCHES } from '../data/storeData';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onOpenCalculatorWithSize: (size: string) => void;
  onAddToInquiryWithOptions: (
    product: ProductItem, 
    options: { size?: string; finish?: string; cutting?: string; grade?: string; quantity: number }
  ) => void;
  onOrderClick?: (product: ProductItem) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenCalculatorWithSize,
  onAddToInquiryWithOptions,
  onOrderClick,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.defaultSize || (product.sizes ? product.sizes[0] : '')
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(
    product.surfaceFinish ? product.surfaceFinish[0] : ''
  );
  const [selectedCutting, setSelectedCutting] = useState<string>(
    product.cuttingType ? product.cuttingType[0] : ''
  );
  const [selectedGrade, setSelectedGrade] = useState<string>(
    product.grades ? product.grades[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(10);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleWhatsAppInquiry = () => {
    let msg = `Halo Surya Anugrah Keramik, saya tertarik dengan:\n`;
    msg += `*${product.name}*\n`;
    msg += `• Kategori: ${product.category} (${product.subcategory})\n`;
    if (selectedSize) msg += `• Ukuran: ${selectedSize} cm\n`;
    if (selectedFinish) msg += `• Permukaan: ${selectedFinish}\n`;
    if (selectedCutting) msg += `• Tipe Pinggiran: ${selectedCutting}\n`;
    if (selectedGrade) msg += `• Grade: ${selectedGrade}\n`;
    msg += `• Estimasi Kebutuhan: ${quantity} ${product.unit}\n\n`;
    msg += `Apakah stok tersedia di cabang Perak (UD. Khrisna Sakti) atau Balongbesuk Diwek? Terima kasih!`;

    window.open(`https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddEstimate = () => {
    onAddToInquiryWithOptions(product, {
      size: selectedSize,
      finish: selectedFinish,
      cutting: selectedCutting,
      grade: selectedGrade,
      quantity,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Column */}
          <div className="relative h-64 md:h-full min-h-[280px] bg-stone-900">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-600 text-white inline-block">
                {product.category} • {product.subcategory}
              </span>
              <div className="flex items-center gap-2 pt-1 text-xs text-amber-200">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Pengiriman armada pick-up & truk toko</span>
              </div>
            </div>
          </div>

          {/* Details & Configurator Column */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Spesifikasi Resmi Bagan
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Badge */}
            {product.estimatedPriceRange && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 font-semibold block uppercase">
                    Kisaran Harga Estimasi:
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-900">
                    {product.estimatedPriceRange}
                  </span>
                  <span className="text-[11px] text-amber-700 ml-1">/{product.unit}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold border border-emerald-300">
                  Stok Siap Kirim
                </span>
              </div>
            )}

            {/* Option 1: Sizes Picker */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Pilih Ukuran Dimensi (cm):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        selectedSize === sz
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Option 2: Surface Finish (Glossy vs Matte) */}
            {product.surfaceFinish && product.surfaceFinish.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Pilihan Permukaan (Tekstur):
                </label>
                <div className="flex gap-2">
                  {product.surfaceFinish.map((finish) => (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border text-center ${
                        selectedFinish === finish
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {finish === 'Glossy' ? 'Glossy (Mengkilap)' : 'Matte (Doff/Kasar)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Option 3: Cutting / Non Cutting */}
            {product.cuttingType && product.cuttingType.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Pilihan Tepi (Cutting):
                </label>
                <div className="flex gap-2">
                  {product.cuttingType.map((cutting) => (
                    <button
                      key={cutting}
                      type="button"
                      onClick={() => setSelectedCutting(cutting)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border text-center ${
                        selectedCutting === cutting
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cutting === 'Cutting' ? 'Cutting (Tepi Presisi Siku)' : 'Non Cutting (Standar)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Option 4: Grade KW A, KW B, KW C */}
            {product.grades && product.grades.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Pilihan Grade Kualitas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.grades.map((grd) => (
                    <button
                      key={grd}
                      type="button"
                      onClick={() => setSelectedGrade(grd)}
                      className={`py-2 px-2 rounded-lg text-xs font-extrabold transition-all border text-center ${
                        selectedGrade === grd
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {grd}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500">
                  *KW A = Tingkat kesempurnaan tertinggi. KW B & C = Opsi hemat untuk volume proyek luas.
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <label className="text-xs font-bold text-stone-700">
                Perkiraan Kebutuhan ({product.unit}):
              </label>
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className="px-3 py-1 text-sm font-black hover:bg-stone-200 text-stone-800"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs font-bold bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 5)}
                  className="px-3 py-1 text-sm font-black hover:bg-stone-200 text-stone-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Features checkmarks */}
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-1.5">
              <span className="text-[11px] font-bold text-stone-600 block uppercase">
                Keunggulan Produk:
              </span>
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddEstimate}
                  className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tersimpan di Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Masuk Keranjang</span>
                    </>
                  )}
                </button>

                {onOrderClick ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOrderClick(product);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Sekarang</span>
                  </button>
                ) : (
                  selectedSize && selectedSize.includes('x') && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCalculatorWithSize(selectedSize);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Calculator className="w-4 h-4 text-amber-700" />
                      <span>Hitung Dus</span>
                    </button>
                  )
                )}
              </div>

              {/* Direct WhatsApp Callout */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Konsultasikan via WhatsApp ({STORE_PHONE})</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
