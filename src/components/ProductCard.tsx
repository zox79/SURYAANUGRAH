import React from 'react';
import { 
  Check, 
  ShoppingCart, 
  ShoppingBag, 
  Phone, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { ProductItem } from '../types';
import { STORE_WA_NUMBER } from '../data/storeData';

interface ProductCardProps {
  product: ProductItem;
  onViewDetails: (product: ProductItem) => void;
  onOrderClick: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onOrderClick,
  onAddToCart,
  isInCart = false,
}) => {
  const defaultSize = product.defaultSize || (product.sizes && product.sizes[0]);

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Halo Surya Anugrah Keramik, saya tertarik dengan produk:\n*${product.name}*\nKategori: ${product.category} - ${product.subcategory}\nUkuran: ${defaultSize || '-'}\nMohon informasi ketersediaan stok & harga terbaru.`
    );
    window.open(`https://wa.me/${STORE_WA_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Card Image & Badges */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-80" />

          {/* Subcategory & Category Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            <span className="bg-amber-600/90 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow backdrop-blur-sm">
              {product.subcategory}
            </span>
            {product.isPopular && (
              <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Terlaris
              </span>
            )}
          </div>

          {/* Unit / Stock badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-stone-900/80 text-stone-200 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm border border-stone-700">
              Satuan: /{product.unit}
            </span>
          </div>

          {/* Bottom Overlay Title in Image */}
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <span className="text-[10px] text-amber-300 font-medium tracking-wider uppercase block">
              {product.category}
            </span>
            <p className="text-xs font-semibold text-stone-200 truncate">
              {product.features[0] || 'Kualitas Terjamin'}
            </p>
          </div>
        </div>

        {/* Card Content Details */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-stone-600 line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>

          {/* Specifications Pills */}
          <div className="space-y-1.5 pt-1">
            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="text-[11px] font-semibold text-stone-400 shrink-0">Ukuran:</span>
                <div className="flex flex-wrap gap-1 overflow-hidden max-h-6">
                  {product.sizes.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="bg-stone-100 text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-stone-200"
                    >
                      {s}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="text-[10px] text-stone-500 font-semibold self-center">
                      +{product.sizes.length - 4} lagi
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Surface Finish & Cutting */}
            {(product.surfaceFinish || product.cuttingType) && (
              <div className="flex flex-wrap items-center gap-1 text-[11px]">
                {product.surfaceFinish?.map((finish) => (
                  <span
                    key={finish}
                    className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  >
                    {finish}
                  </span>
                ))}
                {product.cuttingType?.map((c) => (
                  <span
                    key={c}
                    className="bg-sky-50 text-sky-900 border border-sky-200 text-[10px] font-bold px-1.5 py-0.5 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Grades (KW A, B, C) */}
            {product.grades && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] font-semibold text-stone-400">Pilihan Grade:</span>
                <div className="flex gap-1">
                  {product.grades.map((grd) => (
                    <span
                      key={grd}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-black px-1.5 py-0.5 rounded"
                    >
                      {grd}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price Range Estimate */}
          {product.estimatedPriceRange && (
            <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block">Estimasi Harga:</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                  {product.estimatedPriceRange}
                </span>
                <span className="text-[10px] text-stone-500 ml-1">/{product.unit}</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                Stok Ready
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons: Keranjang & Order (Sesuai Permintaan User) */}
      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Tombol Keranjang (sebelumnya: estimasi) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`py-2.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
              isInCart
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-700 hover:text-stone-900'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
                <span>Keranjang</span>
              </>
            )}
          </button>

          {/* Tombol Order (sebelumnya: hitung dus) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOrderClick(product);
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/20 transition-all hover:scale-102"
            title="Pesan ubin ini langsung & terbitkan resi"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order</span>
          </button>
        </div>

        {/* WhatsApp Direct Action */}
        <button
          type="button"
          onClick={handleDirectWhatsApp}
          className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tanya Stok & Harga via WA</span>
        </button>
      </div>
    </div>
  );
};
