import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Users,
  Building2,
  Settings,
  Sun,
  Moon,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  Plus,
  Eye,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  CloudUpload,
  Loader2,
  AlertCircle,
  Copy,
  ArrowUp,
  ArrowDown,
  Palette,
  Image as ImageIcon,
  RotateCw,
  Maximize2,
  Video,
  Film,
  Grid,
  Play,
  X,
  LayoutGrid,
  Check,
  Tag,
  Info,
  LogOut,
  Activity,
  FileText,
} from 'lucide-react';
import {
  defaultBentoGalleryData,
  BentoGalleryItem,
  BENTO_SPAN_PRESETS,
  BentoSpanPreset,
  sanitizeBentoGalleryList,
} from '../data/gallery';
import { dlorenzExecutiveTeam as initialTeam, TeamMember } from '../data/team';
import { enterprisePartners as initialPartners, sanitizePartnersList } from '../data/partners';
import { MarqueeLogoItem } from './ui/marquee-logo-scroller';
import { SiteConfig } from '../types';
import { BrandLogo } from './ui/brand-logo';

import { AssetImageLinkField } from './cms/AssetImageLinkField';
import { ImageKitMediaTab } from './cms/ImageKitMediaTab';
import { InquiriesTab } from './cms/InquiriesTab';
import { ActivityLogsTab } from './cms/ActivityLogsTab';
import { AdminLoginModal } from './cms/AdminLoginModal';
import {
  AdminUser,
  apiGetMe,
  apiLogout,
  apiGetSiteConfig,
  apiUpdateSiteConfig,
  apiGetGallery,
  apiSaveGallery,
  apiGetTeam,
  apiSaveTeam,
  apiGetPartners,
  apiSavePartners,
} from '../lib/api';

interface AdminCMSProps {
  onExit: () => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'projects' | 'team' | 'partners' | 'media' | 'inquiries' | 'activity' | 'appearance'
  >('general');
  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  // Authentication state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ImageKit status state
  const [imageKitStatus, setImageKitStatus] = useState<{
    configured: boolean;
    urlEndpoint: string | null;
    publicKey: string | null;
  } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

  // Check Auth & load real production database records on mount
  useEffect(() => {
    const initData = async () => {
      setIsCheckingAuth(true);

      // 1. Check Auth Status
      try {
        const user = await apiGetMe();
        if (user) {
          setAdminUser(user);
        } else {
          setShowLoginModal(true);
        }
      } catch (e) {
        setShowLoginModal(true);
      } finally {
        setIsCheckingAuth(false);
      }

      // 2. Check ImageKit status
      try {
        const res = await fetch('/api/imagekit/status');
        if (res.ok) {
          const data = await res.json();
          setImageKitStatus(data);
        }
      } catch (e) {
        setImageKitStatus({ configured: false, urlEndpoint: null, publicKey: null });
      }

      // 3. Fetch Full Database Records
      try {
        const [remoteConfig, remoteGallery, remoteTeam, remotePartners] = await Promise.all([
          apiGetSiteConfig().catch(() => null),
          apiGetGallery().catch(() => null),
          apiGetTeam().catch(() => null),
          apiGetPartners().catch(() => null),
        ]);

        if (remoteConfig) {
          setSiteConfig(remoteConfig);
          localStorage.setItem('dlorenz_cms_config', JSON.stringify(remoteConfig));
        }
        if (remoteGallery && Array.isArray(remoteGallery.items) && remoteGallery.items.length > 0) {
          setBentoGallery(sanitizeBentoGalleryList(remoteGallery.items));
          if (remoteGallery.config) setGalleryConfig(remoteGallery.config);
          localStorage.setItem('dlorenz_cms_bento_gallery', JSON.stringify(remoteGallery.items));
        }
        if (remoteTeam && Array.isArray(remoteTeam) && remoteTeam.length > 0) {
          setTeam(remoteTeam);
          localStorage.setItem('dlorenz_cms_team', JSON.stringify(remoteTeam));
        }
        if (remotePartners && Array.isArray(remotePartners) && remotePartners.length > 0) {
          setPartners(sanitizePartnersList(remotePartners));
          localStorage.setItem('dlorenz_cms_partners', JSON.stringify(remotePartners));
        }
      } catch (err) {
        console.error('Initial database fetch warning:', err);
      }
    };

    initData();
  }, []);

  // General Settings State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      siteName: 'DLORENZ SOLUTIONS',
      tagline: 'Brand Ascension & Zero-Risk Real Estate Advisory',
      heroHeadline: 'We Engineer Dominance for Nigeria’s Boldest Brands',
      heroSubheadline:
        'From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.',
      logoImage: '',
      aboutImage:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      aboutHeadline: 'Architecting Market Dominance',
      logoIconText: 'DL',
      logoType: 'both',
      primaryPhone: '+234 906 090 9034',
      secondaryPhone: '+234 816 866 1924',
      email: 'DLorenzSolutions@gmail.com',
      officeAddress: 'Federal Peace Estate, Lasu Igando Road, Lagos, Nigeria',
      consultationsActive: true,
      realEstateActive: true,
      emergencyHotline: true,
    };
  });

  // Interactive Bento Gallery State
  const [bentoGallery, setBentoGallery] = useState<BentoGalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_bento_gallery');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizeBentoGalleryList(parsed);
          }
        }
        // Backward-compatibility check
        const legacy = localStorage.getItem('dlorenz_cms_projects');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            return sanitizeBentoGalleryList(parsedLegacy);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultBentoGalleryData;
  });

  const [galleryConfig, setGalleryConfig] = useState<{ title: string; description: string }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_gallery_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      title: 'Interactive Field Portfolio',
      description:
        'Drag to reorganize items or click any card to inspect high-resolution video reels, field activations, and verified project documentation.',
    };
  });

  const [selectedBentoId, setSelectedBentoId] = useState<string | number>(
    bentoGallery[0]?.id || 1
  );
  const [previewLightboxItem, setPreviewLightboxItem] = useState<BentoGalleryItem | null>(null);

  // Team State
  const [team, setTeam] = useState<TeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_team');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialTeam;
  });
  const [selectedMemberId, setSelectedMemberId] = useState<string>(team[0]?.id || '');

  // Partners State
  const [partners, setPartners] = useState<MarqueeLogoItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_partners');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizePartnersList(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialPartners;
  });
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState<number>(0);

  // Appearance State
  const [appearance, setAppearance] = useState({
    theme:
      (typeof window !== 'undefined'
        ? (localStorage.getItem('dlorenz-theme') as 'light' | 'dark')
        : 'dark') || 'dark',
    accentColor: '#4EFE32',
    density: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
  });

  // Inquiries Inbox
  const [inquiries] = useState([
    {
      id: 'inq-1',
      name: 'Adeola Adeleke',
      company: 'Guaranty Trust FMCG Division',
      email: 'adeola@gtfmcg.ng',
      phone: '+234 802 345 6789',
      service: 'Retail Sampling Campaign',
      budget: '₦10M - ₦25M',
      date: '2 hours ago',
      status: 'New',
    },
    {
      id: 'inq-2',
      name: 'Chief Emeka Nwosu',
      company: 'Zenith Crest Holdings',
      email: 'enwosu@zenithcrest.com',
      phone: '+234 803 111 2233',
      service: 'Real Estate Land Title Audit',
      budget: '₦50M+',
      date: 'Yesterday',
      status: 'In Review',
    },
  ]);

  const markDirty = () => {
    setIsDirty(true);
    setSaveSuccessMessage(null);
  };

  const handleSave = async () => {
    setIsSavingAll(true);
    try {
      // Persist to backend database
      await Promise.all([
        apiUpdateSiteConfig(siteConfig),
        apiSaveGallery(bentoGallery, galleryConfig),
        apiSaveTeam(team),
        apiSavePartners(partners),
      ]);

      // Cache locally for offline and instant reactivity
      localStorage.setItem('dlorenz_cms_config', JSON.stringify(siteConfig));
      localStorage.setItem('dlorenz_cms_bento_gallery', JSON.stringify(bentoGallery));
      localStorage.setItem('dlorenz_cms_gallery_config', JSON.stringify(galleryConfig));
      localStorage.setItem('dlorenz_cms_projects', JSON.stringify(bentoGallery));
      localStorage.setItem('dlorenz_cms_team', JSON.stringify(team));
      localStorage.setItem('dlorenz_cms_partners', JSON.stringify(partners));
      localStorage.setItem('dlorenz-theme', appearance.theme);

      // Notify other components immediately
      window.dispatchEvent(new CustomEvent('dlorenz_cms_updated'));

      setIsDirty(false);
      setSaveSuccessMessage('All changes saved to DLORENZ production database & live across the site.');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to save to backend database:', err);
      // Still write to local storage as fallback
      localStorage.setItem('dlorenz_cms_config', JSON.stringify(siteConfig));
      localStorage.setItem('dlorenz_cms_bento_gallery', JSON.stringify(bentoGallery));
      localStorage.setItem('dlorenz_cms_team', JSON.stringify(team));
      localStorage.setItem('dlorenz_cms_partners', JSON.stringify(partners));
      window.dispatchEvent(new CustomEvent('dlorenz_cms_updated'));
      setIsDirty(false);
      setSaveSuccessMessage('Saved locally (Warning: database update had network delay).');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } finally {
      setIsSavingAll(false);
    }
  };

  const handleDiscard = () => {
    const savedConfig = localStorage.getItem('dlorenz_cms_config');
    if (savedConfig) setSiteConfig(JSON.parse(savedConfig));

    const savedBento = localStorage.getItem('dlorenz_cms_bento_gallery');
    if (savedBento) {
      try {
        setBentoGallery(sanitizeBentoGalleryList(JSON.parse(savedBento)));
      } catch (e) {
        setBentoGallery(defaultBentoGalleryData);
      }
    }

    const savedGalleryConfig = localStorage.getItem('dlorenz_cms_gallery_config');
    if (savedGalleryConfig) {
      try {
        setGalleryConfig(JSON.parse(savedGalleryConfig));
      } catch (e) {
        console.error(e);
      }
    }

    const savedTeam = localStorage.getItem('dlorenz_cms_team');
    if (savedTeam) setTeam(JSON.parse(savedTeam));

    const savedPartners = localStorage.getItem('dlorenz_cms_partners');
    if (savedPartners) {
      try {
        setPartners(sanitizePartnersList(JSON.parse(savedPartners)));
      } catch (e) {
        setPartners(initialPartners);
      }
    }

    setIsDirty(false);
    setSaveSuccessMessage(null);
  };

  // Modular Asset File Upload Function with ImageKit synchronization
  const uploadAssetFile = async (
    file: File,
    type: 'bento' | 'project' | 'team' | 'partner' | 'logo' | 'about'
  ): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;

        // Try getting ImageKit keys from saved config
        let savedKeys: any = null;
        try {
          const raw = localStorage.getItem('dlorenz_imagekit_config');
          if (raw) savedKeys = JSON.parse(raw);
        } catch (e) {}

        if (imageKitStatus?.configured || savedKeys?.publicKey) {
          setIsUploadingImage(true);
          setUploadProgressText(`Uploading ${type} asset to ImageKit CDN...`);
          try {
            let folder = '/dlorenz/projects';
            if (type === 'team') folder = '/dlorenz/team';
            else if (type === 'partner') folder = '/dlorenz/partners';
            else if (type === 'logo') folder = '/dlorenz/brand';
            else if (type === 'about') folder = '/dlorenz/brand';

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (savedKeys?.publicKey) headers['x-imagekit-public-key'] = savedKeys.publicKey;
            if (savedKeys?.privateKey) headers['x-imagekit-private-key'] = savedKeys.privateKey;
            if (savedKeys?.urlEndpoint) headers['x-imagekit-url-endpoint'] = savedKeys.urlEndpoint;

            const res = await fetch('/api/imagekit/upload', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                file: dataUrl,
                fileName: `${type}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                folder,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.url) {
                setUploadProgressText(`Uploaded successfully to ImageKit CDN!`);
                setTimeout(() => setUploadProgressText(null), 3000);
                setIsUploadingImage(false);
                resolve(data.url);
                return;
              }
            }
          } catch (err) {
            console.error('ImageKit upload failed, falling back to data URL', err);
          } finally {
            setIsUploadingImage(false);
          }
        }

        // Fallback: Local Data URL
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  // Quick apply asset URL from Media Tab to active sections
  const handleApplyAssetUrl = (
    type: 'bento' | 'project' | 'team' | 'partner' | 'logo' | 'about',
    url: string
  ) => {
    if (type === 'bento' || type === 'project') {
      const isVideo =
        url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('/video/');
      if (selectedBentoId) {
        setBentoGallery((prev) =>
          prev.map((item) =>
            item.id === selectedBentoId
              ? { ...item, url, type: isVideo ? 'video' : item.type }
              : item
          )
        );
      } else if (bentoGallery[0]?.id) {
        setBentoGallery((prev) =>
          prev.map((item, idx) =>
            idx === 0 ? { ...item, url, type: isVideo ? 'video' : item.type } : item
          )
        );
      }
      setActiveTab('projects');
    } else if (type === 'team') {
      if (selectedMemberId) {
        setTeam((prev) =>
          prev.map((m) => (m.id === selectedMemberId ? { ...m, image: url } : m))
        );
      } else if (team[0]?.id) {
        setTeam((prev) =>
          prev.map((m, idx) => (idx === 0 ? { ...m, image: url } : m))
        );
      }
      setActiveTab('team');
    } else if (type === 'partner') {
      const targetIdx = selectedPartnerIndex >= 0 ? selectedPartnerIndex : 0;
      setPartners((prev) =>
        prev.map((p, idx) => (idx === targetIdx ? { ...p, src: url, svgIcon: undefined } : p))
      );
      setActiveTab('partners');
    } else if (type === 'logo') {
      setSiteConfig((prev) => ({ ...prev, logoImage: url }));
      setActiveTab('general');
    } else if (type === 'about') {
      setSiteConfig((prev) => ({ ...prev, aboutImage: url }));
      setActiveTab('general');
    }
    markDirty();
    setSaveSuccessMessage('Media URL applied successfully to active CMS element!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // --- Bento Gallery CRUD ---
  const handleAddBentoItem = () => {
    const newId = Date.now();
    const preset = BENTO_SPAN_PRESETS[bentoGallery.length % BENTO_SPAN_PRESETS.length];
    const newItem: BentoGalleryItem = {
      id: newId,
      type: 'image',
      title: `Field Showcase ${bentoGallery.length + 1}`,
      desc: 'High-impact experiential brand activation or verified commercial asset documentation.',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      span: preset.spanClass,
      tags: ['Experiential', 'Activation', 'DLORENZ'],
      alt: `Showcase ${bentoGallery.length + 1}`,
    };
    setBentoGallery((prev) => [...prev, newItem]);
    setSelectedBentoId(newId);
    markDirty();
  };

  const handleDuplicateBentoItem = (id: string | number) => {
    const target = bentoGallery.find((item) => item.id === id);
    if (!target) return;
    const newId = Date.now();
    const duplicate: BentoGalleryItem = {
      ...target,
      id: newId,
      title: `${target.title} (Copy)`,
    };
    const targetIdx = bentoGallery.findIndex((item) => item.id === id);
    setBentoGallery((prev) => [
      ...prev.slice(0, targetIdx + 1),
      duplicate,
      ...prev.slice(targetIdx + 1),
    ]);
    setSelectedBentoId(newId);
    markDirty();
  };

  const handleMoveBentoItem = (id: string | number, direction: 'up' | 'down') => {
    const index = bentoGallery.findIndex((item) => item.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === bentoGallery.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...bentoGallery];
    const [removed] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, removed);
    setBentoGallery(reordered);
    markDirty();
  };

  const handleDeleteBentoItem = (id: string | number) => {
    if (bentoGallery.length <= 1) {
      alert('You must maintain at least one media card in the Bento Gallery.');
      return;
    }
    const filtered = bentoGallery.filter((item) => item.id !== id);
    setBentoGallery(filtered);
    if (selectedBentoId === id) {
      setSelectedBentoId(filtered[0]?.id || 1);
    }
    markDirty();
  };

  const handleResetBentoDemo = () => {
    if (
      window.confirm(
        'Reset the Interactive Bento Gallery to default high-definition demo tiles and video reels?'
      )
    ) {
      setBentoGallery(defaultBentoGalleryData);
      setSelectedBentoId(defaultBentoGalleryData[0].id);
      markDirty();
    }
  };

  // --- Partner CRUD ---
  const handleAddPartner = () => {
    const newPartner: MarqueeLogoItem = {
      name: `Partner ${partners.length + 1}`,
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    };
    setPartners((prev) => [...prev, newPartner]);
    setSelectedPartnerIndex(partners.length);
    markDirty();
  };

  const handleDeletePartner = (index: number) => {
    if (partners.length <= 1) {
      alert('You must maintain at least one partner logo.');
      return;
    }
    const filtered = partners.filter((_, idx) => idx !== index);
    setPartners(filtered);
    setSelectedPartnerIndex(Math.max(0, index - 1));
    markDirty();
  };

  // --- Team CRUD ---
  const handleAddMember = () => {
    const newId = `exec-${Date.now()}`;
    const newMember: TeamMember = {
      id: newId,
      name: `Leadership Member ${team.length + 1}`,
      role: 'Director of Strategic Growth',
      division: 'Brand Operations & Market Execution',
      bio: 'Executive strategist driving market dominance across Nigeria and West Africa.',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      badge: 'Executive',
      credentials: ['Strategic Advisory', 'Campaign Architecture'],
      directAdvisoryScope: 'National Enterprise Brands & Real Estate Assets',
    };
    setTeam((prev) => [...prev, newMember]);
    setSelectedMemberId(newId);
    markDirty();
  };

  const handleDeleteMember = (id: string) => {
    if (team.length <= 1) {
      alert('You must maintain at least one leadership profile.');
      return;
    }
    const filtered = team.filter((m) => m.id !== id);
    setTeam(filtered);
    if (selectedMemberId === id) {
      setSelectedMemberId(filtered[0]?.id || '');
    }
    markDirty();
  };

  const selectedBentoItem =
    bentoGallery.find((item) => item.id === selectedBentoId) || bentoGallery[0];
  const selectedMember = team.find((m) => m.id === selectedMemberId) || team[0];
  const selectedPartner = partners[selectedPartnerIndex] || partners[0];

  return (
    <div className="min-h-screen md:h-screen w-full bg-[#111216] text-[#FFFFFF] font-sans flex flex-col md:flex-row antialiased selection:bg-[#4EFE32] selection:text-[#121212] md:overflow-hidden">
      {/* ===================================================================== */}
      {/* SIDEBAR NAVIGATION                                                    */}
      {/* ===================================================================== */}
      <aside className="w-full md:w-64 bg-[#16181D] border-b md:border-b-0 md:border-r border-[#262933] flex flex-col justify-between shrink-0 font-condensed md:h-full md:overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="p-4 sm:p-6 border-b border-[#262933] flex items-center justify-between md:block">
            <div className="flex items-center gap-3">
              <BrandLogo
                siteConfig={siteConfig}
                size="sm"
                onClick={onExit}
              />
            </div>

            {/* Mobile quick return button */}
            <button
              type="button"
              onClick={onExit}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111216] border border-[#262933] text-[11px] font-bold uppercase tracking-wider text-white hover:border-[#4EFE32] hover:text-[#4EFE32] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 sm:p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:gap-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('general')}
              className={`shrink-0 md:w-full flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">General & Logo</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Bento Gallery</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'projects'
                    ? 'bg-[#121212]/20 text-[#121212]'
                    : 'bg-[#262933] text-white'
                }`}
              >
                {bentoGallery.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Partner Logos</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'partners'
                    ? 'bg-[#121212]/20 text-[#121212]'
                    : 'bg-[#262933] text-white'
                }`}
              >
                {partners.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Leadership</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'team' ? 'bg-[#121212]/20 text-[#121212]' : 'bg-[#262933] text-white'
                }`}
              >
                {team.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <CloudUpload className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">ImageKit & Media</span>
              </div>
              {imageKitStatus?.configured ? (
                <span className="w-2 h-2 rounded-full bg-[#4EFE32]" title="Connected" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Needs Setup" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`shrink-0 md:w-full flex items-center justify-between gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Inquiries & CRM</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`shrink-0 md:w-full flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Audit Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`shrink-0 md:w-full flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'appearance'
                  ? 'bg-[#4EFE32] text-[#121212] font-black'
                  : 'text-[#A0A6B2] hover:bg-[#1A1C22] hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Appearance</span>
            </button>
          </nav>
        </div>

        {/* Desktop Sidebar Footer: Admin User Status & Return Button */}
        <div className="p-4 border-t border-[#262933] space-y-3 hidden md:block">
          {adminUser && (
            <div className="p-2.5 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate">{adminUser.name}</p>
                <p className="text-[9px] text-[#4EFE32] uppercase font-mono">{adminUser.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  apiLogout();
                  setAdminUser(null);
                  setShowLoginModal(true);
                }}
                title="Sign out of Admin CMS"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111216] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Site</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* MAIN CONTENT AREA                                                     */}
      {/* ===================================================================== */}
      <main className="flex-1 md:overflow-y-auto md:h-full flex flex-col justify-between">
        <div className="p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full font-condensed space-y-8">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#262933]">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#4EFE32]">
                DLORENZ CMS Control Panel
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                {activeTab === 'general' && 'General Settings & Identity'}
                {activeTab === 'projects' && 'Interactive Bento Gallery Studio'}
                {activeTab === 'partners' && 'Enterprise Partner Logos Marquee'}
                {activeTab === 'team' && 'Executive Leadership Profiles'}
                {activeTab === 'media' && 'ImageKit Cloud CDN & Media Assets'}
                {activeTab === 'inquiries' && 'Client Consultation Inbox & CRM'}
                {activeTab === 'activity' && 'Executive Audit Trail & System Logs'}
                {activeTab === 'appearance' && 'Visual Styling & Brand Theme'}
              </h2>
            </div>

            {/* Save & Action Buttons */}
            <div className="flex items-center gap-3">
              {saveSuccessMessage && (
                <span className="text-xs text-[#4EFE32] font-bold flex items-center gap-1.5 bg-[#4EFE32]/10 border border-[#4EFE32]/30 px-3 py-1.5 rounded-lg animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {saveSuccessMessage}
                </span>
              )}
              {isDirty && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-3 py-2 rounded-lg bg-[#16181D] border border-[#262933] text-xs font-bold uppercase text-[#A0A6B2] hover:text-white transition-colors cursor-pointer"
                >
                  Discard
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(78,254,50,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* TAB 1: GENERAL SETTINGS & IDENTITY                                  */}
          {/* =================================================================== */}
          {activeTab === 'general' && (
            <div className="space-y-8">
              {/* Brand Identity Card */}
              <div className="bg-[#16181D] border border-[#262933] rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4EFE32]" />
                  <span>Brand Identity & Headlines</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      value={siteConfig.siteName}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, siteName: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Corporate Tagline
                    </label>
                    <input
                      type="text"
                      value={siteConfig.tagline}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, tagline: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                    Hero Section Primary Headline
                  </label>
                  <input
                    type="text"
                    value={siteConfig.heroHeadline}
                    onChange={(e) => {
                      setSiteConfig({ ...siteConfig, heroHeadline: e.target.value });
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                    Hero Section Subheadline
                  </label>
                  <textarea
                    rows={2}
                    value={siteConfig.heroSubheadline}
                    onChange={(e) => {
                      setSiteConfig({ ...siteConfig, heroSubheadline: e.target.value });
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none resize-y"
                  />
                </div>
              </div>

              {/* Brand Logo Uploader */}
              <div className="bg-[#16181D] border border-[#262933] rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#4EFE32]" />
                  <span>Site Logo & Brand Monogram</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Logo Monogram Text (e.g. DL)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={siteConfig.logoIconText || 'DL'}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, logoIconText: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Logo Display Style
                    </label>
                    <select
                      value={siteConfig.logoType || 'both'}
                      onChange={(e) => {
                        setSiteConfig({
                          ...siteConfig,
                          logoType: e.target.value as 'icon' | 'image' | 'both',
                        });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="both">Both (Image with Monogram fallback)</option>
                      <option value="image">Custom Logo Image Only</option>
                      <option value="icon">Monogram Icon Only</option>
                    </select>
                  </div>
                </div>

                <AssetImageLinkField
                  label="Header Brand Logo Image"
                  description="Upload your high-res transparent PNG/SVG or paste ImageKit CDN URL."
                  value={siteConfig.logoImage || ''}
                  onChange={(newUrl) => {
                    setSiteConfig((prev) => ({ ...prev, logoImage: newUrl }));
                    markDirty();
                  }}
                  onUpload={(file) => uploadAssetFile(file, 'logo')}
                  imageKitConfigured={imageKitStatus?.configured}
                  folder="/dlorenz/brand"
                  recommendedSize="320x80 Transparent PNG/SVG"
                  aspectRatio="wide"
                />
              </div>

              {/* About Showcase Image */}
              <div className="bg-[#16181D] border border-[#262933] rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
                  <span>About Us Feature Visual & Headline</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                    About Section Headline
                  </label>
                  <input
                    type="text"
                    value={siteConfig.aboutHeadline || 'Architecting Market Dominance'}
                    onChange={(e) => {
                      setSiteConfig({ ...siteConfig, aboutHeadline: e.target.value });
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                  />
                </div>

                <AssetImageLinkField
                  label="About Us Corporate Headquarters / Feature Image"
                  description="Main architectural or corporate team visual in the About section."
                  value={siteConfig.aboutImage || ''}
                  onChange={(newUrl) => {
                    setSiteConfig((prev) => ({ ...prev, aboutImage: newUrl }));
                    markDirty();
                  }}
                  onUpload={(file) => uploadAssetFile(file, 'about')}
                  imageKitConfigured={imageKitStatus?.configured}
                  folder="/dlorenz/brand"
                  recommendedSize="1200x800 JPG/WebP"
                  aspectRatio="landscape"
                />
              </div>

              {/* Contact Information */}
              <div className="bg-[#16181D] border border-[#262933] rounded-2xl p-6 space-y-6">
                <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#4EFE32]" />
                  <span>Contact Information & Coordinates</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Primary Phone
                    </label>
                    <input
                      type="text"
                      value={siteConfig.primaryPhone}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, primaryPhone: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Secondary Hotline
                    </label>
                    <input
                      type="text"
                      value={siteConfig.secondaryPhone}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, secondaryPhone: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={siteConfig.email}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, email: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                      Office Address
                    </label>
                    <input
                      type="text"
                      value={siteConfig.officeAddress}
                      onChange={(e) => {
                        setSiteConfig({ ...siteConfig, officeAddress: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: INTERACTIVE BENTO GALLERY STUDIO                             */}
          {/* =================================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262933]">
                <div>
                  <div className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                    <span>Interactive Bento Gallery Studio</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#4EFE32]/10 border border-[#4EFE32]/30 text-[10px] text-[#4EFE32] font-mono">
                      {bentoGallery.length} Showcase Tiles
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A0A6B2] mt-0.5">
                    Configure high-resolution media cards, MP4 video streams, drag-and-drop bento spans, and lightbox details.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetBentoDemo}
                    title="Reset to default demo cards and video reels"
                    className="px-3 py-2 rounded-lg bg-[#16181D] hover:bg-[#262933] border border-[#262933] text-[11px] font-bold uppercase tracking-wider text-[#A0A6B2] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Reset Demo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddBentoItem}
                    className="px-3.5 py-2 rounded-lg bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(78,254,50,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Media Card</span>
                  </button>
                </div>
              </div>

              {/* Gallery Page Section Header Configuration */}
              <div className="bg-[#16181D] border border-[#262933] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-[#4EFE32] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Portfolio Page Hero Headline & Subtitle</span>
                  </h3>
                  <span className="text-[10px] text-[#A0A6B2] font-mono">Live On /gallery</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1">
                      Portfolio Headline Title
                    </label>
                    <input
                      type="text"
                      value={galleryConfig.title}
                      onChange={(e) => {
                        setGalleryConfig({ ...galleryConfig, title: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1">
                      Portfolio Intro Description
                    </label>
                    <input
                      type="text"
                      value={galleryConfig.description}
                      onChange={(e) => {
                        setGalleryConfig({ ...galleryConfig, description: e.target.value });
                        markDirty();
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bento Card Selector Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#A0A6B2]">
                  <span className="uppercase font-bold tracking-wider">Select Card to Edit:</span>
                  <span className="font-mono text-[11px]">
                    Drag cards on the frontend to reorder in real time
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {bentoGallery.map((item, idx) => {
                    const isSelected = selectedBentoId === item.id;
                    const isVideo = item.type === 'video';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBentoId(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#4EFE32] text-[#121212] shadow-md font-black'
                            : 'bg-[#16181D] border border-[#262933] text-[#A0A6B2] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1 font-mono">
                          {isVideo ? (
                            <Video className="w-3 h-3 text-[#00C2CB]" />
                          ) : (
                            <ImageIcon className="w-3 h-3 opacity-70" />
                          )}
                          <span>#{idx + 1}</span>
                        </span>
                        <span className="truncate max-w-[110px]">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Bento Card Editor */}
              {selectedBentoItem && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 bg-[#16181D]/90 p-6 rounded-2xl border border-[#262933]">
                  {/* Form Left Column */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#262933] pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-[#00C2CB] tracking-wider font-mono">
                          Editing Bento Card #{bentoGallery.findIndex((p) => p.id === selectedBentoItem.id) + 1} of{' '}
                          {bentoGallery.length}
                        </span>
                        {selectedBentoItem.type === 'video' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#00C2CB]/15 text-[#00C2CB] border border-[#00C2CB]/30">
                            Video Reel
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#4EFE32]/15 text-[#4EFE32] border border-[#4EFE32]/30">
                            Photo Asset
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Move earlier in grid"
                          onClick={() => handleMoveBentoItem(selectedBentoItem.id, 'up')}
                          className="p-1.5 rounded bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-[#A0A6B2] hover:text-white cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Move later in grid"
                          onClick={() => handleMoveBentoItem(selectedBentoItem.id, 'down')}
                          className="p-1.5 rounded bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-[#A0A6B2] hover:text-white cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Duplicate Card"
                          onClick={() => handleDuplicateBentoItem(selectedBentoItem.id)}
                          className="px-2.5 py-1 rounded bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-xs text-white font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#4EFE32]" />
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                        {bentoGallery.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${selectedBentoItem.title}"?`)) {
                                handleDeleteBentoItem(selectedBentoItem.id);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#FF4444]/10 hover:bg-[#FF4444]/20 border border-[#FF4444]/30 text-[#FF6666] text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Media Type Switcher */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                        Media Format
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setBentoGallery((prev) =>
                              prev.map((item) =>
                                item.id === selectedBentoItem.id
                                  ? { ...item, type: 'image' }
                                  : item
                              )
                            );
                            markDirty();
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            selectedBentoItem.type === 'image'
                              ? 'border-[#4EFE32] bg-[#4EFE32]/10 text-white shadow-sm'
                              : 'border-[#262933] bg-[#111216] text-[#A0A6B2] hover:border-[#4EFE32]/50'
                          }`}
                        >
                          <ImageIcon className="w-4 h-4 text-[#4EFE32]" />
                          <span>Image (WebP / JPG / PNG)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setBentoGallery((prev) =>
                              prev.map((item) =>
                                item.id === selectedBentoItem.id
                                  ? { ...item, type: 'video' }
                                  : item
                              )
                            );
                            markDirty();
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            selectedBentoItem.type === 'video'
                              ? 'border-[#00C2CB] bg-[#00C2CB]/10 text-white shadow-sm'
                              : 'border-[#262933] bg-[#111216] text-[#A0A6B2] hover:border-[#00C2CB]/50'
                          }`}
                        >
                          <Video className="w-4 h-4 text-[#00C2CB]" />
                          <span>Video Reel (MP4 / WebM)</span>
                        </button>
                      </div>
                    </div>

                    {/* Title Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase text-[#A0A6B2]">
                          Showcase Title / Headline
                        </label>
                        <span className="text-[10px] text-[#A0A6B2] font-mono">
                          {selectedBentoItem.title.length} characters
                        </span>
                      </div>
                      <input
                        type="text"
                        value={selectedBentoItem.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBentoGallery((prev) =>
                            prev.map((item) =>
                              item.id === selectedBentoItem.id ? { ...item, title: val } : item
                            )
                          );
                          markDirty();
                        }}
                        placeholder="e.g. Guinness Street Storm Activation"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase text-[#A0A6B2]">
                          Narrative Caption & Lightbox Details
                        </label>
                        <span className="text-[10px] text-[#A0A6B2] font-mono">
                          {selectedBentoItem.desc?.length || 0} characters
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={selectedBentoItem.desc || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBentoGallery((prev) =>
                            prev.map((item) =>
                              item.id === selectedBentoItem.id ? { ...item, desc: val } : item
                            )
                          );
                          markDirty();
                        }}
                        placeholder="Provide deep context, attendance stats, field metrics, or campaign insights..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none resize-y"
                      />
                    </div>

                    {/* Bento Layout Span Presets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase text-[#A0A6B2] flex items-center gap-1.5">
                          <Grid className="w-3.5 h-3.5 text-[#4EFE32]" />
                          <span>Bento Grid Span / Layout Variant</span>
                        </label>
                        <span className="text-[10px] text-[#A0A6B2] font-mono">
                          Active: {selectedBentoItem.span}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BENTO_SPAN_PRESETS.map((preset) => {
                          const isCurrent = selectedBentoItem.span === preset.spanClass;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                setBentoGallery((prev) =>
                                  prev.map((item) =>
                                    item.id === selectedBentoItem.id
                                      ? { ...item, span: preset.spanClass }
                                      : item
                                  )
                                );
                                markDirty();
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isCurrent
                                  ? 'border-[#4EFE32] bg-[#4EFE32]/10 text-white'
                                  : 'border-[#262933] bg-[#111216] text-[#A0A6B2] hover:border-white/40 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase">{preset.label}</span>
                                {isCurrent && <Check className="w-3 h-3 text-[#4EFE32]" />}
                              </div>
                              <div className="text-[10px] opacity-70 mt-0.5 font-mono">
                                {preset.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom CSS Span Class */}
                      <div className="pt-1">
                        <label className="block text-[10px] uppercase font-bold text-[#A0A6B2] mb-1">
                          Custom Tailwind Span Class (e.g. md:col-span-2 md:row-span-2)
                        </label>
                        <input
                          type="text"
                          value={selectedBentoItem.span}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBentoGallery((prev) =>
                              prev.map((item) =>
                                item.id === selectedBentoItem.id ? { ...item, span: val } : item
                              )
                            );
                            markDirty();
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-xs font-mono text-white outline-none"
                        />
                      </div>
                    </div>

                    {/* Tagging / Category Tags */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#00C2CB]" />
                        <span>Category Badges & Search Tags (Comma-Separated)</span>
                      </label>
                      <input
                        type="text"
                        value={selectedBentoItem.tags?.join(', ') || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const tagsArray = val
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                          setBentoGallery((prev) =>
                            prev.map((item) =>
                              item.id === selectedBentoItem.id ? { ...item, tags: tagsArray } : item
                            )
                          );
                          markDirty();
                        }}
                        placeholder="e.g. Activation, Retail Sampling, Lagos, FMCG"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                      />

                      {/* Quick Tag Suggestions */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-[#A0A6B2] uppercase">Quick Add:</span>
                        {[
                          'Street Activation',
                          'Retail Sampling',
                          'Field Execution',
                          'Real Estate Audit',
                          'Studio Photography',
                          'VIP Launch',
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              const currentTags = selectedBentoItem.tags || [];
                              if (!currentTags.includes(suggestion)) {
                                const newTags = [...currentTags, suggestion];
                                setBentoGallery((prev) =>
                                  prev.map((item) =>
                                    item.id === selectedBentoItem.id
                                      ? { ...item, tags: newTags }
                                      : item
                                  )
                                );
                                markDirty();
                              }
                            }}
                            className="px-2 py-0.5 rounded text-[10px] bg-[#262933] hover:bg-[#4EFE32] hover:text-[#121212] text-[#A0A6B2] transition-colors cursor-pointer font-mono"
                          >
                            +{suggestion}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Media Direct Link & ImageKit Uploader */}
                    <AssetImageLinkField
                      label={
                        selectedBentoItem.type === 'video'
                          ? 'Video Stream Asset URL (MP4 / WebM)'
                          : 'High-Definition Showcase Image URL'
                      }
                      description={
                        selectedBentoItem.type === 'video'
                          ? 'Direct MP4/WebM video stream URL. You can upload video files or paste CDN links.'
                          : 'High-resolution photo link or upload to ImageKit CDN /dlorenz/projects.'
                      }
                      value={selectedBentoItem.url}
                      onChange={(newUrl) => {
                        const isVideo =
                          newUrl.endsWith('.mp4') ||
                          newUrl.endsWith('.webm') ||
                          newUrl.includes('/video/');
                        setBentoGallery((prev) =>
                          prev.map((item) =>
                            item.id === selectedBentoItem.id
                              ? {
                                  ...item,
                                  url: newUrl,
                                  type: isVideo ? 'video' : item.type,
                                }
                              : item
                          )
                        );
                        markDirty();
                      }}
                      onUpload={(file) => uploadAssetFile(file, 'bento')}
                      imageKitConfigured={imageKitStatus?.configured}
                      folder="/dlorenz/projects"
                      recommendedSize={
                        selectedBentoItem.type === 'video'
                          ? '1080p MP4 H.264 Video'
                          : '1200x800 High-Res JPG/WebP'
                      }
                      aspectRatio="landscape"
                      mediaType={selectedBentoItem.type === 'video' ? 'video' : 'image'}
                      placeholder={
                        selectedBentoItem.type === 'video'
                          ? 'https://.../video.mp4'
                          : 'https://images.unsplash.com/... or https://ik.imagekit.io/...'
                      }
                    />

                    {/* Field Validation Alert */}
                    {!selectedBentoItem.url && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Please provide a valid media URL or upload a file for this tile.</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Live Card & Canvas Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-[#A0A6B2] flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#4EFE32]" />
                        <span>Live Bento Card Preview</span>
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#262933] text-white font-mono">
                        {selectedBentoItem.span.replace(/md:/g, '')}
                      </span>
                    </div>

                    {/* Simulated Bento Card */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#111216] border border-[#262933] shadow-xl group">
                      {selectedBentoItem.url ? (
                        selectedBentoItem.type === 'video' ? (
                          <video
                            src={selectedBentoItem.url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src={selectedBentoItem.url}
                            alt={selectedBentoItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#505664] p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs font-bold uppercase">No Media Assigned</span>
                        </div>
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-[#111216]/40 to-transparent pointer-events-none" />

                      {/* Header Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111216]/80 backdrop-blur-md border border-[#262933] text-[10px] font-bold text-white uppercase">
                          {selectedBentoItem.type === 'video' ? (
                            <>
                              <Play className="w-2.5 h-2.5 text-[#00C2CB] fill-current" />
                              <span className="text-[#00C2CB]">Video Reel</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4EFE32]" />
                              <span>Photo Card</span>
                            </>
                          )}
                        </div>

                        {selectedBentoItem.tags && selectedBentoItem.tags.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#262933]/80 backdrop-blur-md text-[9px] text-[#A0A6B2] uppercase font-mono">
                            {selectedBentoItem.tags[0]}
                          </span>
                        )}
                      </div>

                      {/* Bottom Caption Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate">
                          {selectedBentoItem.title || 'Untitled Card'}
                        </h4>
                        <p className="text-[11px] text-[#A0A6B2] line-clamp-2 leading-relaxed">
                          {selectedBentoItem.desc || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Test Lightbox Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewLightboxItem(selectedBentoItem)}
                      className="w-full py-2.5 rounded-xl bg-[#16181D] hover:bg-[#262933] border border-[#262933] hover:border-[#4EFE32] text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#4EFE32]" />
                      <span>Test Fullscreen Lightbox</span>
                    </button>

                    {/* Information Guide */}
                    <div className="p-4 rounded-xl bg-[#111216] border border-[#262933] space-y-2 text-xs text-[#A0A6B2]">
                      <div className="text-white font-bold uppercase flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#00C2CB]" />
                        <span>Frontend Drag & Drop</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Cards on the client-facing page can be dragged and rearranged in real-time by users without breaking the responsive grid structure.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lightbox Simulator Modal */}
              {previewLightboxItem && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="relative max-w-4xl w-full bg-[#16181D] border border-[#262933] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-[#262933] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#4EFE32]" />
                        <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                          Lightbox Simulator: {previewLightboxItem.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewLightboxItem(null)}
                        className="p-1.5 rounded-lg bg-[#262933] hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Media Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                      <div className="relative rounded-2xl overflow-hidden bg-[#111216] border border-[#262933] aspect-video flex items-center justify-center">
                        {previewLightboxItem.type === 'video' ? (
                          <video
                            src={previewLightboxItem.url}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={previewLightboxItem.url}
                            alt={previewLightboxItem.title}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#4EFE32]/15 border border-[#4EFE32]/30 text-xs font-bold text-[#4EFE32] uppercase">
                            {previewLightboxItem.type === 'video' ? 'Video Showcase' : 'High-Res Asset'}
                          </span>
                          {previewLightboxItem.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-[#262933] text-xs text-[#A0A6B2] font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-xl font-bold uppercase text-white">
                          {previewLightboxItem.title}
                        </h2>
                        <p className="text-sm text-[#A0A6B2] leading-relaxed">
                          {previewLightboxItem.desc || 'No extended description entered.'}
                        </p>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t border-[#262933] flex justify-end bg-[#111216]">
                      <button
                        type="button"
                        onClick={() => setPreviewLightboxItem(null)}
                        className="px-4 py-2 rounded-xl bg-[#262933] hover:bg-[#4EFE32] hover:text-black text-xs font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
                      >
                        Close Simulator
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: ENTERPRISE PARTNER LOGOS MARQUEE                             */}
          {/* =================================================================== */}
          {activeTab === 'partners' && (
            <div className="space-y-8">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262933]">
                <div>
                  <div className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                    <span>Corporate Client & Partner Badges</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#4EFE32]/10 border border-[#4EFE32]/30 text-[10px] text-[#4EFE32]">
                      {partners.length} Partner Badges
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A0A6B2] mt-0.5">
                    Upload white monochrome client logos to showcase across the infinite animated marquee scroller.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="px-3.5 py-2 rounded-lg bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(78,254,50,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Partner Logo</span>
                </button>
              </div>

              {/* Partner Logo Pills */}
              <div className="flex flex-wrap gap-2">
                {partners.map((partner, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPartnerIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedPartnerIndex === idx
                        ? 'bg-[#4EFE32] text-[#121212] shadow-md font-black'
                        : 'bg-[#16181D] border border-[#262933] text-[#A0A6B2] hover:text-white'
                    }`}
                  >
                    <span>Logo {idx + 1}:</span>
                    <span className="truncate max-w-[120px]">{partner.name}</span>
                  </button>
                ))}
              </div>

              {/* Selected Partner Editor */}
              {selectedPartner && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 bg-[#16181D]/80 p-6 rounded-2xl border border-[#262933]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#00C2CB] tracking-wider font-mono">
                        Editing Partner #{selectedPartnerIndex + 1} of {partners.length}
                      </span>

                      {partners.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${selectedPartner.name}"?`)) {
                              handleDeletePartner(selectedPartnerIndex);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#FF4444]/10 hover:bg-[#FF4444]/20 border border-[#FF4444]/30 text-[#FF6666] text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Logo</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                        Brand / Enterprise Name
                      </label>
                      <input
                        type="text"
                        value={selectedPartner.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPartners((prev) =>
                            prev.map((p, idx) =>
                              idx === selectedPartnerIndex ? { ...p, name: val } : p
                            )
                          );
                          markDirty();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                      />
                    </div>

                    <AssetImageLinkField
                      label="Partner Logo Visual (Transparent PNG / SVG)"
                      description="High-contrast white or light monochrome logo recommended for dark theme scroller."
                      value={selectedPartner.src || ''}
                      onChange={(newUrl) => {
                        setPartners((prev) =>
                          prev.map((p, idx) =>
                            idx === selectedPartnerIndex
                              ? { ...p, src: newUrl, svgIcon: undefined }
                              : p
                          )
                        );
                        markDirty();
                      }}
                      onUpload={(file) => uploadAssetFile(file, 'partner')}
                      imageKitConfigured={imageKitStatus?.configured}
                      folder="/dlorenz/partners"
                      recommendedSize="240x80 Transparent Monochrome PNG"
                      aspectRatio="wide"
                    />
                  </div>

                  {/* Partner Marquee Preview */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2]">
                      Marquee Tile Preview
                    </label>
                    <div className="relative aspect-video rounded-xl bg-[#111216] border border-[#262933] p-4 flex items-center justify-center shadow-inner">
                      {selectedPartner.src ? (
                        <img
                          src={selectedPartner.src}
                          alt={selectedPartner.name}
                          className="max-h-12 max-w-[160px] object-contain filter brightness-125"
                        />
                      ) : (
                        <span className="text-xs font-bold uppercase text-neutral-400">
                          {selectedPartner.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: EXECUTIVE LEADERSHIP PROFILES                                */}
          {/* =================================================================== */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262933]">
                <div>
                  <div className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                    <span>Executive Leadership Profiles</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#4EFE32]/10 border border-[#4EFE32]/30 text-[10px] text-[#4EFE32]">
                      {team.length} Leaders
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A0A6B2] mt-0.5">
                    Update executive titles, credentials, direct advisory scopes, and high-resolution portraits.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3.5 py-2 rounded-lg bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(78,254,50,0.3)] active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Leader</span>
                </button>
              </div>

              {/* Team Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {team.map((member, idx) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedMemberId(member.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedMemberId === member.id
                        ? 'bg-[#4EFE32] text-[#121212] shadow-md font-black'
                        : 'bg-[#16181D] border border-[#262933] text-[#A0A6B2] hover:text-white'
                    }`}
                  >
                    <span>Leader {idx + 1}:</span>
                    <span className="truncate max-w-[120px]">{member.name}</span>
                  </button>
                ))}
              </div>

              {/* Selected Member Editor */}
              {selectedMember && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 bg-[#16181D]/80 p-6 rounded-2xl border border-[#262933]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#00C2CB] tracking-wider font-mono">
                        Editing Leader #{team.findIndex((m) => m.id === selectedMember.id) + 1} of{' '}
                        {team.length}
                      </span>

                      {team.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete profile for "${selectedMember.name}"?`)) {
                              handleDeleteMember(selectedMember.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-[#FF4444]/10 hover:bg-[#FF4444]/20 border border-[#FF4444]/30 text-[#FF6666] text-xs font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Profile</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={selectedMember.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeam((prev) =>
                              prev.map((m) => (m.id === selectedMember.id ? { ...m, name: val } : m))
                            );
                            markDirty();
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                          Executive Role
                        </label>
                        <input
                          type="text"
                          value={selectedMember.role}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeam((prev) =>
                              prev.map((m) => (m.id === selectedMember.id ? { ...m, role: val } : m))
                            );
                            markDirty();
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                          Division
                        </label>
                        <input
                          type="text"
                          value={selectedMember.division}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeam((prev) =>
                              prev.map((m) =>
                                m.id === selectedMember.id ? { ...m, division: val } : m
                              )
                            );
                            markDirty();
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                          Badge Title (e.g. Founder & Managing Director)
                        </label>
                        <input
                          type="text"
                          value={selectedMember.badge || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTeam((prev) =>
                              prev.map((m) =>
                                m.id === selectedMember.id ? { ...m, badge: val } : m
                              )
                            );
                            markDirty();
                          }}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#A0A6B2] mb-1.5">
                        Executive Bio
                      </label>
                      <textarea
                        rows={3}
                        value={selectedMember.bio}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTeam((prev) =>
                            prev.map((m) => (m.id === selectedMember.id ? { ...m, bio: val } : m))
                          );
                          markDirty();
                        }}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#111216] border border-[#262933] focus:border-[#4EFE32] text-sm text-white outline-none resize-y"
                      />
                    </div>

                    <AssetImageLinkField
                      label="Executive Portrait Photo"
                      description="High-resolution headshot or portrait link (JPG/PNG/WebP)."
                      value={selectedMember.image}
                      onChange={(newUrl) => {
                        setTeam((prev) =>
                          prev.map((m) =>
                            m.id === selectedMember.id ? { ...m, image: newUrl } : m
                          )
                        );
                        markDirty();
                      }}
                      onUpload={(file) => uploadAssetFile(file, 'team')}
                      imageKitConfigured={imageKitStatus?.configured}
                      folder="/dlorenz/team"
                      recommendedSize="800x1000 High-Res Portrait"
                      aspectRatio="portrait"
                    />
                  </div>

                  {/* Leader Card Preview */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-[#A0A6B2]">
                      Live Profile Preview
                    </label>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111216] border border-[#262933] shadow-md group">
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-[10px] font-bold text-[#4EFE32] uppercase">
                          {selectedMember.role}
                        </div>
                        <div className="text-sm font-bold text-white uppercase truncate">
                          {selectedMember.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: IMAGEKIT CLOUD CDN & MEDIA ASSETS                            */}
          {/* =================================================================== */}
          {activeTab === 'media' && (
            <ImageKitMediaTab
              imageKitStatus={imageKitStatus}
              onStatusUpdated={() => {
                fetch('/api/imagekit/status')
                  .then((res) => (res.ok ? res.json() : null))
                  .then((data) => {
                    if (data) setImageKitStatus(data);
                  });
              }}
              onApplyAssetUrl={handleApplyAssetUrl}
            />
          )}

          {/* =================================================================== */}
          {/* TAB 6: INQUIRIES & LEADS CRM                                        */}
          {/* =================================================================== */}
          {activeTab === 'inquiries' && <InquiriesTab />}

          {/* =================================================================== */}
          {/* TAB 7: AUDIT TRAIL & SYSTEM LOGS                                    */}
          {/* =================================================================== */}
          {activeTab === 'activity' && <ActivityLogsTab />}

          {/* =================================================================== */}
          {/* TAB 8: APPEARANCE & THEMES                                          */}
          {/* =================================================================== */}
          {activeTab === 'appearance' && (
            <div className="space-y-8 bg-[#16181D] border border-[#262933] rounded-2xl p-6">
              <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#4EFE32]" />
                <span>Visual Theme & Styling Controls</span>
              </h3>

              {/* Theme Mode Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 pb-6 border-b border-[#262933]">
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">Color Mode</h4>
                  <p className="text-xs text-[#A0A6B2] mt-1 leading-relaxed">
                    Toggle high-contrast premium dark slate or clean bright daylight mode.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAppearance({ ...appearance, theme: 'dark' });
                      markDirty();
                    }}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      appearance.theme === 'dark'
                        ? 'border-[#4EFE32] bg-[#4EFE32]/10 text-white'
                        : 'border-[#262933] bg-[#111216] text-[#A0A6B2] hover:border-white/30'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-[#4EFE32]" />
                    <span className="text-xs font-bold uppercase">Executive Dark Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAppearance({ ...appearance, theme: 'light' });
                      markDirty();
                    }}
                    className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      appearance.theme === 'light'
                        ? 'border-[#4EFE32] bg-[#4EFE32]/10 text-white'
                        : 'border-[#262933] bg-[#111216] text-[#A0A6B2] hover:border-white/30'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase">Daylight Mode</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Tokens */}
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 pb-6">
                <div>
                  <h4 className="text-sm font-bold uppercase text-white">Accent Swatch</h4>
                  <p className="text-xs text-[#A0A6B2] mt-1 leading-relaxed">
                    Primary glowing neon token for buttons, active badges, and highlights.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Electric Lime', hex: '#4EFE32' },
                    { name: 'Cyber Cyan', hex: '#00C2CB' },
                    { name: 'Gold Amber', hex: '#EAD9B4' },
                    { name: 'Royal Purple', hex: '#7F56D9' },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        setAppearance({ ...appearance, accentColor: color.hex });
                        markDirty();
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        appearance.accentColor === color.hex
                          ? 'border-white bg-[#16181D] shadow-md'
                          : 'border-[#262933] bg-[#111216] hover:border-white/50'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs font-bold uppercase text-white">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Save Footer Bar */}
        {isDirty && (
          <div className="sticky bottom-0 left-0 right-0 p-4 sm:px-10 bg-[#16181D] border-t border-[#262933] shadow-[0_-8px_30px_rgba(0,0,0,0.8)] z-30 flex items-center justify-between animate-fade-in font-condensed">
            <div className="flex items-center gap-2 text-xs font-bold text-[#EAD9B4]">
              <span className="w-2 h-2 rounded-full bg-[#EAD9B4] animate-pulse" />
              <span>Unsaved changes detected. Click Save Changes to apply to your live site.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 rounded-lg bg-[#111216] border border-[#262933] text-xs font-bold uppercase text-[#A0A6B2] hover:text-white transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-black text-xs uppercase tracking-wider transition-all shadow-[0_2px_12px_rgba(78,254,50,0.3)] active:scale-95 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Admin Authentication Gate Modal */}
      {(showLoginModal || (!adminUser && !isCheckingAuth)) && (
        <AdminLoginModal
          onSuccess={(user) => {
            setAdminUser(user);
            setShowLoginModal(false);
          }}
          onCancel={onExit}
        />
      )}
    </div>
  );
};
