export interface DriveFolderItem {
  id: string;
  name: string;
  modifiedTime?: string;
}

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  driveUrl: string;
  thumbnailUrl: string;
  webViewLink?: string;
}

const STORAGE_KEY_SELECTED_FOLDER_ID = 'sak_drive_selected_folder_id';
const STORAGE_KEY_SELECTED_FOLDER_NAME = 'sak_drive_selected_folder_name';
const DEFAULT_FOLDER_NAME = 'Foto_Produk_Surya_Anugrah';

/**
 * Get the currently remembered Google Drive folder preferences
 */
export function getSavedDriveFolder(): { folderId: string | null; folderName: string } {
  try {
    const id = localStorage.getItem(STORAGE_KEY_SELECTED_FOLDER_ID);
    const name = localStorage.getItem(STORAGE_KEY_SELECTED_FOLDER_NAME) || DEFAULT_FOLDER_NAME;
    return { folderId: id, folderName: name };
  } catch {
    return { folderId: null, folderName: DEFAULT_FOLDER_NAME };
  }
}

/**
 * Save folder selection
 */
export function saveDriveFolder(folderId: string, folderName: string) {
  try {
    localStorage.setItem(STORAGE_KEY_SELECTED_FOLDER_ID, folderId);
    localStorage.setItem(STORAGE_KEY_SELECTED_FOLDER_NAME, folderName);
  } catch (e) {
    console.error('Failed to save drive folder selection in localStorage', e);
  }
}

/**
 * List all folders in user's Google Drive
 */
export async function listDriveFolders(accessToken: string): Promise<DriveFolderItem[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.folder' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)&orderBy=name asc&pageSize=100`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memuat daftar folder Google Drive.');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Create a new folder in Google Drive
 */
export async function createDriveFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFolderItem> {
  const metadata: any = {
    name: folderName.trim(),
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat folder baru di Google Drive.');
  }

  const data = await res.json();
  return {
    id: data.id,
    name: data.name,
    modifiedTime: data.modifiedTime,
  };
}

/**
 * Find or create a default folder
 */
export async function findOrCreateFolder(
  accessToken: string,
  targetFolderName = DEFAULT_FOLDER_NAME
): Promise<DriveFolderItem> {
  const folders = await listDriveFolders(accessToken);
  const found = folders.find(f => f.name.toLowerCase() === targetFolderName.toLowerCase());
  if (found) {
    return found;
  }
  return await createDriveFolder(accessToken, targetFolderName);
}

/**
 * Upload an image (base64) directly to user's specified Google Drive folder
 */
export async function uploadImageToDriveFolder(
  accessToken: string,
  folderId: string,
  fileName: string,
  mimeType: string,
  base64Data: string
): Promise<DriveUploadResult> {
  const pureBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const byteChars = atob(pureBase64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const imageBlob = new Blob([byteArray], { type: mimeType });

  // Use multipart upload
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType,
  };

  const multipartRequestBody = new Blob([
    delimiter,
    'Content-Type: application/json; charset=UTF-8\r\n\r\n',
    JSON.stringify(metadata),
    delimiter,
    `Content-Type: ${mimeType}\r\n\r\n`,
    imageBlob,
    closeDelimiter,
  ]);

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengunggah foto ke Google Drive.');
  }

  const fileData = await uploadRes.json();
  const fileId = fileData.id;

  // Make the uploaded photo readable via link so it displays in product cards
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (permErr) {
    console.warn('Could not set public permission on Drive photo:', permErr);
  }

  const directThumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  const driveUrl = fileData.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

  return {
    fileId,
    fileName: fileData.name,
    driveUrl,
    thumbnailUrl: directThumb,
    webViewLink: fileData.webViewLink,
  };
}
