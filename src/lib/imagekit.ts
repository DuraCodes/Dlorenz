/**
 * ImageKit CDN & Cloud Media Client (Universal - works in both Full-Stack and Netlify Static SPA mode)
 */

export interface ImageKitConfig {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}

export interface ImageKitFileItem {
  fileId: string;
  name: string;
  url: string;
  thumbnail?: string;
  fileType?: string;
  size?: number;
  height?: number;
  width?: number;
  createdAt?: string;
}

// Storage key
const IK_CONFIG_KEY = 'dlorenz_imagekit_config';

export function getStoredImageKitConfig(): ImageKitConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(IK_CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.publicKey && parsed.urlEndpoint) {
      return parsed;
    }
  } catch (e) {
    console.error('Error reading ImageKit config:', e);
  }
  return null;
}

export function saveStoredImageKitConfig(config: ImageKitConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IK_CONFIG_KEY, JSON.stringify(config));
}

export function isImageKitConfigured(): boolean {
  const config = getStoredImageKitConfig();
  return Boolean(config && config.publicKey && config.urlEndpoint);
}

/**
 * Test credentials against ImageKit direct REST API
 */
export async function testImageKitConnection(config: ImageKitConfig): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { privateKey, urlEndpoint } = config;
    if (!privateKey) {
      return { success: false, error: 'Private Key is required to test API connection.' };
    }

    const authHeader = 'Basic ' + btoa(`${privateKey.trim()}:`);
    const res = await fetch('https://api.imagekit.io/v1/files?limit=1', {
      headers: {
        Authorization: authHeader,
      },
    });

    if (res.ok) {
      return {
        success: true,
        message: 'Successfully connected and verified with ImageKit API!',
      };
    }

    const text = await res.text();
    let errorMsg = 'ImageKit credentials rejected. Check your Private Key.';
    try {
      const data = JSON.parse(text);
      if (data.message) errorMsg = data.message;
    } catch {}

    return { success: false, error: errorMsg };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to ImageKit API' };
  }
}

/**
 * Upload file directly to ImageKit CDN
 */
export async function uploadToImageKit(
  fileData: string | File,
  fileName: string,
  folder: string = '/dlorenz/media',
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; url?: string; fileId?: string; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();
    if (!config || !config.privateKey) {
      return { success: false, error: 'ImageKit private key not configured. Please save your credentials first.' };
    }

    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('folder', folder.startsWith('/') ? folder : `/${folder}`);
    formData.append('useUniqueFileName', 'true');

    if (typeof fileData === 'string') {
      formData.append('file', fileData);
    } else {
      formData.append('file', fileData);
    }

    const authHeader = 'Basic ' + btoa(`${config.privateKey.trim()}:`);
    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      return { success: false, error: `Invalid response from ImageKit: ${text.slice(0, 100)}` };
    }

    if (res.ok && data.url) {
      return {
        success: true,
        url: data.url,
        fileId: data.fileId,
      };
    }

    return { success: false, error: data.message || 'ImageKit upload failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error uploading to ImageKit' };
  }
}

/**
 * Fetch files list directly from ImageKit REST API
 */
export async function listImageKitFiles(
  folder: string = '/dlorenz/media',
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; files: ImageKitFileItem[]; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();
    if (!config || !config.privateKey) {
      return { success: false, files: [], error: 'ImageKit not configured' };
    }

    const authHeader = 'Basic ' + btoa(`${config.privateKey.trim()}:`);
    const cleanPath = folder.startsWith('/') ? folder : `/${folder}`;
    const url = `https://api.imagekit.io/v1/files?path=${encodeURIComponent(cleanPath)}&limit=40`;

    const res = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return { success: false, files: [], error: 'Could not parse response from ImageKit' };
    }

    if (res.ok && Array.isArray(data)) {
      return {
        success: true,
        files: data.map((f: any) => ({
          fileId: f.fileId,
          name: f.name,
          url: f.url,
          thumbnail: f.thumbnail || f.url,
          fileType: f.fileType,
          size: f.size,
          height: f.height,
          width: f.width,
          createdAt: f.createdAt,
        })),
      };
    }

    return { success: false, files: [], error: data.message || 'Failed to list files' };
  } catch (err: any) {
    return { success: false, files: [], error: err.message };
  }
}

/**
 * Delete a file directly from ImageKit
 */
export async function deleteImageKitFile(
  fileId: string,
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();
    if (!config || !config.privateKey) {
      return { success: false, error: 'ImageKit not configured' };
    }

    const authHeader = 'Basic ' + btoa(`${config.privateKey.trim()}:`);
    const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader,
      },
    });

    if (res.status === 204 || res.ok) {
      return { success: true };
    }

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {}

    return { success: false, error: data.message || 'Failed to delete file' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
