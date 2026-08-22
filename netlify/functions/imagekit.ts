import ImageKit from 'imagekit';

export interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
}

export interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

function getImageKitInstance(event: NetlifyEvent, bodyData?: any): ImageKit | null {
  const headers = event.headers || {};
  const publicKey =
    bodyData?.publicKey ||
    headers['x-ik-public-key'] ||
    headers['x-imagekit-public-key'] ||
    process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey =
    bodyData?.privateKey ||
    headers['x-ik-private-key'] ||
    headers['x-imagekit-private-key'] ||
    process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint =
    bodyData?.urlEndpoint ||
    headers['x-ik-url-endpoint'] ||
    headers['x-imagekit-url-endpoint'] ||
    process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  try {
    return new ImageKit({
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    });
  } catch (e) {
    console.error('Error initializing ImageKit:', e);
    return null;
  }
}

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ik-public-key, x-ik-private-key, x-ik-url-endpoint, x-imagekit-public-key, x-imagekit-private-key, x-imagekit-url-endpoint',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path || '';
  let bodyData: any = {};
  if (event.body) {
    try {
      bodyData = JSON.parse(event.body);
    } catch {}
  }

  // 1. Status Check
  if (path.endsWith('/status') && event.httpMethod === 'GET') {
    const ik = getImageKitInstance(event, bodyData);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        configured: Boolean(ik),
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || null,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? `${process.env.IMAGEKIT_PUBLIC_KEY.slice(0, 8)}...` : null,
      }),
    };
  }

  // 2. Test Connection
  if (path.endsWith('/test-connection') || (path.endsWith('/configure') && event.httpMethod === 'POST')) {
    const ik = getImageKitInstance(event, bodyData);
    if (!ik) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'ImageKit credentials missing. Provide Public Key, Private Key, and URL Endpoint.',
        }),
      };
    }

    try {
      const files = await ik.listFiles({ limit: 1 });
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Successfully connected and verified with ImageKit API!',
          filesCount: files.length,
        }),
      };
    } catch (err: any) {
      console.error('ImageKit test failed:', err);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: err?.message || 'Invalid ImageKit credentials. Verification failed.',
        }),
      };
    }
  }

  // 3. Upload File
  if (path.endsWith('/upload') && event.httpMethod === 'POST') {
    const ik = getImageKitInstance(event, bodyData);
    if (!ik) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'ImageKit credentials missing.' }),
      };
    }

    const { file, fileName, folder } = bodyData;
    if (!file) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No file data provided' }),
      };
    }

    try {
      const uploadRes = await ik.upload({
        file,
        fileName: fileName || `dlorenz_${Date.now()}`,
        folder: folder || '/dlorenz/media',
        useUniqueFileName: true,
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          url: uploadRes.url,
          fileId: uploadRes.fileId,
          thumbnailUrl: uploadRes.thumbnailUrl || uploadRes.url,
          name: uploadRes.name,
        }),
      };
    } catch (err: any) {
      console.error('ImageKit upload error:', err);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: err?.message || 'Failed to upload to ImageKit' }),
      };
    }
  }

  // 4. List Files
  if (path.endsWith('/files') && event.httpMethod === 'GET') {
    const ik = getImageKitInstance(event);
    if (!ik) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'ImageKit credentials missing.' }),
      };
    }

    try {
      const folderParam = event.queryStringParameters?.path || '/dlorenz';
      const files = await ik.listFiles({
        path: folderParam,
        limit: 40,
        sort: 'DESC_CREATED',
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          files: files.map((f: any) => ({
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
        }),
      };
    } catch (err: any) {
      console.error('ImageKit list files error:', err);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: err?.message || 'Failed to fetch files' }),
      };
    }
  }

  // 5. Delete File
  if (path.includes('/delete/') && event.httpMethod === 'DELETE') {
    const ik = getImageKitInstance(event, bodyData);
    if (!ik) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'ImageKit credentials missing.' }),
      };
    }

    const fileId = path.split('/delete/')[1];
    if (!fileId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'File ID is required' }),
      };
    }

    try {
      await ik.deleteFile(fileId);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true }),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: err?.message || 'Failed to delete file' }),
      };
    }
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ message: 'DLorenz ImageKit Serverless Gateway active' }),
  };
};
