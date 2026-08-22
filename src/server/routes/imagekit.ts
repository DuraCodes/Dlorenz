import { Router, Response } from 'express';
import ImageKit from 'imagekit';
import { db } from '../db';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../auth';

export const imageKitRouter = Router();

// In-memory / dynamic ImageKit runtime configuration
let runtimeImageKitConfig: {
  publicKey?: string;
  privateKey?: string;
  urlEndpoint?: string;
} = {};

export function getImageKitClient(override?: {
  publicKey?: string;
  privateKey?: string;
  urlEndpoint?: string;
}): ImageKit | null {
  const publicKey =
    override?.publicKey?.trim() ||
    runtimeImageKitConfig.publicKey?.trim() ||
    process.env.IMAGEKIT_PUBLIC_KEY?.trim();
  const privateKey =
    override?.privateKey?.trim() ||
    runtimeImageKitConfig.privateKey?.trim() ||
    process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const urlEndpoint =
    override?.urlEndpoint?.trim() ||
    runtimeImageKitConfig.urlEndpoint?.trim() ||
    process.env.IMAGEKIT_URL_ENDPOINT?.trim();

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  try {
    return new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  } catch (e) {
    console.error('Error instantiating ImageKit client:', e);
    return null;
  }
}

// GET /api/imagekit/status (Public / CMS Check)
imageKitRouter.get('/status', (req, res) => {
  const publicKey =
    runtimeImageKitConfig.publicKey || process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey =
    runtimeImageKitConfig.privateKey || process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint =
    runtimeImageKitConfig.urlEndpoint || process.env.IMAGEKIT_URL_ENDPOINT;

  const isConfigured = Boolean(publicKey && privateKey && urlEndpoint);

  res.json({
    configured: isConfigured,
    source: runtimeImageKitConfig.publicKey
      ? 'cms_runtime'
      : process.env.IMAGEKIT_PUBLIC_KEY
      ? 'env'
      : 'none',
    urlEndpoint: urlEndpoint || null,
    publicKey: publicKey ? `${publicKey.slice(0, 8)}...` : null,
  });
});

// POST /api/imagekit/configure (Protected - CMS Admin)
imageKitRouter.post('/configure', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { publicKey, privateKey, urlEndpoint } = req.body || {};

  if (!publicKey || !privateKey || !urlEndpoint) {
    return res.status(400).json({
      error: 'Please provide all 3 required fields: publicKey, privateKey, and urlEndpoint.',
    });
  }

  try {
    const testClient = new ImageKit({
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    });

    // Test API credentials
    const files = await testClient.listFiles({ limit: 1 });

    runtimeImageKitConfig = {
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    };

    db.logActivity(
      'IMAGEKIT_CONFIGURED',
      'media',
      undefined,
      'ImageKit credentials validated and updated',
      req.user?.email,
      req.user?.name
    );

    res.json({
      success: true,
      message: 'ImageKit credentials validated and connected successfully!',
      configured: true,
      sampleFilesCount: files.length,
      urlEndpoint: runtimeImageKitConfig.urlEndpoint,
      publicKey: `${runtimeImageKitConfig.publicKey.slice(0, 8)}...`,
    });
  } catch (err: any) {
    console.error('ImageKit configuration validation failed:', err);
    res.status(400).json({
      error:
        err?.message ||
        'Invalid ImageKit credentials. Please verify your Public Key, Private Key, and URL Endpoint.',
    });
  }
});

// POST /api/imagekit/test-connection (Protected or with credentials)
imageKitRouter.post('/test-connection', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { publicKey, privateKey, urlEndpoint } = req.body || {};
  const ik = getImageKitClient({ publicKey, privateKey, urlEndpoint });

  if (!ik) {
    return res.status(400).json({
      error: 'ImageKit credentials are not configured. Provide them in the request or environment variables.',
    });
  }

  try {
    const files = await ik.listFiles({ limit: 5 });
    res.json({
      success: true,
      message: 'Successfully connected to ImageKit Cloud!',
      files,
    });
  } catch (err: any) {
    console.error('ImageKit connection test failed:', err);
    res.status(500).json({
      error: err?.message || 'Failed to connect to ImageKit with provided credentials.',
    });
  }
});

// GET /api/imagekit/files (Protected or CMS Admin)
imageKitRouter.get('/files', async (req, res) => {
  const ik = getImageKitClient();
  if (!ik) {
    return res.status(400).json({
      error: 'ImageKit is not configured. Please add your credentials in CMS Media Settings or environment variables.',
    });
  }

  try {
    const pathParam = (req.query.path as string) || '/dlorenz';
    const limit = Math.min(100, parseInt(req.query.limit as string) || 40);

    const files = await ik.listFiles({
      path: pathParam,
      limit,
      sort: 'DESC_CREATED',
    });

    res.json({ success: true, files });
  } catch (err: any) {
    console.error('Failed to list files from ImageKit:', err);
    res.status(500).json({ error: err?.message || 'Failed to list ImageKit files' });
  }
});

// GET /api/imagekit/auth (Client auth parameter generator)
imageKitRouter.get('/auth', (req, res) => {
  const ik = getImageKitClient();
  if (!ik) {
    return res.status(400).json({
      error: 'ImageKit is not configured.',
    });
  }

  try {
    const authParams = ik.getAuthenticationParameters();
    res.json(authParams);
  } catch (err: any) {
    console.error('Error generating ImageKit auth parameters:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate authentication parameters' });
  }
});

// POST /api/imagekit/upload (Server-side Direct Upload with validation & DB tracking)
imageKitRouter.post('/upload', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { file, fileName, folder, tags, publicKey, privateKey, urlEndpoint } = req.body || {};

  const ik = getImageKitClient({ publicKey, privateKey, urlEndpoint });
  if (!ik) {
    return res.status(400).json({
      error:
        'ImageKit credentials missing. Please set your ImageKit API keys in the CMS Media tab or environment variables.',
    });
  }

  if (!file) {
    return res.status(400).json({ error: 'No image or video file data provided' });
  }

  // Basic size validation for base64
  if (typeof file === 'string' && file.length > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds maximum 50MB limit' });
  }

  try {
    const targetFolder = folder || '/dlorenz/media';
    const cleanFileName = (fileName || `dlorenz_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');

    const uploadResponse = await ik.upload({
      file,
      fileName: cleanFileName,
      folder: targetFolder,
      useUniqueFileName: true,
      tags: Array.isArray(tags) ? tags : ['dlorenz', 'cms_asset'],
    });

    // Record asset in persistent database
    db.addMediaAsset({
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
      filePath: uploadResponse.filePath,
      fileType: uploadResponse.fileType === 'non-image' ? 'video' : 'image',
      size: uploadResponse.size,
      tags: uploadResponse.tags || [],
      uploadedBy: req.user?.email || 'Admin',
    });

    console.log(`[ImageKit] Successfully uploaded ${uploadResponse.name} -> ${uploadResponse.url}`);

    res.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
      name: uploadResponse.name,
      filePath: uploadResponse.filePath,
      fileType: uploadResponse.fileType,
      size: uploadResponse.size,
    });
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({
      error: error?.message || 'Upload to ImageKit failed. Check your API credentials and quota.',
    });
  }
});

// DELETE /api/imagekit/delete/:fileId (Protected - Delete file from ImageKit & DB)
imageKitRouter.delete('/delete/:fileId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { fileId } = req.params;
  const ik = getImageKitClient();

  if (!ik) {
    return res.status(400).json({ error: 'ImageKit is not configured.' });
  }

  try {
    await ik.deleteFile(fileId);
    db.removeMediaAsset(fileId);
    db.logActivity('MEDIA_DELETED', 'media', fileId, `Deleted ImageKit file ${fileId}`, req.user?.email, req.user?.name);

    res.json({
      success: true,
      message: 'File deleted from ImageKit and media library successfully',
    });
  } catch (err: any) {
    console.error(`Failed to delete ImageKit file ${fileId}:`, err);
    // Still attempt to clean up local DB if already deleted on remote
    db.removeMediaAsset(fileId);
    res.status(500).json({
      error: err?.message || 'Failed to delete file from ImageKit cloud',
    });
  }
});
