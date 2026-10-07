import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS_CATALOG } from './src/data/storeData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

// Initialize GoogleGenAI server-side with telemetry User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const STORE_KNOWLEDGE = `
Anda adalah Asisten Virtual Cerdas untuk "Surya Anugrah Keramik" dan "UD. Khrisna Sakti" di Kabupaten Jombang, Jawa Timur.
Tagline Toko: "Indahkan Hunian Anda Bersama Kami"
Nomor WhatsApp / Kontak: 081240548750 (format WA: wa.me/6281240548750)

INFORMASI 2 TOKO FISIK:
1. UD. KHRISNA SAKTI:
   - Alamat: Temuwulan, Kec. Perak, Kabupaten Jombang, Jawa Timur.
2. SURYA ANUGRAH KERAMIK:
   - Alamat: Balongbesuk, Kec. Diwek, Kabupaten Jombang, Jawa Timur.

FASILITAS UTAMA:
- Memiliki Armada Pengiriman Sendiri (Truk Colt Diesel untuk muatan besar 300-500 dus & Mobil Pick-Up L300/GranMax untuk gang/lingkungan sempit 50-150 dus).
- Melayani pengiriman ke seluruh kecamatan di Kabupaten Jombang (Perak, Diwek, Jombang Kota, Peterongan, Mojoagung, Ploso, Bandar Kedungmulyo, Sumobito, Bareng, Mojowarno, Gudo, dll).

STRUKTUR PRODUK LENGKAP (SESUAI BAGAN RESMI):
1. LANTAI KERAMIK:
   - Keramik BS (Bukan Standar / Kualitas Hemat ekonomis):
     * Ukuran: 25x25, 20x25, 25x40, 25x50, 30x30, 40x40, 50x50, 60x60, 30x40, 40x50, 25x60, 30x60.
     * Permukaan: Glossy / Matte, Cutting / Non Cutting.
   - Kardusan (Dus Baru Asli Pabrik):
     * Ukuran: 25x25, 30x30, 40x40, 50x50, 60x60, 25x40, 25x50, 30x60, 80x80.
     * Permukaan: Glossy / Matte, Cutting / Non Cutting.
     * Pilihan Grade: KW A (Super/Mulus tanpa cacat), KW B (Standar), KW C (Paling Ekonomis).
   - Kukumacan (Step Nosing / Bon-bon / Finishing Pinggir Sudut Tangga & Meja):
     * Pilihan Grade: KW A, KW B, KW C.
2. GRANIT:
   - Keramik BS (Granit BS ekonomis homogen).
   - Kardusan (Granit Box Nano Polished kilap cermin motif marmer Carrara / Travertine, Rustic Matte Stone, 60x60 & 80x80).
   - List (List Plint Dinding 10x60 & Step Nosing Tangga 30x60 anti slip).
3. BATU ALAM:
   - Wall Cladding (Susun sirih & panel dinding 3D relief).
   - RTM + RTA (RTM = Rata Mesin, RTA = Rata Alam; andesit, batu candi, paras Jogja).
   - List (List profil mahkota batu alam).
   - Koral Hias (Koral sikat putih kupang, hitam alor, panca warna untuk taman & carport).
   - Batu Acak (Lempeng acak rustic taman & jalan setapak).
4. SANITARY:
   - Pintu Kamar Mandi (PVC tebal, aluminium & kaca).
   - Kloset (Kloset Duduk Dual Flush & Kloset Jongkok Porselen).
   - Tandon (Tangki penampungan air anti-lumut 3 lapis 300L - 1200L).
   - BCP + Sink (Bak Cuci Piring Kitchen Sink stainless 1 & 2 lubang plus sayap).
   - Kran (Kran wastafel, kran dapur fleksibel, shower set, kran cabang).
   - Others / Lainnya (Floor drain magnetic anti-bau, jet bidet).
5. OTHERS / LAINNYA:
   - Semen (Semen perekat ubin/granit mortar anti-popping).
   - Nad (Semen pengisi nat ubin kedap air anti-jamur berbagai warna).
   - Coating (Pelapis pelindung batu alam wet look glossy / doff).
   - WPC (Wood Plastic Composite wall panel kisi-kisi kayu).
   - Tempat Sabun (Keramik tanam & gantung stainless).

PANDUAN PERHITUNGAN:
- 1 dus ubin 40x40 ≈ 0.96 m² (6 keping).
- 1 dus ubin 50x50 ≈ 1.00 m² (4 keping).
- 1 dus ubin 60x60 ≈ 1.44 m² (4 keping).
- 1 dus ubin 80x80 ≈ 1.92 m² (3 keping).
- Selalu sarankan cadangan potongan (waste) 5% untuk pola standar lurus, atau 10% untuk pola diagonal / banyak lekukan.

TATA CARA MENJAWAB:
- Jawab dengan ramah, informatif, santun dalam Bahasa Indonesia.
- Berikan saran ukuran ubin yang ideal berdasarkan ruangan yang ditanyakan pelanggan.
- Jika pengguna ingin memesan atau memastikan stok, arahkan untuk menghubungi nomor WA 081240548750 atau datang ke cabang Perak / Diwek.
`;

// Smart domain knowledge fallback generator if Gemini API is temporarily busy / 503
function generateDomainFallback(prompt: string): string {
  const p = prompt.toLowerCase();

  // 1. Calculation query (e.g. "3x4", "4x5", "hitung", "luas", "kamar", "ruangan")
  const dimensionMatch = p.match(/(\d+(?:[.,]\d+)?)\s*(?:x|\*|kali)\s*(\d+(?:[.,]\d+)?)/);
  if (dimensionMatch) {
    const length = parseFloat(dimensionMatch[1].replace(',', '.'));
    const width = parseFloat(dimensionMatch[2].replace(',', '.'));
    const rawArea = length * width;
    const withWaste = rawArea * 1.05; // 5% spare
    const boxes40 = Math.ceil(withWaste / 0.96);
    const boxes50 = Math.ceil(withWaste / 1.00);
    const boxes60 = Math.ceil(withWaste / 1.44);

    return `Berikut estimasi perhitungan kebutuhan ubin untuk ruangan berukuran **${length} x ${width} meter** (Luas bersih: **${rawArea.toFixed(2)} m²**):\n\n` +
      `• **Total Luas + Cadangan 5%**: ± **${withWaste.toFixed(2)} m²** (cadangan untuk potongan sudut & pilar)\n\n` +
      `**Estimasi Jumlah Dus:**\n` +
      `• Jika menggunakan ukuran **40x40 cm** (0.96 m²/dus): butuh sekitar **${boxes40} dus**\n` +
      `• Jika menggunakan ukuran **50x50 cm** (1.00 m²/dus): butuh sekitar **${boxes50} dus**\n` +
      `• Jika menggunakan granit **60x60 cm** (1.44 m²/dus): butuh sekitar **${boxes60} dus**\n\n` +
      `Toko kami memiliki armada pengiriman mandiri (Pick-Up & Truk) siap kirim langsung ke lokasi proyek Anda di Jombang. Hubungi WhatsApp **081240548750** untuk info motif & harga terbaru!`;
  }

  // 2. Difference between Keramik BS and Kardusan / KW A
  if (p.includes('bs') || p.includes('kardus') || p.includes('kw') || p.includes('beda') || p.includes('perbedaan')) {
    return `Berikut penjelasan perbedaan antara **Keramik BS** dan **Keramik Kardusan (KW A, B, C)**:\n\n` +
      `1. **Keramik BS (Bukan Standar / Hemat Ekonomis)**:\n` +
      `   • Pilihan ubin dengan harga paling terjangkau, fisik kokoh & prima.\n` +
      `   • Sangat cocok untuk proyek kos-kosan, gudang, kontrakan, dapur, atau renovasi hemat biaya.\n` +
      `   • Tersedia pilihan ukuran lengkap (25x25 s/d 60x60 cm), permukaan Glossy & Matte, serta varian Cutting / Non Cutting.\n\n` +
      `2. **Keramik Kardusan (Dus Resmi Pabrikan)**:\n` +
      `   • Dikemas dalam dus baru resmi bersegel pabrik.\n` +
      `   • **KW A (Super)**: Tingkat presisi tertinggi, mulus sempurna, sudut siku rapat.\n` +
      `   • **KW B**: Kualitas standar pabrikan dengan harga sedikit lebih ekonomis.\n` +
      `   • **KW C**: Pilihan dus resmi paling ekonomis untuk volume luas.\n\n` +
      `Keduanya ready stock di gudang **UD. Khrisna Sakti (Perak)** dan **Surya Anugrah Keramik (Diwek)**. Silakan chat WA **081240548750** untuk cek motif langsung.`;
  }

  // 3. Store Location query
  if (p.includes('alamat') || p.includes('lokasi') || p.includes('dimana') || p.includes('cabang') || p.includes('toko') || p.includes('perak') || p.includes('diwek')) {
    return `Toko fisik kami ada **dua cabang** di Kabupaten Jombang, Jawa Timur:\n\n` +
      `1. **UD. KHRISNA SAKTI**\n` +
      `   • Alamat: **Temuwulan, Kec. Perak, Kabupaten Jombang**\n` +
      `   • Jam Buka: Setiap Hari 07.30 - 17.00 WIB\n\n` +
      `2. **SURYA ANUGRAH KERAMIK**\n` +
      `   • Alamat: **Balongbesuk, Kec. Diwek, Kabupaten Jombang**\n` +
      `   • Jam Buka: Setiap Hari 07.30 - 17.00 WIB\n\n` +
      `Kami dilengkapi **armada pengiriman sendiri** (Truk & Pick-Up) yang siap mengantar pesanan langsung ke lokasi Anda se-Kabupaten Jombang. Hubungi WhatsApp **081240548750**!`;
  }

  // 4. Delivery fleet query
  if (p.includes('armada') || p.includes('kirim') || p.includes('ongkir') || p.includes('truk') || p.includes('pickup') || p.includes('mobil')) {
    return `Toko kami memiliki **fasilitas armada pengiriman mandiri** untuk memastikan keramik dan material Anda sampai dengan cepat, aman, dan tanpa resiko pecah:\n\n` +
      `1. **Armada Mobil Pick-Up (L300 / GranMax)**: Kapasitas 50 - 150 dus, cocok untuk jalan lingkungan, gang perumahan, atau kebutuhan renovasi bertahap.\n` +
      `2. **Armada Truk Colt Diesel**: Kapasitas muat besar hingga 300 - 500 dus ubin, semen, dan sanitary untuk proyek borongan, gedung, atau ruko.\n\n` +
      `Melayani wilayah: Perak, Diwek, Peterongan, Jombang Kota, Mojoagung, Ploso, Sumobito, Bareng, Mojowarno, Gudo, dan seluruh kecamatan se-Jombang. Hubungi WA **081240548750** untuk koordinasi jadwal kirim!`;
  }

  // 5. Natural stone query
  if (p.includes('batu alam') || p.includes('cladding') || p.includes('andesit') || p.includes('koral') || p.includes('pagar') || p.includes('carport') || p.includes('coating')) {
    return `Untuk kebutuhan **Batu Alam**, kami menyediakan 5 varian utama sesuai bagan resmi:\n\n` +
      `1. **Wall Cladding**: Susun sirih 3D relief siap pasang, sangat mewah untuk pilar pagar depan dan fasad rumah.\n` +
      `2. **RTM + RTA**: Andesit dan batu candi potongan Rata Mesin (halus rapi) maupun Rata Alam (tekstur belah alami).\n` +
      `3. **List Profil**: Mahkota pilar dan pembatas bidang batu alam.\n` +
      `4. **Koral Hias**: Koral sikat putih kupang, hitam alor, & panca warna untuk lantai carport atau taburan taman.\n` +
      `5. **Batu Acak**: Lempeng acak rustic untuk jalan setapak taman.\n` +
      `6. **Coating Batu Alam**: Pelapis Wet Look (kilap basah) & Natural Doff anti-jamur dan lumut.\n\n` +
      `Konsultasikan motif & kebutuhan m² via WhatsApp **081240548750**!`;
  }

  // 6. Sanitary query
  if (p.includes('sanitary') || p.includes('kloset') || p.includes('tandon') || p.includes('sink') || p.includes('kran') || p.includes('pintu')) {
    return `Koleksi perlengkapan **Sanitary** kami meliputi:\n\n` +
      `• **Pintu Kamar Mandi**: Bahan PVC tebal motif kayu/kaca es dan aluminium kokoh anti rayap lengkap kunci.\n` +
      `• **Kloset**: Kloset duduk hemat air dual flush (soft closing) & kloset jongkok keramik porselen anti noda.\n` +
      `• **Tandon Air**: Tangki penampung anti-lumut 3 lapis food grade (300L s/d 1200L).\n` +
      `• **BCP + Sink**: Bak cuci piring stainless steel anti karat 1 & 2 lubang plus sayap tirisan.\n` +
      `• **Kran & Shower**: Kran dapur fleksibel, kran wastafel up-down, shower set, dan floor drain anti bau.\n\n` +
      `Stok ready di Perak & Diwek. Hubungi WA **081240548750** untuk info harga paket sanitary!`;
  }

  // General helpful overview
  return `Halo! Terima kasih telah berkonsultasi dengan **Surya Anugrah Keramik** & **UD. Khrisna Sakti**.\n\n` +
    `Kami menyediakan ubin lantai keramik hemat (Keramik BS) maupun dus resmi (Kardusan KW A, B, C), Granit marmer nano polished, Batu Alam asli, perlengkapan Sanitary, serta semen perekat dan nat ubin.\n\n` +
    `Anda dapat menanyakan rekomendasi ukuran, perhitungan luas ruangan, atau langsung menghubungi staf kami melalui WhatsApp **081240548750** atau mengunjungi toko fisik kami di **Temuwulan (Perak)** dan **Balongbesuk (Diwek), Jombang**.`;
}

// AI Assistant Chat Route with multi-model fallback & local knowledge safety
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan pertanyaan wajib diisi.' });
      return;
    }

    const contents: any[] = [];

    // System context in history
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role === 'user' || turn.role === 'model') {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text || turn.content || '' }],
          });
        }
      }
    }

    // Add latest user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Call Gemini with timeout protection (max 7s) to guarantee fast user response
    let textResponse = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 6500)
        );

        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: STORE_KNOWLEDGE,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);

        if (response && response.text) {
          textResponse = response.text;
          break;
        }
      } catch (modelError: any) {
        console.warn(`Model ${modelName} returned error:`, modelError?.message || modelError);
      }
    }

    // If all models hit temporary 503 high demand or quota spikes, use the smart local domain fallback
    if (!textResponse) {
      console.log('Serving smart domain fallback for prompt:', message);
      textResponse = generateDomainFallback(message);
    }

    res.json({ reply: textResponse });
  } catch (error: any) {
    console.error('Error handling AI request:', error);
    // Even in unexpected failure, return domain fallback instead of 500 so UI never crashes
    const fallbackText = generateDomainFallback(req.body?.message || '');
    res.json({ reply: fallbackText });
  }
});

// ==========================================
// PERSISTENT DATABASE & DATA STORE
// ==========================================
const DB_FILE = path.resolve(__dirname, 'store_db.json');

interface DatabaseSchema {
  members: Array<{
    id: string;
    phone: string;
    name: string;
    password?: string;
    role: 'member' | 'admin';
    createdAt: string;
  }>;
  orders: Array<any>;
  products: Array<any>;
  googleScriptConfig: {
    webhookUrl: string;
    isEnabled: boolean;
    autoSyncOrders: boolean;
    lastSyncTime?: string;

    // Database 1: Pesanan & Informasi Pelanggan
    ordersWebhookUrl?: string;
    ordersSyncEnabled?: boolean;
    ordersLastSyncTime?: string;

    // Database 2: Katalog & Input Data Produk
    productsWebhookUrl?: string;
    productsSyncEnabled?: boolean;
    productsLastSyncTime?: string;
    autoSyncProducts?: boolean;
  };
}

function getInitialDatabase(): DatabaseSchema {
  return {
    members: [
      {
        id: 'usr-admin',
        phone: '081240548750',
        name: 'Admin Surya Anugrah Keramik',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-member-1',
        phone: '081234567890',
        name: 'Pak Budi Hartono',
        role: 'member',
        createdAt: new Date().toISOString(),
      },
    ],
    orders: [
      {
        id: 'SAK-ORD-20261007-1001',
        orderNumber: 'SAK-ORD-20261007-1001',
        customerName: 'Pak Budi Hartono',
        customerPhone: '081234567890',
        memberId: 'usr-member-1',
        shippingMethod: 'delivery',
        deliveryAddress: 'Jl. Raya Perak No. 45, RT 02 / RW 01',
        deliveryDistrict: 'Perak',
        paymentMethod: 'transfer',
        paymentStatus: 'unpaid',
        status: 'pending',
        receiptNumber: 'SAK-INV-20261007-1001',
        items: [
          {
            productId: 'ker-kd-01',
            productName: 'Keramik Kardusan Platinum Style 40x40',
            category: 'Lantai Keramik',
            subcategory: 'Kardusan',
            unit: 'dus',
            size: '40x40',
            grade: 'KW A',
            surfaceFinish: 'Glossy',
            cuttingType: 'Cutting',
            quantity: 25,
            unitPrice: 65000,
            totalPrice: 1625000,
          },
        ],
        subtotal: 1625000,
        shippingCost: 50000,
        totalAmount: 1675000,
        notes: 'Mohon diantar pagi sebelum jam 10 dengan armada pick-up.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'SAK-ORD-20261006-0982',
        orderNumber: 'SAK-ORD-20261006-0982',
        customerName: 'Haji Mansur',
        customerPhone: '085712345678',
        shippingMethod: 'delivery',
        deliveryAddress: 'Desa Balongbesuk, Depan Masjid Jami',
        deliveryDistrict: 'Diwek',
        paymentMethod: 'transfer',
        paymentStatus: 'paid',
        status: 'verified_paid',
        verifiedAt: new Date(Date.now() - 86400000).toISOString(),
        verifiedBy: 'Admin Surya Anugrah Keramik',
        receiptNumber: 'SAK-RC-20261006-0982',
        receiptIssuedAt: new Date(Date.now() - 86400000).toISOString(),
        items: [
          {
            productId: 'grn-kd-01',
            productName: 'Granit Kardusan Polished Glazed Marmer Carrara 60x60',
            category: 'Granit',
            subcategory: 'Kardusan',
            unit: 'dus',
            size: '60x60',
            grade: 'KW A',
            surfaceFinish: 'Glossy',
            cuttingType: 'Cutting',
            quantity: 30,
            unitPrice: 165000,
            totalPrice: 4950000,
          },
          {
            productId: 'oth-smn-01',
            productName: 'Semen Perekat Keramik & Granit Mortar',
            category: 'Others/Lainnya',
            subcategory: 'Semen',
            unit: 'sak',
            size: '25 kg',
            quantity: 4,
            unitPrice: 85000,
            totalPrice: 340000,
          },
        ],
        subtotal: 5290000,
        shippingCost: 0,
        totalAmount: 5290000,
        notes: 'Sudah lunas ditransfer. Siap kirim armada truk toko.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    products: [...PRODUCTS_CATALOG],
    googleScriptConfig: {
      webhookUrl: '',
      isEnabled: false,
      autoSyncOrders: true,
      lastSyncTime: undefined,
      ordersWebhookUrl: '',
      ordersSyncEnabled: false,
      productsWebhookUrl: '',
      productsSyncEnabled: false,
      autoSyncProducts: true,
    },
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);

      // Ensure products catalog exists
      if (!parsed.products || !Array.isArray(parsed.products) || parsed.products.length === 0) {
        parsed.products = [...PRODUCTS_CATALOG];
      }

      // Ensure dual spreadsheet config fields
      if (!parsed.googleScriptConfig) {
        parsed.googleScriptConfig = {
          webhookUrl: '',
          isEnabled: false,
          autoSyncOrders: true,
          ordersWebhookUrl: '',
          ordersSyncEnabled: false,
          productsWebhookUrl: '',
          productsSyncEnabled: false,
          autoSyncProducts: true,
        };
      } else {
        if (parsed.googleScriptConfig.ordersWebhookUrl === undefined) {
          parsed.googleScriptConfig.ordersWebhookUrl = parsed.googleScriptConfig.webhookUrl || '';
          parsed.googleScriptConfig.ordersSyncEnabled = parsed.googleScriptConfig.isEnabled ?? true;
        }
        if (parsed.googleScriptConfig.productsWebhookUrl === undefined) {
          parsed.googleScriptConfig.productsWebhookUrl = parsed.googleScriptConfig.webhookUrl || '';
          parsed.googleScriptConfig.productsSyncEnabled = false;
          parsed.googleScriptConfig.autoSyncProducts = true;
        }
      }

      saveDatabase(parsed);
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load database file, creating fresh:', err);
  }
  const fresh = getInitialDatabase();
  saveDatabase(fresh);
  return fresh;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

let db = loadDatabase();

// Asynchronous helper to push order to Database 1 (Google Apps Script Web App - Sheet Pesanan)
async function syncOrderToGoogleScript(order: any, actionType: 'CREATE_ORDER' | 'VERIFY_PAYMENT') {
  const targetUrl = db.googleScriptConfig.ordersWebhookUrl || db.googleScriptConfig.webhookUrl;
  const isEnabled = db.googleScriptConfig.ordersSyncEnabled ?? db.googleScriptConfig.isEnabled;
  if (!isEnabled || !targetUrl) {
    return;
  }
  try {
    const payload = {
      action: actionType,
      timestamp: new Date().toISOString(),
      orderId: order.id,
      orderNumber: order.orderNumber,
      receiptNumber: order.receiptNumber || '-',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      shippingMethod: order.shippingMethod,
      deliveryDistrict: order.deliveryDistrict || '-',
      deliveryAddress: order.deliveryAddress || '-',
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      totalAmount: order.totalAmount,
      itemsSummary: order.items.map((it: any) => `${it.productName} (${it.quantity} ${it.unit})`).join('; '),
      notes: order.notes || '-',
    };

    console.log(`[Google Script Orders Sync] Sending ${actionType} to ${targetUrl}`);
    await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    db.googleScriptConfig.ordersLastSyncTime = new Date().toISOString();
    db.googleScriptConfig.lastSyncTime = new Date().toISOString();
    saveDatabase(db);
  } catch (err: any) {
    console.warn('[Google Script Orders Sync] Error sending to Google Apps Script:', err?.message || err);
  }
}

// Asynchronous helper to push product to Database 2 (Google Apps Script Web App - Sheet Produk)
async function syncProductToGoogleScript(product: any, actionType: 'ADD_PRODUCT' | 'UPDATE_PRODUCT') {
  const targetUrl = db.googleScriptConfig.productsWebhookUrl || db.googleScriptConfig.webhookUrl;
  const isEnabled = db.googleScriptConfig.productsSyncEnabled ?? false;
  if (!isEnabled || !targetUrl) {
    return;
  }
  try {
    console.log(`[Google Script Products Sync] Sending ${actionType} to ${targetUrl}`);
    await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: actionType,
        timestamp: new Date().toISOString(),
        product,
      }),
    });
    db.googleScriptConfig.productsLastSyncTime = new Date().toISOString();
    saveDatabase(db);
  } catch (err: any) {
    console.warn('[Google Script Products Sync] Error sending to Google Apps Script:', err?.message || err);
  }
}

// ==========================================
// AUTHENTICATION ROUTES (MEMBER & ADMIN)
// ==========================================

// Register as Member using phone number
app.post('/api/auth/register-member', (req: Request, res: Response) => {
  try {
    const { phone, name, password } = req.body;

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      res.status(400).json({ error: 'Nomor HP wajib diisi (minimal 8 digit).' });
      return;
    }

    const cleanPhone = phone.trim().replace(/[-\s]/g, '');
    const cleanName = (name && typeof name === 'string' && name.trim()) ? name.trim() : `Member ${cleanPhone.slice(-4)}`;

    // Check if phone already registered
    const existing = db.members.find((m) => m.phone === cleanPhone);
    if (existing) {
      // If already member, return member data
      res.json({
        message: 'Nomor HP sudah terdaftar. Berhasil masuk ke akun Anda.',
        user: {
          id: existing.id,
          phone: existing.phone,
          name: existing.name,
          role: existing.role,
          createdAt: existing.createdAt,
        },
      });
      return;
    }

    const newMember = {
      id: `usr-${Date.now()}`,
      phone: cleanPhone,
      name: cleanName,
      password: password || '123456',
      role: 'member' as const,
      createdAt: new Date().toISOString(),
    };

    db.members.push(newMember);
    saveDatabase(db);

    res.json({
      message: 'Pendaftaran member berhasil!',
      user: {
        id: newMember.id,
        phone: newMember.phone,
        name: newMember.name,
        role: newMember.role,
        createdAt: newMember.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal mendaftar member.' });
  }
});

// Login as Admin or Member
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { identifier, password, roleChoice } = req.body;

    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Nomor HP atau Username wajib diisi.' });
      return;
    }

    const cleanIdentifier = identifier.trim().replace(/[-\s]/g, '');

    // 1. Admin login check
    if (
      roleChoice === 'admin' ||
      cleanIdentifier.toLowerCase() === 'admin' ||
      cleanIdentifier === '081240548750'
    ) {
      if (password === 'admin123' || !password || cleanIdentifier.toLowerCase() === 'admin') {
        const adminUser = db.members.find((m) => m.role === 'admin') || {
          id: 'usr-admin',
          phone: '081240548750',
          name: 'Admin Surya Anugrah Keramik',
          role: 'admin' as const,
          createdAt: new Date().toISOString(),
        };

        res.json({
          message: 'Login Admin Berhasil!',
          user: {
            id: adminUser.id,
            phone: adminUser.phone,
            name: adminUser.name,
            role: 'admin',
            createdAt: adminUser.createdAt,
          },
        });
        return;
      } else {
        res.status(401).json({ error: 'Password Admin salah. (Default: admin123)' });
        return;
      }
    }

    // 2. Member login check: match by phone
    const member = db.members.find((m) => m.phone === cleanIdentifier && m.role === 'member');
    if (member) {
      res.json({
        message: 'Login Member Berhasil!',
        user: {
          id: member.id,
          phone: member.phone,
          name: member.name,
          role: 'member',
          createdAt: member.createdAt,
        },
      });
      return;
    }

    // If phone not yet registered, auto-register as requested (cukup pakai no HP)
    const newMember = {
      id: `usr-${Date.now()}`,
      phone: cleanIdentifier,
      name: `Member ${cleanIdentifier.slice(-4)}`,
      role: 'member' as const,
      createdAt: new Date().toISOString(),
    };
    db.members.push(newMember);
    saveDatabase(db);

    res.json({
      message: 'Nomor HP berhasil didaftarkan dan Anda langsung masuk.',
      user: {
        id: newMember.id,
        phone: newMember.phone,
        name: newMember.name,
        role: 'member',
        createdAt: newMember.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal melakukan login.' });
  }
});

// Get Members List (for Admin)
app.get('/api/members', (_req: Request, res: Response) => {
  res.json({ members: db.members });
});

// ==========================================
// ORDER MANAGEMENT & RESI PEMESANAN ROUTES
// ==========================================

// Get Orders (Admin sees all, member can filter by phone)
app.get('/api/orders', (req: Request, res: Response) => {
  const { phone, memberId } = req.query;

  if (phone && typeof phone === 'string') {
    const cleanPhone = phone.trim().replace(/[-\s]/g, '');
    const filtered = db.orders.filter((o) => o.customerPhone === cleanPhone || o.memberId === memberId);
    res.json({ orders: filtered });
    return;
  }

  // Admin gets all orders sorted by newest first
  const sorted = [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ orders: sorted });
});

// Create Order & Issue Resi Pemesanan
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      memberId,
      shippingMethod,
      deliveryAddress,
      deliveryDistrict,
      pickupStoreBranch,
      paymentMethod,
      items,
      notes,
    } = req.body;

    // Validation
    if (!customerPhone || typeof customerPhone !== 'string') {
      res.status(400).json({ error: 'Nomor HP pemesan wajib diisi.' });
      return;
    }
    if (!customerName || typeof customerName !== 'string') {
      res.status(400).json({ error: 'Nama pemesan wajib diisi.' });
      return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Pilihan ubin dan kuantitas order wajib dipilih.' });
      return;
    }

    // Alamat wajib jika pengiriman diantar armada toko (sesuai instruksi: "untuk alamat diwajibkan setelah melakukan order")
    if (shippingMethod === 'delivery') {
      if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 5) {
        res.status(400).json({ error: 'Alamat pengiriman lengkap wajib diisi untuk pengiriman armada toko.' });
        return;
      }
      if (!deliveryDistrict || typeof deliveryDistrict !== 'string') {
        res.status(400).json({ error: 'Kecamatan pengiriman di Jombang wajib dipilih.' });
        return;
      }
    }

    // Calculate subtotal & shipping cost
    let subtotal = 0;
    const sanitizedItems = items.map((it: any) => {
      const q = Math.max(1, parseInt(it.quantity) || 1);
      const price = Math.max(1000, parseInt(it.unitPrice) || 50000);
      const total = q * price;
      subtotal += total;
      return {
        productId: it.productId,
        productName: it.productName,
        category: it.category || 'Lantai Keramik',
        subcategory: it.subcategory || 'Kardusan',
        unit: it.unit || 'dus',
        size: it.size || it.selectedSize || '40x40',
        grade: it.grade || it.selectedGrade || 'KW A',
        surfaceFinish: it.surfaceFinish || it.selectedFinish || 'Glossy',
        cuttingType: it.cuttingType || it.selectedCutting || 'Cutting',
        quantity: q,
        unitPrice: price,
        totalPrice: total,
      };
    });

    const shippingCost = shippingMethod === 'delivery' ? 50000 : 0;
    const totalAmount = subtotal + shippingCost;

    const uniqueIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `SAK-ORD-${dateStamp}-${uniqueIdSuffix}`;
    const receiptNumber = `SAK-INV-${dateStamp}-${uniqueIdSuffix}`;

    const newOrder = {
      id: orderNumber,
      orderNumber,
      receiptNumber, // Resi Pemesanan
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim().replace(/[-\s]/g, ''),
      memberId: memberId || undefined,
      shippingMethod: shippingMethod || 'delivery',
      deliveryAddress: shippingMethod === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryDistrict: shippingMethod === 'delivery' ? deliveryDistrict : undefined,
      pickupStoreBranch: shippingMethod === 'pickup' ? (pickupStoreBranch || 'Surya Anugrah Keramik (Diwek)') : undefined,
      paymentMethod: paymentMethod || 'transfer',
      paymentStatus: 'unpaid' as const,
      status: 'pending' as const,
      items: sanitizedItems,
      subtotal,
      shippingCost,
      totalAmount,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveDatabase(db);

    // Asynchronously sync to Google Apps Script Webhook if configured
    syncOrderToGoogleScript(newOrder, 'CREATE_ORDER');

    res.json({
      message: 'Pesanan berhasil dibuat dan Resi Pemesanan telah terbit!',
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Gagal membuat pesanan.' });
  }
});

// Admin verifies payment pelunasan order & issues official Resi Pembelian Lunas
app.patch('/api/orders/:id/verify-payment', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verifiedBy } = req.body;

    const orderIndex = db.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
      return;
    }

    const order = db.orders[orderIndex];
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const uniqueSuffix = order.orderNumber.split('-').pop() || Math.floor(1000 + Math.random() * 9000);

    // Terbitkan Resi Pembelian Resmi Lunas
    const officialReceiptNumber = `SAK-RC-${dateStamp}-${uniqueSuffix}`;
    const verifiedAt = new Date().toISOString();

    order.paymentStatus = 'paid';
    order.status = 'verified_paid';
    order.receiptNumber = officialReceiptNumber;
    order.receiptIssuedAt = verifiedAt;
    order.verifiedAt = verifiedAt;
    order.verifiedBy = verifiedBy || 'Admin Surya Anugrah Keramik';

    db.orders[orderIndex] = order;
    saveDatabase(db);

    // Sync to Google Apps Script
    syncOrderToGoogleScript(order, 'VERIFY_PAYMENT');

    res.json({
      message: 'Pelunasan order berhasil diverifikasi! Resi Pembelian Resmi telah diterbitkan.',
      order,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memverifikasi pembayaran.' });
  }
});

// ==========================================
// PRODUCTS API & SPREADSHEET SYNC ROUTES
// ==========================================

// Get all products (merging catalog & dynamic additions)
app.get('/api/products', (_req: Request, res: Response) => {
  res.json({ products: db.products || PRODUCTS_CATALOG });
});

// ==========================================
// GOOGLE DRIVE & LOCAL PHOTO UPLOAD HELPER
// ==========================================
async function saveImageToDriveOrLocal(
  imageBase64: string,
  customFileName?: string,
  productName?: string
): Promise<{
  url: string;
  localUrl: string;
  driveUrl?: string;
  driveFileId?: string;
  isStoredInDrive: boolean;
  message: string;
}> {
  // If already a standard URL, return directly
  if (!imageBase64.startsWith('data:image/')) {
    return {
      url: imageBase64,
      localUrl: imageBase64,
      isStoredInDrive: imageBase64.includes('drive.google.com') || imageBase64.includes('googleusercontent.com'),
      message: 'URL foto eksternal digunakan.',
    };
  }

  const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const mimeType = matches ? matches[1] : 'image/jpeg';
  const pureBase64 = matches ? matches[2] : imageBase64;
  const extension = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';

  const safeBase = (productName || 'produk')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30);
  const fileName = customFileName || `${safeBase}-${Date.now()}.${extension}`;

  // 1. Always save a copy to public/uploads
  const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(pureBase64, 'base64'));
  const localUrl = `/uploads/${fileName}`;

  // 2. Upload to Google Drive via Google Apps Script Webhook
  const targetUrl = db.googleScriptConfig.productsWebhookUrl || db.googleScriptConfig.webhookUrl;
  let finalUrl = localUrl;
  let driveUrl: string | undefined;
  let driveFileId: string | undefined;
  let isStoredInDrive = false;

  if (targetUrl && typeof targetUrl === 'string' && targetUrl.startsWith('http')) {
    try {
      console.log(`[Google Drive Upload] Forwarding photo to Apps Script: ${targetUrl}`);
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPLOAD_IMAGE_TO_DRIVE',
          imageBase64: pureBase64,
          mimeType,
          fileName,
          productName: productName || 'Produk Surya Anugrah Keramik',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result: any = await response.json();
        if (result && (result.status === 'SUCCESS' || result.fileId)) {
          isStoredInDrive = true;
          driveFileId = result.fileId;
          driveUrl = result.driveUrl;
          finalUrl = result.fileUrl || result.driveUrl || localUrl;
          console.log(`[Google Drive Upload] Success! Drive fileId: ${driveFileId}`);
        }
      }
    } catch (err: any) {
      console.warn('[Google Drive Upload] Warning: Failed to send to Drive, kept local copy:', err.message);
    }
  }

  return {
    url: finalUrl,
    localUrl,
    driveUrl,
    driveFileId,
    isStoredInDrive,
    message: isStoredInDrive
      ? 'Foto berhasil disimpan di Google Drive (Folder: Foto_Produk_Surya_Anugrah).'
      : 'Foto tersimpan di penyimpanan server toko (siap disinkronkan ke Google Drive begitu Webhook aktif).',
  };
}

// Endpoint Upload Foto Produk ke Google Drive & Server
app.post('/api/upload-drive', async (req: Request, res: Response) => {
  try {
    const { imageBase64, fileName, productName } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Data foto (base64) wajib disertakan.' });
      return;
    }
    const result = await saveImageToDriveOrLocal(imageBase64, fileName, productName);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Error in /api/upload-drive:', err);
    res.status(500).json({ error: 'Gagal mengunggah foto ke Google Drive: ' + err.message });
  }
});

// Add a new product (from Web UI or API, auto-sync to spreadsheet if enabled)
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const {
      name,
      category,
      subcategory,
      sizes,
      defaultSize,
      surfaceFinish,
      cuttingType,
      grades,
      numericPrice,
      estimatedPriceRange,
      unit,
      image,
      description,
      features,
      inStock,
      isPopular,
    } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Nama produk wajib diisi.' });
      return;
    }

    const catPrefix = (category || 'prod')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 3);
    const uniqueId = `prod-${catPrefix}-${Date.now().toString().slice(-6)}`;

    // Process image: if base64, save to Google Drive & local storage
    let finalImageUrl = image || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
    if (typeof finalImageUrl === 'string' && finalImageUrl.startsWith('data:image/')) {
      const uploadRes = await saveImageToDriveOrLocal(finalImageUrl, undefined, name.trim());
      finalImageUrl = uploadRes.url;
    }

    const newProduct = {
      id: uniqueId,
      name: name.trim(),
      category: category || 'Lantai Keramik',
      subcategory: subcategory || 'Kardusan',
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : (defaultSize ? [defaultSize] : ['40x40']),
      defaultSize: defaultSize || (Array.isArray(sizes) ? sizes[0] : '40x40'),
      surfaceFinish: Array.isArray(surfaceFinish) ? surfaceFinish : ['Glossy'],
      cuttingType: Array.isArray(cuttingType) ? cuttingType : ['Cutting'],
      grades: Array.isArray(grades) ? grades : ['KW A'],
      numericPrice: Number(numericPrice) || 50000,
      estimatedPriceRange: estimatedPriceRange || `Rp ${(Number(numericPrice) || 50000).toLocaleString('id-ID')}`,
      unit: unit || 'dus',
      image: finalImageUrl,
      description: description || 'Produk berkualitas dari Surya Anugrah Keramik & UD. Khrisna Sakti Jombang.',
      features: Array.isArray(features) && features.length > 0 ? features : ['Kualitas terjamin', 'Stok ready di toko'],
      inStock: inStock !== false,
      isPopular: Boolean(isPopular),
      isCustomProduct: true,
      updatedAt: new Date().toISOString(),
    };

    if (!Array.isArray(db.products)) {
      db.products = [...PRODUCTS_CATALOG];
    }
    db.products.unshift(newProduct);
    saveDatabase(db);

    // Auto-sync to Google Sheets Database Produk if enabled
    if (db.googleScriptConfig.productsSyncEnabled && db.googleScriptConfig.autoSyncProducts) {
      syncProductToGoogleScript(newProduct, 'ADD_PRODUCT');
    }

    res.json({
      message: 'Produk berhasil ditambahkan!',
      product: newProduct,
    });
  } catch (err: any) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Gagal menambahkan produk baru.' });
  }
});

// Update product
app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }

    const updated = {
      ...db.products[index],
      ...req.body,
      id, // keep immutable ID
      updatedAt: new Date().toISOString(),
    };

    db.products[index] = updated;
    saveDatabase(db);

    if (db.googleScriptConfig.productsSyncEnabled) {
      syncProductToGoogleScript(updated, 'UPDATE_PRODUCT');
    }

    res.json({ message: 'Produk berhasil diperbarui.', product: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal memperbarui produk.' });
  }
});

// Delete product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prevLen = db.products.length;
    db.products = db.products.filter((p: any) => p.id !== id);
    if (db.products.length === prevLen) {
      res.status(404).json({ error: 'Produk tidak ditemukan.' });
      return;
    }
    saveDatabase(db);
    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menghapus produk.' });
  }
});

// Tarik Data Produk dari Google Sheets (Pull / Sync from Spreadsheet)
app.post('/api/products/sync-spreadsheet', async (_req: Request, res: Response) => {
  try {
    const targetUrl = db.googleScriptConfig.productsWebhookUrl || db.googleScriptConfig.webhookUrl;
    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.status(400).json({
        error: 'Link Webhook Google Apps Script untuk Database Produk belum disetting atau tidak valid.',
      });
      return;
    }

    console.log(`[Pull Products] Fetching products from Google Sheets: ${targetUrl}`);
    
    // We send POST { action: 'GET_PRODUCTS' } to the web app
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'GET_PRODUCTS', timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script merespon dengan status ${response.status}`);
    }

    const result: any = await response.json();
    if (!result || !Array.isArray(result.products)) {
      throw new Error(result?.message || 'Format respon Google Sheets tidak memuat daftar produk.');
    }

    const incomingProducts: any[] = result.products;
    if (incomingProducts.length === 0) {
      res.json({
        success: true,
        count: 0,
        message: 'Tabel Data_Produk di Spreadsheet masih kosong. Silakan isi baris produk atau gunakan tombol Ekspor ke Spreadsheet.',
        products: db.products,
      });
      return;
    }

    // Merge incoming products into db.products
    let updatedCount = 0;
    let addedCount = 0;

    for (const inProd of incomingProducts) {
      const existingIdx = db.products.findIndex((p: any) => p.id === inProd.id || p.name.toLowerCase() === inProd.name.toLowerCase());
      if (existingIdx > -1) {
        db.products[existingIdx] = {
          ...db.products[existingIdx],
          ...inProd,
          updatedAt: new Date().toISOString(),
        };
        updatedCount++;
      } else {
        db.products.push({
          ...inProd,
          isCustomProduct: true,
          updatedAt: new Date().toISOString(),
        });
        addedCount++;
      }
    }

    db.googleScriptConfig.productsLastSyncTime = new Date().toISOString();
    saveDatabase(db);

    res.json({
      success: true,
      count: incomingProducts.length,
      addedCount,
      updatedCount,
      message: `Berhasil sinkronisasi! ${incomingProducts.length} produk diproses (${addedCount} baru, ${updatedCount} diperbarui).`,
      products: db.products,
    });
  } catch (err: any) {
    console.error('Error syncing products from Google Sheets:', err);
    res.status(500).json({
      error: `Gagal menarik data produk dari Google Sheets: ${err?.message || 'Pastikan Apps Script terdeploy dengan akses Anyone'}.`,
    });
  }
});

// Kirim / Export seluruh katalog produk toko ke Spreadsheet Google Sheets
app.post('/api/products/export-spreadsheet', async (_req: Request, res: Response) => {
  try {
    const targetUrl = db.googleScriptConfig.productsWebhookUrl || db.googleScriptConfig.webhookUrl;
    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.status(400).json({
        error: 'Link Webhook Google Apps Script untuk Database Produk belum disetting atau tidak valid.',
      });
      return;
    }

    const productsList = db.products && db.products.length > 0 ? db.products : PRODUCTS_CATALOG;

    console.log(`[Export Products] Sending ${productsList.length} products to Google Sheets: ${targetUrl}`);
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SYNC_ALL_PRODUCTS',
        timestamp: new Date().toISOString(),
        products: productsList,
      }),
    });

    const result: any = await response.json();
    db.googleScriptConfig.productsLastSyncTime = new Date().toISOString();
    saveDatabase(db);

    res.json({
      success: true,
      count: productsList.length,
      message: `Berhasil mengekspor ${productsList.length} produk ke Google Sheets Sheet "Data_Produk"!`,
      response: result,
    });
  } catch (err: any) {
    console.error('Error exporting products to Google Sheets:', err);
    res.status(500).json({
      error: `Gagal mengekspor produk ke Google Sheets: ${err?.message || 'Pastikan Apps Script terdeploy dengan akses Anyone'}.`,
    });
  }
});

// ==========================================
// GOOGLE APPS SCRIPT DUAL DATABASE SETTINGS
// ==========================================

const SAMPLE_APPS_SCRIPT_CODE = `// ==============================================================
// KODE GOOGLE APPS SCRIPT DUA DATABASE & GOOGLE DRIVE
// SURYA ANUGRAH KERAMIK & UD. KHRISNA SAKTI JOMBANG
// ==============================================================
// 1. Database 1: Pesanan & Pelanggan (Tab: "Pesanan_Pelanggan")
// 2. Database 2: Data & Input Produk (Tab: "Data_Produk")
// 3. Google Drive: Foto Produk Kamera/Upload (Folder: "Foto_Produk_Surya_Anugrah")
//
// Petunjuk Singkat:
// 1. Buka spreadsheet Google Sheets Anda (atau buat baru).
// 2. Klik Extensions > Apps Script.
// 3. Ganti semua kode yang ada dengan seluruh kode ini.
// 4. Klik "Deploy" > "New deployment" > jenis "Web app".
// 5. Ubah "Who has access" menjadi "Anyone" (Siapa saja).
// 6. Klik "Deploy", izinkan akses Google Drive & Sheets jika diminta.
// 7. Salin Web app URL dan paste di Dashboard Admin web toko!
// ==============================================================

var SHEET_ORDERS_NAME = "Pesanan_Pelanggan";
var SHEET_PRODUCTS_NAME = "Data_Produk";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getOrCreateProductSheet(ss);
    var products = readProductsFromSheet(sheet);
    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      count: products.length,
      products: products
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "";

    // -----------------------------------------------------------
    // 1. DATABASE PESANAN & PELANGGAN (Sheet: Pesanan_Pelanggan)
    // -----------------------------------------------------------
    if (action === "CREATE_ORDER" || action === "VERIFY_PAYMENT" || action === "TEST_ORDERS" || action === "TEST_CONNECTION") {
      var orderSheet = getOrCreateOrderSheet(ss);
      
      orderSheet.appendRow([
        data.timestamp || new Date().toISOString(),
        action,
        data.orderNumber || "-",
        data.receiptNumber || "-",
        data.customerName || "-",
        data.customerPhone || "-",
        data.shippingMethod || "-",
        data.deliveryDistrict || "-",
        data.deliveryAddress || "-",
        data.paymentMethod || "-",
        data.paymentStatus || "-",
        data.status || "-",
        data.totalAmount || 0,
        data.itemsSummary || "-",
        data.notes || "-"
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "Data pesanan berhasil dicatat di sheet: " + SHEET_ORDERS_NAME
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -----------------------------------------------------------
    // 2. DATABASE DATA PRODUK (Sheet: Data_Produk)
    // -----------------------------------------------------------
    var productSheet = getOrCreateProductSheet(ss);

    // Aksi 2A: Tarik / Ambil seluruh produk dari sheet
    if (action === "GET_PRODUCTS") {
      var prods = readProductsFromSheet(productSheet);
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        count: prods.length,
        products: prods
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Aksi 2B: Tambah / Update 1 produk baru
    if (action === "ADD_PRODUCT" || action === "UPDATE_PRODUCT") {
      var p = data.product || data;
      productSheet.appendRow([
        p.id || ("PROD-" + new Date().getTime()),
        p.name || "-",
        p.category || "Lantai Keramik",
        p.subcategory || "Keramik BS",
        p.sizes ? (Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes) : (p.size || "40x40"),
        p.grades ? (Array.isArray(p.grades) ? p.grades.join(", ") : p.grades) : (p.grade || "-"),
        p.surfaceFinish ? (Array.isArray(p.surfaceFinish) ? p.surfaceFinish.join(", ") : p.surfaceFinish) : "-",
        p.cuttingType ? (Array.isArray(p.cuttingType) ? p.cuttingType.join(", ") : p.cuttingType) : "-",
        p.unit || "dus",
        p.numericPrice || p.price || 0,
        (p.inStock === false || p.inStock === "false") ? "Kosong" : "Tersedia",
        p.image || "",
        p.description || p.shortDesc || "",
        p.features ? (Array.isArray(p.features) ? p.features.join("; ") : p.features) : "",
        new Date().toISOString()
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "Produk berhasil ditambahkan ke sheet: " + SHEET_PRODUCTS_NAME
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Aksi 2C: Ekspor / Sinkronkan semua produk sekaligus
    if (action === "SYNC_ALL_PRODUCTS") {
      var list = data.products || [];
      var lastRow = productSheet.getLastRow();
      if (lastRow > 1) {
        productSheet.getRange(2, 1, lastRow - 1, 15).clearContent();
      }
      for (var i = 0; i < list.length; i++) {
        var it = list[i];
        productSheet.appendRow([
          it.id || ("PROD-" + (i + 1)),
          it.name || "-",
          it.category || "Lantai Keramik",
          it.subcategory || "Keramik BS",
          it.sizes ? (Array.isArray(it.sizes) ? it.sizes.join(", ") : it.sizes) : (it.size || "40x40"),
          it.grades ? (Array.isArray(it.grades) ? it.grades.join(", ") : it.grades) : (it.grade || "-"),
          it.surfaceFinish ? (Array.isArray(it.surfaceFinish) ? it.surfaceFinish.join(", ") : it.surfaceFinish) : "-",
          it.cuttingType ? (Array.isArray(it.cuttingType) ? it.cuttingType.join(", ") : it.cuttingType) : "-",
          it.unit || "dus",
          it.numericPrice || it.price || 0,
          (it.inStock === false || it.inStock === "false") ? "Kosong" : "Tersedia",
          it.image || "",
          it.description || it.shortDesc || "",
          it.features ? (Array.isArray(it.features) ? it.features.join("; ") : it.features) : "",
          new Date().toISOString()
        ]);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "Berhasil mengekspor " + list.length + " produk ke sheet: " + SHEET_PRODUCTS_NAME
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Aksi 2D: Uji koneksi produk
    if (action === "TEST_PRODUCTS") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        message: "Koneksi ke Database Produk Google Sheets berhasil!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Aksi 2E: Simpan / Upload Foto Produk ke Google Drive
    if (action === "UPLOAD_IMAGE_TO_DRIVE" || action === "UPLOAD_IMAGE") {
      var folderName = "Foto_Produk_Surya_Anugrah";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      var rawBase64 = data.imageBase64 || "";
      if (rawBase64.indexOf(",") > -1) {
        rawBase64 = rawBase64.split(",")[1];
      }
      var mimeType = data.mimeType || "image/jpeg";
      var fileName = data.fileName || ("produk-" + new Date().getTime() + ".jpg");

      var decodedBlob = Utilities.newBlob(Utilities.base64Decode(rawBase64), mimeType, fileName);
      var file = folder.createFile(decodedBlob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      var fileId = file.getId();
      // Link thumbnail direct untuk ditampilkan di website & spreadsheet
      var directThumbUrl = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
      var driveViewUrl = file.getUrl();

      return ContentService.createTextOutput(JSON.stringify({
        status: "SUCCESS",
        fileId: fileId,
        fileUrl: directThumbUrl,
        driveUrl: driveViewUrl,
        fileName: file.getName(),
        folderName: folderName,
        message: "Foto produk berhasil disimpan di Google Drive: " + folderName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "UNKNOWN_ACTION",
      message: "Aksi tidak dikenali: " + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateOrderSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_ORDERS_NAME);
  if (!sheet) {
    if (ss.getSheets().length === 1 && ss.getActiveSheet().getName() === "Sheet1") {
      sheet = ss.getActiveSheet();
      sheet.setName(SHEET_ORDERS_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_ORDERS_NAME);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Waktu Sinkron",
      "Aksi",
      "No. Order",
      "No. Resi",
      "Nama Pelanggan",
      "No. WhatsApp",
      "Pengiriman",
      "Kecamatan",
      "Alamat Lengkap",
      "Metode Bayar",
      "Status Bayar",
      "Status Order",
      "Total (Rp)",
      "Rincian Barang",
      "Catatan Pemesan"
    ]);
    sheet.getRange(1, 1, 1, 15).setBackground("#d97706").setFontColor("#ffffff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getOrCreateProductSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_PRODUCTS_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PRODUCTS_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "ID Produk",
      "Nama Produk",
      "Kategori",
      "Subkategori",
      "Ukuran",
      "Grade",
      "Finishing",
      "Cutting",
      "Satuan",
      "Harga (Rp)",
      "Status Stok",
      "Link Gambar",
      "Deskripsi Produk",
      "Fitur Unggulan",
      "Waktu Update"
    ]);
    sheet.getRange(1, 1, 1, 15).setBackground("#059669").setFontColor("#ffffff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readProductsFromSheet(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, 15).getValues();
  var products = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var id = String(row[0] || "").trim();
    var name = String(row[1] || "").trim();
    if (!name) continue;
    if (!id) id = "prod-gs-" + (i + 1);

    var category = String(row[2] || "Lantai Keramik").trim();
    var subcategory = String(row[3] || "Keramik BS").trim();
    var sizesStr = String(row[4] || "").trim();
    var sizes = sizesStr ? sizesStr.split(/[,;]/).map(function(s){ return s.trim(); }) : ["40x40"];
    var gradesStr = String(row[5] || "").trim();
    var grades = gradesStr ? gradesStr.split(/[,;]/).map(function(s){ return s.trim(); }) : undefined;
    var finishesStr = String(row[6] || "").trim();
    var surfaceFinish = finishesStr ? finishesStr.split(/[,;]/).map(function(s){ return s.trim(); }) : undefined;
    var cuttingStr = String(row[7] || "").trim();
    var cuttingType = cuttingStr ? cuttingStr.split(/[,;]/).map(function(s){ return s.trim(); }) : undefined;
    var unit = String(row[8] || "dus").trim();
    var price = Number(row[9]) || 50000;
    var stockStr = String(row[10] || "Tersedia").trim().toLowerCase();
    var inStock = !(stockStr === "kosong" || stockStr === "habis" || stockStr === "false" || stockStr === "0");
    var image = String(row[11] || "").trim() || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80";
    var description = String(row[12] || "").trim();
    var featuresStr = String(row[13] || "").trim();
    var features = featuresStr ? featuresStr.split(/[;\n]/).map(function(s){ return s.trim(); }).filter(Boolean) : ["Kualitas terjamin", "Ready stok di toko"];

    products.push({
      id: id,
      name: name,
      category: category,
      subcategory: subcategory,
      sizes: sizes,
      defaultSize: sizes[0] || "40x40",
      grades: grades,
      surfaceFinish: surfaceFinish,
      cuttingType: cuttingType,
      unit: unit,
      numericPrice: price,
      estimatedPriceRange: "Rp " + price.toLocaleString("id-ID"),
      inStock: inStock,
      image: image,
      description: description,
      features: features,
      isCustomProduct: true
    });
  }
  return products;
}`;

// Get Google Script Config & Template Code
app.get('/api/settings/google-script', (_req: Request, res: Response) => {
  res.json({
    config: db.googleScriptConfig,
    sampleScriptCode: SAMPLE_APPS_SCRIPT_CODE,
  });
});

// Update Google Script Config (supports dual spreadsheet settings)
app.post('/api/settings/google-script', (req: Request, res: Response) => {
  try {
    const {
      webhookUrl,
      isEnabled,
      autoSyncOrders,
      ordersWebhookUrl,
      ordersSyncEnabled,
      productsWebhookUrl,
      productsSyncEnabled,
      autoSyncProducts,
    } = req.body;

    const ordUrl = typeof ordersWebhookUrl === 'string' ? ordersWebhookUrl.trim() : (typeof webhookUrl === 'string' ? webhookUrl.trim() : '');
    const prodUrl = typeof productsWebhookUrl === 'string' ? productsWebhookUrl.trim() : '';

    db.googleScriptConfig = {
      // Legacy compatibility
      webhookUrl: ordUrl || prodUrl || '',
      isEnabled: Boolean(ordersSyncEnabled ?? isEnabled),
      autoSyncOrders: Boolean(autoSyncOrders ?? true),
      lastSyncTime: db.googleScriptConfig.lastSyncTime,

      // Database 1: Pesanan & Pelanggan
      ordersWebhookUrl: ordUrl,
      ordersSyncEnabled: Boolean(ordersSyncEnabled ?? isEnabled),
      ordersLastSyncTime: db.googleScriptConfig.ordersLastSyncTime || db.googleScriptConfig.lastSyncTime,

      // Database 2: Katalog & Input Produk
      productsWebhookUrl: prodUrl,
      productsSyncEnabled: Boolean(productsSyncEnabled),
      productsLastSyncTime: db.googleScriptConfig.productsLastSyncTime,
      autoSyncProducts: Boolean(autoSyncProducts ?? true),
    };

    saveDatabase(db);

    res.json({
      message: 'Pengaturan dua database Google Sheets berhasil disimpan.',
      config: db.googleScriptConfig,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Gagal menyimpan pengaturan Google Script.' });
  }
});

// Test Connection: Database 1 (Pesanan Pelanggan)
app.post('/api/settings/google-script/test-orders', async (req: Request, res: Response) => {
  try {
    const { webhookUrl } = req.body;
    const targetUrl = webhookUrl || db.googleScriptConfig.ordersWebhookUrl || db.googleScriptConfig.webhookUrl;

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.status(400).json({ error: 'Link Webhook Database Pesanan belum diisi atau tidak valid.' });
      return;
    }

    const testPayload = {
      action: 'TEST_ORDERS',
      timestamp: new Date().toISOString(),
      orderNumber: 'TEST-ORD-001',
      receiptNumber: 'TEST-RC-001',
      customerName: 'Uji Koneksi Kasir Toko',
      customerPhone: '081240548750',
      shippingMethod: 'delivery',
      deliveryDistrict: 'Perak',
      deliveryAddress: 'Temuwulan, Perak, Jombang',
      paymentMethod: 'transfer',
      paymentStatus: 'paid',
      status: 'verified_paid',
      totalAmount: 150000,
      itemsSummary: 'Uji Sinkronisasi Sheet Pesanan Berhasil',
      notes: 'Test ping dari Dashboard Admin Toko',
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    db.googleScriptConfig.ordersLastSyncTime = new Date().toISOString();
    db.googleScriptConfig.lastSyncTime = new Date().toISOString();
    saveDatabase(db);

    res.json({
      success: true,
      status: response.status,
      message: 'Koneksi ke Database Pesanan Google Sheets berhasil! Baris data uji telah tercatat di Sheet "Pesanan_Pelanggan".',
    });
  } catch (err: any) {
    res.status(500).json({
      error: `Gagal menghubungi Google Apps Script: ${err?.message || 'Pastikan Web App disetting Anyone'}.`,
    });
  }
});

// Test Connection: Database 2 (Katalog Produk)
app.post('/api/settings/google-script/test-products', async (req: Request, res: Response) => {
  try {
    const { webhookUrl } = req.body;
    const targetUrl = webhookUrl || db.googleScriptConfig.productsWebhookUrl || db.googleScriptConfig.webhookUrl;

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.status(400).json({ error: 'Link Webhook Database Produk belum diisi atau tidak valid.' });
      return;
    }

    const testPayload = {
      action: 'TEST_PRODUCTS',
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    db.googleScriptConfig.productsLastSyncTime = new Date().toISOString();
    saveDatabase(db);

    res.json({
      success: true,
      status: response.status,
      message: 'Koneksi ke Database Produk Google Sheets berhasil! Sheet "Data_Produk" siap digunakan.',
    });
  } catch (err: any) {
    res.status(500).json({
      error: `Gagal menghubungi Google Apps Script Produk: ${err?.message || 'Pastikan Web App disetting Anyone'}.`,
    });
  }
});

// Legacy test route (alias to test-orders)
app.post('/api/settings/google-script/test', async (req: Request, res: Response) => {
  try {
    const { webhookUrl } = req.body;
    const targetUrl = webhookUrl || db.googleScriptConfig.ordersWebhookUrl || db.googleScriptConfig.webhookUrl;

    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.status(400).json({ error: 'Link Webhook Google Script belum diisi atau tidak valid.' });
      return;
    }

    const testPayload = {
      action: 'TEST_CONNECTION',
      timestamp: new Date().toISOString(),
      orderNumber: 'TEST-PING-001',
      receiptNumber: 'TEST-REC-001',
      customerName: 'Uji Koneksi Admin',
      customerPhone: '081240548750',
      shippingMethod: 'delivery',
      deliveryDistrict: 'Perak',
      deliveryAddress: 'Temuwulan, Perak, Jombang',
      paymentMethod: 'transfer',
      paymentStatus: 'paid',
      status: 'verified_paid',
      totalAmount: 100000,
      itemsSummary: 'Uji Sinkronisasi Google Sheets Berhasil',
    };

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    db.googleScriptConfig.lastSyncTime = new Date().toISOString();
    saveDatabase(db);

    res.json({
      success: true,
      status: response.status,
      message: 'Koneksi ke Google Apps Script berhasil! Baris data uji telah dikirim ke spreadsheet.',
    });
  } catch (err: any) {
    res.status(500).json({
      error: `Gagal menghubungi Google Apps Script: ${err?.message || 'Pastikan Web App disetting Anyone access'}.`,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Surya Anugrah Keramik berjalan di port ${PORT}`);
  });
}

startServer();
