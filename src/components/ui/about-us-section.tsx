import React, { useState, useEffect, useRef } from "react";
import {
  Pen,
  PaintBucket,
  Home,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  ShieldCheck,
  Target,
} from "lucide-react";
import { motion, useScroll, useTransform, useInView, useSpring, useReducedMotion } from "framer-motion";
import { SiteConfig } from "../../types";
import { RevealWords, ScrollRevealText } from "./animated-typography";
import { LiquidMetalButton } from "./liquid-metal-button";

export interface AboutUsSectionProps {
  onOpenConsultation?: () => void;
  onExplorePortfolio?: () => void;
}

export default function AboutUsSection({
  onOpenConsultation,
  onExplorePortfolio,
}: AboutUsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

  // Dynamic Site Config for About section image & headlines
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("dlorenz_cms_config");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      siteName: "DLORENZ SOLUTIONS",
      tagline: "Brand Ascension & Zero-Risk Real Estate Advisory",
      heroHeadline: "We Engineer Dominance for Nigeria’s Boldest Brands",
      heroSubheadline: "From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.",
      logoImage: "",
      aboutImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      aboutHeadline: "Architecting Market Dominance",
      logoIconText: "DL",
      logoType: "both",
      primaryPhone: "+234 906 090 9034",
      secondaryPhone: "+234 816 866 1924",
      email: "DLorenzSolutions@gmail.com",
      officeAddress: "Federal Peace Estate, Lasu Igando Road, Lagos, Nigeria",
      consultationsActive: true,
      realEstateActive: true,
      emergencyHotline: true,
    };
  });

  useEffect(() => {
    const handleConfigUpdate = () => {
      try {
        const saved = localStorage.getItem("dlorenz_cms_config");
        if (saved) setSiteConfig(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("dlorenz_cms_updated", handleConfigUpdate);
    window.addEventListener("storage", handleConfigUpdate);
    return () => {
      window.removeEventListener("dlorenz_cms_updated", handleConfigUpdate);
      window.removeEventListener("storage", handleConfigUpdate);
    };
  }, []);

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  const services = [
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#00C2CB]" />,
      title: "Magnetic Brand Promotion",
      description:
        "We engineer high-converting marketing campaigns that capture immediate market attention, establish trust, and turn audiences into loyal advocates.",
      position: "left",
    },
    {
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <CheckCircle className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#4EFE32]" />,
      title: "Experiential Activations",
      description:
        "Unforgettable in-person consumer activations, high-traffic experiential popups, and sensory brand experiences that trigger direct retail velocity.",
      position: "left",
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <Star className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#00C2CB]" />,
      title: "Audience & Market Intelligence",
      description:
        "Deep competitor analysis, demographic insights, and positioning algorithms that guarantee your brand commands the absolute apex of your sector.",
      position: "left",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#4EFE32]" />,
      title: "Zero-Risk Real Estate Advisory",
      description:
        "100% verified, clean-titled, legally fortified property acquisitions across Nigeria, protecting and compounding generational capital.",
      position: "right",
    },
    {
      icon: <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <CheckCircle className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#00C2CB]" />,
      title: "Master Campaign Architecture",
      description:
        "Meticulous end-to-end campaign blueprints ensuring seamless delivery across multi-channel media, retail, and field operations with measurable ROI.",
      position: "right",
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      secondaryIcon: <Star className="w-3.5 h-3.5 absolute -top-1 -right-1 text-[#4EFE32]" />,
      title: "Flawless Field Execution",
      description:
        "High-energy boots-on-the-ground execution teams deployed directly where target customers shop, live, and work, generating verifiable trial.",
      position: "right",
    },
  ];

  const stats = [
    { icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />, value: 500, label: "Accelerated Value", suffix: "M+" },
    { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, value: 1200, label: "Enterprise Campaigns", suffix: "+" },
    { icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />, value: 12, label: "Years Market Leadership", suffix: "+" },
    { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, value: 98, label: "Client Retention Rate", suffix: "%" },
  ];

  const handleAction = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const contactSection = document.getElementById("dlorenz-contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="about-us-section"
      ref={sectionRef}
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-[#111216] text-[#FFFFFF] overflow-hidden relative border-t border-[#262933] font-condensed"
    >
      {/* Decorative background ambient glows */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#4EFE32]/5 blur-3xl pointer-events-none"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#00C2CB]/5 blur-3xl pointer-events-none"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-[#4EFE32]/40 pointer-events-none"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-[#00C2CB]/40 pointer-events-none"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header Block */}
        <motion.div className="flex flex-col items-center mb-6 text-center" variants={itemVariants}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1A1C22] border border-[#262933] text-[#4EFE32] shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB] shadow-[0_0_6px_#00C2CB]" />
            Growth Acceleration &amp; Advisory
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FFFFFF] uppercase font-condensed mb-4 text-center leading-tight">
            <RevealWords
              text="About DLorenz Solutions"
              highlightWords={["DLorenz", "Solutions"]}
              delay={0.1}
              staggerDelay={0.05}
            />
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#4EFE32] via-[#00C2CB] to-[#4EFE32] rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 text-sm sm:text-base text-[#ECECEC] font-condensed leading-relaxed"
          variants={itemVariants}
        >
          <RevealWords
            text="We are a premier growth acceleration and commercial advisory firm. We turn quiet brands into household market titans and structure bulletproof, high-yield real estate portfolios across Nigeria."
            delay={0.25}
            staggerDelay={0.015}
          />
        </motion.div>

        {/* 3-Column Services & Visual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative items-center">
          {/* Left Column */}
          <div className="space-y-10 sm:space-y-12">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="left"
                  onAction={handleAction}
                />
              ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first md:order-none mb-6 md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div
                className="rounded-2xl overflow-hidden shadow-2xl bg-[#1A1C22] border border-[#262933] relative group"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <img
                  src={siteConfig.aboutImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"}
                  alt={siteConfig.aboutHeadline || "DLorenz Commercial Architecture"}
                  className="w-full h-80 sm:h-96 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#111216] via-[#111216]/40 to-transparent flex flex-col justify-end p-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <span className="text-[11px] font-semibold uppercase text-[#4EFE32] tracking-wider mb-1">
                    Verified Execution
                  </span>
                  <h4 className="text-lg font-bold text-white uppercase leading-tight mb-3">
                    {siteConfig.aboutHeadline || "Architecting Market Dominance"}
                  </h4>
                  <LiquidMetalButton
                    size="sm"
                    variant="neon"
                    label="Our Blueprint"
                    icon={<ArrowRight className="w-3.5 h-3.5 text-[#4EFE32]" />}
                    iconPosition="right"
                    onClick={onExplorePortfolio || handleAction}
                  />
                </motion.div>
              </motion.div>

              {/* Decorative Outlined Frame */}
              <motion.div
                className="absolute inset-0 border-2 border-[#00C2CB]/40 rounded-2xl -m-2.5 z-[-1] pointer-events-none"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />

              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-6 w-14 h-14 rounded-full bg-[#4EFE32]/10 blur-xl pointer-events-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ y: y1 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-8 w-16 h-16 rounded-full bg-[#00C2CB]/15 blur-xl pointer-events-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={{ y: y2 }}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-10 sm:space-y-12">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="right"
                  onAction={handleAction}
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Action Banner */}
        <motion.div
          className="mt-16 bg-[#1A1C22] border border-[#262933] text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4EFE32]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex-1 text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#FFFFFF] mb-1 font-condensed">
              Ready to command category leadership?
            </h3>
            <p className="text-sm text-[#A0A6B2] font-condensed">
              Partner with DLorenz Solutions to architect results-driven campaigns and secure landed wealth.
            </p>
          </div>
          <motion.button
            onClick={handleAction}
            className="bg-[#4EFE32] hover:bg-[#43e629] text-[#121212] px-6 py-3.5 rounded-full flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider font-condensed shadow-[0_4px_16px_rgba(78,254,50,0.3)] transition-all cursor-pointer shrink-0 z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Claim Your Growth Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#121212]" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface ServiceItemProps {
  key?: React.Key;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  description: string;
  variants: {
    hidden: { opacity: number; y?: number };
    visible: { opacity: number; y?: number; transition: { duration: number; ease: string } };
  };
  delay: number;
  direction: "left" | "right";
  onAction?: () => void;
}

function ServiceItem({
  icon,
  secondaryIcon,
  title,
  description,
  variants,
  delay,
  direction,
  onAction,
}: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group cursor-pointer"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onAction}
    >
      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="text-[#4EFE32] bg-[#1A1C22] border border-[#262933] p-2.5 sm:p-3 rounded-xl transition-all duration-300 group-hover:border-[#4EFE32] group-hover:bg-[#111216] relative shrink-0 shadow-sm"
          whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#FFFFFF] group-hover:text-[#4EFE32] transition-colors duration-300 font-condensed">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-xs sm:text-sm text-[#A0A6B2] leading-relaxed pl-12 font-condensed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-2 pl-12 flex items-center text-[#4EFE32] text-xs font-semibold uppercase tracking-wider font-condensed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
      >
        <span className="flex items-center gap-1">
          Learn more <ArrowRight className="w-3 h-3 text-[#00C2CB]" />
        </span>
      </motion.div>
    </motion.div>
  );
}

interface StatCounterProps {
  key?: React.Key;
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: false });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 12,
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    } else if (!isInView && hasAnimated) {
      springValue.set(0);
      setHasAnimated(false);
    }
  }, [isInView, value, springValue, hasAnimated]);

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  return (
    <motion.div
      className="bg-[#1A1C22] border border-[#262933] p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[#4EFE32] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(78,254,50,0.12)]"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-12 h-12 rounded-xl bg-[#111216] border border-[#262933] flex items-center justify-center mb-3 text-[#4EFE32] group-hover:border-[#00C2CB] group-hover:text-[#00C2CB] transition-colors duration-300 shadow-sm"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <div ref={countRef} className="text-2xl sm:text-3xl font-black text-[#FFFFFF] flex items-center font-condensed tracking-tight">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-[#A0A6B2] text-xs sm:text-sm uppercase tracking-wider font-condensed mt-1">{label}</p>
      <motion.div className="w-8 h-0.5 bg-[#4EFE32] mt-3 group-hover:w-16 transition-all duration-300 rounded-full" />
    </motion.div>
  );
}
