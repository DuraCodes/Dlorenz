import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  Archive,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { InquiryItem, apiGetInquiries, apiUpdateInquiryStatus, apiDeleteInquiry } from '../../lib/api';

export const InquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    new: 0,
    inReview: 0,
    resolved: 0,
    archived: 0,
    consultationsCount: 0,
    contactsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await apiGetInquiries({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery,
      });
      if (data) {
        setInquiries(data.inquiries || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'in_review' | 'resolved' | 'archived') => {
    setUpdatingId(id);
    const res = await apiUpdateInquiryStatus(id, newStatus, internalNotes || undefined);
    setUpdatingId(null);

    if (res.success && res.inquiry) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? res.inquiry! : i)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(res.inquiry);
      }
      setActionSuccess(`Inquiry status updated to "${newStatus.replace('_', ' ')}"`);
      setTimeout(() => setActionSuccess(null), 3000);
      fetchLeads();
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the inquiry from ${name}?`)) return;

    const res = await apiDeleteInquiry(id);
    if (res.success) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      setActionSuccess('Inquiry deleted successfully');
      setTimeout(() => setActionSuccess(null), 3000);
      fetchLeads();
    } else {
      alert(res.error || 'Failed to delete inquiry');
    }
  };

  const exportToCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Company', 'Service/Scope', 'Budget', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      new Date(i.createdAt).toLocaleString(),
      i.type,
      i.status,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.serviceInterest || (i.projectTypes || []).join(', ')).replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DLorenz_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-[#4EFE32] border border-emerald-500/30">New Lead</span>;
      case 'in_review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">In Review</span>;
      case 'resolved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">Resolved</span>;
      case 'archived':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-800 text-neutral-400 border border-neutral-700">Archived</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 font-condensed">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262933]">
        <div>
          <h3 className="text-base font-bold uppercase text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#4EFE32]" />
            <span>Client Consultation & Inquiries CRM</span>
          </h3>
          <p className="text-xs text-[#A0A6B2] mt-0.5">
            Real-time verified leads and consultation submissions stored in the backend database.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-3 py-1.5 rounded-lg bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-xs font-bold uppercase text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#4EFE32]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchLeads}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-[#111216] border border-[#262933] hover:border-[#4EFE32] text-xs font-bold uppercase text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#4EFE32] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#16181D] border border-[#262933]">
          <p className="text-[10px] text-[#A0A6B2] uppercase font-bold tracking-wider">Total Received</p>
          <p className="text-2xl font-black text-white mt-1">{stats.total || inquiries.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#16181D] border border-emerald-900/40">
          <p className="text-[10px] text-[#4EFE32] uppercase font-bold tracking-wider">New Actionable</p>
          <p className="text-2xl font-black text-[#4EFE32] mt-1">{stats.new || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#16181D] border border-amber-900/40">
          <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">In Review</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{stats.inReview || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#16181D] border border-blue-900/40">
          <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Resolved</p>
          <p className="text-2xl font-black text-blue-400 mt-1">{stats.resolved || 0}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#16181D] p-3 rounded-2xl border border-[#262933]">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Leads' },
            { id: 'new', label: 'New' },
            { id: 'in_review', label: 'In Review' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'archived', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#4EFE32] text-black shadow-sm'
                  : 'bg-[#111216] text-[#A0A6B2] hover:text-white border border-transparent hover:border-[#262933]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#111216] border border-[#262933] rounded-xl text-white placeholder-[#505664] focus:outline-none focus:border-[#4EFE32]"
          />
        </form>
      </div>

      {/* Action Notification Toast */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[#4EFE32] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Inquiry List */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#4EFE32]" />
          <p className="text-xs text-[#A0A6B2] uppercase font-bold">Querying backend database...</p>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              onClick={() => {
                setSelectedInquiry(inq);
                setInternalNotes(inq.notes || '');
              }}
              className="p-5 rounded-2xl bg-[#16181D] border border-[#262933] hover:border-[#4EFE32]/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      inq.status === 'new'
                        ? 'bg-[#4EFE32] animate-pulse'
                        : inq.status === 'in_review'
                        ? 'bg-amber-400'
                        : inq.status === 'resolved'
                        ? 'bg-blue-400'
                        : 'bg-neutral-600'
                    }`}
                  />
                  <h4 className="text-sm font-bold text-white uppercase group-hover:text-[#4EFE32] transition-colors">
                    {inq.name}
                  </h4>
                  {inq.company && (
                    <span className="text-xs text-[#A0A6B2]">({inq.company})</span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#111216] border border-[#262933] text-[#A0A6B2] uppercase font-mono">
                    {inq.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(inq.status)}
                  <span className="text-[10px] text-[#A0A6B2] font-mono">
                    {new Date(inq.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#A0A6B2] pt-2 border-t border-[#262933]/50">
                <div>
                  <span className="text-[#505664] uppercase block text-[10px]">Service / Scope:</span>
                  <span className="text-white font-bold truncate block">
                    {inq.serviceInterest || (inq.projectTypes || []).join(', ') || 'Strategic Briefing'}
                  </span>
                </div>
                <div>
                  <span className="text-[#505664] uppercase block text-[10px]">Contact Info:</span>
                  <span className="text-white truncate block">
                    {inq.email} {inq.phone ? `• ${inq.phone}` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[#505664] uppercase block text-[10px]">Budget Scope:</span>
                  <span className="text-[#4EFE32] font-bold">
                    {inq.budget || 'Standard Engagement'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 line-clamp-2 bg-[#111216]/60 p-2.5 rounded-xl border border-[#262933]/40">
                "{inq.message}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-[#262933] rounded-2xl p-6">
          <Mail className="w-8 h-8 text-[#505664]" />
          <p className="text-xs text-white font-bold uppercase">No Inquiries Found</p>
          <p className="text-[11px] text-[#A0A6B2]">
            New submissions from the Homepage contact form and Consultation Modal will appear here automatically.
          </p>
        </div>
      )}

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#262933]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedInquiry.status)}
                  <span className="text-xs text-[#A0A6B2] font-mono">
                    ID: {selectedInquiry.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  {selectedInquiry.name}
                </h3>
                {selectedInquiry.company && (
                  <p className="text-xs text-[#4EFE32] font-bold">{selectedInquiry.company}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl bg-[#111216] border border-[#262933] text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111216] p-4 rounded-2xl border border-[#262933]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4EFE32]" />
                <div>
                  <span className="text-[10px] text-[#505664] uppercase block">Email Address</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-xs text-white hover:underline font-bold">
                    {selectedInquiry.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#4EFE32]" />
                <div>
                  <span className="text-[10px] text-[#505664] uppercase block">Phone Number</span>
                  <span className="text-xs text-white font-bold">
                    {selectedInquiry.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[#4EFE32]" />
                <div>
                  <span className="text-[10px] text-[#505664] uppercase block">Target Service</span>
                  <span className="text-xs text-white font-bold">
                    {selectedInquiry.serviceInterest || (selectedInquiry.projectTypes || []).join(', ') || 'Consultation'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#4EFE32]" />
                <div>
                  <span className="text-[10px] text-[#505664] uppercase block">Submission Date</span>
                  <span className="text-xs text-white font-bold">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Message */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#A0A6B2]">
                Detailed Project Scope / Objectives
              </label>
              <div className="p-4 rounded-2xl bg-[#111216] border border-[#262933] text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Workflow Controls */}
            <div className="space-y-3 pt-2 border-t border-[#262933]">
              <label className="text-xs font-bold uppercase text-[#A0A6B2]">
                Update Status Workflow
              </label>
              <div className="flex flex-wrap gap-2">
                {(['new', 'in_review', 'resolved', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={updatingId === selectedInquiry.id}
                    onClick={() => handleStatusChange(selectedInquiry.id, st)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      selectedInquiry.status === st
                        ? 'bg-[#4EFE32] text-black font-black'
                        : 'bg-[#111216] text-[#A0A6B2] hover:text-white border border-[#262933]'
                    }`}
                  >
                    Set as {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete Lead */}
            <div className="flex items-center justify-between pt-4 border-t border-[#262933]">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 text-xs font-bold uppercase flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-6 py-2 rounded-xl bg-[#262933] hover:bg-[#323642] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
