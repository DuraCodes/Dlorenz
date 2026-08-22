import React, { useState, useEffect } from 'react';
import {
  CloudUpload,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Users,
  Building2,
  Zap,
  Trash2,
} from 'lucide-react';
import { SiteConfig } from '../../types';
import {
  testImageKitConnection,
  saveStoredImageKitConfig,
  getStoredImageKitConfig,
  uploadToImageKit,
  listImageKitFiles,
  deleteImageKitFile,
  ImageKitConfig,
} from '../../lib/imagekit';

interface ImageKitMediaTabProps {
  imageKitStatus: {
    configured: boolean;
    urlEndpoint: string | null;
    publicKey: string | null;
    source?: string;
  } | null;
  onStatusUpdated: () => void;
  onApplyAssetUrl?: (type: 'bento' | 'project' | 'team' | 'partner' | 'logo' | 'about', url: string) => void;
}

export const ImageKitMediaTab: React.FC<ImageKitMediaTabProps> = ({
  imageKitStatus,
  onStatusUpdated,
  onApplyAssetUrl,
}) => {
  // Form Credentials State
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [urlEndpoint, setUrlEndpoint] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Status & Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload Studio State
  const [uploadFolder, setUploadFolder] = useState('/dlorenz/media');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Asset Explorer State
  const [files, setFiles] = useState<any[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const stored = getStoredImageKitConfig();
    if (stored) {
      if (stored.publicKey) setPublicKey(stored.publicKey);
      if (stored.privateKey) setPrivateKey(stored.privateKey);
      if (stored.urlEndpoint) setUrlEndpoint(stored.urlEndpoint);
    }
  }, []);

  // Fetch files from ImageKit
  const fetchImageKitFiles = async () => {
    const config = {
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim(),
    };
    if (!config.privateKey) return;

    setIsLoadingFiles(true);
    try {
      const res = await listImageKitFiles(uploadFolder, config);
      if (res.success && res.files) {
        setFiles(res.files);
      }
    } catch (err) {
      console.error('Failed to fetch ImageKit files:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (privateKey.trim() || imageKitStatus?.configured) {
      fetchImageKitFiles();
    }
  }, [imageKitStatus?.configured, uploadFolder, privateKey]);

  // Delete ImageKit file
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!fileId) return;
    if (!window.confirm(`Are you sure you want to delete "${fileName}" from ImageKit cloud?`)) return;

    try {
      const res = await deleteImageKitFile(fileId, {
        publicKey: publicKey.trim(),
        privateKey: privateKey.trim(),
        urlEndpoint: urlEndpoint.trim(),
      });
      if (res.success) {
        setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
      } else {
        alert(res.error || 'Failed to delete file from ImageKit');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting file');
    }
  };

  // Handle Save Credentials
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey.trim() || !privateKey.trim() || !urlEndpoint.trim()) {
      setErrorMessage('Please fill in all three ImageKit credential fields.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(null);

    const config: ImageKitConfig = {
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim().replace(/\/$/, ''),
    };

    try {
      // 1. Direct validation test with ImageKit REST API
      const testRes = await testImageKitConnection(config);
      if (!testRes.success) {
        setErrorMessage(testRes.error || 'Invalid credentials. Please verify your ImageKit keys.');
        setIsSaving(false);
        return;
      }

      // 2. Save to client storage
      saveStoredImageKitConfig(config);
      setSaveSuccess('ImageKit connected, validated, and saved successfully!');
      onStatusUpdated();
      fetchImageKitFiles();

      // 3. Optional background sync to Express backend (if running in fullstack)
      fetch('/api/imagekit/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      }).catch(() => {});
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error configuring ImageKit.');
    } finally {
      setIsSaving(false);
    }
  };

  // Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    setErrorMessage(null);
    setSaveSuccess(null);

    const config: ImageKitConfig = {
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim().replace(/\/$/, ''),
    };

    try {
      const res = await testImageKitConnection(config);
      if (res.success) {
        setSaveSuccess(res.message || 'Connection verified! ImageKit CDN & REST API responding.');
        saveStoredImageKitConfig(config);
        onStatusUpdated();
        fetchImageKitFiles();
      } else {
        setErrorMessage(res.error || 'Connection test failed. Please check your Private Key and URL Endpoint.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Connection test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  // Direct File Upload in Studio
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccessUrl(null);
    setErrorMessage(null);

    const config: ImageKitConfig = {
      publicKey: publicKey.trim(),
      privateKey: privateKey.trim(),
      urlEndpoint: urlEndpoint.trim().replace(/\/$/, ''),
    };

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      try {
        const cleanName = `dlorenz_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const res = await uploadToImageKit(dataUrl, cleanName, uploadFolder, config);

        if (res.success && res.url) {
          setUploadSuccessUrl(res.url);
          setSaveSuccess(`Uploaded "${file.name}" to ImageKit CDN successfully!`);
          fetchImageKitFiles();
        } else {
          setErrorMessage(res.error || 'Upload to ImageKit failed.');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Error during ImageKit upload.');
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="space-y-8 font-condensed">
      {/* ----------------------------------------------------------------- */}
      {/* HEADER BANNER & CONNECTION STATUS                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4EFE32]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  imageKitStatus?.configured
                    ? 'bg-[#4EFE32]/15 text-[#4EFE32] border-[#4EFE32]/40 shadow-[0_0_20px_rgba(78,254,50,0.2)]'
                    : 'bg-[#262933] text-[#A0A6B2] border-[#343844]'
                }`}
              >
                <CloudUpload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <span>ImageKit Cloud Storage & CDN</span>
                  {imageKitStatus?.configured ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#4EFE32]/20 text-[#4EFE32] border border-[#4EFE32]/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-400/15 text-amber-400 border border-amber-400/40 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Needs Setup</span>
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-[#A0A6B2]">
                  Store all website media on ImageKit CDN for lightning-fast global delivery, real-time optimization, and instant dashboard synchronization.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl bg-[#111216] hover:bg-[#262933] border border-[#262933] text-xs font-bold uppercase text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              {isTesting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#4EFE32]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[#4EFE32]" />
              )}
              <span>Test Connection</span>
            </button>

            <a
              href="https://imagekit.io/dashboard/developer/api-keys"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#00C2CB]/15 hover:bg-[#00C2CB]/25 border border-[#00C2CB]/40 text-[#00C2CB] text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
            >
              <span>ImageKit Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Notifications & Feedback */}
        {saveSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#4EFE32]/10 border border-[#4EFE32]/30 text-xs font-bold text-[#4EFE32] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#FF4444]/10 border border-[#FF4444]/30 text-xs font-bold text-[#FF6666] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 2-COLUMN: CREDENTIALS SETUP & QUICK UPLOADER                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: API Key Configuration */}
        <div className="bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#262933]">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-[#4EFE32]" />
              <h3 className="text-base font-bold uppercase text-white tracking-wide">
                ImageKit API Credentials
              </h3>
            </div>
            <span className="text-[11px] text-[#A0A6B2] font-mono">Developer API</span>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            {/* Public Key */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                ImageKit Public Key
              </label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="public_xxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs font-mono text-white outline-none"
              />
            </div>

            {/* Private Key */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-[#A0A6B2]">
                  ImageKit Private Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-[11px] text-[#00C2CB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPrivateKey ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPrivateKey ? 'text' : 'password'}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="private_xxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs font-mono text-white outline-none"
              />
            </div>

            {/* URL Endpoint */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                ImageKit URL Endpoint
              </label>
              <input
                type="text"
                value={urlEndpoint}
                onChange={(e) => setUrlEndpoint(e.target.value)}
                placeholder="https://ik.imagekit.io/your_account_id"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs font-mono text-white outline-none"
              />
              <span className="text-[11px] text-[#A0A6B2] mt-1 block">
                Found on ImageKit Dashboard → Developer options → URL-endpoints.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(78,254,50,0.25)]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#121212]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#121212]" />
              )}
              <span>Save & Connect ImageKit</span>
            </button>
          </form>

          {/* Quick Guide Card */}
          <div className="p-4 rounded-2xl bg-[#111216] border border-[#262933] space-y-2">
            <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>How to get your ImageKit Keys</span>
            </h4>
            <ol className="text-xs text-[#A0A6B2] space-y-1 list-decimal list-inside leading-relaxed">
              <li>Log in to your free account at <strong className="text-white">imagekit.io</strong></li>
              <li>Navigate to <strong className="text-white">Developer options → API Keys</strong> in the sidebar</li>
              <li>Copy your <strong className="text-[#4EFE32]">Public Key</strong> and <strong className="text-[#4EFE32]">Private Key</strong></li>
              <li>Copy your <strong className="text-[#00C2CB]">URL-endpoint</strong> (e.g. <code className="text-white bg-[#262933] px-1 py-0.5 rounded">https://ik.imagekit.io/dlorenz</code>)</li>
            </ol>
          </div>
        </div>

        {/* Right Card: Upload Media Directly */}
        <div className="bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#262933]">
            <div className="flex items-center gap-2.5">
              <CloudUpload className="w-5 h-5 text-[#00C2CB]" />
              <h3 className="text-base font-bold uppercase text-white tracking-wide">
                Direct Cloud Uploader
              </h3>
            </div>
            <span className="text-[11px] text-[#A0A6B2] font-mono">CDN Ingestion</span>
          </div>

          {/* Target Folder Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
              Target ImageKit Folder
            </label>
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#00C2CB] text-xs text-white outline-none cursor-pointer"
            >
              <option value="/dlorenz/projects">/dlorenz/projects (Portfolio & Showcase)</option>
              <option value="/dlorenz/team">/dlorenz/team (Executive Portraits)</option>
              <option value="/dlorenz/partners">/dlorenz/partners (Partner Logos)</option>
              <option value="/dlorenz/brand">/dlorenz/brand (Site Logo & Monograms)</option>
              <option value="/dlorenz/media">/dlorenz/media (General Assets)</option>
            </select>
          </div>

          {/* Upload Dropzone */}
          <div>
            <label
              className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
                isUploading
                  ? 'border-[#00C2CB] bg-[#00C2CB]/10 cursor-wait'
                  : 'border-[#262933] hover:border-[#00C2CB] bg-[#111216] cursor-pointer'
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-[#00C2CB] mb-2 animate-spin" />
              ) : (
                <CloudUpload className="w-8 h-8 text-[#00C2CB] mb-2" />
              )}
              <span className="text-sm font-bold uppercase text-white">
                {isUploading ? 'Uploading to ImageKit CDN...' : 'Drop or Select Image File'}
              </span>
              <span className="text-xs text-[#A0A6B2] mt-1">
                JPG, PNG, WebP, SVG supported (Auto-compressed)
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                className="sr-only"
                onChange={handleDirectUpload}
              />
            </label>
          </div>

          {/* Last Upload Result Box */}
          {uploadSuccessUrl && (
            <div className="p-4 rounded-2xl bg-[#111216] border border-[#4EFE32]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#4EFE32] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Permanent CDN URL Generated</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(uploadSuccessUrl)}
                  className="px-2.5 py-1 rounded-lg bg-[#262933] hover:bg-[#343844] text-xs text-white font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedUrl === uploadSuccessUrl ? (
                    <Check className="w-3 h-3 text-[#4EFE32]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedUrl === uploadSuccessUrl ? 'Copied' : 'Copy URL'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#16181D] border border-[#262933] text-xs font-mono text-white truncate select-all">
                {uploadSuccessUrl}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-[#A0A6B2] uppercase">Quick Insert to:</span>
                {onApplyAssetUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => onApplyAssetUrl('bento', uploadSuccessUrl)}
                      className="px-2 py-1 rounded bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-[10px] font-bold uppercase transition-colors"
                    >
                      Bento Gallery Card
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyAssetUrl('team', uploadSuccessUrl)}
                      className="px-2 py-1 rounded bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-[10px] font-bold uppercase transition-colors"
                    >
                      Team Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyAssetUrl('partner', uploadSuccessUrl)}
                      className="px-2 py-1 rounded bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-[10px] font-bold uppercase transition-colors"
                    >
                      Partner Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyAssetUrl('logo', uploadSuccessUrl)}
                      className="px-2 py-1 rounded bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-[10px] font-bold uppercase transition-colors"
                    >
                      Brand Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => onApplyAssetUrl('about', uploadSuccessUrl)}
                      className="px-2 py-1 rounded bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-[10px] font-bold uppercase transition-colors"
                    >
                      About Showcase
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* IMAGEKIT ASSET EXPLORER / MEDIA GALLERY                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262933]">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-[#4EFE32]" />
            <div>
              <h3 className="text-base font-bold uppercase text-white tracking-wide">
                ImageKit Cloud Assets Explorer
              </h3>
              <p className="text-xs text-[#A0A6B2] mt-0.5">
                Browse images stored in your ImageKit dashboard folder ({uploadFolder})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchImageKitFiles}
            disabled={isLoadingFiles}
            className="px-3.5 py-2 rounded-xl bg-[#111216] hover:bg-[#262933] border border-[#262933] text-xs font-bold uppercase text-white flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#4EFE32] ${isLoadingFiles ? 'animate-spin' : ''}`} />
            <span>Refresh Media</span>
          </button>
        </div>

        {isLoadingFiles ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#4EFE32]" />
            <p className="text-xs text-[#A0A6B2] uppercase font-bold tracking-wider">
              Loading assets from ImageKit CDN...
            </p>
          </div>
        ) : files.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => {
              const fileUrl = file.url || `${imageKitStatus?.urlEndpoint}/${file.filePath?.replace(/^\//, '')}`;
              return (
                <div
                  key={file.fileId || file.name}
                  className="bg-[#111216] border border-[#262933] hover:border-[#4EFE32] rounded-2xl p-2 space-y-2 group transition-all"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#16181D] flex items-center justify-center">
                    <img
                      src={file.thumbnailUrl || fileUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(fileUrl)}
                        title="Copy CDN URL"
                        className="p-2 rounded-lg bg-[#4EFE32] text-black font-bold hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Image"
                        className="p-2 rounded-lg bg-white/20 text-white hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {file.fileId && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.fileId, file.name)}
                          title="Delete from ImageKit"
                          className="p-2 rounded-lg bg-red-600/80 text-white hover:bg-red-600 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-1">
                    <p className="text-[11px] font-bold text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-[#A0A6B2] font-mono mt-0.5">
                      <span>{file.size ? `${Math.round(file.size / 1024)} KB` : 'CDN Asset'}</span>
                      {copiedUrl === fileUrl && (
                        <span className="text-[#4EFE32] font-bold">Copied!</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-[#262933] rounded-2xl p-6">
            <ImageIcon className="w-8 h-8 text-[#505664]" />
            <p className="text-xs text-white font-bold uppercase">
              {imageKitStatus?.configured
                ? 'No files found in folder ' + uploadFolder
                : 'Connect your ImageKit credentials above to view and synchronize assets.'}
            </p>
            <p className="text-[11px] text-[#A0A6B2]">
              Uploaded media will appear here with direct CDN links and instant insertion controls.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
