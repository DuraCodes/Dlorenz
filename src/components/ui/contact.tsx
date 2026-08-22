import React, { useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Mail, Phone, MapPin, CheckCircle2, Send, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { RevealWords, ScrollRevealText } from "./animated-typography";
import { apiSubmitInquiry } from "@/src/lib/api";

export interface SocialLink {
  id: string;
  name: string;
  iconSrc?: string;
  href: string;
  customIcon?: React.ReactNode;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  projectType: string[];
}

export interface ContactSectionProps {
  /**
   * The title for the contact section.
   */
  title?: string;
  /**
   * The subtitle or main message for the introductory part.
   */
  mainMessage?: string;
  /**
   * The contact email to display.
   */
  contactEmail?: string;
  /**
   * Array of social media links. Each object should have an 'id', 'name', 'iconSrc', and 'href'.
   */
  socialLinks?: SocialLink[];
  /**
   * Placeholder image for the background.
   */
  backgroundImageSrc?: string;
  /**
   * Callback function when the form is submitted.
   * @param data The form data.
   */
  onSubmit?: (data: ContactFormData) => void;
}

const defaultSocialLinks: SocialLink[] = [
  {
    id: "1",
    name: "Instagram",
    href: "https://www.instagram.com/dlorenz_growth_solutions?igsh=d3Mxa3BwdmluOW1h&utm_source=qr",
  },
  {
    id: "2",
    name: "TikTok",
    href: "https://www.tiktok.com/@dlorenz_solutions?_t=ZM-8u8R7hT6P1t&_r=1",
  },
  {
    id: "3",
    name: "LinkedIn",
    href: "https://linkedin.com",
  },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  title = "We Turn Growth Ambitions Into Irreversible Market Dominance",
  mainMessage = "Book Your Strategic Executive Consultation",
  contactEmail = "DLorenzSolutions@gmail.com",
  socialLinks = defaultSocialLinks,
  backgroundImageSrc = "https://images.unsplash.com/photo-1742273330004-ef9c9d228530?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1600",
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: ["Brand Promotion & Visibility"],
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setFormData((prev) => {
      const currentTypes = prev.projectType;
      if (checked) {
        return { ...prev, projectType: [...currentTypes, type] };
      } else {
        return { ...prev, projectType: currentTypes.filter((t) => t !== type) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await apiSubmitInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectTypes: formData.projectType,
      message: formData.message,
      serviceInterest: formData.projectType.join(', ') || 'Strategic Growth',
      type: 'contact',
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      onSubmit?.(formData);
    } else {
      setErrorMessage(res.error || 'Failed to submit briefing. Please try again.');
    }
  };

  const projectTypeOptions = [
    "Brand Promotion & Visibility",
    "Experiential Marketing & Activations",
    "Audience Research & Market Sizing",
    "Zero-Risk Real Estate Acquisition",
    "Field Marketing & Sampling",
    "Clean-Titled Land Verification",
    "Commercial Architecture & Planning",
    "Full Strategic Retainer",
  ];

  return (
    <section
      id="dlorenz-contact-section"
      className="relative w-full overflow-hidden bg-[#111216] text-[#FFFFFF] font-condensed py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 flex items-center justify-center border-t border-[#262933]"
    >
      {/* Background Image and Ambient Overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-20 pointer-events-none scale-105"
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111216] via-[#111216]/90 to-[#111216] pointer-events-none" />

      {/* Ambient decorative glow orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#4EFE32]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#00C2CB]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Statement & Direct Contact Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1A1C22] border border-[#262933] text-[#4EFE32] shadow-sm mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB] shadow-[0_0_6px_#00C2CB]" />
                Direct Partnership Inquiry
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#FFFFFF] leading-[1.05] mb-4">
                <RevealWords
                  text={title}
                  delay={0.1}
                  staggerDelay={0.04}
                />
              </h2>
              <ScrollRevealText delay={0.2} yOffset={10} className="text-sm sm:text-base text-[#A0A6B2] leading-relaxed">
                <p>Connect with our senior partners to schedule an in-depth brand audit, launch an experiential activation campaign, or acquire verified, high-yield land assets.</p>
              </ScrollRevealText>
            </div>

            {/* Direct Contact Badges */}
            <div className="space-y-4 bg-[#1A1C22]/80 border border-[#262933] p-5 sm:p-6 rounded-2xl backdrop-blur-md">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-center text-[#4EFE32] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#A0A6B2] uppercase tracking-wider">Official Email</p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-[#4EFE32] transition-colors"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-center text-[#00C2CB] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#A0A6B2] uppercase tracking-wider">Direct Hotlines</p>
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <a
                      href="tel:+2349060909034"
                      className="text-sm sm:text-base font-bold text-white hover:text-[#00C2CB] transition-colors"
                    >
                      +234 906 090 9034
                    </a>
                    <a
                      href="tel:+2348168661924"
                      className="text-sm sm:text-base font-bold text-white hover:text-[#00C2CB] transition-colors"
                    >
                      +234 816 866 1924
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-center text-[#4EFE32] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#A0A6B2] uppercase tracking-wider">Headquarters</p>
                  <p className="text-xs sm:text-sm text-white font-medium">
                    Federal Peace Estate, Old Garage Bus Stop, Lasu Igando Rd, Lagos
                  </p>
                </div>
              </div>
            </div>

            {/* Social Network Links */}
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A0A6B2] font-semibold mb-3">Connect With Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-full px-4 text-xs hover:border-[#4EFE32]"
                  >
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                      {link.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Card */}
          <div className="lg:col-span-7 bg-[#1A1C22] border border-[#262933] p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#FFFFFF] mb-1">
              {mainMessage}
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A6B2] mb-6">
              Fill out the briefing form below and our leadership team will respond within 24 hours.
            </p>

            {isSubmitted ? (
              <div className="bg-[#111216] border border-[#4EFE32]/40 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-14 h-14 rounded-full bg-[#4EFE32]/20 border border-[#4EFE32] flex items-center justify-center text-[#4EFE32] mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold uppercase text-white tracking-tight">
                  Consultation Request Received
                </h4>
                <p className="text-sm text-[#A0A6B2] max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our managing partners have received your briefing and will contact you via <strong className="text-[#4EFE32]">{formData.email}</strong> shortly.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-4 rounded-full text-xs uppercase"
                >
                  Submit Another Briefing
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">Your Full Name *</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      placeholder="e.g. Adebayo Adeleke"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">Corporate Email *</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="e.g. ceo@enterprise.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-phone">Phone / WhatsApp Number</Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    placeholder="e.g. +234 800 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Multi-Select Strategic Pillars */}
                <div className="space-y-2.5 pt-1">
                  <Label>Strategic Scope & Required Services</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#111216] p-3.5 rounded-xl border border-[#262933]">
                    {projectTypeOptions.map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2.5 p-1 hover:bg-[#1A1C22] rounded transition-colors"
                      >
                        <Checkbox
                          id={option.replace(/\s/g, "-").toLowerCase()}
                          checked={formData.projectType.includes(option)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(option, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={option.replace(/\s/g, "-").toLowerCase()}
                          className="text-xs font-normal text-[#ECECEC] cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">Project Scope & Objectives *</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    placeholder="Describe your market goals, target timeline, or property acquisition requirements..."
                    className="min-h-[90px]"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full uppercase tracking-wider text-sm font-bold shadow-[0_4px_20px_rgba(78,254,50,0.35)] cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#111216]" /> Securing Consultation Slot...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Submit Strategic Briefing <Send className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
