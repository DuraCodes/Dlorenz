/**
 * ImageKit CDN & Cloud Media Client
 * Routes requests securely through serverless / backend gateway to prevent browser CORS "Failed to fetch" errors.
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

function getRequestHeaders(config?: ImageKitConfig | null): Record<string, string> {
  const cfg = config || getStoredImageKitConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cfg?.publicKey) {
    headers['x-ik-public-key'] = cfg.publicKey;
    headers['x-imagekit-public-key'] = cfg.publicKey;
  }
  if (cfg?.privateKey) {
    headers['x-ik-private-key'] = cfg.privateKey;
    headers['x-imagekit-private-key'] = cfg.privateKey;
  }
  if (cfg?.urlEndpoint) {
    headers['x-ik-url-endpoint'] = cfg.urlEndpoint;
    headers['x-imagekit-url-endpoint'] = cfg.urlEndpoint;
  }
  return headers;
}

/**
 * Test credentials against ImageKit Gateway
 */
export async function testImageKitConnection(
  config: ImageKitConfig
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { publicKey, privateKey, urlEndpoint } = config;
    if (!privateKey || !publicKey || !urlEndpoint) {
      return { success: false, error: 'Please provide Public Key, Private Key, and URL Endpoint.' };
    }

    const res = await fetch('/api/imagekit/test-connection', {
      method: 'POST',
      headers: getRequestHeaders(config),
      body: JSON.stringify({
        publicKey: publicKey.trim(),
        privateKey: privateKey.trim(),
        urlEndpoint: urlEndpoint.trim(),
      }),
    });

    const contentType = res.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      return { success: false, error: `Invalid server response: ${text.slice(0, 100)}` };
    }

    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || 'Successfully connected and verified with ImageKit API!',
      };
    }

    return { success: false, error: data.error || 'Verification failed with provided credentials.' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to ImageKit server gateway' };
  }
}

/**
 * Upload file to ImageKit CDN via Gateway
 */
export async function uploadToImageKit(
  fileData: string | File,
  fileName: string,
  folder: string = '/dlorenz/media',
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; url?: string; fileId?: string; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();

    let base64String = '';
    if (typeof fileData === 'string') {
      base64String = fileData;
    } else {
      base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileData);
      });
    }

    const res = await fetch('/api/imagekit/upload', {
      method: 'POST',
      headers: getRequestHeaders(config),
      body: JSON.stringify({
        file: base64String,
        fileName: fileName.replace(/[^a-zA-Z0-9._-]/g, '_'),
        folder: folder.startsWith('/') ? folder : `/${folder}`,
        publicKey: config?.publicKey,
        privateKey: config?.privateKey,
        urlEndpoint: config?.urlEndpoint,
      }),
    });

    const contentType = res.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      return { success: false, error: 'Server did not return a valid JSON response.' };
    }

    if (res.ok && data.url) {
      return {
        success: true,
        url: data.url,
        fileId: data.fileId,
      };
    }

    return { success: false, error: data.error || data.message || 'ImageKit upload failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error uploading to ImageKit' };
  }
}

/**
 * Fetch files list from ImageKit via Gateway
 */
export async function listImageKitFiles(
  folder: string = '/dlorenz/media',
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; files: ImageKitFileItem[]; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();
    const cleanPath = folder.startsWith('/') ? folder : `/${folder}`;
    const url = `/api/imagekit/files?path=${encodeURIComponent(cleanPath)}&limit=40`;

    const res = await fetch(url, {
      headers: getRequestHeaders(config),
    });

    const contentType = res.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      return { success: false, files: [], error: 'Could not load files.' };
    }

    if (res.ok && data.files && Array.isArray(data.files)) {
      return {
        success: true,
        files: data.files,
      };
    }

    return { success: false, files: [], error: data.error || 'Failed to list files' };
  } catch (err: any) {
    return { success: false, files: [], error: err.message };
  }
}

/**
 * Delete a file from ImageKit via Gateway
 */
export async function deleteImageKitFile(
  fileId: string,
  configOverride?: ImageKitConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = configOverride || getStoredImageKitConfig();
    const res = await fetch(`/api/imagekit/delete/${fileId}`, {
      method: 'DELETE',
      headers: getRequestHeaders(config),
    });

    const contentType = res.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    }

    if (res.ok || res.status === 204) {
      return { success: true };
    }

    return { success: false, error: data.error || 'Failed to delete file' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
