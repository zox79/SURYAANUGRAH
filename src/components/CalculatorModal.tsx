import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Layers, 
  Truck, 
  Phone, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { ALL_SIZES, STORE_WA_NUMBER, STORE_PHONE, FLEET_INFO } from '../data/storeData';

interface CalculatorModalProps {
  initialSize?: string;
  onClose: () => void;
}

// Coverage per box in m² for standard tile sizes
const TILE_COVERAGE_MAP: Record<string, { m2PerBox: number; pcsPerBox: number; kgPerBox: number }> = {
  '25x25': { m2PerBox: 1.00, pcsPerBox: 16, kgPerBox: 15 },
  '20x25': { m2PerBox: 1.00, pcsPerBox: 20, kgPerBox: 14 },
  '25x40': { m2PerBox: 1.00, pcsPerBox: 10, kgPerBox: 16 },
  '25x50': { m2PerBox: 1.00, pcsPerBox: 8, kgPerBox: 17 },
  '30x30': { m2PerBox: 1.00, pcsPerBox: 11, kgPerBox: 16 },
  '40x40': { m2PerBox: 0.96, pcsPerBox: 6, kgPerBox: 17 },
  '50x50': { m2PerBox: 1.00, pcsPerBox: 4, kgPerBox: 20 },
  '60x60': { m2PerBox: 1.44, pcsPerBox: 4, kgPerBox: 30 },
  '30x40': { m2PerBox: 0.96, pcsPerBox: 8, kgPerBox: 16 },
  '40x50': { m2PerBox: 1.00, pcsPerBox: 5, kgPerBox: 18 },
  '25x60': { m2PerBox: 1.05, pcsPerBox: 7, kgPerBox: 19 },
  '30x60': { m2PerBox: 1.44, pcsPerBox: 8, kgPerBox: 28 },
  '80x80': { m2PerBox: 1.92, pcsPerBox: 3, kgPerBox: 48 },
};

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  initialSize = '40x40',
  onClose,
}) => {
  const [length, setLength] = useState<number>(4);
  const [width, setWidth] = useState<number>(5);
  const [wastePercentage, setWastePercentage] = useState<number>(5);
  const [selectedSize, setSelectedSize] = useState<string>(
    TILE_COVERAGE_MAP[initialSize] ? initialSize : '40x40'
  );
  const [district, setDistrict] = useState<string>('Diwek');
  const [projectNote, setProjectNote] = useState<string>('Ruang Tamu & Teras');

  // Calculation logic
  const results = useMemo(() => {
    const rawArea = Math.max(0, length * width);
    const wasteFactor = 1 + wastePercentage / 100;
    const totalAreaWithWaste = rawArea * wasteFactor;

    const tileSpec = TILE_COVERAGE_MAP[selectedSize] || { m2PerBox: 1.0, pcsPerBox: 4, kgPerBox: 20 };
    const boxesNeeded = Math.ceil(totalAreaWithWaste / tileSpec.m2PerBox);
    const totalPieces = boxesNeeded * tileSpec.pcsPerBox;
    const estimatedWeightKg = boxesNeeded * tileSpec.kgPerBox;

    // Delivery fleet recommendation
    let recommendedVehicle = 'Armada Pick-Up L300 / GranMax';
    if (boxesNeeded > 120 || estimatedWeightKg > 2000) {
      recommendedVehicle = 'Armada Truk Colt Diesel Toko';
    }

    return {
      rawArea: rawArea.toFixed(2),
      totalAreaWithWaste: totalAreaWithWaste.toFixed(2),
      boxesNeeded,
      totalPieces,
      estimatedWeightKg,
      m2PerBox: tileSpec.m2PerBox,
      pcsPerBox: tileSpec.pcsPerBox,
      recommendedVehicle,
    };
  }, [length, width, wastePercentage, selectedSize]);

  const handleSendToWhatsApp = () => {
    let msg = `*KONSULTASI HITUNG KEBUTUHAN KERAMIK / GRANIT*\n`;
    msg += `Halo Surya Anugrah Keramik & UD. Khrisna Sakti,\n\n`;
    msg += `Saya telah menghitung kebutuhan untuk proyek saya:\n`;
    msg += `• Catatan: ${projectNote}\n`;
    msg += `• Ukuran Ruangan: ${length} m x ${width} m (${results.rawArea} m²)\n`;
    msg += `• Ukuran Keramik: ${selectedSize} cm\n`;
    msg += `• Cadangan Potongan: ${wastePercentage}%\n`;
    msg += `• Luas Total Kebutuhan: ${results.totalAreaWithWaste} m²\n`;
    msg += `• *Estimasi Kebutuhan: ${results.boxesNeeded} Dus* (${results.totalPieces} keping)\n`;
    msg += `• Estimasi Berat: ± ${results.estimatedWeightKg} kg\n`;
    msg += `• Armada Rekomendasi: ${results.recommendedVehicle}\n`;
    msg += `• Lokasi Proyek: Kec. ${district}, Jombang\n\n`;
    msg += `Mohon info ketersediaan stok motif, grade (KW A / BS / Dus), dan ongkir armada sampai lokasi. Terima kasih!`;

    window.open(`https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Kalkulator Kebutuhan Dus Keramik
              </h3>
              <p className="text-xs text-amber-300">
                Hitung akurat luas ruangan, kebutuhan dus, & armada pengiriman toko
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Step 1: Dimensi Ruangan */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-amber-800 tracking-wider block">
              1. Ukuran Ruangan Proyek
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Panjang (Meter)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={length}
                    onChange={(e) => setLength(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-stone-400 font-bold">meter</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Lebar (Meter)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={width}
                    onChange={(e) => setWidth(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-stone-400 font-bold">meter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Ukuran Tile & Cadangan Potongan */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-amber-800 tracking-wider block">
              2. Pilihan Ukuran Keramik / Granit
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ukuran Ubin (cm)
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                >
                  {Object.keys(TILE_COVERAGE_MAP).map((sz) => (
                    <option key={sz} value={sz}>
                      {sz} cm ({TILE_COVERAGE_MAP[sz].m2PerBox} m²/dus)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Cadangan Potongan Keramik
                </label>
                <select
                  value={wastePercentage}
                  onChange={(e) => setWastePercentage(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>5% (Standar pemasangan lurus)</option>
                  <option value={10}>10% (Pemasangan diagonal / banyak pilar)</option>
                  <option value={15}>15% (Pola rumit / banyak sudut sempit)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Lokasi Proyek & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kecamatan Pengiriman di Jombang
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500"
              >
                {FLEET_INFO.coverageAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Keterangan Ruangan (Opsional)
              </label>
              <input
                type="text"
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
                placeholder="Contoh: Kamar Mandi, Teras, Ruko..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Results Display Card */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-2xl p-5 border border-stone-700 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700/80">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Hasil Perhitungan Rekomendasi
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Luas: {results.rawArea} m² + cadangan = {results.totalAreaWithWaste} m²
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase">Total Kebutuhan:</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">
                  {results.boxesNeeded} Dus
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  ({results.totalPieces} keping)
                </span>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase">Estimasi Bobot:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  ±{results.estimatedWeightKg} kg
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  {(results.estimatedWeightKg / 1000).toFixed(1)} Ton
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-stone-800/80 p-3 rounded-xl border border-stone-700">
                <span className="text-[10px] text-stone-400 block uppercase">Armada Toko:</span>
                <span className="text-xs font-extrabold text-sky-300 block mt-1">
                  {results.recommendedVehicle}
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  Siap kirim ke Kec. {district}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-800/40 p-2.5 rounded-lg border border-stone-700/50">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Hasil sudah termasuk spare cadangan pecahan potong. Hubungi admin kami untuk rekomendasi motif & semen perekat/nad.
              </span>
            </div>
          </div>

          {/* Action WhatsApp Button */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Kirim Rincian Hasil ke WhatsApp ({STORE_PHONE})</span>
            </button>
            <p className="text-[11px] text-center text-stone-500">
              Admin UD. Khrisna Sakti & Surya Anugrah Keramik akan segera merespons ketersediaan stok & jadwal armada.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
