import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_PHONE, STORE_WA_NUMBER } from '../data/storeData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside 
      aria-label="Kontak WhatsApp Cepat"
      className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2"
    >
      {showTooltip && (
        <div className="bg-stone-900 text-white rounded-2xl p-3 shadow-2xl border border-stone-700 max-w-xs animate-bounce flex items-start gap-2 text-left">
          <div className="text-xs">
            <span className="font-extrabold text-emerald-400 block">Chat WhatsApp CS Toko</span>
            <span className="text-stone-300 text-[11px] leading-tight block mt-0.5">
              Tanya stok & nego armada UD. Khrisna Sakti & Surya Anugrah Keramik.
            </span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-white p-0.5 shrink-0"
            aria-label="Tutup pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20saya%20ingin%20tanya%20produk%20dan%20harga`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all ring-4 ring-white/60 focus:outline-none"
        title="Chat WhatsApp Toko (081240548750)"
      >
        <MessageCircle className="w-6 h-6 fill-white shrink-0" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">
          Chat WA Toko
        </span>
      </a>
    </aside>
  );
};
