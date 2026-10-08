import { ProductItem, OrderRecord, UserAccount } from '../types';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export const PRODUCT_SHEET_HEADERS = [
  'ID Produk',
  'Nama Produk',
  'Kategori',
  'Subkategori',
  'Ukuran',
  'Grade',
  'Finishing',
  'Cutting',
  'Satuan',
  'Harga (Rp)',
  'Status Stok',
  'Link Gambar',
  'Deskripsi Produk',
  'Fitur Unggulan',
  'Waktu Update',
];

export const ORDER_SHEET_HEADERS = [
  'Waktu Transaksi',
  'No. Order',
  'No. Resi',
  'Nama Pelanggan',
  'No. WhatsApp',
  'Pengiriman',
  'Kecamatan',
  'Alamat Lengkap',
  'Metode Bayar',
  'Status Bayar',
  'Status Order',
  'Total (Rp)',
  'Rincian Barang',
  'Catatan',
];

export const MEMBER_SHEET_HEADERS = [
  'ID Member',
  'Nama Lengkap',
  'Nomor WhatsApp / HP',
  'Kecamatan',
  'Alamat Lengkap',
  'Tipe Member',
  'Catatan',
  'Tanggal Terdaftar',
];

/**
 * List all Google Spreadsheets from user's Google Drive
 */
export async function listSpreadsheets(accessToken: string): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,modifiedTime)&orderBy=modifiedTime desc&pageSize=30`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gagal mengambil daftar spreadsheet (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Get spreadsheet details and sheets (tabs)
 */
export async function getSpreadsheetDetails(accessToken: string, spreadsheetId: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memuat detail spreadsheet.');
  }

  return response.json();
}

/**
 * Create a new Google Spreadsheet with structured tabs: Data_Produk & Pesanan_Pelanggan
 */
export async function createSpreadsheet(
  accessToken: string, 
  title = 'Katalog Produk & Pesanan - Surya Anugrah Keramik'
): Promise<{ id: string; url: string; name: string }> {
  const createPayload = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Data_Produk',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 16,
          },
        },
      },
      {
        properties: {
          title: 'Pesanan_Pelanggan',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 16,
          },
        },
      },
      {
        properties: {
          title: 'Data_Member',
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 10,
          },
        },
      },
    ],
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // Set header rows for all 3 sheets
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data_Produk!A1:O1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [PRODUCT_SHEET_HEADERS],
    }),
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Pesanan_Pelanggan!A1:N1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [ORDER_SHEET_HEADERS],
    }),
  });

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data_Member!A1:H1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [MEMBER_SHEET_HEADERS],
    }),
  });

  return {
    id: spreadsheetId,
    url: sheetData.spreadsheetUrl,
    name: title,
  };
}

/**
 * Read products from a Google Spreadsheet
 */
export async function readProductsFromSheet(
  accessToken: string,
  spreadsheetId: string,
  preferredSheetName = 'Data_Produk'
): Promise<ProductItem[]> {
  // 1. Inspect sheet tabs first to find appropriate sheet
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
  const sheets: any[] = meta.sheets || [];
  let targetSheet = sheets.find(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase())?.properties?.title;

  if (!targetSheet) {
    // If not found, use first sheet
    targetSheet = sheets[0]?.properties?.title || 'Sheet1';
  }

  const range = `${encodeURIComponent(targetSheet)}!A2:O`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal membaca baris dari tab '${targetSheet}'`);
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];

  const products: ProductItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row[1] || '').trim();
    if (!name) continue;

    let id = String(row[0] || '').trim();
    if (!id) id = `prod-sheet-${i + 1}`;

    const category = (row[2] ? String(row[2]).trim() : 'Lantai Keramik') as any;
    const subcategory = row[3] ? String(row[3]).trim() : 'Keramik BS';
    const sizesStr = String(row[4] || '').trim();
    const sizes = sizesStr ? sizesStr.split(/[,;]/).map(s => s.trim()).filter(Boolean) : ['40x40'];
    const gradesStr = String(row[5] || '').trim();
    const grades = gradesStr ? gradesStr.split(/[,;]/).map(s => s.trim()).filter(Boolean) as any : undefined;
    const finishStr = String(row[6] || '').trim();
    const surfaceFinish = finishStr ? finishStr.split(/[,;]/).map(s => s.trim()).filter(Boolean) as any : undefined;
    const cuttingStr = String(row[7] || '').trim();
    const cuttingType = cuttingStr ? cuttingStr.split(/[,;]/).map(s => s.trim()).filter(Boolean) as any : undefined;
    const unit = String(row[8] || 'dus').trim();
    const rawPrice = Number(String(row[9] || '').replace(/[^0-9]/g, '')) || 50000;
    const stockStr = String(row[10] || 'Tersedia').trim().toLowerCase();
    const inStock = !(stockStr === 'kosong' || stockStr === 'habis' || stockStr === 'false' || stockStr === '0');
    const image = String(row[11] || '').trim() || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
    const description = String(row[12] || '').trim() || 'Produk katalog Surya Anugrah Keramik & UD. Khrisna Sakti Jombang.';
    const featStr = String(row[13] || '').trim();
    const features = featStr ? featStr.split(/[;\n]/).map(s => s.trim()).filter(Boolean) : ['Kualitas terjamin', 'Ready stok'];

    products.push({
      id,
      name,
      category,
      subcategory,
      sizes,
      defaultSize: sizes[0] || '40x40',
      grades,
      surfaceFinish,
      cuttingType,
      unit,
      numericPrice: rawPrice,
      estimatedPriceRange: `Rp ${rawPrice.toLocaleString('id-ID')}`,
      inStock,
      image,
      description,
      features,
    });
  }

  return products;
}

/**
 * Export products to Google Spreadsheet
 */
export async function exportProductsToSheet(
  accessToken: string,
  spreadsheetId: string,
  products: ProductItem[],
  preferredSheetName = 'Data_Produk'
): Promise<{ count: number; sheetName: string }> {
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
  const sheets: any[] = meta.sheets || [];
  let targetSheet = sheets.find(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase())?.properties?.title;

  if (!targetSheet) {
    // Tab doesn't exist, create it
    const addSheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: preferredSheetName,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          },
        ],
      }),
    });
    if (addSheetRes.ok) {
      targetSheet = preferredSheetName;
    } else {
      targetSheet = sheets[0]?.properties?.title || 'Sheet1';
    }
  }

  // Clear existing data (from row 2 downwards)
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:O1000:clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {});

  // Make sure header is present in row 1
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A1:O1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [PRODUCT_SHEET_HEADERS],
    }),
  });

  // Prepare rows
  const rows = products.map((p, idx) => [
    p.id || `PROD-${idx + 1}`,
    p.name,
    p.category,
    p.subcategory,
    p.sizes?.join(', ') || p.defaultSize || '40x40',
    p.grades?.join(', ') || '-',
    p.surfaceFinish?.join(', ') || '-',
    p.cuttingType?.join(', ') || '-',
    p.unit || 'dus',
    p.numericPrice || 0,
    p.inStock ? 'Tersedia' : 'Kosong',
    p.image || '',
    p.description || '',
    p.features?.join('; ') || '',
    new Date().toISOString(),
  ]);

  if (rows.length > 0) {
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:O?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menyimpan data produk ke Google Sheets.');
    }
  }

  return { count: rows.length, sheetName: targetSheet };
}

/**
 * Append a newly added product to the Google Spreadsheet
 */
export async function appendProductToSheet(
  accessToken: string,
  spreadsheetId: string,
  product: ProductItem,
  preferredSheetName = 'Data_Produk'
) {
  const row = [
    product.id,
    product.name,
    product.category,
    product.subcategory,
    product.sizes?.join(', ') || product.defaultSize || '40x40',
    product.grades?.join(', ') || '-',
    product.surfaceFinish?.join(', ') || '-',
    product.cuttingType?.join(', ') || '-',
    product.unit || 'dus',
    product.numericPrice || 0,
    product.inStock ? 'Tersedia' : 'Kosong',
    product.image || '',
    product.description || '',
    product.features?.join('; ') || '',
    new Date().toISOString(),
  ];

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(preferredSheetName)}!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  return res.ok;
}

/**
 * Append an order record to Google Spreadsheet
 */
export async function appendOrderToSheet(
  accessToken: string,
  spreadsheetId: string,
  order: OrderRecord,
  preferredSheetName = 'Pesanan_Pelanggan'
) {
  const itemsSummary = order.items.map(it => `${it.productName} (${it.quantity} ${it.unit})`).join('; ');
  const row = [
    order.createdAt || new Date().toISOString(),
    order.orderNumber,
    order.receiptNumber || '-',
    order.customerName,
    order.customerPhone,
    order.shippingMethod === 'delivery' ? 'Kirim ke Rumah (Armada Toko)' : 'Ambil Sendiri di Toko',
    order.deliveryDistrict || '-',
    order.deliveryAddress || order.pickupStoreBranch || '-',
    order.paymentMethod.toUpperCase(),
    order.paymentStatus === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN',
    order.status,
    order.totalAmount,
    itemsSummary,
    order.notes || '-',
  ];

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(preferredSheetName)}!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  return res.ok;
}

/**
 * Export all orders to Google Spreadsheet
 */
export async function exportOrdersToSheet(
  accessToken: string,
  spreadsheetId: string,
  orders: OrderRecord[],
  preferredSheetName = 'Pesanan_Pelanggan'
): Promise<{ count: number; sheetName: string }> {
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
  const sheets: any[] = meta.sheets || [];
  let targetSheet = sheets.find(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase())?.properties?.title;

  if (!targetSheet) {
    const addSheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: preferredSheetName,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          },
        ],
      }),
    });
    if (addSheetRes.ok) {
      targetSheet = preferredSheetName;
    } else {
      targetSheet = sheets[0]?.properties?.title || 'Sheet1';
    }
  }

  // Clear existing orders
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:N1000:clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {});

  // Make sure header is present
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A1:N1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [ORDER_SHEET_HEADERS],
    }),
  });

  const rows = orders.map(order => {
    const itemsSummary = order.items.map(it => `${it.productName} (${it.quantity} ${it.unit})`).join('; ');
    return [
      order.createdAt || new Date().toISOString(),
      order.orderNumber,
      order.receiptNumber || '-',
      order.customerName,
      order.customerPhone,
      order.shippingMethod === 'delivery' ? 'Kirim ke Rumah (Armada Toko)' : 'Ambil Sendiri di Toko',
      order.deliveryDistrict || '-',
      order.deliveryAddress || order.pickupStoreBranch || '-',
      order.paymentMethod.toUpperCase(),
      order.paymentStatus === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN',
      order.status,
      order.totalAmount,
      itemsSummary,
      order.notes || '-',
    ];
  });

  if (rows.length > 0) {
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:N?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menyimpan data pesanan ke Google Sheets.');
    }
  }

  return { count: rows.length, sheetName: targetSheet };
}

/**
 * Append a member record to Google Spreadsheet
 */
export async function appendMemberToSheet(
  accessToken: string,
  spreadsheetId: string,
  member: UserAccount,
  preferredSheetName = 'Data_Member'
) {
  // Ensure header and sheet exist
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId).catch(() => null);
  if (meta) {
    const sheets: any[] = meta.sheets || [];
    const hasTab = sheets.some(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase());
    if (!hasTab) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: preferredSheetName,
                  gridProperties: { frozenRowCount: 1 },
                },
              },
            },
          ],
        }),
      }).catch(() => {});

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(preferredSheetName)}!A1:H1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [MEMBER_SHEET_HEADERS],
        }),
      }).catch(() => {});
    }
  }

  const row = [
    member.id,
    member.name,
    member.phone,
    member.district || '-',
    member.address || '-',
    member.memberType || (member.role === 'admin' ? 'Admin Toko' : 'Member Umum'),
    member.notes || '-',
    member.createdAt || new Date().toISOString(),
  ];

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(preferredSheetName)}!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  return res.ok;
}

/**
 * Export all members to Google Spreadsheet
 */
export async function exportMembersToSheet(
  accessToken: string,
  spreadsheetId: string,
  members: UserAccount[],
  preferredSheetName = 'Data_Member'
): Promise<{ count: number; sheetName: string }> {
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
  const sheets: any[] = meta.sheets || [];
  let targetSheet = sheets.find(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase())?.properties?.title;

  if (!targetSheet) {
    const addSheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: preferredSheetName,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          },
        ],
      }),
    });
    if (addSheetRes.ok) {
      targetSheet = preferredSheetName;
    } else {
      targetSheet = sheets[0]?.properties?.title || 'Sheet1';
    }
  }

  // Clear existing members
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:H1000:clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {});

  // Make sure header is present
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A1:H1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [MEMBER_SHEET_HEADERS],
    }),
  });

  const rows = members.map(m => [
    m.id,
    m.name,
    m.phone,
    m.district || '-',
    m.address || '-',
    m.memberType || (m.role === 'admin' ? 'Admin Toko' : 'Member Umum'),
    m.notes || '-',
    m.createdAt || new Date().toISOString(),
  ]);

  if (rows.length > 0) {
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetSheet)}!A2:H?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    });

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menyimpan data member ke Google Sheets.');
    }
  }

  return { count: rows.length, sheetName: targetSheet };
}

/**
 * Read members from Google Spreadsheet
 */
export async function readMembersFromSheet(
  accessToken: string,
  spreadsheetId: string,
  preferredSheetName = 'Data_Member'
): Promise<UserAccount[]> {
  const meta = await getSpreadsheetDetails(accessToken, spreadsheetId);
  const sheets: any[] = meta.sheets || [];
  const targetSheet = sheets.find(s => s.properties?.title?.toLowerCase() === preferredSheetName.toLowerCase())?.properties?.title;

  if (!targetSheet) {
    return [];
  }

  const range = `${encodeURIComponent(targetSheet)}!A2:H`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  const rows: any[][] = data.values || [];
  const members: UserAccount[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const phone = String(row[2] || '').trim().replace(/[-\s]/g, '');
    const name = String(row[1] || '').trim();
    if (!phone && !name) continue;

    let id = String(row[0] || '').trim();
    if (!id) id = `usr-sheet-${i + 1}`;

    const district = String(row[3] || '').trim();
    const address = String(row[4] || '').trim();
    const memberType = String(row[5] || '').trim();
    const notes = String(row[6] || '').trim();
    const role: 'member' | 'admin' = memberType.toLowerCase().includes('admin') ? 'admin' : 'member';
    const createdAt = String(row[7] || '').trim() || new Date().toISOString();

    members.push({
      id,
      name: name || `Member ${phone.slice(-4)}`,
      phone,
      role,
      district: district !== '-' ? district : undefined,
      address: address !== '-' ? address : undefined,
      memberType: memberType !== '-' ? memberType : 'Member Umum',
      notes: notes !== '-' ? notes : undefined,
      createdAt,
    });
  }

  return members;
}
