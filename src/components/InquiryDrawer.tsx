import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Phone, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { InquiryItem, ProductItem } from '../types';
import { STORE_PHONE, STORE_WA_NUMBER, FLEET_INFO } from '../data/storeData';

interface InquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: InquiryItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
  onOrderProduct?: (product: ProductItem) => void;
}

export const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
  onOrderProduct,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('Diwek');
  const [customerNotes, setCustomerNotes] = useState('');

  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSendToWhatsApp = () => {
    let msg = `*DAFTAR KERANJANG KEBUTUHAN MATERIAL*\n`;
    msg += `Toko: Surya Anugrah Keramik & UD. Khrisna Sakti\n`;
    if (customerName.trim()) {
      msg += `Nama Pemesan: *${customerName}*\n`;
    }
    msg += `Lokasi Kirim: *Kec. ${customerDistrict}, Kab. Jombang*\n\n`;
    msg += `*RINCIAN PRODUK KERANJANG:*\n`;

    items.forEach((item, index) => {
      msg += `\n${index + 1}. *${item.product.name}*\n`;
      msg += `   • Kategori: ${item.product.category} - ${item.product.subcategory}\n`;
      if (item.selectedSize) msg += `   • Ukuran: ${item.selectedSize} cm\n`;
      if (item.selectedFinish) msg += `   • Permukaan: ${item.selectedFinish}\n`;
      if (item.selectedCutting) msg += `   • Tipe: ${item.selectedCutting}\n`;
      if (item.selectedGrade) msg += `   • Grade: ${item.selectedGrade}\n`;
      msg += `   • Jumlah: *${item.quantity} ${item.product.unit}*\n`;
    });

    if (customerNotes.trim()) {
      msg += `\n*Catatan Tambahan:* ${customerNotes}\n`;
    }

    msg += `\nMohon info ketersediaan stok, harga total terbaik, dan jadwal armada pengiriman toko ke lokasi saya. Terima kasih!`;

    window.open(`https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Keranjang Belanja Material
              </h3>
              <p className="text-[11px] text-amber-300">
                {items.length} Macam Produk ({totalItemCount} Total Satuan)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-stone-400 hover:text-rose-400 p-1"
                title="Hapus Semua"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-stone-800">
                Keranjang Belanja Masih Kosong
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Jelajahi ubin keramik, granit, batu alam, atau sanitary di katalog dan tekan tombol "Keranjang" untuk menyimpan pilihan Anda.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-500 transition-colors"
              >
                Mulai Pilih Produk
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex gap-3 relative"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-bold text-xs text-stone-900 leading-tight truncate">
                        {item.product.name}
                      </h5>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-0.5"
                        title="Hapus item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {item.selectedSize && (
                        <span className="bg-stone-200 text-stone-800 font-semibold px-1.5 py-0.2 rounded">
                          {item.selectedSize} cm
                        </span>
                      )}
                      {item.selectedGrade && (
                        <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                          {item.selectedGrade}
                        </span>
                      )}
                      {item.selectedFinish && (
                        <span className="bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded">
                          {item.selectedFinish}
                        </span>
                      )}
                    </div>

                    {/* Quantity controller */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-stone-500 font-medium">
                        Jumlah ({item.product.unit}):
                      </span>

                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-700 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-stone-900 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 text-stone-700 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {onOrderProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOrderProduct(item.product);
                          }}
                          className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-transform hover:scale-105"
                          title="Lanjut proses order item ini"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delivery & Destination inputs */}
          {items.length > 0 && (
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-3 pt-3">
              <span className="text-xs font-black uppercase text-amber-900 block">
                Tujuan Kirim Armada Toko:
              </span>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    Nama Anda (Opsional):
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Pak Budi / Bu Rina"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    Kecamatan Pengiriman di Jombang:
                  </label>
                  <select
                    value={customerDistrict}
                    onChange={(e) => setCustomerDistrict(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                  >
                    {FLEET_INFO.coverageAreas.map((area) => (
                      <option key={area} value={area}>
                        Kecamatan {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    Catatan Khusus (Opsional):
                  </label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Contoh: Butuh kirim hari Sabtu, tambah semen nad..."
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Kirim Rincian via WhatsApp ({STORE_PHONE})</span>
            </button>
            <p className="text-[10px] text-center text-stone-500">
              Admin toko akan langsung mengecek stok di gudang Perak & Diwek untuk Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
