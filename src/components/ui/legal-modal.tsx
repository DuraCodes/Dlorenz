import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from './dialog';
import { ShieldCheck, FileText, CheckCircle2, Lock, Scale, Building2 } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <Dialog open={!!type} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#16181D] border-[#262933] text-white p-6 sm:p-8 font-condensed rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-[#262933] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4EFE32] uppercase tracking-wider mb-1">
            {isPrivacy ? (
              <>
                <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
                <span>Client & Data Protection Policy</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 text-[#4EFE32]" />
                <span>Client Agreement & Engagement Scope</span>
              </>
            )}
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            {isPrivacy ? 'Privacy & Data Governance Policy' : 'Terms of Service & Commercial Engagement'}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#A0A6B2]">
            DLorenz Solutions Inc. • Effective Date: January 2026 • Governed under the Laws of Nigeria
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5 text-sm text-[#D1D5DB] leading-relaxed max-h-[60vh] pr-2">
          {isPrivacy ? (
            <>
              <div className="p-3.5 rounded-xl bg-[#111216] border border-[#262933]">
                <h4 className="text-xs font-bold uppercase text-[#4EFE32] flex items-center gap-1.5 mb-1">
                  <Lock className="w-3.5 h-3.5" /> 1. Commitment to Absolute Discretion
                </h4>
                <p className="text-xs text-[#A0A6B2]">
                  DLorenz Solutions treats all corporate campaign briefs, trade secrets, sales distribution routes, and real estate acquisition searches with rigorous non-disclosure protocols.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">2. Field & Event Data Collection</h4>
                <p className="text-xs text-[#A0A6B2]">
                  During nationwide brand activations, sampling tours, and supermarket demos, consumer sentiment and contact capture strictly adhere to the Nigeria Data Protection Act (NDPA). All opt-in participant information is encrypted and transmitted directly to the client's verified data silo.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">3. Real Estate Due Diligence & Title Security</h4>
                <p className="text-xs text-[#A0A6B2]">
                  Land coordinate data, surveyor charts, governor's consent filings, and private buyer identities are protected under strict fiduciary confidentiality. DLorenz never shares or monetizes investor acquisition pipelines with third parties.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">4. Commercial Media & Photography Rights</h4>
                <p className="text-xs text-[#A0A6B2]">
                  High-resolution photo shoots, drone survey footage, and video production assets commissioned by clients remain their exclusive intellectual property upon full project settlement.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-[#111216] border border-[#262933]">
                <h4 className="text-xs font-bold uppercase text-[#00C2CB] flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5" /> 1. Scope of Brand & Field Execution
                </h4>
                <p className="text-xs text-[#A0A6B2]">
                  DLorenz delivers end-to-end event production, brand ambassadors, DJ truck activations, and retail store sampling based on written milestone SLAs and agreed field metrics.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">2. Real Estate Advisory & Title Verification</h4>
                <p className="text-xs text-[#A0A6B2]">
                  DLorenz acts as a verified acquisition consultant and property auditor. Real estate title clearance involves formal searches at relevant state land registries (e.g., Lagos State Lands Bureau, Alausa). All land conveys with full legal indemnity.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">3. Cancellation, Force Majeure & Weather Clauses</h4>
                <p className="text-xs text-[#A0A6B2]">
                  Outdoor activations impacted by civil restrictions or extreme weather will be rescheduled to designated backup dates without forfeiture of core production materials.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase text-white">4. Jurisdiction & Dispute Resolution</h4>
                <p className="text-xs text-[#A0A6B2]">
                  These terms are governed exclusively by the laws of the Federal Republic of Nigeria. Any disputes arising shall first be submitted to good-faith mediation under the Lagos Multi-Door Courthouse (LMDC).
                </p>
              </div>
            </>
          )}
        </DialogBody>

        <div className="pt-4 border-t border-[#262933] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#4EFE32] font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Standard DLorenz Governance Framework</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[40px] px-5 py-2 rounded-xl bg-[#1A1C22] border border-[#262933] text-xs font-bold uppercase text-white hover:border-[#4EFE32] hover:text-[#4EFE32] transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
