import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Building, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { ConsultationForm } from '../types';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import { apiSubmitInquiry } from '../lib/api';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<ConsultationForm>({
    name: '',
    email: '',
    company: '',
    serviceInterest: 'Enterprise Growth & Advisory',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await apiSubmitInquiry({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      serviceInterest: formData.serviceInterest,
      message: formData.message,
      type: 'consultation',
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.error || 'Failed to submit consultation request. Please try again.');
    }
  };

  return (
    <div
      id="consultation-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="consultation-modal-dialog"
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain p-5 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="close-consultation-modal-btn"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div id="consultation-success-view" className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Consultation Request Received</h3>
            <p className="text-sm text-neutral-300 max-w-sm mb-6">
              Thank you for reaching out to DLORENZ SOLUTIONS. A Senior Strategic Partner will contact you within 24 hours.
            </p>
            <LiquidMetalButton
              id="consultation-done-btn"
              variant="neon"
              size="default"
              label="Done"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
            />
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-8">
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">
                DLORENZ STRATEGIC ADVISORY
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Schedule a Consultation</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Accelerate your brand's growth trajectory with data-driven strategic solutions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Business Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Organization</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full pl-9 pr-3 py-2.5 text-base sm:text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Strategic Focus</label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full px-3 py-2.5 text-base sm:text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer"
                >
                  <option value="Enterprise Growth & Advisory">Enterprise Growth & Strategic Advisory</option>
                  <option value="Brand Acceleration & Market Positioning">Brand Acceleration & Market Positioning</option>
                  <option value="Global Market Expansion">Global Market Expansion & Scalability</option>
                  <option value="Results-Driven Commercialization">Results-Driven Commercialization</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Key Objectives</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your current targets and timelines..."
                  className="w-full px-3 py-2.5 text-base sm:text-sm bg-neutral-950 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400 resize-none transition-colors"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <LiquidMetalButton
                  type="submit"
                  id="submit-consultation-btn"
                  fullWidth
                  size="lg"
                  variant="neon"
                  disabled={isSubmitting}
                  label={isSubmitting ? 'Transmitting Brief...' : 'Submit Brief'}
                  icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#4EFE32]" /> : <Send className="w-4 h-4 text-[#4EFE32]" />}
                  iconPosition="right"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
