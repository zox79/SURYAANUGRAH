import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { FLEET_INFO, STORE_PHONE, STORE_WA_NUMBER } from '../data/storeData';

export const FleetSection: React.FC = () => {
  return (
    <section id="armada-section" className="py-16 bg-stone-900 text-stone-100 relative overflow-hidden border-t border-stone-800">
      
      {/* Background visual accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            Fasilitas Unggulan Toko Kami
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {FLEET_INFO.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            {FLEET_INFO.description}
          </p>
        </div>

        {/* 2 Fleet Vehicle Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FLEET_INFO.fleetVehicles.map((vehicle, idx) => (
            <div
              key={vehicle.name}
              className="bg-stone-800/90 rounded-2xl p-6 border border-stone-700/80 hover:border-amber-400 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                  <Truck className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-600/30">
                  Armada Mandiri #{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {vehicle.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-400 mt-1">
                  Kapasitas: {vehicle.capacity}
                </p>
              </div>

              <div className="bg-stone-850 p-3.5 rounded-xl border border-stone-750 text-xs text-stone-300">
                <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1">
                  Kegunaan & Kelebihan:
                </span>
                {vehicle.benefit}
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-700/60 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pengemudi & tenaga bongkar berpengalaman dalam handling keramik</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Jadwal pengiriman fleksibel sesuai kesiapan tukang di lokasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coverage District Badges */}
        <div className="bg-stone-850/90 rounded-2xl p-6 border border-stone-750 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Jangkauan Wilayah Pengiriman Armada Kami
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Mengantar keramik, granit, semen, dan sanitary ke seluruh area Kabupaten Jombang:
              </p>
            </div>

            <a
              href={`https://wa.me/${STORE_WA_NUMBER}?text=Halo%20Surya%20Anugrah%20Keramik,%20apakah%20armada%20bisa%20kirim%20ke%20lokasi%20saya?`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Cek Jadwal Armada via WA</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {FLEET_INFO.coverageAreas.map((area) => (
              <span
                key={area}
                className="bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Kec. {area}
              </span>
            ))}
          </div>
        </div>

        {/* 3 Value Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-750 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-white">Minim Resiko Pecah</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Penataan dus keramik rapi bersekat untuk melindungi ubin selama perjalanan.</p>
            </div>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-750 flex items-start gap-3">
            <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-white">Tepat Waktu</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Koordinasi langsung dengan sopir toko agar tidak menghambat progres pembangunan.</p>
            </div>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-750 flex items-start gap-3">
            <PackageCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs sm:text-sm text-white">Bongkar Muat Aman</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Barang diturunkan langsung di depan garasi atau lokasi proyek Anda.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
