import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Truck, 
  Building2, 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  QrCode,
  DollarSign
} from 'lucide-react';
import { ProductItem, UserAccount, OrderRecord, OrderShippingMethod, OrderPaymentMethod } from '../types';
import { FLEET_INFO, STORE_BRANCHES, STORE_PHONE } from '../data/storeData';

interface OrderModalProps {
  product: ProductItem | null;
  onClose: () => void;
  currentUser: UserAccount | null;
  onOrderSuccess: (order: OrderRecord) => void;
  onOpenAuth: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  onClose,
  currentUser,
  onOrderSuccess,
  onOpenAuth,
}) => {
  if (!product) return null;

  // Step 1: Product Specs Selection
  const [selectedSize, setSelectedSize] = useState<string>(
    product.defaultSize || (product.sizes ? product.sizes[0] : '40x40')
  );
  const [selectedGrade, setSelectedGrade] = useState<string>(
    product.grades ? product.grades[0] : 'KW A'
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(
    product.surfaceFinish ? product.surfaceFinish[0] : 'Glossy'
  );
  const [selectedCutting, setSelectedCutting] = useState<string>(
    product.cuttingType ? product.cuttingType[0] : 'Cutting'
  );
  const [quantity, setQuantity] = useState<number>(10);

  // Step 2: Shipping & Address (Alamat diwajibkan setelah melakukan order)
  const [shippingMethod, setShippingMethod] = useState<OrderShippingMethod>('delivery');
  const [deliveryDistrict, setDeliveryDistrict] = useState<string>('Perak');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [pickupStore, setPickupStore] = useState<string>(STORE_BRANCHES[0].name);

  // Step 3: Customer Info & Payment
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>('transfer');
  const [notes, setNotes] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estimate unit price based on product
  const baseUnitPrice = product.numericPrice || 
    (product.estimatedPriceRange ? parseInt(product.estimatedPriceRange.replace(/[^0-9]/g, '').slice(0, 5)) || 65000 : 65000);

  const subtotal = quantity * baseUnitPrice;
  const shippingCost = shippingMethod === 'delivery' ? 50000 : 0;
  const totalAmount = subtotal + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerPhone.trim()) {
      setErrorMessage('Nomor HP pemesan wajib diisi untuk verifikasi pemesanan.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Nama lengkap pemesan wajib diisi.');
      return;
    }
    if (shippingMethod === 'delivery') {
      if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
        setErrorMessage('Alamat pengiriman lengkap di Kabupaten Jombang wajib diisi.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        memberId: currentUser?.id,
        shippingMethod,
        deliveryAddress: shippingMethod === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryDistrict: shippingMethod === 'delivery' ? deliveryDistrict : undefined,
        pickupStoreBranch: shippingMethod === 'pickup' ? pickupStore : undefined,
        paymentMethod,
        notes: notes.trim(),
        items: [
          {
            productId: product.id,
            productName: product.name,
            category: product.category,
            subcategory: product.subcategory,
            unit: product.unit,
            size: selectedSize,
            grade: selectedGrade,
            surfaceFinish: selectedFinish,
            cuttingType: selectedCutting,
            quantity,
            unitPrice: baseUnitPrice,
            totalPrice: subtotal,
          },
        ],
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses order');
      }

      // Success: notify parent to show ReceiptModal
      onOrderSuccess(data.order);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kendala saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Formulir Order & Penerbitan Resi
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">
              Order: {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-stone-50 text-stone-900 text-xs">
          
          {/* Alert Message if any */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Member Banner Prompt if Guest */}
          {!currentUser && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-amber-900 text-[11px] font-semibold">
                  Punya akun member? Masuk untuk riwayat pesanan otomatis.
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px] shrink-0"
              >
                Masuk / Daftar
              </button>
            </div>
          )}

          {/* BAGIAN 1: PILIHAN SPESIFIKASI UBIN */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-extrabold text-sm text-stone-900">
                Pilihan Spesifikasi & Kuantitas Ubin
              </h3>
            </div>

            {/* 1.1 Pilihan Ukuran */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">Pilihan Ukuran (cm):</label>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((sz) => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
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

            {/* 1.2 Pilihan Grade (KW A, KW B, KW C) */}
            <div className="space-y-1.5">
              <label className="font-bold text-stone-700 block">Pilihan Grade Kualitas:</label>
              <div className="grid grid-cols-3 gap-2">
                {['KW A', 'KW B', 'KW C'].map((grd) => (
                  <button
                    type="button"
                    key={grd}
                    onClick={() => setSelectedGrade(grd)}
                    className={`py-2 px-2 rounded-xl font-black text-xs border text-center transition-all ${
                      selectedGrade === grd
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {grd}
                  </button>
                ))}
              </div>
            </div>

            {/* 1.3 Permukaan & Potongan Sisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">Pilihan Permukaan:</label>
                <div className="flex gap-2">
                  {['Glossy', 'Matte'].map((finish) => (
                    <button
                      type="button"
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`flex-1 py-1.5 px-3 rounded-lg font-bold border transition-all ${
                        selectedFinish === finish
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 block">Pilihan Potongan Sisi:</label>
                <div className="flex gap-2">
                  {['Cutting', 'Non Cutting'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setSelectedCutting(c)}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-all ${
                        selectedCutting === c
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1.4 Jumlah Dus */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div>
                <label className="font-bold text-stone-800 block">
                  Jumlah Pesanan ({product.unit}):
                </label>
                <span className="text-[11px] text-stone-500 font-mono">
                  Estimasi Rp {baseUnitPrice.toLocaleString('id-ID')} /{product.unit}
                </span>
              </div>

              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className="px-3 py-1.5 text-sm font-black hover:bg-stone-200 text-stone-800"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center font-bold bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 5)}
                  className="px-3 py-1.5 text-sm font-black hover:bg-stone-200 text-stone-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: PILIHAN PENGIRIMAN & WAJIB ALAMAT */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900">
                  Pilihan Pengiriman & Alamat
                </h3>
                <span className="text-[10px] text-amber-700 font-semibold">
                  *Alamat diwajibkan saat melakukan order
                </span>
              </div>
            </div>

            {/* Pilihan Metode Kirim */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingMethod('delivery')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  shippingMethod === 'delivery'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Truck className={`w-4 h-4 ${shippingMethod === 'delivery' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="font-extrabold text-stone-900">Diantar Armada Toko</span>
                </div>
                <span className="text-[10px] text-stone-600 leading-tight">
                  Truk & Pick-Up toko langsung ke lokasi proyek Anda di Jombang.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod('pickup')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  shippingMethod === 'pickup'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className={`w-4 h-4 ${shippingMethod === 'pickup' ? 'text-amber-700' : 'text-stone-500'}`} />
                  <span className="font-extrabold text-stone-900">Ambil Sendiri ke Toko</span>
                </div>
                <span className="text-[10px] text-stone-600 leading-tight">
                  Ambil ubin di cabang Perak atau Diwek tanpa biaya kirim.
                </span>
              </button>
            </div>

            {/* Form Alamat Wajib jika Delivery */}
            {shippingMethod === 'delivery' ? (
              <div className="space-y-3 pt-2 bg-amber-50/30 p-3.5 rounded-xl border border-amber-200/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Kecamatan di Kabupaten Jombang <span className="text-rose-600">*</span>:
                    </label>
                    <select
                      value={deliveryDistrict}
                      onChange={(e) => setDeliveryDistrict(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                    >
                      {FLEET_INFO.coverageAreas.map((area) => (
                        <option key={area} value={area}>
                          Kecamatan {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Tarif Pengiriman Armada:
                    </label>
                    <div className="bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-amber-800 font-mono">
                      Rp 50.000 (Standar se-Jombang)
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Alamat Lengkap Pengiriman (Wajib) <span className="text-rose-600">*</span>:
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Contoh: Jl. Diponegoro RT 03 / RW 02, Desa Temuwulan (Depan Balai Desa / dekat gapura)"
                    required
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <label className="font-bold text-stone-800 block">
                  Pilih Toko Pengambilan Fisik:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STORE_BRANCHES.map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setPickupStore(b.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        pickupStore === b.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span className="block font-black text-xs">{b.name}</span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">{b.address}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BAGIAN 3: DATA PEMESAN & METODE PEMBAYARAN */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-extrabold text-sm text-stone-900">
                Data Pemesan & Metode Pembayaran
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nomor HP Pemesan (WhatsApp) <span className="text-rose-600">*</span>:
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 081240548750"
                  required
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nama Pemesan <span className="text-rose-600">*</span>:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Bapak / Ibu..."
                  required
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Pilihan Metode Bayar */}
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-stone-800 block">Pilihan Metode Pembayaran:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>Transfer Bank</span>
                  <span className="block text-[10px] text-stone-500">BCA / Mandiri / BRI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>QRIS Toko</span>
                  <span className="block text-[10px] text-stone-500">Scan Instan Semua Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>Bayar di Tempat</span>
                  <span className="block text-[10px] text-stone-500">Saat Armada Tiba / Kasir</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Catatan Tambahan (Opsional):</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Butuh kirim hari Sabtu pagi, tandon ditaruh belakang..."
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* RINGKASAN TOTAL PEMBAYARAN */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white p-5 rounded-2xl border border-stone-700 space-y-3">
            <div className="flex justify-between items-center text-stone-300">
              <span>Subtotal ({quantity} {product.unit} ubin):</span>
              <span className="font-mono font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-stone-300">
              <span>Biaya Pengiriman:</span>
              <span className="font-mono font-bold">
                {shippingCost > 0 ? `Rp ${shippingCost.toLocaleString('id-ID')}` : 'Rp 0 (Ambil di Toko)'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-700 text-sm sm:text-base font-black text-amber-400">
              <span>Total Estimasi Tagihan:</span>
              <span className="font-mono">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sedang Menerbitkan Resi Pemesanan...</span>
              ) : (
                <>
                  <span>Proses Order & Terbitkan Resi Pemesanan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-500 mt-2">
              Resi Pemesanan resmi akan langsung terbit dan bisa dicetak atau dikirim ke WhatsApp Toko.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
