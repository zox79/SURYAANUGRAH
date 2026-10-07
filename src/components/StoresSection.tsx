import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  Truck,
  ExternalLink
} from 'lucide-react';
import { STORE_BRANCHES, STORE_PHONE, STORE_WA_NUMBER, FLEET_INFO } from '../data/storeData';

export const StoresSection: React.FC = () => {
  return (
    <section id="tokofisik-section" className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            2 Lokasi Toko Fisik di Jombang
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Kunjungi Toko Fisik & Gudang Kami
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Pilih lokasi toko fisik terdekat dari hunian atau proyek Anda. Keduanya terhubung dengan armada pengiriman mandiri kami untuk kemudahan logistik Anda.
          </p>
        </div>

        {/* 2 Store Branch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORE_BRANCHES.map((branch, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={branch.id}
                className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-extrabold tracking-wide shadow-sm">
                      {branch.badge}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {branch.hours}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-amber-700 transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">
                      {branch.type}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-700">
                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80">
                      <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-stone-900 block">Alamat Lengkap:</span>
                        <p className="text-stone-600 leading-relaxed mt-0.5">
                          {branch.address}
                        </p>
                        <span className="text-[11px] text-stone-500 font-mono mt-1 inline-block">
                          Kec. {branch.district}, Kab. Jombang, Jawa Timur
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80">
                      <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-900 block">Nomor WA / Telp:</span>
                        <a 
                          href={`https://wa.me/${branch.waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-black hover:underline"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide block mb-2">
                      Fasilitas Cabang:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Display Keramik & Granit</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Armada Siap Bongkar Muat</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Konsultasi Hitung Luas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Stok Proyek & Eceran</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branch CTAs */}
                <div className="pt-6 mt-6 border-t border-stone-200 grid grid-cols-2 gap-3">
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <span>Petunjuk Arah</span>
                  </a>

                  <a
                    href={`https://wa.me/${branch.waNumber}?text=Halo%20${encodeURIComponent(branch.name)},%20saya%20ingin%20tanya%20produk%20dan%20alamat`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Chat Toko Ini</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
