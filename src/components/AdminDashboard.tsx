import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  RefreshCw, 
  Save, 
  Link as LinkIcon, 
  Users, 
  Package, 
  Truck, 
  Copy, 
  Check, 
  AlertCircle, 
  Building2, 
  Phone, 
  Search, 
  Filter, 
  Database, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Layers, 
  Sparkles, 
  X,
  ExternalLink,
  Code2,
  Camera,
  Image as ImageIcon,
  FolderUp,
  Video,
  RotateCw,
  CloudUpload,
  HardDrive
} from 'lucide-react';
import { OrderRecord, ProductItem, MainCategory } from '../types';
import { CATEGORIES, PRODUCTS_CATALOG } from '../data/storeData';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onOpenReceipt: (order: OrderRecord, isOfficialPaidReceipt: boolean) => void;
  onProductsUpdated?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToStore,
  onOpenReceipt,
  onProductsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'spreadsheet' | 'products' | 'scriptcode' | 'members'>('orders');
  
  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'verified_paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Products State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('All');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);
  const [isExportingProducts, setIsExportingProducts] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Form State for Adding New Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<MainCategory>('Lantai Keramik');
  const [newProdSubcategory, setNewProdSubcategory] = useState('Keramik BS');
  const [newProdSize, setNewProdSize] = useState('40x40');
  const [newProdGrade, setNewProdGrade] = useState('KW A');
  const [newProdFinish, setNewProdFinish] = useState('Glossy');
  const [newProdCutting, setNewProdCutting] = useState('Cutting');
  const [newProdUnit, setNewProdUnit] = useState('dus');
  const [newProdPrice, setNewProdPrice] = useState('50000');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFeatures, setNewProdFeatures] = useState('Kualitas terjamin, Stok ready di toko');
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Image Upload & Camera to Google Drive State
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'camera' | 'url'>('upload');
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadStatus, setDriveUploadStatus] = useState<{
    success?: boolean;
    message?: string;
    isStoredInDrive?: boolean;
    driveUrl?: string;
    driveFileId?: string;
  } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const cameraInputRef = React.useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  // Google Script Dual Database State
  // 1. Orders
  const [ordersWebhookUrl, setOrdersWebhookUrl] = useState('');
  const [ordersSyncEnabled, setOrdersSyncEnabled] = useState(true);
  const [autoSyncOrders, setAutoSyncOrders] = useState(true);
  const [ordersLastSyncTime, setOrdersLastSyncTime] = useState<string | undefined>();
  const [isTestingOrders, setIsTestingOrders] = useState(false);
  const [testOrdersResult, setTestOrdersResult] = useState<{ success?: boolean; message?: string } | null>(null);

  // 2. Products
  const [productsWebhookUrl, setProductsWebhookUrl] = useState('');
  const [productsSyncEnabled, setProductsSyncEnabled] = useState(false);
  const [autoSyncProducts, setAutoSyncProducts] = useState(true);
  const [productsLastSyncTime, setProductsLastSyncTime] = useState<string | undefined>();
  const [isTestingProducts, setIsTestingProducts] = useState(false);
  const [testProductsResult, setTestProductsResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const [sampleCode, setSampleCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Members State
  const [members, setMembers] = useState<any[]>([]);

  // Feedback Notification
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotification(msg);
    setTimeout(() => setActionNotification(null), 3500);
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchGoogleScriptConfig = async () => {
    try {
      const res = await fetch('/api/settings/google-script');
      const data = await res.json();
      if (data.config) {
        const c = data.config;
        setOrdersWebhookUrl(c.ordersWebhookUrl || c.webhookUrl || '');
        setOrdersSyncEnabled(c.ordersSyncEnabled ?? c.isEnabled ?? true);
        setAutoSyncOrders(c.autoSyncOrders ?? true);
        setOrdersLastSyncTime(c.ordersLastSyncTime || c.lastSyncTime);

        setProductsWebhookUrl(c.productsWebhookUrl || c.webhookUrl || '');
        setProductsSyncEnabled(Boolean(c.productsSyncEnabled));
        setAutoSyncProducts(c.autoSyncProducts ?? true);
        setProductsLastSyncTime(c.productsLastSyncTime);
      }
      if (data.sampleScriptCode) {
        setSampleCode(data.sampleScriptCode);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchGoogleScriptConfig();
    fetchMembers();
  }, []);

  // Update subcategories when category changes in add product modal
  useEffect(() => {
    const found = CATEGORIES.find((c) => c.id === newProdCategory);
    if (found && found.subcategories.length > 0) {
      setNewProdSubcategory(found.subcategories[0]);
    }
  }, [newProdCategory]);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Camera & Image Processing Helpers
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCameraStream = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    stopCameraStream();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser atau perangkat ini tidak mengizinkan akses kamera langsung. Silakan gunakan tombol Buka Kamera HP.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setCameraFacing(facing);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Izin kamera ditolak atau kamera tidak ditemukan.');
      setIsCameraActive(false);
    }
  };

  const switchCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCameraStream(nextFacing);
  };

  const resizeAndProcessImage = (fileOrBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.86));
        };
        img.onerror = () => reject(new Error('Gagal memproses gambar'));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(fileOrBlob);
    });
  };

  const handleUploadImageToDrive = async (base64Data: string, fileName?: string) => {
    setIsUploadingToDrive(true);
    setDriveUploadStatus(null);
    try {
      const res = await fetch('/api/upload-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          fileName,
          productName: newProdName || 'Produk Keramik',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan foto ke Google Drive');
      }

      setNewProdImage(data.url);
      setDriveUploadStatus({
        success: true,
        isStoredInDrive: data.isStoredInDrive,
        driveUrl: data.driveUrl,
        driveFileId: data.driveFileId,
        message: data.message,
      });

      if (data.isStoredInDrive) {
        showNotification('Foto produk berhasil disimpan di Google Drive toko!');
      } else {
        showNotification('Foto produk tersimpan di server toko (siap disinkronkan ke Drive)!');
      }
    } catch (err: any) {
      console.error('Error uploading to drive:', err);
      setDriveUploadStatus({
        success: false,
        message: err.message || 'Gagal menyimpan ke Google Drive. Foto tetap tersimpan secara lokal.',
      });
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const capturePhotoFromCamera = async () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCameraStream();
      setNewProdImage(dataUrl);
      const safeName = `kamera-${Date.now()}.jpg`;
      await handleUploadImageToDrive(dataUrl, safeName);
    } catch (err: any) {
      alert('Gagal mengambil foto dari kamera: ' + err.message);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resizedBase64 = await resizeAndProcessImage(file);
      setNewProdImage(resizedBase64);
      await handleUploadImageToDrive(resizedBase64, file.name);
    } catch (err: any) {
      alert('Gagal memproses file foto: ' + err.message);
    }
  };

  const handleCloseAddProductModal = () => {
    stopCameraStream();
    setDriveUploadStatus(null);
    setIsAddProductModalOpen(false);
  };

  // Action: Verifikasi Pelunasan Order & Terbitkan Resi Pembelian
  const handleVerifyPayment = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy: 'Admin Surya Anugrah Keramik' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memverifikasi');
      }

      showNotification('Pelunasan berhasil diverifikasi! Resi Pembelian Resmi Lunas telah terbit & dikirim ke spreadsheet.');
      fetchOrders();
      onOpenReceipt(data.order, true);
    } catch (err: any) {
      alert(err.message || 'Gagal memverifikasi pembayaran.');
    }
  };

  // Action: Save Dual Google Script Settings
  const handleSaveGoogleScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const res = await fetch('/api/settings/google-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ordersWebhookUrl: ordersWebhookUrl.trim(),
          ordersSyncEnabled,
          autoSyncOrders,
          productsWebhookUrl: productsWebhookUrl.trim(),
          productsSyncEnabled,
          autoSyncProducts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan');
      }

      showNotification('Pengaturan 2 Database Spreadsheet Google Sheets berhasil disimpan!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Action: Test Database 1 (Pesanan Pelanggan)
  const handleTestOrdersWebhook = async () => {
    if (!ordersWebhookUrl.trim()) {
      alert('Masukkan link webhook Database Pesanan terlebih dahulu.');
      return;
    }

    setIsTestingOrders(true);
    setTestOrdersResult(null);

    try {
      const res = await fetch('/api/settings/google-script/test-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: ordersWebhookUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Uji koneksi pesanan gagal');
      }

      setTestOrdersResult({
        success: true,
        message: 'Koneksi Berhasil! Baris uji telah tercatat di sheet "Pesanan_Pelanggan".',
      });
      setOrdersLastSyncTime(new Date().toISOString());
      showNotification('Koneksi Database Pesanan Berhasil!');
    } catch (err: any) {
      setTestOrdersResult({
        success: false,
        message: err.message || 'Gagal menghubungi Google Apps Script.',
      });
    } finally {
      setIsTestingOrders(false);
    }
  };

  // Action: Test Database 2 (Katalog Produk)
  const handleTestProductsWebhook = async () => {
    const targetUrl = productsWebhookUrl.trim() || ordersWebhookUrl.trim();
    if (!targetUrl) {
      alert('Masukkan link webhook Database Produk terlebih dahulu.');
      return;
    }

    setIsTestingProducts(true);
    setTestProductsResult(null);

    try {
      const res = await fetch('/api/settings/google-script/test-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Uji koneksi produk gagal');
      }

      setTestProductsResult({
        success: true,
        message: 'Koneksi Berhasil! Sheet "Data_Produk" siap menerima & membaca produk.',
      });
      setProductsLastSyncTime(new Date().toISOString());
      showNotification('Koneksi Database Produk Berhasil!');
    } catch (err: any) {
      setTestProductsResult({
        success: false,
        message: err.message || 'Gagal menghubungi Google Apps Script Produk.',
      });
    } finally {
      setIsTestingProducts(false);
    }
  };

  // Action: Pull / Sync Products from Google Sheets
  const handlePullProductsFromSheets = async () => {
    const targetUrl = productsWebhookUrl.trim() || ordersWebhookUrl.trim();
    if (!targetUrl) {
      alert('Silakan isi dan simpan Webhook URL Spreadsheet Produk terlebih dahulu.');
      return;
    }

    setIsSyncingProducts(true);
    try {
      const res = await fetch('/api/products/sync-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menarik data produk.');
      }

      showNotification(data.message || 'Sinkronisasi produk dari Google Sheets berhasil!');
      setProducts(data.products || []);
      setProductsLastSyncTime(new Date().toISOString());
      if (onProductsUpdated) {
        onProductsUpdated();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menarik data produk dari spreadsheet.');
    } finally {
      setIsSyncingProducts(false);
    }
  };

  // Action: Push / Export Products to Google Sheets
  const handleExportProductsToSheets = async () => {
    const targetUrl = productsWebhookUrl.trim() || ordersWebhookUrl.trim();
    if (!targetUrl) {
      alert('Silakan isi dan simpan Webhook URL Spreadsheet Produk terlebih dahulu.');
      return;
    }

    setIsExportingProducts(true);
    try {
      const res = await fetch('/api/products/export-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengekspor produk.');
      }

      showNotification(data.message || 'Semua produk toko berhasil diekspor ke Sheet "Data_Produk"!');
      setProductsLastSyncTime(new Date().toISOString());
    } catch (err: any) {
      alert(err.message || 'Gagal mengekspor produk ke spreadsheet.');
    } finally {
      setIsExportingProducts(false);
    }
  };

  // Action: Submit New Product from Web Form
  const handleCreateNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      alert('Nama produk wajib diisi.');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const payload = {
        name: newProdName.trim(),
        category: newProdCategory,
        subcategory: newProdSubcategory,
        sizes: [newProdSize.trim() || '40x40'],
        defaultSize: newProdSize.trim() || '40x40',
        grades: [newProdGrade],
        surfaceFinish: [newProdFinish],
        cuttingType: [newProdCutting],
        unit: newProdUnit.trim() || 'dus',
        numericPrice: Number(newProdPrice) || 50000,
        estimatedPriceRange: `Rp ${(Number(newProdPrice) || 50000).toLocaleString('id-ID')}`,
        image: newProdImage.trim() || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        description: newProdDesc.trim() || 'Produk pilihan resmi dari Surya Anugrah Keramik & UD. Khrisna Sakti Jombang.',
        features: newProdFeatures.split(',').map((s) => s.trim()).filter(Boolean),
        inStock: newProdInStock,
        isPopular: true,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan produk.');
      }

      showNotification('Produk baru berhasil ditambahkan dan dicatat ke toko & spreadsheet!');
      handleCloseAddProductModal();
      // Reset form
      setNewProdName('');
      setNewProdDesc('');
      setNewProdImage('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80');
      fetchProducts();
      if (onProductsUpdated) {
        onProductsUpdated();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan produk.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Action: Toggle inStock status of a product
  const handleToggleProductStock = async (product: ProductItem) => {
    try {
      const nextStock = !product.inStock;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: nextStock }),
      });

      if (!res.ok) throw new Error('Gagal memperbarui status');
      showNotification(`Status stok "${product.name}" diubah menjadi ${nextStock ? 'Tersedia' : 'Kosong'}.`);
      fetchProducts();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Action: Delete a product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Hapus produk "${productName}" dari katalog toko?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus produk');
      showNotification(`Produk "${productName}" telah dihapus.`);
      fetchProducts();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sampleCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending' && o.paymentStatus === 'paid') return false;
    if (orderFilter === 'verified_paid' && o.paymentStatus !== 'paid') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchRec = (o.receiptNumber || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchNum || matchRec;
    }
    return true;
  });

  // Filter products
  const filteredProductsList = products.filter((p) => {
    if (productCategoryFilter !== 'All' && p.category !== productCategoryFilter) {
      return false;
    }
    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen py-8 sm:py-12 animate-fadeIn font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Toast Notification */}
        {actionNotification && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-slideDown border border-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotification}</span>
          </div>
        )}

        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-850 p-5 rounded-3xl border border-stone-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-black shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white">
                  Dashboard Mode Admin Toko
                </h1>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  Pengelola
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Surya Anugrah Keramik & UD. Khrisna Sakti Jombang
              </p>
            </div>
          </div>

          <button
            onClick={onBackToStore}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Kembali ke Tampilan Katalog</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg'
                : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Verifikasi Order & Resi</span>
            <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('spreadsheet')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'spreadsheet'
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg'
                : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Database Spreadsheet (2 Jenis)</span>
            <span className="flex items-center gap-1">
              {ordersSyncEnabled && <span className="w-2 h-2 rounded-full bg-amber-400" title="Sheet Pesanan Aktif" />}
              {productsSyncEnabled && <span className="w-2 h-2 rounded-full bg-emerald-400" title="Sheet Produk Aktif" />}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg'
                : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Katalog & Input Produk</span>
            <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('scriptcode')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'scriptcode'
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg'
                : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>4. Kode Apps Script & Panduan</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-amber-500 text-stone-950 font-black shadow-lg'
                : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>5. Data Akun Member</span>
            <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </button>
        </div>

        {/* TAB 1: VERIFIKASI PELUNASAN ORDER & RESI */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-stone-850 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-stone-400 font-bold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Status:
                </span>
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    orderFilter === 'all'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                  }`}
                >
                  Semua ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    orderFilter === 'pending'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                  }`}
                >
                  Menunggu Pembayaran ({orders.filter((o) => o.paymentStatus !== 'paid').length})
                </button>
                <button
                  onClick={() => setOrderFilter('verified_paid')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    orderFilter === 'verified_paid'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
                  }`}
                >
                  Terverifikasi Lunas ({orders.filter((o) => o.paymentStatus === 'paid').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, no. HP, no. order/resi..."
                  className="w-full bg-stone-900 border border-stone-750 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-stone-850 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-900 text-stone-400 font-bold border-b border-stone-800 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3.5">No. Order & Resi</th>
                      <th className="p-3.5">Pelanggan</th>
                      <th className="p-3.5">Pengiriman & Alamat</th>
                      <th className="p-3.5">Rincian Barang</th>
                      <th className="p-3.5 text-right">Total Tagihan</th>
                      <th className="p-3.5 text-center">Status Bayar</th>
                      <th className="p-3.5 text-center">Aksi Pelunasan & Resi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {isLoadingOrders ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-stone-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                          Memuat data pesanan...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-stone-500">
                          Tidak ada pesanan yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const isPaid = ord.paymentStatus === 'paid';
                        return (
                          <tr key={ord.id} className="hover:bg-stone-800/60 transition-colors">
                            {/* No Order & Waktu */}
                            <td className="p-3.5 space-y-1 font-mono">
                              <span className="font-bold text-white block">
                                {ord.orderNumber}
                              </span>
                              <span className="text-[10px] text-amber-400 block">
                                Resi: {ord.receiptNumber || '-'}
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            {/* Pelanggan */}
                            <td className="p-3.5 space-y-0.5">
                              <p className="font-bold text-white">{ord.customerName}</p>
                              <a
                                href={`https://wa.me/62${ord.customerPhone.replace(/^0/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 font-mono flex items-center gap-1 hover:underline text-[11px]"
                              >
                                <Phone className="w-3 h-3" />
                                {ord.customerPhone}
                              </a>
                              <span className="text-[10px] text-stone-400 block uppercase">
                                Bayar: {ord.paymentMethod}
                              </span>
                            </td>

                            {/* Pengiriman & Alamat */}
                            <td className="p-3.5 max-w-xs space-y-1">
                              {ord.shippingMethod === 'delivery' ? (
                                <div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30">
                                    <Truck className="w-3 h-3" />
                                    Armada Kec. {ord.deliveryDistrict}
                                  </span>
                                  <p className="text-[11px] text-stone-300 mt-1 line-clamp-2">
                                    {ord.deliveryAddress}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-300 bg-stone-800 px-2 py-0.5 rounded">
                                    <Building2 className="w-3 h-3 text-amber-400" />
                                    Ambil di Toko
                                  </span>
                                  <p className="text-[11px] text-stone-400 mt-1">
                                    {ord.pickupStoreBranch || 'Surya Anugrah Keramik (Diwek)'}
                                  </p>
                                </div>
                              )}
                            </td>

                            {/* Rincian Barang */}
                            <td className="p-3.5 space-y-1">
                              {ord.items.map((it: any, idx: number) => (
                                <div key={idx} className="text-[11px]">
                                  <span className="font-bold text-stone-200">
                                    {it.productName}
                                  </span>
                                  <span className="text-stone-400 ml-1">
                                    ({it.quantity} {it.unit} • {it.size || ''} {it.grade || ''})
                                  </span>
                                </div>
                              ))}
                            </td>

                            {/* Total Tagihan */}
                            <td className="p-3.5 text-right font-mono font-black text-amber-400 text-sm whitespace-nowrap">
                              Rp {ord.totalAmount.toLocaleString('id-ID')}
                            </td>

                            {/* Status Pembayaran */}
                            <td className="p-3.5 text-center">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[11px] font-black">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  LUNAS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40 text-[11px] font-bold">
                                  <Clock className="w-3.5 h-3.5" />
                                  Belum Lunas
                                </span>
                              )}
                            </td>

                            {/* Aksi Verifikasi */}
                            <td className="p-3.5 text-center space-y-1.5 whitespace-nowrap">
                              {!isPaid ? (
                                <button
                                  onClick={() => handleVerifyPayment(ord.id)}
                                  className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow transition-all"
                                  title="Verifikasi Pelunasan & Terbitkan Resi Pembelian"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Verifikasi Lunas</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-emerald-400 font-bold block">
                                  Terverifikasi Lunas
                                </span>
                              )}

                              <button
                                onClick={() => onOpenReceipt(ord, isPaid)}
                                className="w-full py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-400" />
                                <span>{isPaid ? 'Resi Pembelian' : 'Resi Order'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PENGATURAN DUA JENIS DATABASE SPREADSHEET */}
        {activeTab === 'spreadsheet' && (
          <div className="space-y-6">
            
            {/* Intro banner */}
            <div className="bg-gradient-to-r from-stone-850 via-stone-800 to-stone-850 p-6 rounded-3xl border border-stone-750 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Database className="w-4 h-4" />
                  <span>Sistem Dua Jenis Database Google Sheets</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Database Pesanan Pelanggan &amp; Database Katalog Produk
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  Website ini terhubung dengan 2 database terpisah atau 2 sheet dalam 1 file spreadsheet:
                  <b> 1. Sheet Pesanan_Pelanggan</b> (menyimpan riwayat order pelanggan secara real-time) dan
                  <b> 2. Sheet Data_Produk</b> (menampung katalog produk &amp; memungkinkan input produk baru langsung lewat baris spreadsheet).
                </p>
              </div>

              <button
                onClick={() => setActiveTab('scriptcode')}
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-amber-300 text-xs font-bold flex items-center gap-2 shrink-0 transition-all"
              >
                <Code2 className="w-4 h-4" />
                <span>Lihat Template Apps Script</span>
              </button>
            </div>

            <form onSubmit={handleSaveGoogleScript} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* CARD 1: DATABASE 1 - PESANAN & PELANGGAN */}
              <div className="bg-stone-850 p-6 rounded-3xl border border-amber-600/30 shadow-xl space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">
                          Database 1: Pesanan &amp; Pelanggan
                        </h4>
                        <span className="text-[11px] text-amber-400 font-mono">
                          Sheet Tab: "Pesanan_Pelanggan"
                        </span>
                      </div>
                    </div>
                    {ordersSyncEnabled ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] font-black uppercase">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-[10px] font-bold uppercase">
                        Nonaktif
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    Setiap pelanggan melakukan pemesanan (nama, no. HP, alamat di Jombang, barang yang dipesan) serta saat status pesanan diverifikasi lunas, data akan langsung dicatat secara otomatis ke baris baru spreadsheet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-200 block">
                      Webhook URL Web App (Pesanan):
                    </label>
                    <input
                      type="url"
                      value={ordersWebhookUrl}
                      onChange={(e) => setOrdersWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      URL dari deployment Apps Script jenis "Web app" (Who has access: Anyone).
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-800">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ordersSyncEnabled}
                        onChange={(e) => setOrdersSyncEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-stone-900 border-stone-700"
                      />
                      <span className="text-xs font-bold text-stone-200">
                        Aktifkan Sinkronisasi Pesanan ke Spreadsheet
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSyncOrders}
                        onChange={(e) => setAutoSyncOrders(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-stone-900 border-stone-700"
                      />
                      <span className="text-xs text-stone-400">
                        Kirim otomatis saat order dibuat dan diverifikasi lunas
                      </span>
                    </label>
                  </div>

                  {ordersLastSyncTime && (
                    <div className="text-[11px] text-stone-400 bg-stone-900 px-3 py-2 rounded-xl flex items-center justify-between font-mono">
                      <span>Terakhir Sinkron:</span>
                      <span className="text-amber-400">
                        {new Date(ordersLastSyncTime).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}

                  {testOrdersResult && (
                    <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                      testOrdersResult.success
                        ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-600 text-rose-200'
                    }`}>
                      {testOrdersResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>{testOrdersResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestOrdersWebhook}
                    disabled={isTestingOrders}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isTestingOrders ? 'animate-spin' : ''}`} />
                    <span>{isTestingOrders ? 'Menguji...' : 'Uji Koneksi Sheet Pesanan'}</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: DATABASE 2 - DATA PRODUK & INPUT PRODUK BARU */}
              <div className="bg-stone-850 p-6 rounded-3xl border border-emerald-600/30 shadow-xl space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">
                          Database 2: Data &amp; Input Produk Baru
                        </h4>
                        <span className="text-[11px] text-emerald-400 font-mono">
                          Sheet Tab: "Data_Produk"
                        </span>
                      </div>
                    </div>
                    {productsSyncEnabled ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] font-black uppercase">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-stone-800 text-stone-400 text-[10px] font-bold uppercase">
                        Nonaktif
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    Gunakan spreadsheet untuk mengelola produk toko! Anda dapat <b>mengetik baris produk baru</b> langsung di Google Sheets lalu menariknya ke web, atau mengekspor seluruh katalog saat ini ke spreadsheet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-200 block">
                      Webhook URL Web App (Produk):
                    </label>
                    <input
                      type="url"
                      value={productsWebhookUrl}
                      onChange={(e) => setProductsWebhookUrl(e.target.value)}
                      placeholder={ordersWebhookUrl || "https://script.google.com/macros/s/.../exec"}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 font-mono focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-stone-500 block">
                      (Tips: Jika Anda menggunakan 1 spreadsheet yang sama untuk Pesanan &amp; Produk, URL ini boleh sama dengan Database 1).
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-800">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productsSyncEnabled}
                        onChange={(e) => setProductsSyncEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-stone-900 border-stone-700"
                      />
                      <span className="text-xs font-bold text-stone-200">
                        Aktifkan Sinkronisasi Dua Arah Data Produk
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSyncProducts}
                        onChange={(e) => setAutoSyncProducts(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-stone-900 border-stone-700"
                      />
                      <span className="text-xs text-stone-400">
                        Otomatis catat ke spreadsheet saat produk baru dibuat di dashboard web
                      </span>
                    </label>
                  </div>

                  {productsLastSyncTime && (
                    <div className="text-[11px] text-stone-400 bg-stone-900 px-3 py-2 rounded-xl flex items-center justify-between font-mono">
                      <span>Terakhir Sinkron Produk:</span>
                      <span className="text-emerald-400">
                        {new Date(productsLastSyncTime).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}

                  {testProductsResult && (
                    <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                      testProductsResult.success
                        ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-600 text-rose-200'
                    }`}>
                      {testProductsResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span>{testProductsResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePullProductsFromSheets}
                    disabled={isSyncingProducts}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow disabled:opacity-50"
                    title="Tarik produk yang diketik di spreadsheet masuk ke web toko"
                  >
                    <Download className={`w-3.5 h-3.5 ${isSyncingProducts ? 'animate-bounce' : ''}`} />
                    <span>{isSyncingProducts ? 'Menarik Data...' : 'Tarik Produk dari Sheet'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportProductsToSheets}
                    disabled={isExportingProducts}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Kirim katalog produk web saat ini ke spreadsheet"
                  >
                    <Upload className={`w-3.5 h-3.5 text-emerald-400 ${isExportingProducts ? 'animate-pulse' : ''}`} />
                    <span>{isExportingProducts ? 'Mengekspor...' : 'Ekspor ke Sheet'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTestProductsWebhook}
                    disabled={isTestingProducts}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-bold text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-stone-400 ${isTestingProducts ? 'animate-spin' : ''}`} />
                    <span>Uji</span>
                  </button>
                </div>
              </div>

              {/* SAVE BUTTON FULL WIDTH */}
              <div className="lg:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingConfig ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan Spreadsheet'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: KATALOG & INPUT PRODUK BARU */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            
            {/* Top Toolbar */}
            <div className="bg-stone-850 p-4 rounded-3xl border border-stone-800 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-stone-400 font-bold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Kategori:
                </span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-bold"
                >
                  <option value="All">Semua Kategori ({products.length})</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({products.filter((p) => p.category === c.id).length})
                    </option>
                  ))}
                </select>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Cari produk / ukuran..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-1.5 shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Produk Baru</span>
                </button>

                <button
                  onClick={handlePullProductsFromSheets}
                  disabled={isSyncingProducts}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
                  title="Tarik data produk dari Spreadsheet"
                >
                  <Download className={`w-3.5 h-3.5 ${isSyncingProducts ? 'animate-bounce' : ''}`} />
                  <span>{isSyncingProducts ? 'Menarik...' : 'Tarik dari Sheets'}</span>
                </button>

                <button
                  onClick={handleExportProductsToSheets}
                  disabled={isExportingProducts}
                  className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                  title="Ekspor seluruh produk ke Spreadsheet"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ekspor</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-stone-850 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-900 text-stone-400 font-bold border-b border-stone-800 uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Produk</th>
                      <th className="p-3.5">Kategori &amp; Sub</th>
                      <th className="p-3.5">Ukuran &amp; Spek</th>
                      <th className="p-3.5 text-right">Harga (Rp)</th>
                      <th className="p-3.5 text-center">Status Stok</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {isLoadingProducts ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                          Memuat data produk...
                        </td>
                      </tr>
                    ) : filteredProductsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-500 space-y-2">
                          <p>Tidak ada produk yang cocok dengan pencarian.</p>
                          <button
                            onClick={() => setIsAddProductModalOpen(true)}
                            className="text-amber-400 hover:underline font-bold"
                          >
                            + Tambah produk baru sekarang
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredProductsList.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-800/60 transition-colors">
                          {/* Foto & Nama */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0 bg-stone-900"
                              />
                              <div>
                                <p className="font-extrabold text-white text-xs leading-snug">
                                  {p.name}
                                </p>
                                <span className="text-[10px] text-stone-500 font-mono block">
                                  ID: {p.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Kategori & Subkategori */}
                          <td className="p-3.5">
                            <span className="font-bold text-amber-300 block">
                              {p.category}
                            </span>
                            <span className="text-[11px] text-stone-400 block">
                              {p.subcategory}
                            </span>
                          </td>

                          {/* Ukuran & Spek */}
                          <td className="p-3.5 space-y-0.5 font-mono text-[11px]">
                            <div>
                              <span className="text-stone-400">Ukuran: </span>
                              <span className="text-stone-200 font-bold">
                                {p.sizes ? p.sizes.join(', ') : (p.defaultSize || '-')}
                              </span>
                            </div>
                            {p.grades && p.grades.length > 0 && (
                              <div>
                                <span className="text-stone-400">Grade: </span>
                                <span className="text-amber-400">
                                  {p.grades.join(', ')}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Harga */}
                          <td className="p-3.5 text-right font-mono font-black text-amber-400 text-sm whitespace-nowrap">
                            Rp {(p.numericPrice || 0).toLocaleString('id-ID')}
                            <span className="text-[10px] text-stone-400 font-normal block">
                              /{p.unit}
                            </span>
                          </td>

                          {/* Status Stok */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleToggleProductStock(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                                p.inStock
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-900'
                                  : 'bg-rose-950 text-rose-300 border border-rose-600/40 hover:bg-rose-900'
                              }`}
                              title="Klik untuk ubah stok"
                            >
                              {p.inStock ? 'Tersedia' : 'Kosong'}
                            </button>
                          </td>

                          {/* Aksi */}
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950 hover:text-rose-400 text-stone-400 border border-stone-700 transition-colors"
                              title="Hapus produk dari toko"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: TEMPLATE KODE APPS SCRIPT & PANDUAN DUA SHEET */}
        {activeTab === 'scriptcode' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            
            {/* Code Box (7 cols) */}
            <div className="lg:col-span-7 bg-stone-850 p-6 rounded-3xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-base">
                    Template Universal Google Apps Script
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Otomatis mengelola 2 tab: <b>Pesanan_Pelanggan</b> dan <b>Data_Produk</b>
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-1.5 shadow transition-all"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-stone-950" /> : <Copy className="w-4 h-4 text-stone-950" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>

              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 max-h-[500px] overflow-y-auto font-mono text-[11px] text-amber-300/90 leading-relaxed">
                <pre>{sampleCode || '// Sedang memuat kode template...'}</pre>
              </div>
            </div>

            {/* Explanation & Steps (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Cara Pasang */}
              <div className="bg-stone-850 p-6 rounded-3xl border border-stone-800 space-y-3">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cara Pasang di Google Sheets (5 Menit):</span>
                </h4>
                <ol className="space-y-2 text-stone-300 list-decimal list-inside leading-relaxed text-[11px]">
                  <li>Buka <b>Google Sheets</b> baru di akun Google toko Anda.</li>
                  <li>Pilih menu atas: <b>Extensions &gt; Apps Script</b>.</li>
                  <li>Hapus kode bawaan, lalu <b>tempel (paste)</b> kode di samping.</li>
                  <li>Klik tombol biru <b>Deploy &gt; New deployment</b>.</li>
                  <li>Pilih jenis <b>Web app</b>.</li>
                  <li>Ubah pengaturan <i>Who has access</i> menjadi <b>Anyone</b> (Siapa saja).</li>
                  <li>Klik <b>Deploy</b>, salin <b>Web app URL</b> yang muncul.</li>
                  <li>Paste URL tersebut di tab <b>2. Database Spreadsheet</b>!</li>
                </ol>
              </div>

              {/* Struktur Kolom Dua Database */}
              <div className="bg-stone-850 p-6 rounded-3xl border border-stone-800 space-y-4">
                <h4 className="font-extrabold text-white text-sm">
                  Struktur Kolom Otomatis di Spreadsheet:
                </h4>

                {/* Sheet 1 */}
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-amber-600/30 space-y-1">
                  <span className="font-bold text-amber-400 block text-xs">
                    1. Tab: "Pesanan_Pelanggan"
                  </span>
                  <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                    Waktu Sinkron | Aksi | No. Order | No. Resi | Nama Pelanggan | No. WhatsApp | Pengiriman | Kecamatan | Alamat Lengkap | Metode Bayar | Status Bayar | Status Order | Total (Rp) | Rincian Barang | Catatan Pemesan
                  </p>
                </div>

                {/* Sheet 2 */}
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-emerald-600/30 space-y-1">
                  <span className="font-bold text-emerald-400 block text-xs">
                    2. Tab: "Data_Produk"
                  </span>
                  <p className="text-[10px] text-stone-400 font-mono leading-relaxed">
                    ID Produk | Nama Produk | Kategori | Subkategori | Ukuran | Grade | Finishing | Cutting | Satuan | Harga (Rp) | Status Stok | Link Gambar | Deskripsi Produk | Fitur Unggulan | Waktu Update
                  </p>
                </div>

                {/* Google Drive 3 */}
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-sky-600/30 space-y-1">
                  <span className="font-bold text-sky-400 block text-xs flex items-center gap-1.5">
                    <CloudUpload className="w-3.5 h-3.5 text-sky-400" />
                    <span>3. Google Drive: Folder "Foto_Produk_Surya_Anugrah"</span>
                  </span>
                  <p className="text-[10px] text-stone-400 leading-relaxed">
                    Setiap upload foto atau pengambilan foto via Kamera langsung dari etalase toko otomatis tersimpan ke folder Google Drive toko dan link thumbnail publiknya langsung dimasukkan ke kolom <b>Link Gambar</b> di Spreadsheet.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: DATA MEMBER TERDAFTAR */}
        {activeTab === 'members' && (
          <div className="bg-stone-850 p-6 rounded-3xl border border-stone-800 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <div>
                <h3 className="text-base font-black text-white">
                  Daftar Member Terdaftar
                </h3>
                <p className="text-xs text-stone-400">
                  Pelanggan yang mendaftar via Nomor HP
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-600/30">
                Total: {members.length} Pengguna
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-900 text-stone-400 font-bold border-b border-stone-800 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Nomor HP</th>
                    <th className="p-3">Role Akun</th>
                    <th className="p-3">Tanggal Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-300">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-800">
                      <td className="p-3 font-bold text-white">{m.name}</td>
                      <td className="p-3 font-mono text-emerald-400">{m.phone}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          m.role === 'admin' ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3 text-stone-400 font-mono">
                        {new Date(m.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: TAMBAH PRODUK BARU */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-850 w-full max-w-2xl rounded-3xl border border-stone-750 p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">
                  + Tambah Produk Baru ke Toko &amp; Spreadsheet
                </h3>
                <p className="text-xs text-stone-400">
                  Data otomatis tersimpan di web katalog dan dikirim ke Sheet "Data_Produk".
                </p>
              </div>
              <button
                onClick={handleCloseAddProductModal}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Produk */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-200 block mb-1">
                    Nama Produk Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Contoh: Keramik Platinum 50x50 Marble Grey Glossy"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="font-bold text-stone-200 block mb-1">
                    Kategori Utama *
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as MainCategory)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subkategori */}
                <div>
                  <label className="font-bold text-stone-200 block mb-1">
                    Sub-Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProdSubcategory}
                    onChange={(e) => setNewProdSubcategory(e.target.value)}
                    placeholder="Contoh: Keramik BS, Kardusan, List, dll"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Ukuran */}
                <div>
                  <label className="font-bold text-stone-200 block mb-1">
                    Ukuran (Dimensi)
                  </label>
                  <input
                    type="text"
                    value={newProdSize}
                    onChange={(e) => setNewProdSize(e.target.value)}
                    placeholder="40x40, 50x50, 60x60, 25 kg, dll"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Satuan & Harga */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-200 block mb-1">
                      Satuan
                    </label>
                    <select
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="dus">dus</option>
                      <option value="m²">m²</option>
                      <option value="pcs">pcs</option>
                      <option value="sak">sak</option>
                      <option value="roll">roll</option>
                      <option value="set">set</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-stone-200 block mb-1">
                      Harga (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="65000"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* Grade & Finishing */}
                <div>
                  <label className="font-bold text-stone-200 block mb-1">
                    Grade Kualitas
                  </label>
                  <select
                    value={newProdGrade}
                    onChange={(e) => setNewProdGrade(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="KW A">KW A (Super Mulus)</option>
                    <option value="KW B">KW B (Standar Dus)</option>
                    <option value="KW C">KW C (Ekonomis Dus)</option>
                    <option value="BS">BS (Bukan Standar)</option>
                    <option value="Original">Original Pabrik</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-200 block mb-1">
                    Finishing Permukaan
                  </label>
                  <select
                    value={newProdFinish}
                    onChange={(e) => setNewProdFinish(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Glossy">Glossy (Kilap Cermin)</option>
                    <option value="Matte">Matte (Kasar / Antislip)</option>
                    <option value="Rustic">Rustic (Tekstur Belah Alami)</option>
                    <option value="Polished">Polished Nano Marmer</option>
                  </select>
                </div>

                {/* PILIHAN FOTO: UPLOAD / KAMERA / LINK (SIMPAN KE GOOGLE DRIVE) */}
                <div className="sm:col-span-2 space-y-3 bg-stone-900/90 p-4 rounded-2xl border border-stone-750">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="font-extrabold text-stone-100 flex items-center gap-2 text-xs">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Foto Produk (Upload / Kamera &rarr; Simpan di Google Drive)</span>
                      </label>
                      <p className="text-[11px] text-stone-400">
                        Foto otomatis disimpan ke folder Google Drive <b>"Foto_Produk_Surya_Anugrah"</b> &amp; tercatat di spreadsheet.
                      </p>
                    </div>

                    {/* Google Drive Status Badge */}
                    <div className="shrink-0">
                      {productsWebhookUrl || ordersWebhookUrl ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                          <CloudUpload className="w-3 h-3 text-emerald-400" />
                          <span>Google Drive Siap</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-600/30">
                          <HardDrive className="w-3 h-3 text-amber-400" />
                          <span>Penyimpanan Lokal (Drive siap jika Webhook diisi)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-2 p-1 bg-stone-950 rounded-xl border border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        setImageSourceMode('upload');
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-all ${
                        imageSourceMode === 'upload'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>1. Upload Galeri/File</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setImageSourceMode('camera');
                        startCameraStream();
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-all ${
                        imageSourceMode === 'camera'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>2. Kamera Langsung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        stopCameraStream();
                        setImageSourceMode('url');
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-all ${
                        imageSourceMode === 'url'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>3. Link URL Manual</span>
                    </button>
                  </div>

                  {/* Hidden Native File & Camera Inputs */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* TAB 1: UPLOAD FILE */}
                  {imageSourceMode === 'upload' && (
                    <div className="space-y-3">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-700 hover:border-amber-500/80 bg-stone-950/60 rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-stone-900/60 group"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-stone-800 group-hover:bg-amber-500/20 text-stone-300 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                          <CloudUpload className="w-6 h-6" />
                        </div>
                        <p className="font-extrabold text-stone-200 text-xs">
                          Klik untuk Memilih Foto dari Galeri / Berkas Komputer/HP
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Mendukung JPG, PNG, WEBP (Otomatis dikompres &amp; disimpan ke Google Drive)
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                        <span>Punya file foto produk? Klik kotak di atas.</span>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Buka Kamera HP (File Langsung)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: KAMERA LANGSUNG */}
                  {imageSourceMode === 'camera' && (
                    <div className="space-y-3">
                      {isCameraActive ? (
                        <div className="relative rounded-2xl overflow-hidden bg-black border border-amber-500 shadow-2xl">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-64 sm:h-80 object-cover"
                          />

                          {/* Shutter / Capture Controls Overlay */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={switchCameraFacing}
                              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-white backdrop-blur border border-stone-600 transition-all flex items-center gap-1 text-[11px]"
                              title="Balik kamera depan / belakang"
                            >
                              <RotateCw className="w-4 h-4" />
                              <span className="hidden sm:inline">Balik ({cameraFacing === 'environment' ? 'Belakang' : 'Depan'})</span>
                            </button>

                            <button
                              type="button"
                              onClick={capturePhotoFromCamera}
                              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-2 shadow-2xl transform active:scale-95 transition-all text-xs"
                            >
                              <Camera className="w-5 h-5" />
                              <span>Ambil Foto Ini &amp; Simpan ke Drive</span>
                            </button>

                            <button
                              type="button"
                              onClick={stopCameraStream}
                              className="p-2.5 rounded-full bg-stone-800/80 hover:bg-rose-900 text-stone-300 hover:text-rose-200 backdrop-blur border border-stone-600 transition-all text-[11px]"
                              title="Tutup kamera"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-stone-950/70 p-6 rounded-2xl border border-stone-800 text-center space-y-3">
                          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                            <Camera className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-white text-xs">
                              Kamera Fisik untuk Toko &amp; Gudang
                            </h5>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              Ambil foto keramik, granit, atau batu alam secara live langsung dari etalase toko.
                            </p>
                          </div>

                          {cameraError && (
                            <div className="bg-rose-950/60 border border-rose-700/60 p-2.5 rounded-xl text-[11px] text-rose-300 text-left">
                              <p className="font-bold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Info Kamera: {cameraError}</span>
                              </p>
                              <p className="text-[10px] mt-1 text-stone-300">
                                Jika menggunakan iframe atau browser HP memblokir, klik tombol <b>Buka Kamera HP (File Capture)</b> di bawah.
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => startCameraStream('environment')}
                              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-2 shadow transition-all text-xs"
                            >
                              <Video className="w-4 h-4" />
                              <span>Nyalakan Kamera Langsung</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => cameraInputRef.current?.click()}
                              className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold border border-stone-700 flex items-center gap-2 transition-all text-xs"
                            >
                              <Camera className="w-4 h-4 text-amber-400" />
                              <span>Buka Kamera HP (Capture Native)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: INPUT URL MANUAL */}
                  {imageSourceMode === 'url' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => {
                          setNewProdImage(e.target.value);
                          setDriveUploadStatus(null);
                        }}
                        placeholder="https://images.unsplash.com/... atau link foto Google Drive"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <p className="text-[10px] text-stone-400">
                        Bisa menggunakan link foto Unsplash, link CDN, atau link file sharing Google Drive.
                      </p>
                    </div>
                  )}

                  {/* Uploading Spinner */}
                  {isUploadingToDrive && (
                    <div className="bg-amber-950/40 border border-amber-600/40 p-3 rounded-xl flex items-center gap-3 text-xs text-amber-300 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <div>
                        <p className="font-bold">Menyimpan Foto ke Google Drive...</p>
                        <p className="text-[10px] text-stone-300">
                          Sedang mengunggah dan mengonfigurasi tautan publik Google Drive toko.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Upload Hasil */}
                  {driveUploadStatus && !isUploadingToDrive && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                        driveUploadStatus.isStoredInDrive
                          ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                          : driveUploadStatus.success
                          ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                          : 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {driveUploadStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-extrabold">
                            {driveUploadStatus.isStoredInDrive
                              ? '✓ Foto Berhasil Disimpan di Google Drive!'
                              : driveUploadStatus.success
                              ? '✓ Foto Disimpan di Server Toko'
                              : 'Gagal Menyimpan ke Google Drive'}
                          </p>
                          <p className="text-[10px] text-stone-300 mt-0.5">
                            {driveUploadStatus.message || (driveUploadStatus.isStoredInDrive ? 'Folder: Foto_Produk_Surya_Anugrah' : '')}
                          </p>
                        </div>
                      </div>

                      {driveUploadStatus.driveUrl && (
                        <a
                          href={driveUploadStatus.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-600/30 text-[10px] font-bold flex items-center gap-1"
                        >
                          <span>Buka di Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* PREVIEW GAMBAR AKTIF */}
                  {newProdImage && (
                    <div className="flex items-center gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800">
                      <img
                        src={newProdImage}
                        alt="Preview Produk"
                        className="w-16 h-16 rounded-xl object-cover border border-stone-700 bg-stone-900 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white text-xs">Preview Foto Terpilih</span>
                          {newProdImage.includes('drive.google.com') || newProdImage.includes('googleusercontent.com') ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 font-mono font-bold">
                              Google Drive
                            </span>
                          ) : newProdImage.startsWith('/uploads/') ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-600/40 font-mono font-bold">
                              Local Upload
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-mono">
                              Web URL
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono truncate">
                          {newProdImage}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (imageSourceMode === 'upload') {
                              fileInputRef.current?.click();
                            } else if (imageSourceMode === 'camera') {
                              startCameraStream();
                            }
                          }}
                          className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-750 text-[10px] font-bold text-stone-300"
                        >
                          Ganti
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Deskripsi */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-200 block mb-1">
                    Deskripsi Produk
                  </label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Rincian spesifikasi, kecocokan ruangan, atau keunggulan produk..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Status Stok */}
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={newProdInStock}
                    onChange={(e) => setNewProdInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 bg-stone-900 border-stone-700"
                  />
                  <label htmlFor="stockCheck" className="text-xs font-bold text-stone-200 cursor-pointer">
                    Stok Tersedia (Ready di Cabang Perak &amp; Diwek)
                  </label>
                </div>

              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAddProductModal}
                  className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmittingProduct ? 'Menyimpan...' : 'Simpan Produk'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
