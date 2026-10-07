import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Truck, 
  Building2, 
  RefreshCw 
} from 'lucide-react';
import { OrderRecord, UserAccount } from '../types';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onOpenReceipt: (order: OrderRecord, isOfficialPaidReceipt: boolean) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenReceipt,
}) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyOrders = async () => {
    if (!currentUser?.phone) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(currentUser.phone)}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [currentUser]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <h3 className="font-extrabold text-base text-white">
              Riwayat Pesanan & Resi Saya
            </h3>
            <p className="text-xs text-amber-300">
              Akun Member: {currentUser?.name} ({currentUser?.phone})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-stone-50 text-xs">
          <div className="flex justify-between items-center text-stone-600 font-semibold">
            <span>Daftar {orders.length} transaksi pemesanan</span>
            <button
              onClick={fetchMyOrders}
              className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center space-y-2">
              <p className="font-bold text-stone-800 text-sm">Belum ada riwayat pesanan</p>
              <p className="text-stone-500">
                Lakukan order ubin keramik, granit, atau batu alam melalui tombol <b>Order</b> pada katalog produk.
              </p>
            </div>
          ) : (
            orders.map((ord) => {
              const isPaid = ord.paymentStatus === 'paid';
              return (
                <div
                  key={ord.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-stone-100">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Lunas Diverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          Menunggu Pembayaran
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-stone-800">
                        <span>
                          {it.productName} ({it.quantity} {it.unit} • {it.size || ''} {it.grade || ''})
                        </span>
                        <span className="font-mono font-bold">
                          Rp {it.totalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Total */}
                  <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-stone-600">
                    <div>
                      {ord.shippingMethod === 'delivery' ? (
                        <span className="flex items-center gap-1 text-amber-800 font-semibold">
                          <Truck className="w-3.5 h-3.5" />
                          Kirim Armada: {ord.deliveryAddress}, Kec. {ord.deliveryDistrict}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-stone-700 font-semibold">
                          <Building2 className="w-3.5 h-3.5" />
                          Ambil Toko: {ord.pickupStoreBranch}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 mr-2">Total Tagihan:</span>
                      <span className="font-mono font-black text-amber-700 text-sm">
                        Rp {ord.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Action Button to Open Receipt */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReceipt(ord, isPaid);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>
                        {isPaid ? 'Buka Resi Pembelian Resmi (Lunas)' : 'Buka Resi Pemesanan & Pembayaran'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
