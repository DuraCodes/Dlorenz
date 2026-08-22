import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import { apiLogin, AdminUser } from '../../lib/api';

interface AdminLoginModalProps {
  onSuccess: (user: AdminUser) => void;
  onCancel: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@dlorenz.com');
  const [password, setPassword] = useState('DLorenz@2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await apiLogin(email, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setErrorMessage(res.error || 'Invalid administrator credentials. Please check and retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-condensed">
      <div className="w-full max-w-md bg-[#16181D] border border-[#262933] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-white">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#111216] border border-[#4EFE32]/40 text-[#4EFE32] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(78,254,50,0.15)]">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
            DLORENZ EXECUTIVE CMS
          </h2>
          <p className="text-xs text-[#A0A6B2]">
            Enter your credentials to access the production database & CMS controls.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#A0A6B2]">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#505664] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dlorenz.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#111216] border border-[#262933] rounded-xl text-white placeholder-[#505664] focus:outline-none focus:border-[#4EFE32]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-[#A0A6B2]">Master Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#505664] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#111216] border border-[#262933] rounded-xl text-white placeholder-[#505664] focus:outline-none focus:border-[#4EFE32]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-[#111216] border border-[#262933] text-xs font-bold uppercase text-[#A0A6B2] hover:text-white transition-colors cursor-pointer"
            >
              Back to Site
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] font-black text-xs uppercase tracking-wider transition-all shadow-[0_2px_12px_rgba(78,254,50,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#121212]" /> Authenticating...
                </>
              ) : (
                <>
                  Enter CMS <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-[#262933]">
          <p className="text-[11px] text-[#505664]">
            Default credentials seeded for instant executive access: <br />
            <code className="text-[#4EFE32] font-mono">admin@dlorenz.com</code> / <code className="text-[#4EFE32] font-mono">DLorenz@2026!</code>
          </p>
        </div>
      </div>
    </div>
  );
};
