import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, CheckCircle2, Send, Facebook, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { LiquidMetalButton } from './ui/liquid-metal-button';

const serviceOptions = [
  { id: 'magnetic-brand', label: 'Magnetic Brand Promotion' },
  { id: 'experiential-events', label: 'Experiential Activations & Events' },
  { id: 'zero-risk-realestate', label: 'Zero-Risk Real Estate Services' },
  { id: 'growth-briefing', label: 'Deep-Dive Briefing & Growth Audit' },
  { id: 'audience-intel', label: 'Audience & Competitor Intelligence' },
  { id: 'strategic-roadmap', label: 'Strategic ROI Roadmap' },
  { id: 'campaign-arch', label: 'Master Campaign Architecture' },
  { id: 'field-execution', label: 'Flawless Field Execution' },
];

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['magnetic-brand', 'zero-risk-realestate']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="dlorenz-contact-section"
      className="relative w-full min-h-[750px] lg:min-h-[850px] overflow-hidden flex items-center justify-center py-16 sm:py-24 border-t border-[#262933]"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Background Image requested by user */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://ik.imagekit.io/dura/Dlorenz%20Hero%201.jpg"
          alt="DLorenz Background"
          className="w-full h-full object-cover object-center filter brightness-90"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Subtle dark ambient gradient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-[#111216]/60" />
      </div>

      {/* Floating ambient glow matching About section */}
      <motion.div
        className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-[#4EFE32]/5 blur-3xl pointer-events-none z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bold Headline & Manifesto */}
          <motion.div className="lg:col-span-5 flex flex-col justify-center text-left" variants={itemVariants}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FFFFFF] font-condensed uppercase leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mb-3">
              Ready to Scale <br className="hidden sm:inline" />
              <span className="text-[#FFFFFF]">Your Brand &amp;</span> <br />
              <span className="text-[#4EFE32] drop-shadow-[0_0_24px_rgba(78,254,50,0.4)]">Secure Your</span> <br />
              Wealth?
            </h2>

            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-[#4EFE32] to-[#00C2CB] rounded-full mb-4"
              initial={{ width: 0 }}
              animate={isInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            <p className="mt-2 text-base sm:text-lg text-[#ECECEC] font-condensed leading-relaxed max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              Stop leaving your growth to chance. Partner with an agency that delivers verified results.
            </p>

            <div className="mt-8 flex flex-col space-y-3 text-sm font-condensed text-[#FFFFFF]">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#4EFE32] shrink-0 shadow-[0_0_6px_#4EFE32]" />
                <span>Explosive Brand Ascension</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#00C2CB] shrink-0 shadow-[0_0_6px_#00C2CB]" />
                <span>Ironclad Real Estate Security</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] shrink-0" />
                <span>Generational Wealth Building</span>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="mt-8 pt-6 border-t border-[#262933]/60 flex flex-col space-y-2 text-xs sm:text-sm font-condensed text-[#A0A6B2]">
              <div>
                <strong className="text-[#FFFFFF] uppercase">Direct Hotline:</strong>{' '}
                <a href="tel:+2349060909034" className="text-[#4EFE32] hover:underline font-semibold">+234 906 090 9034</a>
                {' '}|{' '}
                <a href="tel:+2348168661924" className="text-[#4EFE32] hover:underline font-semibold">+234 816 866 1924</a>
              </div>
              <div>
                <strong className="text-[#FFFFFF] uppercase">Address:</strong>{' '}
                <span>Federal Peace Estate Old Garage Bus Stop, Lasu Igando Road</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Dark Contact Card */}
          <motion.div className="lg:col-span-7 flex justify-center lg:justify-end" variants={itemVariants}>
            <div
              id="dlorenz-contact-card"
              className="w-full max-w-xl p-6 sm:p-8 md:p-10 rounded-3xl bg-[#16181D]/95 border border-[#262933] hover:border-[#4EFE32]/30 shadow-2xl backdrop-blur-xl text-[#FFFFFF] font-condensed transition-colors"
            >
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#4EFE32]/20 border border-[#4EFE32] flex items-center justify-center text-[#4EFE32] shadow-[0_0_24px_rgba(78,254,50,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#FFFFFF] uppercase tracking-tight">
                    Consultation Request Received!
                  </h3>
                  <p className="text-sm text-[#A0A6B2] max-w-sm leading-relaxed">
                    Thank you, <span className="text-[#FFFFFF] font-bold">{name}</span>. Our growth leadership team will review your project and get in touch within 24 hours.
                  </p>
                  <LiquidMetalButton
                    variant="outline"
                    size="default"
                    label="Send Another Message"
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="mt-4"
                  />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Card Header & Direct Channels */}
                  <div className="pb-4 border-b border-[#262933]">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight flex items-center gap-2 uppercase">
                      <span>Reach out to us today!</span>
                      <Sparkles className="w-5 h-5 text-[#00C2CB]" />
                    </h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A0A6B2]">
                      <div>
                        <span>Mail us at </span>
                        <a
                          href="mailto:DLorenzSolutions@gmail.com"
                          className="text-[#FFFFFF] font-semibold hover:text-[#4EFE32] transition-colors underline underline-offset-2 ml-1"
                        >
                          DLorenzSolutions@gmail.com
                        </a>
                      </div>

                      {/* Social Shortcuts */}
                      <div className="flex items-center gap-2">
                        <span className="uppercase text-[10px] tracking-wider text-[#A0A6B2]">OR</span>
                        <a
                          href="https://linkedin.com/company/dlorenzsolutions"
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 rounded-full bg-[#111216] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] flex items-center justify-center text-[#A0A6B2] transition-all hover:scale-110"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="https://x.com/dlorenzgrowth"
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 rounded-full bg-[#111216] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] flex items-center justify-center text-[#A0A6B2] transition-all hover:scale-110"
                          title="X"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                        <a
                          href="https://facebook.com/dlorenzsolutions"
                          target="_blank"
                          rel="noreferrer"
                          className="w-7 h-7 rounded-full bg-[#111216] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] flex items-center justify-center text-[#A0A6B2] transition-all hover:scale-110"
                          title="Facebook"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-[#A0A6B2] font-semibold">
                    Leave us a brief message
                  </p>

                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-[#ECECEC] uppercase tracking-wide">
                        Your name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] focus:ring-1 focus:ring-[#4EFE32] text-sm text-[#FFFFFF] placeholder-[#555A68] outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-[#ECECEC] uppercase tracking-wide">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] focus:ring-1 focus:ring-[#4EFE32] text-sm text-[#FFFFFF] placeholder-[#555A68] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Project Description Textarea */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-[#ECECEC] uppercase tracking-wide">
                      Briefly describe your project idea...
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Briefly describe your project idea, revenue targets, or landed property goals..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111216] border border-[#262933] focus:border-[#4EFE32] focus:ring-1 focus:ring-[#4EFE32] text-sm text-[#FFFFFF] placeholder-[#555A68] outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Looking for Multi-Select Checkboxes */}
                  <div className="space-y-2 text-left pt-1">
                    <label className="text-xs font-semibold text-[#ECECEC] uppercase tracking-wide block">
                      I&apos;m looking for...
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                      {serviceOptions.map((opt) => {
                        const isChecked = selectedServices.includes(opt.id);
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleService(opt.id)}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                              isChecked
                                ? 'bg-[#4EFE32]/10 border-[#4EFE32] text-[#FFFFFF]'
                                : 'bg-[#111216] border-[#262933] text-[#A0A6B2] hover:border-[#4EFE32]/50'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border shrink-0 ${
                                isChecked
                                  ? 'border-[#4EFE32] bg-[#4EFE32]'
                                  : 'border-[#555A68] bg-transparent'
                              }`}
                            >
                              {isChecked && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#121212]" />
                              )}
                            </span>
                            <span className="truncate">{opt.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <LiquidMetalButton
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                      size="lg"
                      variant="neon"
                      label={isSubmitting ? "Sending Request..." : "Claim Your Growth Consultation"}
                      icon={!isSubmitting ? <Send className="w-4 h-4 text-[#4EFE32]" /> : undefined}
                      iconPosition="right"
                    />
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
