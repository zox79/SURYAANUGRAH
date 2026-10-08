import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  FileSpreadsheet, 
  Folder, 
  FolderPlus, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Upload, 
  Download, 
  LogOut, 
  Sparkles, 
  HardDrive,
  ShieldCheck,
  ChevronRight,
  Database,
  Users,
  UserPlus
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from '../services/googleAuth';
import { 
  listSpreadsheets, 
  createSpreadsheet, 
  readProductsFromSheet, 
  exportProductsToSheet, 
  exportOrdersToSheet,
  exportMembersToSheet,
  readMembersFromSheet,
  DriveSpreadsheetFile 
} from '../services/googleSheetsService';
import { 
  listDriveFolders, 
  createDriveFolder, 
  getSavedDriveFolder, 
  saveDriveFolder, 
  DriveFolderItem 
} from '../services/googleDriveService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ProductItem, OrderRecord, UserAccount } from '../types';

interface GoogleWorkspaceManagerProps {
  products: ProductItem[];
  orders: OrderRecord[];
  members?: UserAccount[];
  onProductsUpdated?: (newProducts: ProductItem[]) => void;
  onMembersUpdated?: (newMembers: UserAccount[]) => void;
  onOpenAddMember?: () => void;
  showNotification: (msg: string) => void;
}

const STORAGE_ACTIVE_SHEET_ID = 'sak_active_sheet_id';
const STORAGE_ACTIVE_SHEET_NAME = 'sak_active_sheet_name';
const STORAGE_ACTIVE_SHEET_URL = 'sak_active_sheet_url';

export const GoogleWorkspaceManager: React.FC<GoogleWorkspaceManagerProps> = ({
  products,
  orders,
  members = [],
  onProductsUpdated,
  onMembersUpdated,
  onOpenAddMember,
  showNotification,
}) => {
  // Auth state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sheets state
  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheetFile[]>([]);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_SHEET_ID) || '';
  });
  const [activeSheetName, setActiveSheetName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_SHEET_NAME) || '';
  });
  const [activeSheetUrl, setActiveSheetUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ACTIVE_SHEET_URL) || '';
  });

  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState('Katalog Produk & Pesanan - Surya Anugrah Keramik');

  // Sync operations
  const [isSyncingFromSheet, setIsSyncingFromSheet] = useState(false);
  const [isExportingToSheet, setIsExportingToSheet] = useState(false);
  const [isExportingOrders, setIsExportingOrders] = useState(false);
  const [isExportingMembers, setIsExportingMembers] = useState(false);
  const [isSyncingMembers, setIsSyncingMembers] = useState(false);

  // Drive Folders state ("Folder yang saya inginkan")
  const [driveFolders, setDriveFolders] = useState<DriveFolderItem[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('Foto_Produk_Surya_Anugrah');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const [showCreateFolderInput, setShowCreateFolderInput] = useState(false);

  // Destructive confirmation modal state (Required by skill for Google Workspace mutations)
  const [confirmModalData, setConfirmModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    affectedCount: number;
    actionType: 'export_products' | 'export_orders' | 'export_members';
  } | null>(null);

  // Load saved folder preference
  useEffect(() => {
    const saved = getSavedDriveFolder();
    setSelectedFolderId(saved.folderId);
    setSelectedFolderName(saved.folderName);
  }, []);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When access token becomes available, auto-fetch spreadsheets and folders
  useEffect(() => {
    if (accessToken) {
      fetchSpreadsheetsList();
      fetchFoldersList();
    }
  }, [accessToken]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      setGoogleUser(result.user);
      setAccessToken(result.accessToken);
      showNotification(`Berhasil terhubung dengan Google: ${result.user.email}`);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Gagal masuk dengan Google.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setAccessToken(null);
      showNotification('Berhasil memutuskan koneksi Google.');
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchSpreadsheetsList = async () => {
    if (!accessToken) return;
    setIsLoadingSheets(true);
    try {
      const list = await listSpreadsheets(accessToken);
      setSpreadsheets(list);
      // If no active sheet set yet and list has items, set first one
      if (!activeSheetId && list.length > 0) {
        selectSpreadsheet(list[0]);
      }
    } catch (err: any) {
      console.warn('Error loading spreadsheets:', err);
    } finally {
      setIsLoadingSheets(false);
    }
  };

  const selectSpreadsheet = (file: DriveSpreadsheetFile) => {
    setActiveSheetId(file.id);
    setActiveSheetName(file.name);
    const link = file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}`;
    setActiveSheetUrl(link);
    localStorage.setItem(STORAGE_ACTIVE_SHEET_ID, file.id);
    localStorage.setItem(STORAGE_ACTIVE_SHEET_NAME, file.name);
    localStorage.setItem(STORAGE_ACTIVE_SHEET_URL, link);
    showNotification(`Spreadsheet aktif diubah: "${file.name}"`);
  };

  const handleCreateNewSpreadsheet = async () => {
    if (!accessToken) return;
    setIsCreatingSheet(true);
    try {
      const res = await createSpreadsheet(accessToken, newSheetTitle.trim() || 'Katalog Produk & Pesanan - Surya Anugrah Keramik');
      setActiveSheetId(res.id);
      setActiveSheetName(res.name);
      setActiveSheetUrl(res.url);
      localStorage.setItem(STORAGE_ACTIVE_SHEET_ID, res.id);
      localStorage.setItem(STORAGE_ACTIVE_SHEET_NAME, res.name);
      localStorage.setItem(STORAGE_ACTIVE_SHEET_URL, res.url);
      
      showNotification('Spreadsheet baru berhasil dibuat dengan template Data_Produk & Pesanan_Pelanggan!');
      await fetchSpreadsheetsList();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat spreadsheet baru');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const fetchFoldersList = async () => {
    if (!accessToken) return;
    setIsLoadingFolders(true);
    try {
      const list = await listDriveFolders(accessToken);
      setDriveFolders(list);
      // If we don't have a valid selected folder id yet, look for matching folder name
      if (!selectedFolderId && list.length > 0) {
        const match = list.find(f => f.name.toLowerCase() === selectedFolderName.toLowerCase());
        if (match) {
          setSelectedFolderId(match.id);
          saveDriveFolder(match.id, match.name);
        }
      }
    } catch (err: any) {
      console.warn('Error loading folders:', err);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleSelectFolder = (folder: DriveFolderItem) => {
    setSelectedFolderId(folder.id);
    setSelectedFolderName(folder.name);
    saveDriveFolder(folder.id, folder.name);
    showNotification(`Folder Google Drive untuk foto produk diubah ke: "${folder.name}"`);
  };

  const handleCreateNewFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newFolderNameInput.trim()) return;

    setIsCreatingFolder(true);
    try {
      const created = await createDriveFolder(accessToken, newFolderNameInput.trim());
      setSelectedFolderId(created.id);
      setSelectedFolderName(created.name);
      saveDriveFolder(created.id, created.name);
      setNewFolderNameInput('');
      setShowCreateFolderInput(false);
      showNotification(`Folder baru "${created.name}" berhasil dibuat di Google Drive!`);
      await fetchFoldersList();
    } catch (err: any) {
      alert(err.message || 'Gagal membuat folder di Google Drive');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Pull / Sync Products from Google Sheets
  const handlePullFromSheet = async () => {
    if (!accessToken) {
      alert('Silakan Masuk dengan Google terlebih dahulu.');
      return;
    }
    if (!activeSheetId) {
      alert('Pilih atau buat spreadsheet aktif terlebih dahulu.');
      return;
    }

    setIsSyncingFromSheet(true);
    try {
      const incomingProducts = await readProductsFromSheet(accessToken, activeSheetId, 'Data_Produk');
      if (incomingProducts.length === 0) {
        alert('Tab "Data_Produk" pada spreadsheet kosong atau belum memiliki baris data.');
        return;
      }

      // Send to server to update db.products
      const res = await fetch('/api/products/sync-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      if (onProductsUpdated) {
        onProductsUpdated(incomingProducts);
      }

      showNotification(`Berhasil menarik ${incomingProducts.length} produk dari Google Sheets!`);
    } catch (err: any) {
      alert(err.message || 'Gagal membaca data dari spreadsheet.');
    } finally {
      setIsSyncingFromSheet(false);
    }
  };

  // Prompt confirmation dialog before exporting/mutating spreadsheet data (Skill requirement)
  const promptExportProducts = () => {
    if (!accessToken) {
      alert('Silakan Masuk dengan Google terlebih dahulu.');
      return;
    }
    if (!activeSheetId) {
      alert('Pilih atau buat spreadsheet aktif terlebih dahulu.');
      return;
    }

    setConfirmModalData({
      isOpen: true,
      title: 'Konfirmasi Ekspor Katalog ke Google Sheets',
      description: `Apakah Anda yakin ingin mengekspor seluruh katalog (${products.length} produk) ke tab "Data_Produk" di spreadsheet "${activeSheetName}"? Tindakan ini akan memperbarui dan menyelaraskan baris data produk di Google Sheets.`,
      affectedCount: products.length,
      actionType: 'export_products',
    });
  };

  const promptExportOrders = () => {
    if (!accessToken) {
      alert('Silakan Masuk dengan Google terlebih dahulu.');
      return;
    }
    if (!activeSheetId) {
      alert('Pilih atau buat spreadsheet aktif terlebih dahulu.');
      return;
    }

    setConfirmModalData({
      isOpen: true,
      title: 'Konfirmasi Ekspor Pesanan ke Google Sheets',
      description: `Apakah Anda yakin ingin mengekspor ${orders.length} data pesanan pelanggan ke tab "Pesanan_Pelanggan" di spreadsheet "${activeSheetName}"?`,
      affectedCount: orders.length,
      actionType: 'export_orders',
    });
  };

  const promptExportMembers = () => {
    if (!accessToken) {
      alert('Silakan Masuk dengan Google terlebih dahulu.');
      return;
    }
    if (!activeSheetId) {
      alert('Pilih atau buat spreadsheet aktif terlebih dahulu.');
      return;
    }

    setConfirmModalData({
      isOpen: true,
      title: 'Konfirmasi Ekspor Data Member ke Google Sheets',
      description: `Apakah Anda yakin ingin mengekspor ${members.length} data member pelanggan ke tab "Data_Member" di spreadsheet "${activeSheetName}"?`,
      affectedCount: members.length,
      actionType: 'export_members',
    });
  };

  const handlePullMembersFromSheet = async () => {
    if (!accessToken) {
      alert('Silakan Masuk dengan Google terlebih dahulu.');
      return;
    }
    if (!activeSheetId) {
      alert('Pilih atau buat spreadsheet aktif terlebih dahulu.');
      return;
    }

    setIsSyncingMembers(true);
    try {
      const incoming = await readMembersFromSheet(accessToken, activeSheetId, 'Data_Member');
      if (incoming.length === 0) {
        alert('Tab "Data_Member" pada spreadsheet masih kosong.');
        return;
      }

      const res = await fetch('/api/members/sync-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: incoming }),
      });
      const data = await res.json();

      if (onMembersUpdated) {
        onMembersUpdated(data.members || incoming);
      }
      showNotification(`Berhasil menarik ${incoming.length} member dari Google Sheets!`);
    } catch (err: any) {
      alert(err.message || 'Gagal membaca data member dari spreadsheet.');
    } finally {
      setIsSyncingMembers(false);
    }
  };

  const handleExecuteConfirmedAction = async () => {
    if (!confirmModalData || !accessToken || !activeSheetId) return;

    if (confirmModalData.actionType === 'export_products') {
      setIsExportingToSheet(true);
      setConfirmModalData(null);
      try {
        const result = await exportProductsToSheet(accessToken, activeSheetId, products, 'Data_Produk');
        showNotification(`Berhasil mengekspor ${result.count} produk ke spreadsheet "${activeSheetName}"!`);
      } catch (err: any) {
        alert(err.message || 'Gagal mengekspor data produk ke Google Sheets.');
      } finally {
        setIsExportingToSheet(false);
      }
    } else if (confirmModalData.actionType === 'export_orders') {
      setIsExportingOrders(true);
      setConfirmModalData(null);
      try {
        await exportOrdersToSheet(accessToken, activeSheetId, orders, 'Pesanan_Pelanggan');
        showNotification(`Berhasil mengekspor ${orders.length} pesanan ke spreadsheet "${activeSheetName}"!`);
      } catch (err: any) {
        alert(err.message || 'Gagal mengekspor data pesanan ke Google Sheets.');
      } finally {
        setIsExportingOrders(false);
      }
    } else if (confirmModalData.actionType === 'export_members') {
      setIsExportingMembers(true);
      setConfirmModalData(null);
      try {
        await exportMembersToSheet(accessToken, activeSheetId, members, 'Data_Member');
        showNotification(`Berhasil mengekspor ${members.length} member ke spreadsheet "${activeSheetName}"!`);
      } catch (err: any) {
        alert(err.message || 'Gagal mengekspor data member ke Google Sheets.');
      } finally {
        setIsExportingMembers(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Account & Connection Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-800">
                  Google Workspace (Google Sheets & Google Drive)
                </h3>
                {googleUser ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Terhubung
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Belum Terhubung
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Kelola dan sinkronkan katalog produk serta pesanan secara langsung dengan Google Sheets, dan simpan foto kamera produk di folder Google Drive pilihan Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {googleUser ? (
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-9 h-9 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {googleUser.email?.[0]?.toUpperCase() || 'G'}
                  </div>
                )}
                <div className="text-left pr-2">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {googleUser.displayName || 'Google Admin'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {googleUser.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Putuskan Hubungan Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={handleSignIn}
                isLoading={isSigningIn}
                text="Hubungkan Akun Google"
              />
            )}
          </div>
        </div>

        {authError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {googleUser && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-4 h-4" />
              <span>Akses Google Sheets (Read & Write) Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-4 h-4" />
              <span>Akses Google Drive (Folder & Foto) Aktif</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: 2 Columns for Sheets & Drive Folders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* SECTION 1: GOOGLE SHEETS MANAGEMENT                       */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Google Sheets</h4>
                  <p className="text-xs text-slate-500">Database Produk & Pesanan Pelanggan</p>
                </div>
              </div>

              {activeSheetUrl && (
                <a
                  href={activeSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span>Buka di Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Active Spreadsheet Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                Spreadsheet Aktif Saat Ini
              </span>
              {activeSheetName ? (
                <div>
                  <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{activeSheetName}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">
                    ID: {activeSheetId}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Belum ada spreadsheet aktif yang dipilih. Buat baru atau pilih dari Google Drive di bawah.
                </p>
              )}
            </div>

            {/* Select Spreadsheet Dropdown */}
            {googleUser && (
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Pilih dari File Spreadsheet di Google Drive:
                    </label>
                    <button
                      type="button"
                      onClick={fetchSpreadsheetsList}
                      disabled={isLoadingSheets}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingSheets ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <select
                    value={activeSheetId}
                    onChange={(e) => {
                      const found = spreadsheets.find(s => s.id === e.target.value);
                      if (found) selectSpreadsheet(found);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Spreadsheet --</option>
                    {spreadsheets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Create New Spreadsheet Form */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSheetTitle}
                      onChange={(e) => setNewSheetTitle(e.target.value)}
                      placeholder="Nama Spreadsheet Baru..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewSpreadsheet}
                      disabled={isCreatingSheet}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                    >
                      {isCreatingSheet ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>Buat Otomatis</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Membuat file baru dengan tab <b>Data_Produk</b> dan <b>Pesanan_Pelanggan</b> siap pakai.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons for Sheets */}
          <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handlePullFromSheet}
                disabled={!googleUser || !activeSheetId || isSyncingFromSheet}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Tarik data produk dari spreadsheet ke web katalog"
              >
                <Download className={`w-3.5 h-3.5 ${isSyncingFromSheet ? 'animate-bounce' : ''}`} />
                <span>Tarik Produk dari Sheet</span>
              </button>

              <button
                type="button"
                onClick={promptExportProducts}
                disabled={!googleUser || !activeSheetId || isExportingToSheet}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Ekspor seluruh produk toko ke Google Sheets"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Ekspor Produk ke Sheet</span>
              </button>
            </div>

            <button
              type="button"
              onClick={promptExportOrders}
              disabled={!googleUser || !activeSheetId || isExportingOrders}
              className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              title="Ekspor seluruh pesanan pelanggan ke Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Daftar Pesanan ({orders.length}) ke Sheet</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handlePullMembersFromSheet}
                disabled={!googleUser || !activeSheetId || isSyncingMembers}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Tarik data member dari tab Data_Member ke database toko"
              >
                <Download className={`w-3.5 h-3.5 ${isSyncingMembers ? 'animate-bounce' : ''}`} />
                <span>Tarik Member dari Sheet</span>
              </button>

              <button
                type="button"
                onClick={promptExportMembers}
                disabled={!googleUser || !activeSheetId || isExportingMembers}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Ekspor seluruh data member ke tab Data_Member di Google Sheets"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ekspor Member ({members.length}) ke Sheet</span>
              </button>
            </div>

            {onOpenAddMember && (
              <button
                type="button"
                onClick={onOpenAddMember}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                title="Input data member baru untuk disimpan di database & Google Sheets"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Input Data Member Baru ke Database &amp; Sheets</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: GOOGLE DRIVE FOLDERS ("Folder yang diinginkan") */}
        {/* ========================================================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Google Drive Folder Foto</h4>
                  <p className="text-xs text-slate-500">Lokasi Simpan Foto Kamera & Upload Produk</p>
                </div>
              </div>

              {selectedFolderId && (
                <a
                  href={`https://drive.google.com/drive/folders/${selectedFolderId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <span>Buka di Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Active Drive Folder Card */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 mb-4">
              <span className="text-[11px] font-bold tracking-wider text-blue-500 uppercase block mb-1">
                Folder Google Drive Aktif Pilihan Anda
              </span>
              <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>{selectedFolderName}</span>
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Setiap foto produk dari kamera HP atau upload file akan langsung otomatis disimpan ke dalam folder ini di Google Drive Anda.
              </p>
            </div>

            {/* Folder Selection & Creation */}
            {googleUser && (
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Pilih Folder Lain dari Google Drive Anda:
                    </label>
                    <button
                      type="button"
                      onClick={fetchFoldersList}
                      disabled={isLoadingFolders}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingFolders ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                  <select
                    value={selectedFolderId || ''}
                    onChange={(e) => {
                      const found = driveFolders.find(f => f.id === e.target.value);
                      if (found) handleSelectFolder(found);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Folder Tersedia --</option>
                    {driveFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Create New Folder option */}
                <div className="pt-2 border-t border-slate-100">
                  {!showCreateFolderInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCreateFolderInput(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>+ Buat Folder Baru di Google Drive</span>
                    </button>
                  ) : (
                    <form onSubmit={handleCreateNewFolder} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFolderNameInput}
                          onChange={(e) => setNewFolderNameInput(e.target.value)}
                          placeholder="Nama folder baru (cth: Foto_Keramik_2026)"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={isCreatingFolder || !newFolderNameInput.trim()}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
                        >
                          {isCreatingFolder ? 'Membuat...' : 'Buat Folder'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateFolderInput(false)}
                          className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <HardDrive className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>
                Saat menambah produk baru, foto akan disimpan dengan resolusi optimal, terindeks ID Drive, dan terhubung ke tabel produk.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MANDATORY CONFIRMATION MODAL FOR DESTRUCTIVE OPERATIONS   */}
      {/* ========================================================= */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {confirmModalData.title}
            </h3>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              {confirmModalData.description}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 text-xs text-slate-700">
              <p><b>Target Spreadsheet:</b> {activeSheetName}</p>
              <p><b>Jumlah Data:</b> {confirmModalData.affectedCount} baris</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Ya, Konfirmasi & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
