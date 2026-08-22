import React, { useEffect, useState } from 'react';
import { Sun, Moon, ArrowUp } from 'lucide-react';

interface FooterControlsProps {
  onScrollTop?: () => void;
  onThemeToggle?: (mode: 'light' | 'dark') => void;
}

export function handleScrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
  if (document.documentElement) {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const FooterControls: React.FC<FooterControlsProps> = ({
  onScrollTop = handleScrollTop,
  onThemeToggle,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('dlorenz-theme') as 'light' | 'dark' | null;
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const setAppTheme = (mode: 'light' | 'dark') => {
    setTheme(mode);
    localStorage.setItem('dlorenz-theme', mode);
    if (mode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    if (onThemeToggle) {
      onThemeToggle(mode);
    }
  };

  return (
    <div id="footer-floating-controls" className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-[#262933] bg-[#1A1C22]/90 p-1 backdrop-blur-md shadow-lg">
        {/* Light Mode Switcher */}
        <button
          type="button"
          onClick={() => setAppTheme('light')}
          className={`rounded-full p-2 transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-[#E5E7EB] text-[#16a34a] shadow-sm ring-1 ring-[#16a34a]/40 scale-105'
              : 'text-[#A0A6B2] hover:text-[#4EFE32] hover:bg-[#111216]'
          }`}
          title="Switch to Light Canvas"
          aria-label="Light Canvas Mode"
        >
          <Sun className="h-4 w-4" strokeWidth={theme === 'light' ? 2.5 : 1.75} />
          <span className="sr-only">Light</span>
        </button>

        {/* Scroll To Top Action */}
        <button
          type="button"
          onClick={onScrollTop}
          className="mx-1.5 flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFFFFF] bg-[#111216] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] active:scale-95 transition-all font-condensed cursor-pointer shadow-sm"
          title="Scroll to Top of Page"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="mr-1 h-3 w-3 text-[#00C2CB]" />
          <span>TOP</span>
        </button>

        {/* Dark Mode Switcher */}
        <button
          type="button"
          onClick={() => setAppTheme('dark')}
          className={`rounded-full p-2 transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-[#111216] text-[#00C2CB] shadow-sm ring-1 ring-[#00C2CB]/40 scale-105'
              : 'text-[#A0A6B2] hover:text-[#00C2CB] hover:bg-[#111216]'
          }`}
          title="Switch to Dark Canvas"
          aria-label="Dark Canvas Mode"
        >
          <Moon className="h-4 w-4" strokeWidth={theme === 'dark' ? 2.5 : 1.75} />
          <span className="sr-only">Dark</span>
        </button>
      </div>
    </div>
  );
};

export default FooterControls;

