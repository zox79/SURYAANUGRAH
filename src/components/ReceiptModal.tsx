import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Building2, 
  Share2, 
  Download,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { OrderRecord } from '../types';
import { STORE_PHONE, STORE_WA_NUMBER, STORE_TAGLINE, STORE_BRANCHES } from '../data/storeData';

interface ReceiptModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  isOfficialPaidReceipt?: boolean; // True jika resi pembelian lunas
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onClose,
  isOfficialPaidReceipt = false,
}) => {
  if (!order) return null;

  const isPaid = order.paymentStatus === 'paid' || isOfficialPaidReceipt;

  const handlePrint = () => {
    window.print();
  };

  const handleSendToWhatsApp = () => {
    let msg = `*${isPaid ? 'BUKTI PEMBELIAN RESMI (LUNAS)' : 'RESI PEMESANAN'}*\n`;
    msg += `No. Resi: *${order.receiptNumber || order.orderNumber}*\n`;
    msg += `Nama: *${order.customerName}*\n`;
    msg += `No. HP: *${order.customerPhone}*\n`;
    msg += `Status: *${isPaid ? 'LUNAS (VERIFIED)' : 'MENUNGGU PEMBAYARAN'}*\n\n`;
    msg += `*RINCIAN PRODUK:*\n`;
    order.items.forEach((it, i) => {
      msg += `${i + 1}. ${it.productName}\n`;
      msg += `   • Spek: Ukuran ${it.size || '-'} | Grade ${it.grade || '-'} | ${it.surfaceFinish || '-'} | ${it.cuttingType || '-'}\n`;
      msg += `   • Qty: ${it.quantity} ${it.unit} x Rp ${it.unitPrice.toLocaleString('id-ID')} = Rp ${it.totalPrice.toLocaleString('id-ID')}\n`;
    });
    msg += `\nSubtotal: Rp ${order.subtotal.toLocaleString('id-ID')}\n`;
    msg += `Ongkir: Rp ${order.shippingCost.toLocaleString('id-ID')} (${order.shippingMethod === 'delivery' ? `Armada ke Kec. ${order.deliveryDistrict}` : 'Diambil ke Toko'})\n`;
    msg += `*TOTAL AKHIR: Rp ${order.totalAmount.toLocaleString('id-ID')}*\n\n`;
    if (order.shippingMethod === 'delivery') {
      msg += `Alamat Kirim: ${order.deliveryAddress}, Kec. ${order.deliveryDistrict}, Jombang\n\n`;
    } else {
      msg += `Pengambilan di: ${order.pickupStoreBranch || 'Surya Anugrah Keramik (Diwek)'}\n\n`;
    }
    msg += `Mohon dicek oleh admin Surya Anugrah Keramik / UD. Khrisna Sakti. Terima kasih!`;

    window.open(`https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-stone-950'
            }`}>
              {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {isPaid ? 'Resi Pembelian Resmi (Lunas)' : 'Resi Pemesanan Pelanggan'}
              </h3>
              <p className="text-[11px] text-stone-400">
                Surya Anugrah Keramik & UD. Khrisna Sakti Jombang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Cetak Resi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-stone-50 space-y-6 print:p-0 print:bg-white text-stone-900">
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 relative overflow-hidden">
            
            {/* LUNAS Watermark Stamp */}
            {isPaid && (
              <div className="absolute right-6 top-24 pointer-events-none select-none rotate-[-15deg] opacity-80 border-4 border-emerald-600 rounded-2xl px-6 py-2.5 bg-emerald-50/50">
                <span className="font-black text-2xl sm:text-3xl text-emerald-700 tracking-widest block text-center uppercase">
                  LUNAS
                </span>
                <span className="text-[10px] text-emerald-800 font-bold block text-center">
                  TERVERIFIKASI
                </span>
              </div>
            )}

            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b-2 border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-black text-lg text-stone-900 tracking-tight">
                    SURYA ANUGRAH KERAMIK
                  </span>
                </div>
                <p className="text-xs text-amber-700 font-semibold">{STORE_TAGLINE}</p>
                <p className="text-[11px] text-stone-500">
                  Temuwulan, Perak & Balongbesuk, Diwek, Jombang
                </p>
                <p className="text-[11px] text-stone-500 font-mono">
                  WA: {STORE_PHONE}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className={`inline-block text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                  isPaid ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isPaid ? 'RESI PEMBELIAN LUNAS' : 'RESI PEMESANAN'}
                </span>
                <p className="text-xs font-mono font-bold text-stone-800 block pt-1">
                  {order.receiptNumber || order.orderNumber}
                </p>
                <p className="text-[11px] text-stone-500">
                  Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                  Data Pembeli:
                </span>
                <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
                <p className="text-stone-600 font-mono mt-0.5">{order.customerPhone}</p>
                <p className="text-stone-500 mt-1">
                  Metode Bayar: <b className="uppercase">{order.paymentMethod}</b>
                </p>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 font-bold uppercase block mb-1">
                  Pengiriman / Pengambilan:
                </span>
                {order.shippingMethod === 'delivery' ? (
                  <div>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-700" />
                      Armada Toko ke Kec. {order.deliveryDistrict}
                    </span>
                    <p className="text-stone-700 mt-1 leading-snug font-medium">
                      {order.deliveryAddress}
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-stone-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-700" />
                      Diambil Sendiri di Toko
                    </span>
                    <p className="text-stone-700 mt-1 font-medium">
                      {order.pickupStoreBranch || 'Surya Anugrah Keramik (Diwek)'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                Rincian Barang:
              </span>

              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-2.5">Produk & Spesifikasi</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Harga</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800">
                    {order.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="p-2.5 space-y-0.5">
                          <p className="font-bold text-stone-900">{it.productName}</p>
                          <div className="flex flex-wrap gap-1 text-[10px] text-stone-600">
                            {it.size && <span className="bg-stone-100 px-1.5 py-0.2 rounded border">Uk: {it.size}</span>}
                            {it.grade && <span className="bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200 font-bold">{it.grade}</span>}
                            {it.surfaceFinish && <span className="bg-stone-100 px-1.5 py-0.2 rounded border">{it.surfaceFinish}</span>}
                            {it.cuttingType && <span className="bg-sky-50 text-sky-900 px-1.5 py-0.2 rounded border border-sky-200">{it.cuttingType}</span>}
                          </div>
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          {it.quantity} {it.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono">
                          Rp {it.unitPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-stone-900">
                          Rp {it.totalPrice.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Totals */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal Barang:</span>
                <span className="font-mono">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Biaya Kirim ({order.shippingMethod === 'delivery' ? 'Armada Toko' : 'Ambil Sendiri'}):</span>
                <span className="font-mono">
                  {order.shippingCost > 0 ? `Rp ${order.shippingCost.toLocaleString('id-ID')}` : 'Rp 0 (Gratis / Ambil Sendiri)'}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-amber-900 pt-2 border-t border-dashed border-stone-300">
                <span>TOTAL TAGIHAN:</span>
                <span className="font-mono">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Official Footer Verification Details */}
            {isPaid ? (
              <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>PEMBAYARAN RESMI DIVERIFIKASI</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Diverifikasi oleh: <b>{order.verifiedBy || 'Admin Surya Anugrah Keramik'}</b> pada {order.verifiedAt ? new Date(order.verifiedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Hari ini'}.
                </p>
                <p className="text-[10px] text-emerald-700">
                  *Resi pembelian ini sah sebagai bukti transaksi resmi toko Surya Anugrah Keramik & UD. Khrisna Sakti.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Status: Menunggu Pelunasan & Verifikasi Admin</span>
                <p className="text-[11px] text-amber-800">
                  Silakan lakukan pembayaran sesuai total tagihan, kemudian kirimkan bukti transfer atau konfirmasi ke WhatsApp Toko: <b>{STORE_PHONE}</b>. Admin akan memverifikasi dan menerbitkan Resi Pembelian Resmi Lunas.
                </p>
              </div>
            )}

            {order.notes && (
              <div className="text-[11px] text-stone-500 pt-1">
                Catatan: <i>"{order.notes}"</i>
              </div>
            )}

          </div>

          {/* Action CTAs in Modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSendToWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim Resi ke WhatsApp Toko ({STORE_PHONE})</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / Simpan PDF Resi</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
