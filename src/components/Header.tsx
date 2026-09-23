import React from 'react';
import { Search, Calendar, Code2, Menu, X } from 'lucide-react';
import { miniAudio } from '../utils/audio';

interface HeaderProps {
  onOpenTestDrive: () => void;
  onOpenSearch: () => void;
  onOpenStandalone: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTestDrive,
  onOpenSearch,
  onOpenStandalone,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    miniAudio.playClick(500);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F6F5F2]/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-2xl font-black font-display tracking-tight text-[#111215] hover:opacity-85 transition-opacity flex items-center gap-2"
        >
          <span>MINI</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-600">
          <a
            href="#oled-display"
            onClick={handleNavClick}
            className="hover:text-[#111215] transition-colors relative py-1 hover:border-b-2 hover:border-[#111215]"
          >
            OLED Display
          </a>
          <a
            href="#configurator"
            onClick={handleNavClick}
            className="hover:text-[#111215] transition-colors relative py-1 hover:border-b-2 hover:border-[#111215]"
          >
            360° Configurator
          </a>
          <a
            href="#fleet"
            onClick={handleNavClick}
            className="hover:text-[#111215] transition-colors relative py-1 hover:border-b-2 hover:border-[#111215]"
          >
            Model Fleet
          </a>
          <a
            href="#big-love"
            onClick={handleNavClick}
            className="hover:text-[#111215] transition-colors relative py-1 hover:border-b-2 hover:border-[#111215]"
          >
            Big Love
          </a>
          <button
            onClick={() => {
              onOpenStandalone();
              miniAudio.playClick(600);
            }}
            className="hover:text-[#00C2D6] transition-colors relative py-1 flex items-center gap-1.5 font-mono text-xs uppercase"
          >
            <Code2 className="w-3.5 h-3.5 text-[#00C2D6]" />
            <span>Standalone Edition</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onOpenSearch();
              miniAudio.playClick(450);
            }}
            className="p-2.5 rounded-full hover:bg-neutral-200/80 text-neutral-700 transition-colors"
            aria-label="Search models and specs"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onOpenTestDrive();
              miniAudio.playClick(650);
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#111215] hover:bg-neutral-800 active:scale-98 text-white font-bold text-xs tracking-wide transition-all shadow-sm whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-[#00C2D6]" />
            <span>Book Test Drive</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg md:hidden text-neutral-700 hover:bg-neutral-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F5F2] border-b border-neutral-200 px-6 py-4 space-y-3">
          <a
            href="#oled-display"
            onClick={handleNavClick}
            className="block py-2 text-sm font-bold text-neutral-800"
          >
            OLED Display
          </a>
          <a
            href="#configurator"
            onClick={handleNavClick}
            className="block py-2 text-sm font-bold text-neutral-800"
          >
            360° Configurator
          </a>
          <a
            href="#fleet"
            onClick={handleNavClick}
            className="block py-2 text-sm font-bold text-neutral-800"
          >
            Model Fleet
          </a>
          <a
            href="#big-love"
            onClick={handleNavClick}
            className="block py-2 text-sm font-bold text-neutral-800"
          >
            Big Love
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStandalone();
            }}
            className="w-full text-left py-2 text-sm font-bold text-[#00C2D6] flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            <span>Standalone Pure HTML Edition</span>
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestDrive();
              }}
              className="w-full py-3 rounded-full bg-[#111215] text-white font-bold text-xs"
            >
              Book Go-Kart Test Drive
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
