/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MainCategory, 
  PageView, 
  ProductItem, 
  InquiryItem, 
  UserAccount, 
  OrderRecord 
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { CalculatorModal } from './components/CalculatorModal';
import { StoresSection } from './components/StoresSection';
import { FleetSection } from './components/FleetSection';
import { InquiryDrawer } from './components/InquiryDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { BaganPage } from './components/BaganPage';
import { PRODUCTS_CATALOG } from './data/storeData';
import { AiPage } from './components/AiPage';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { OrderModal } from './components/OrderModal';
import { ReceiptModal } from './components/ReceiptModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { CheckCircle2, Bot } from 'lucide-react';

export default function App() {
  // Page Navigation View: 'preview' (default main view) | 'bagan' (dedicated chart page) | 'tanya-ai' | 'admin'
  const [activePageView, setActivePageView] = useState<PageView>('preview');

  // Authentication & Mode State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('surya_keramik_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'member' | 'admin'>('member');

  // Dynamic Products State (synced with server & Google Sheets)
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS_CATALOG);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Error fetching products from server, using default catalog:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Product Filtering State
  const [activeCategory, setActiveCategory] = useState<MainCategory | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers State
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);
  const [calculatorInitialSize, setCalculatorInitialSize] = useState<string>('40x40');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductItem | null>(null);
  const [isInquiryDrawerOpen, setIsInquiryDrawerOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Order Flow & Receipt State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<ProductItem | null>(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<OrderRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [isReceiptOfficialPaid, setIsReceiptOfficialPaid] = useState<boolean>(false);

  // Member My Orders Modal
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState<boolean>(false);

  // Cart (Keranjang) State
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem('surya_keramik_inquiry');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('surya_keramik_inquiry', JSON.stringify(inquiryItems));
    } catch (e) {
      console.error(e);
    }
  }, [inquiryItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('surya_keramik_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Selamat datang, ${user.name}!`);
    if (user.role === 'admin') {
      setActivePageView('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('surya_keramik_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Berhasil keluar dari akun.');
    if (activePageView === 'admin') {
      setActivePageView('preview');
    }
  };

  const handleOpenAuth = (mode: 'member' | 'admin' = 'member') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSelectCategory = (cat: MainCategory | 'All') => {
    setActiveCategory(cat);
    setSelectedSubcategory('All');
    setSelectedSize('All');
    if (activePageView !== 'preview') {
      setActivePageView('preview');
    }
  };

  // Called when clicking any node in the dedicated Bagan page
  const handleSelectDiagramNode = (category: MainCategory, subcategory: string, size?: string) => {
    setActiveCategory(category);
    setSelectedSubcategory(subcategory);
    if (size) {
      setSelectedSize(size);
    } else {
      setSelectedSize('All');
    }
    setActivePageView('preview');
    setTimeout(() => {
      const el = document.getElementById('katalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOpenCalculatorWithSize = (size: string) => {
    setCalculatorInitialSize(size);
    setIsCalculatorModalOpen(true);
  };

  // Quick Order button handler on any product card
  const handleOrderProduct = (product: ProductItem) => {
    setSelectedProductForOrder(product);
    setIsOrderModalOpen(true);
  };

  // Called when an order is submitted successfully
  const handleOrderSuccess = (order: OrderRecord) => {
    setActiveReceiptOrder(order);
    setIsReceiptOfficialPaid(false);
    setIsReceiptModalOpen(true);
    showToast(`Pesanan berhasil! Resi Pemesanan terbit: ${order.orderNumber}`);
  };

  // Called from Admin dashboard or My Orders modal to view a receipt
  const handleOpenReceipt = (order: OrderRecord, isOfficialPaid: boolean) => {
    setActiveReceiptOrder(order);
    setIsReceiptOfficialPaid(isOfficialPaid);
    setIsReceiptModalOpen(true);
  };

  const handleAddToCartQuick = (product: ProductItem) => {
    const existingIndex = inquiryItems.findIndex((it) => it.product.id === product.id);
    if (existingIndex > -1) {
      const next = [...inquiryItems];
      next[existingIndex].quantity += 1;
      setInquiryItems(next);
      showToast(`Jumlah ${product.name} ditambah di keranjang.`);
    } else {
      setInquiryItems([
        ...inquiryItems,
        {
          product,
          quantity: 10,
          selectedSize: product.defaultSize || (product.sizes ? product.sizes[0] : undefined),
          selectedFinish: product.surfaceFinish ? product.surfaceFinish[0] : undefined,
          selectedCutting: product.cuttingType ? product.cuttingType[0] : undefined,
          selectedGrade: product.grades ? product.grades[0] : undefined,
        },
      ]);
      showToast(`${product.name} dimasukkan ke keranjang!`);
    }
  };

  const handleAddToCartWithOptions = (
    product: ProductItem,
    options: { size?: string; finish?: string; cutting?: string; grade?: string; quantity: number }
  ) => {
    const existingIndex = inquiryItems.findIndex((it) => it.product.id === product.id);
    if (existingIndex > -1) {
      const next = [...inquiryItems];
      next[existingIndex].quantity = options.quantity;
      next[existingIndex].selectedSize = options.size;
      next[existingIndex].selectedFinish = options.finish;
      next[existingIndex].selectedCutting = options.cutting;
      next[existingIndex].selectedGrade = options.grade;
      setInquiryItems(next);
    } else {
      setInquiryItems([
        ...inquiryItems,
        {
          product,
          quantity: options.quantity,
          selectedSize: options.size,
          selectedFinish: options.finish,
          selectedCutting: options.cutting,
          selectedGrade: options.grade,
        },
      ]);
    }
    showToast(`Tersimpan ke keranjang belanja.`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setInquiryItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setInquiryItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearAllInquiry = () => {
    setInquiryItems([]);
  };

  const scrollToSection = (sectionId: string) => {
    if (activePageView !== 'preview') {
      setActivePageView('preview');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const inquiryProductIds = new Set(inquiryItems.map((i) => i.product.id));

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-2.5 text-xs font-bold animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar with Dual Mode Switcher & Keranjang */}
      <Navbar
        activePageView={activePageView}
        onSelectPageView={(view) => {
          setActivePageView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onOpenInquiry={() => setIsInquiryDrawerOpen(true)}
        inquiryCount={inquiryItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScrollToSection={scrollToSection}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onLogout={handleLogout}
      />

      {/* VIEW 1: PREVIEW & KATALOG PRODUK (Default Halaman Utama Calon Konsumen) */}
      {activePageView === 'preview' && (
        <main className="flex-1">
          {/* Hero Section with Immediate Product Preview */}
          <Hero
            onOpenDiagramPage={() => {
              setActivePageView('bagan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAiPage={() => {
              setActivePageView('tanya-ai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCalculator={() => setIsCalculatorModalOpen(true)}
            onSelectCategory={(cat) => {
              handleSelectCategory(cat);
              scrollToSection('katalog-section');
            }}
            onScrollToCatalog={() => scrollToSection('katalog-section')}
            onViewProductDetails={(p) => setSelectedProductForModal(p)}
          />

          {/* Product Catalog Section directly below Hero (with Order & Keranjang buttons) */}
          <ProductCatalog
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewProductDetails={(p) => setSelectedProductForModal(p)}
            onOrderClick={handleOrderProduct}
            onOpenCalculatorWithSize={handleOpenCalculatorWithSize}
            onAddToInquiry={handleAddToCartQuick}
            inquiryProductIds={inquiryProductIds}
            onOpenDiagram={() => {
              setActivePageView('bagan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 2 Physical Stores (Perak & Diwek) */}
          <StoresSection />

          {/* Toko Armada Delivery Section */}
          <FleetSection />
        </main>
      )}

      {/* VIEW 2: HALAMAN BAGAN STRUKTUR PRODUK (Dedicated Separate Page) */}
      {activePageView === 'bagan' && (
        <main className="flex-1">
          <BaganPage
            onBackToPreview={() => {
              setActivePageView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDiagramNode={handleSelectDiagramNode}
            onOpenAi={() => {
              setActivePageView('tanya-ai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* VIEW 3: HALAMAN TANYA AI (Dedicated AI Assistant Experience) */}
      {activePageView === 'tanya-ai' && (
        <main className="flex-1">
          <AiPage
            onBackToPreview={() => {
              setActivePageView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDiagram={() => {
              setActivePageView('bagan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCalculator={() => setIsCalculatorModalOpen(true)}
          />
        </main>
      )}

      {/* VIEW 4: DASHBOARD ADMIN (Mode Admin: Setting Database Google Script & Verifikasi Pelunasan) */}
      {activePageView === 'admin' && (
        <main className="flex-1">
          <AdminDashboard
            onBackToStore={() => {
              setActivePageView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReceipt={handleOpenReceipt}
            onProductsUpdated={fetchProducts}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          handleSelectCategory(cat);
          scrollToSection('katalog-section');
        }}
        onOpenDiagram={() => {
          setActivePageView('bagan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Floating WhatsApp Action Button (Kiri Bawah) */}
      <FloatingWhatsApp />

      {/* Floating Tanya AI Trigger Button (Kanan Bawah) */}
      {activePageView !== 'tanya-ai' && activePageView !== 'admin' && (
        <aside 
          aria-label="Tanya AI Asisten Virtual"
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-stone-900 hover:bg-stone-850 text-amber-300 font-extrabold text-xs shadow-2xl border border-amber-500/50 hover:scale-105 transition-all group ring-4 ring-amber-500/20"
            title="Tanya AI Asisten Surya Keramik"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </div>
            <span>Tanya AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </aside>
      )}

      {/* AI Assistant Modal (quick popup on top of any page) */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onOpenCalculator={() => {
          setIsAiModalOpen(false);
          setIsCalculatorModalOpen(true);
        }}
        onOpenDiagram={() => {
          setIsAiModalOpen(false);
          setActivePageView('bagan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Details Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onOpenCalculatorWithSize={handleOpenCalculatorWithSize}
          onAddToInquiryWithOptions={handleAddToCartWithOptions}
          onOrderClick={handleOrderProduct}
        />
      )}

      {/* Calculator Modal */}
      {isCalculatorModalOpen && (
        <CalculatorModal
          initialSize={calculatorInitialSize}
          onClose={() => setIsCalculatorModalOpen(false)}
        />
      )}

      {/* Keranjang Belanja Drawer */}
      <InquiryDrawer
        isOpen={isInquiryDrawerOpen}
        onClose={() => setIsInquiryDrawerOpen(false)}
        items={inquiryItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearAllInquiry}
        onOrderProduct={handleOrderProduct}
      />

      {/* Order Wizard Modal: Pilihan Spek -> Pengiriman (Alamat Wajib) -> Pembayaran */}
      {isOrderModalOpen && (
        <OrderModal
          product={selectedProductForOrder}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedProductForOrder(null);
          }}
          currentUser={currentUser}
          onOrderSuccess={handleOrderSuccess}
          onOpenAuth={() => {
            setIsOrderModalOpen(false);
            setAuthModalInitialMode('member');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Resi Pemesanan & Resi Pembelian Modal */}
      {isReceiptModalOpen && activeReceiptOrder && (
        <ReceiptModal
          order={activeReceiptOrder}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setActiveReceiptOrder(null);
          }}
          isOfficialPaidReceipt={isReceiptOfficialPaid}
        />
      )}

      {/* Auth Modal (Member Registration with Phone & Login / Admin Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModalInitialMode}
      />

      {/* Member My Orders Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        currentUser={currentUser}
        onOpenReceipt={handleOpenReceipt}
      />

    </div>
  );
}
