import type { MainCategory, CategoryInfo, StoreBranch, ProductItem } from '../types/index.ts';

export const STORE_PHONE = '081240548750';
export const STORE_WA_NUMBER = '6281240548750';
export const STORE_TAGLINE = 'Indahkan Hunian Anda Bersama Kami';

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: 'khrisna-sakti',
    name: 'UD. KHRISNA SAKTI',
    type: 'Pusat Distribusi & Retail Keramik',
    address: 'Temuwulan, Kec. Perak, Kabupaten Jombang, Jawa Timur',
    district: 'Perak',
    city: 'Jombang',
    phone: STORE_PHONE,
    waNumber: STORE_WA_NUMBER,
    mapsUrl: 'https://maps.google.com/?q=Temuwulan+Perak+Jombang',
    badge: 'Cabang Perak',
    hours: 'Setiap Hari: 07.30 - 17.00 WIB'
  },
  {
    id: 'surya-anugrah',
    name: 'SURYA ANUGRAH KERAMIK',
    type: 'Showroom & Retail Keramik Granit',
    address: 'Balongbesuk, Kec. Diwek, Kabupaten Jombang, Jawa Timur',
    district: 'Diwek',
    city: 'Jombang',
    phone: STORE_PHONE,
    waNumber: STORE_WA_NUMBER,
    mapsUrl: 'https://maps.google.com/?q=Balongbesuk+Diwek+Jombang',
    badge: 'Cabang Diwek',
    hours: 'Setiap Hari: 07.30 - 17.00 WIB'
  }
];

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Lantai Keramik',
    name: 'Lantai Keramik',
    shortDesc: 'Pilihan Keramik BS ekonomis, Keramik Kardusan resmi (KW A/B/C), dan Kukumacan sudut.',
    iconName: 'Grid3X3',
    subcategories: ['Keramik BS', 'Kardusan', 'Kukumacan']
  },
  {
    id: 'Granit',
    name: 'Granit',
    shortDesc: 'Koleksi Granit BS, Granit Kardusan mewah polished/matte, dan List granit plint.',
    iconName: 'Layers',
    subcategories: ['Keramik BS', 'Kardusan', 'List']
  },
  {
    id: 'Batu Alam',
    name: 'Batu Alam',
    shortDesc: 'Wall Cladding, RTM + RTA, List batu alam, Koral hias taman, dan Batu acak carport.',
    iconName: 'Mountain',
    subcategories: ['Wall Cladding', 'RTM + RTA', 'List', 'Koral Hias', 'Batu Acak']
  },
  {
    id: 'Sanitary',
    name: 'Sanitary',
    shortDesc: 'Pintu kamar mandi, kloset duduk/jongkok, tandon air, BCP + sink, dan aneka kran.',
    iconName: 'Bath',
    subcategories: ['Pintu Kamar Mandi', 'Kloset', 'Tandon', 'BCP+Sink', 'Kran', 'Others/Lainnya']
  },
  {
    id: 'Others/Lainnya',
    name: 'Bahan Pendukung & Aksesoris',
    shortDesc: 'Semen perekat, pengisi nad warna, pelapis coating batu, WPC wall panel, dan tempat sabun.',
    iconName: 'Sparkles',
    subcategories: ['Semen', 'Nad', 'Coating', 'WPC', 'Tempat Sabun']
  }
];

// Exact sizes defined in the diagram
export const SIZES_KERAMIK_BS = [
  '25x25', '20x25', '25x40', '25x50', '30x30', '40x40', 
  '50x50', '60x60', '30x40', '40x50', '25x60', '30x60'
];

export const SIZES_KERAMIK_KARDUSAN = [
  '25x25', '30x30', '40x40', '50x50', '60x60', '25x40', 
  '25x50', '30x60', '80x80'
];

export const ALL_SIZES = Array.from(new Set([...SIZES_KERAMIK_BS, ...SIZES_KERAMIK_KARDUSAN]));

export const SURFACE_FINISHES = ['Glossy', 'Matte'] as const;
export const CUTTING_OPTIONS = ['Cutting', 'Non Cutting'] as const;
export const GRADE_OPTIONS = ['KW A', 'KW B', 'KW C'] as const;

export const PRODUCTS_CATALOG: ProductItem[] = [
  // --- LANTAI KERAMIK: Keramik BS ---
  {
    id: 'ker-bs-01',
    name: 'Keramik BS Polos & Corak Ekonomis 40x40',
    category: 'Lantai Keramik',
    subcategory: 'Keramik BS',
    sizes: SIZES_KERAMIK_BS,
    defaultSize: '40x40',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting', 'Non Cutting'],
    estimatedPriceRange: 'Rp 38.000 - Rp 46.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik BS (Bukan Standar) pilihan hemat terbaik untuk proyek kos-kosan, gudang, dapur, teras, atau renovasi beranggaran cerdas. Tersedia varian Glossy & Matte.',
    features: ['Harga sangat hemat', 'Pilihan ukuran lengkap 25x25 s/d 60x60', 'Tersedia Cutting & Non Cutting', 'Cocok untuk proyek borongan & rumah tinggal'],
    inStock: true,
    isPopular: true
  },
  {
    id: 'ker-bs-02',
    name: 'Keramik Dinding BS Motif Marmer & Bata 25x40 / 25x50',
    category: 'Lantai Keramik',
    subcategory: 'Keramik BS',
    sizes: ['20x25', '25x40', '25x50', '25x60', '30x40', '30x60'],
    defaultSize: '25x40',
    surfaceFinish: ['Glossy'],
    cuttingType: ['Non Cutting', 'Cutting'],
    estimatedPriceRange: 'Rp 42.000 - Rp 52.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik dinding BS bermotif marmer dan bata cerah untuk kamar mandi dan dapur. Efek glossy berkilau memberikan kesan bersih dan mudah dilap.',
    features: ['Finishing Glossy mudah dibersihkan', 'Motif variatif modern', 'Pilihan ukuran dinding populer', 'Stok melimpah siap antar armada kami'],
    inStock: true
  },
  {
    id: 'ker-bs-03',
    name: 'Keramik BS Kasar Matte Antislip 50x50 & 60x60',
    category: 'Lantai Keramik',
    subcategory: 'Keramik BS',
    sizes: ['30x30', '40x40', '50x50', '60x60'],
    defaultSize: '50x50',
    surfaceFinish: ['Matte'],
    cuttingType: ['Cutting', 'Non Cutting'],
    estimatedPriceRange: 'Rp 48.000 - Rp 65.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik BS bertekstur matte tidak licin, sangat cocok untuk garasi, carport, area cuci, teras luar ruangan, atau area basah.',
    features: ['Permukaan Matte anti-selip aman', 'Tersedia ukuran besar 50x50 & 60x60', 'Daya tahan benturan baik', 'Harga ekonomis borongan'],
    inStock: true
  },

  // --- LANTAI KERAMIK: Kardusan ---
  {
    id: 'ker-kd-01',
    name: 'Keramik Kardusan Platinum / Roman Style 40x40 & 50x50',
    category: 'Lantai Keramik',
    subcategory: 'Kardusan',
    sizes: SIZES_KERAMIK_KARDUSAN,
    defaultSize: '50x50',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting', 'Non Cutting'],
    grades: ['KW A', 'KW B', 'KW C'],
    estimatedPriceRange: 'Rp 55.000 - Rp 75.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik kardusan resmi pabrikan tersegel rapi. Tersedia pilihan grade KW A (Super/Mulus sempurna), KW B, hingga KW C untuk efisiensi budget.',
    features: ['Dus original kemasan pabrik', 'Pilihan Grade lengkap (KW A, B, C)', 'Presisi cutting sudut rapat', 'Pilihan permukaan Glossy mewah atau Matte lembut'],
    inStock: true,
    isPopular: true
  },
  {
    id: 'ker-kd-02',
    name: 'Keramik Kardusan Ukuran Besar 60x60 & 80x80 Glazed Cut',
    category: 'Lantai Keramik',
    subcategory: 'Kardusan',
    sizes: ['50x50', '60x60', '80x80'],
    defaultSize: '60x60',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting'],
    grades: ['KW A', 'KW B'],
    estimatedPriceRange: 'Rp 78.000 - Rp 110.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik kardusan cutting tepi presisi format lebar 60x60 dan 80x80. Memberikan tampilan ruang tamu yang tampak luas, bersih, dan elegan tanpa nat tebal.',
    features: ['Laser Cutting presisi tinggi', 'Format mewah 60x60 & 80x80', 'Kualitas KW A bergaransi kemasan', 'Armada siap kirim sampai depan pintu'],
    inStock: true,
    isPopular: true
  },
  {
    id: 'ker-kd-03',
    name: 'Keramik Kardusan Subway & Dinding Dapur 25x40 / 30x60',
    category: 'Lantai Keramik',
    subcategory: 'Kardusan',
    sizes: ['25x25', '25x40', '25x50', '30x60'],
    defaultSize: '30x60',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting', 'Non Cutting'],
    grades: ['KW A', 'KW B', 'KW C'],
    estimatedPriceRange: 'Rp 62.000 - Rp 85.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    description: 'Keramik dinding kardusan berestetika tinggi untuk backdrop dapur (backsplash), dinding wastafel, dan kamar mandi minimalis modern.',
    features: ['Grade KW A, B, C komplit', 'Motif relief emboss & flat glossy', 'Tahan lembap & mudah dibersihkan', 'Stok tersedia di Perak & Diwek'],
    inStock: true
  },

  // --- LANTAI KERAMIK: Kukumacan ---
  {
    id: 'ker-km-01',
    name: 'Kukumacan (Bon-bon / Step Nosing Keramik Sudut Tangga)',
    category: 'Lantai Keramik',
    subcategory: 'Kukumacan',
    grades: ['KW A', 'KW B', 'KW C'],
    estimatedPriceRange: 'Rp 3.500 - Rp 7.000',
    unit: 'batang',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Profil kukumacan / bon-bon pelindung sudut keramik lantai tangga dan pinggiran meja dapur. Menghilangkan ujung tajam keramik agar rapi dan aman bagi anak-anak.',
    features: ['Pilihan Grade KW A, KW B, KW C', 'Aneka warna matching dengan keramik', 'Ujung cembung mulus presisi', 'Mencegah keramik gompal / retak sudut'],
    inStock: true
  },

  // --- GRANIT: Keramik BS ---
  {
    id: 'grn-bs-01',
    name: 'Granit BS Glazed & Polished Tile 60x60',
    category: 'Granit',
    subcategory: 'Keramik BS',
    sizes: ['60x60', '80x80'],
    defaultSize: '60x60',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting'],
    estimatedPriceRange: 'Rp 85.000 - Rp 110.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    description: 'Granit BS (Bukan Standar) kelas homogen / glazed tile 60x60 dengan harga jauh lebih hemat dari granit dus. Ideal untuk proyek ruko, kantor, dan rumah dengan budget hemat rasa mewah.',
    features: ['Tampilan marmer mewah setara granit mahal', 'Body padat tahan beban berat', 'Ukuran presisi cutting 60x60', 'Stok cepat berputar di gudang Perak & Diwek'],
    inStock: true,
    isPopular: true
  },

  // --- GRANIT: Kardusan ---
  {
    id: 'grn-kd-01',
    name: 'Granit Kardusan Polished Glazed Marmer Carrara 60x60 & 80x80',
    category: 'Granit',
    subcategory: 'Kardusan',
    sizes: ['60x60', '80x80', '60x120'],
    defaultSize: '60x60',
    surfaceFinish: ['Glossy', 'Matte'],
    cuttingType: ['Cutting'],
    grades: ['KW A', 'KW B'],
    estimatedPriceRange: 'Rp 145.000 - Rp 230.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80',
    description: 'Granit dus resmi motif Carrara White, Nero Marquina, dan Travertine. Kilap cermin tinggi (nano polished) tahan gores dan anti noda kopi/minyak.',
    features: ['Nano Polished kilau kaca jernih', 'Bodi full porcellanato anti pori', 'Motif urat marmer elegan tersambung (random effect)', 'Grade KW A garansi pabrikan'],
    inStock: true,
    isPopular: true
  },
  {
    id: 'grn-kd-02',
    name: 'Granit Kardusan Rustic Matte Rock Stone 60x60',
    category: 'Granit',
    subcategory: 'Kardusan',
    sizes: ['60x60'],
    defaultSize: '60x60',
    surfaceFinish: ['Matte'],
    cuttingType: ['Cutting'],
    grades: ['KW A'],
    estimatedPriceRange: 'Rp 155.000 - Rp 195.000',
    unit: 'dus',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    description: 'Granit motif batu alam doff/matte bergaya Japandi dan Industrial modern. Tekstur soft surface tidak licin saat terkena percikan air.',
    features: ['Permukaan doff estetis minim pantulan silau', 'Sangat cocok untuk cafe, villa, & hunian modern', 'Tahan noda dan goresan furniture', 'Grade KW A dus rapi'],
    inStock: true
  },

  // --- GRANIT: List ---
  {
    id: 'grn-lst-01',
    name: 'List Granit Plint Dinding & Step Nosing Tangga 10x60 & 30x60',
    category: 'Granit',
    subcategory: 'List',
    sizes: ['10x60', '30x60'],
    defaultSize: '10x60',
    estimatedPriceRange: 'Rp 18.000 - Rp 35.000',
    unit: 'batang',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'List plint granit pinggir dinding dan list step nosing tangga bergaris tali air anti-selip. Memberikan sentuhan akhir interior yang rapi dan mewah.',
    features: ['Sudah dibevel halus pinggirnya', 'Garis anti-selip pada varian tangga', 'Warna serasi dengan motif granit lantai', 'Tahan benturan sapu dan pel'],
    inStock: true
  },

  // --- BATU ALAM: Wall Cladding ---
  {
    id: 'batu-wc-01',
    name: 'Batu Alam Wall Cladding Susun Sirih & Relief Dinding',
    category: 'Batu Alam',
    subcategory: 'Wall Cladding',
    sizes: ['15x40', '20x40', 'Custom panel'],
    defaultSize: '20x40',
    estimatedPriceRange: 'Rp 120.000 - Rp 185.000',
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    description: 'Panel susun sirih batu alam asli siap pasang. Sangat cocok untuk dinding pilar pagar, fasad depan rumah, dinding kolam renang, dan water wall.',
    features: ['Pemasangan lebih cepat karena berbentuk panel', 'Tekstur timbul 3D natural menawan', 'Tahan terhadap cuaca panas & hujan tropis', 'Warna alami andesit, cupang merah, & marmer putih'],
    inStock: true,
    isPopular: true
  },

  // --- BATU ALAM: RTM + RTA ---
  {
    id: 'batu-rtm-01',
    name: 'Batu Alam RTM (Rata Mesin) & RTA (Rata Alam) Andesit / Candi',
    category: 'Batu Alam',
    subcategory: 'RTM + RTA',
    sizes: ['10x20', '15x30', '20x40', '30x30', '30x60'],
    defaultSize: '15x30',
    estimatedPriceRange: 'Rp 85.000 - Rp 140.000',
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    description: 'Tersedia pilihan RTM (permukaan halus potongan mesin) dan RTA (permukaan belah alami bertekstur). Pilihan bahan andesit bintik, batu candi hitam, dan paras Jogja.',
    features: ['Potongan siku rapi memudahkan tukang', 'Pilihan tekstur RTM rata atau RTA kasar alami', 'Karakter sejuk alami untuk hunian tropis', 'Bisa diaplikasikan di pagar, pilar, maupun interior'],
    inStock: true
  },

  // --- BATU ALAM: List ---
  {
    id: 'batu-lst-01',
    name: 'List Profil Batu Alam & Mahkota Pilar',
    category: 'Batu Alam',
    subcategory: 'List',
    sizes: ['5x40', '7x40', '10x40'],
    defaultSize: '7x40',
    estimatedPriceRange: 'Rp 15.000 - Rp 30.000',
    unit: 'batang',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
    description: 'List profil batu alam pembatas bidang dinding dan mahkota pilar pagar. Menambah aksen klasik modern pada susunan batu alam.',
    features: ['Ukiran profil presisi', 'Bahan batu asli kokoh', 'Merapikan pertemuan sudut dinding', 'Mudah dicoating agar tidak berlumut'],
    inStock: true
  },

  // --- BATU ALAM: Koral Hias ---
  {
    id: 'batu-krl-01',
    name: 'Batu Koral Hias Sikat (Putih Kupang, Hitam Alor, Panca Warna)',
    category: 'Batu Alam',
    subcategory: 'Koral Hias',
    sizes: ['No. 1 (Kecil)', 'No. 2 (Sedang)', 'No. 3 (Besar)'],
    defaultSize: 'No. 2 (Sedang)',
    estimatedPriceRange: 'Rp 45.000 - Rp 65.000',
    unit: 'karung (10-15kg)',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    description: 'Batu koral hias pilihan untuk taburan taman kering, pot tanaman, sekeliling kolam ikan, serta lantai carport motif koral sikat.',
    features: ['Batu asli mulus bundar alami', 'Warna putih cerah, hitam legam, & panca warna', 'Kemasan karung bersih', 'Bisa diaplikasikan untuk koral sikat lantai'],
    inStock: true,
    isPopular: true
  },

  // --- BATU ALAM: Batu Acak ---
  {
    id: 'batu-ack-01',
    name: 'Batu Acak Lempeng / Candi Acak Taman & Carport',
    category: 'Batu Alam',
    subcategory: 'Batu Acak',
    sizes: ['Ukuran Acak / Lempeng Bebas'],
    defaultSize: 'Ukuran Acak',
    estimatedPriceRange: 'Rp 65.000 - Rp 95.000',
    unit: 'm²',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description: 'Batu lempeng acak ketebalan stabil untuk jalan setapak taman (stepping stone), lantai carport rustic, dan dinding gaya natural rustic.',
    features: ['Tampilan alami organik tidak monoton', 'Kuat menahan beban kendaraan', 'Daya cengkeram ban baik anti-selip', 'Diambil langsung dari tambang pilihan'],
    inStock: true
  },

  // --- SANITARY: Pintu Kamar Mandi ---
  {
    id: 'san-pt-01',
    name: 'Pintu Kamar Mandi PVC & Aluminium Tebal Lengkap Handle Kunci',
    category: 'Sanitary',
    subcategory: 'Pintu Kamar Mandi',
    sizes: ['70x195 cm', '70x200 cm', '80x200 cm'],
    defaultSize: '70x195 cm',
    estimatedPriceRange: 'Rp 220.000 - Rp 580.000',
    unit: 'set',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Pintu kamar mandi berkualitas anti rayap, anti jamur, dan tahan air. Tersedia bahan PVC tebal motif urat kayu, kaca cermin, serta kusen aluminium kokoh.',
    features: ['Lengkap dengan engsel stainless & kunci slot/handle', 'Anti lapuk dan tahan benturan', 'Pilihan motif kaca es & motif kayu modern', 'Tersedia bukaan kanan & kiri'],
    inStock: true,
    isPopular: true
  },

  // --- SANITARY: Kloset ---
  {
    id: 'san-kl-01',
    name: 'Kloset Duduk Dual Flush & Kloset Jongkok Porselen',
    category: 'Sanitary',
    subcategory: 'Kloset',
    sizes: ['Standard Duduk', 'Standard Jongkok'],
    defaultSize: 'Standard Duduk',
    estimatedPriceRange: 'Rp 140.000 - Rp 1.450.000',
    unit: 'unit',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    description: 'Kloset jongkok keramik porselen putih mengkilap dan kloset duduk hemat air sistem dual flush dengan tutup soft closing perlahan.',
    features: ['Porselen halus anti noda & anti kerak', 'Soft closing seat cover tidak berisik', 'Sistem siram vortex deras hemat air', 'Tersedia pipa instalasi standar SNI'],
    inStock: true,
    isPopular: true
  },

  // --- SANITARY: Tandon ---
  {
    id: 'san-td-01',
    name: 'Tandon Air / Tangki Penampungan Anti Lumut (500L - 1200L)',
    category: 'Sanitary',
    subcategory: 'Tandon',
    sizes: ['300 Liter', '550 Liter', '1100 Liter', '1200 Liter'],
    defaultSize: '550 Liter',
    estimatedPriceRange: 'Rp 650.000 - Rp 1.650.000',
    unit: 'unit',
    image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=800&q=80',
    description: 'Tangki air tebal food grade berlapis anti lumut dan pelindung sinar UV. Menjaga kemurnian air bersih keluarga Anda.',
    features: ['Teknologi 3 lapis anti lumut', 'Material Food Grade bersertifikat SNI', 'Lengkap dengan fitting drat & pelampung otomatis', 'Bisa dikirim langsung armada pickup toko'],
    inStock: true
  },

  // --- SANITARY: BCP + Sink ---
  {
    id: 'san-bcp-01',
    name: 'BCP + Kitchen Sink Stainless Steel Tebal (1 Lubang & 2 Lubang)',
    category: 'Sanitary',
    subcategory: 'BCP+Sink',
    sizes: ['50x40 cm (1 Lubang)', '75x40 cm (1 Lubang + Sayap)', '82x45 cm (2 Lubang)'],
    defaultSize: '75x40 cm',
    estimatedPriceRange: 'Rp 175.000 - Rp 650.000',
    unit: 'set',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Bak cuci piring dapur (sink) stainless tebal anti karat dengan lapisan peredam suara di bawah baskom agar tidak bising saat air mengalir.',
    features: ['Stainless steel sus anti karat', 'Sudah termasuk afur saringan & selang pembuangan', 'Kedalaman mangkok ideal anti cipratan', 'Permukaan satin brush mewah'],
    inStock: true
  },

  // --- SANITARY: Kran ---
  {
    id: 'san-krn-01',
    name: 'Kran Air Wastafel, Kran Cuci Piring Fleksibel, & Shower Set',
    category: 'Sanitary',
    subcategory: 'Kran',
    sizes: ['Standard 1/2 inch'],
    defaultSize: '1/2 inch',
    estimatedPriceRange: 'Rp 35.000 - Rp 220.000',
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
    description: 'Koleksi kran dapur leher angsa fleksibel, kran wastafel up-down, kran cabang shower, dan hand shower set dengan semprotan deras lembut.',
    features: ['Jantung kuningan awet anti bocor', 'Finishing chrome kilap tebal', 'Pilihan mode semprotan air', 'Drat 1/2 inch universal'],
    inStock: true
  },

  // --- SANITARY: Others / Lainnya ---
  {
    id: 'san-oth-01',
    name: 'Floor Drain Stainless Anti Bau & Jet Shower Bidet',
    category: 'Sanitary',
    subcategory: 'Others/Lainnya',
    sizes: ['Standard'],
    defaultSize: 'Standard',
    estimatedPriceRange: 'Rp 25.000 - Rp 95.000',
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Saringan pembuangan air lantai (floor drain) dengan katup otomatis pencegah bau dan serangga, serta jet shower bidet bertekanan pas.',
    features: ['Katup magnetic anti bau pipa', 'Plat stainless tebal', 'Selang shower bidet anti meledak', 'Finishing rapi'],
    inStock: true
  },

  // --- OTHERS/LAINNYA: Semen ---
  {
    id: 'oth-smn-01',
    name: 'Semen Perekat Keramik & Granit (Tile Adhesive Mortar)',
    category: 'Others/Lainnya',
    subcategory: 'Semen',
    sizes: ['Kemasan 25 kg', 'Kemasan 40 kg'],
    defaultSize: '25 kg',
    estimatedPriceRange: 'Rp 65.000 - Rp 115.000',
    unit: 'sak',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description: 'Semen instan perekat keramik dan granit bodi berat. Mencegah keramik terangkat (popping) dan kopong. Daya rekat tinggi langsung lekat tanpa basahi keramik.',
    features: ['Daya rekat ekstra kuat', 'Mencegah ubin terangkat / meledak', 'Hemat adukan & mudah diaplikasikan tukang', 'Sedia partai besar & eceran'],
    inStock: true,
    isPopular: true
  },

  // --- OTHERS/LAINNYA: Nad ---
  {
    id: 'oth-nad-01',
    name: 'Semen Nad Pengisi Nat Keramik & Granit Kedap Air Warna-Warni',
    category: 'Others/Lainnya',
    subcategory: 'Nad',
    sizes: ['Kemasan 1 kg'],
    defaultSize: '1 kg',
    estimatedPriceRange: 'Rp 14.000 - Rp 25.000',
    unit: 'bungkus',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Semen pengisi rongga nat keramik tahan jamur dan lumut. Mengandung polimer waterproof agar air tidak merembes ke bawah ubin. Puluhan varian warna.',
    features: ['Formula anti jamur & anti retak', 'Kedap air untuk kamar mandi & kolam', 'Pilihan warna matching lengkap (putih, abu, krem, hitam, mocca)', 'Mudah dihaluskan'],
    inStock: true
  },

  // --- OTHERS/LAINNYA: Coating ---
  {
    id: 'oth-ctg-01',
    name: 'Coating Pelapis Pelindung Batu Alam (Glossy & Doff / Natural)',
    category: 'Others/Lainnya',
    subcategory: 'Coating',
    sizes: ['Kaleng 0.9 Liter', 'Kaleng 2.5 Liter'],
    defaultSize: '0.9 Liter',
    estimatedPriceRange: 'Rp 58.000 - Rp 145.000',
    unit: 'kaleng',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    description: 'Cairan pelapis khusus batu alam untuk melindungi dari lumut, jamur, serta cuaca ekstrem. Menampilkan corak batu makin hidup dan tajam.',
    features: ['Tersedia varian Wet Look Glossy (efek basah kilap) & Natural Doff', 'Tahan air hujan & sinar matahari', 'Tidak menguning', 'Daya sebar luas'],
    inStock: true
  },

  // --- OTHERS/LAINNYA: WPC ---
  {
    id: 'oth-wpc-01',
    name: 'WPC Wall Panel Kisi-kisi Kayu Interior & Fasad Mewah',
    category: 'Others/Lainnya',
    subcategory: 'WPC',
    sizes: ['16cm x 290cm', '20cm x 290cm'],
    defaultSize: '16cm x 290cm',
    estimatedPriceRange: 'Rp 75.000 - Rp 120.000',
    unit: 'batang',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description: 'Wood Plastic Composite (WPC) wall panel bermotif serat kayu alami untuk kisi-kisi dinding TV, ruang tamu, backdrop kamar, dan plafon.',
    features: ['Tahan air, anti rayap, & tidak merambatkan api', 'Pemasangan sistem interlocking klip tersembunyi', 'Tekstur kayu 3D elegan', 'Panjang hingga 2.9 meter siap pasang'],
    inStock: true,
    isPopular: true
  },

  // --- OTHERS/LAINNYA: Tempat Sabun ---
  {
    id: 'oth-tms-01',
    name: 'Tempat Sabun Keramik Tempel & Stainless Gantung',
    category: 'Others/Lainnya',
    subcategory: 'Tempat Sabun',
    sizes: ['Standard'],
    defaultSize: 'Standard',
    estimatedPriceRange: 'Rp 22.000 - Rp 45.000',
    unit: 'pcs',
    image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
    description: 'Tempat sabun porselen keramik yang ditanam menyatu dengan keramik dinding, serta model sudut stainless gantung.',
    features: ['Bahan keramik porselen matching dengan dinding', 'Saluran tirisan air sabun cepat kering', 'Kuat tahan lama bertahun-tahun', 'Pilihan model flat dan sudut'],
    inStock: true
  }
];

// Delivery fleet feature bullet points
export const FLEET_INFO = {
  title: 'Punya Armada Pengiriman Sendiri',
  subtitle: 'Pengiriman Cepat, Terjadwal, & Aman Sampai di Depan Lokasi Proyek Anda',
  description: 'Surya Anugrah Keramik & UD. Khrisna Sakti dilengkapi armada pick-up dan truk operasional milik sendiri. Anda tidak perlu khawatir biaya sewa kurir luar yang mahal atau resiko keramik pecah di jalan.',
  coverageAreas: ['Perak', 'Diwek', 'Jombang Kota', 'Peterongan', 'Mojoagung', 'Ploso', 'Bandar Kedungmulyo', 'Sumobito', 'Bareng', 'Mojowarno', 'Gudo', 'Kecamatan lainnya di Kab. Jombang & sekitarnya'],
  fleetVehicles: [
    {
      name: 'Armada Truk Colt Diesel',
      capacity: 'Muatan besar hingga 300 - 500 Dus Keramik / Granit / Semen / Pasir',
      benefit: 'Ideal untuk borongan rumah baru, proyek ruko, masjid, dan gedung'
    },
    {
      name: 'Armada Mobil Pick-Up L300 / GranMax',
      capacity: 'Muatan lincah hingga 50 - 150 Dus / Tandon Air / Pintu Kamar Mandi',
      benefit: 'Dapat masuk ke jalan lingkungan, gang perumahan, dan pengiriman mendesak'
    }
  ]
};
