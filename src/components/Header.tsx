import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onJumpToMemoryForm: () => void;
}

const NAV_LINKS = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Kenang-Kenangan', href: '#kenang-kenangan' },
  { label: 'Kegiatan', href: '#kegiatan' },
  { label: 'Kotak Saran', href: '#saran' },
  { label: 'Media Sosial', href: '#sosial' },
];

export function Header({ onJumpToMemoryForm }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#beranda"
          className="font-editorial text-lg font-semibold tracking-tight text-[#171923] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          OSIS SMKN 3 Pacitan
        </a>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#171923] hover:underline underline-offset-4 decoration-stone-400 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onJumpToMemoryForm}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            Isi Kenangan
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-stone-200 text-[#171923] hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF8F5] px-4 py-4">
          <nav className="flex flex-col gap-1" aria-label="Navigasi seluler">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-stone-700 hover:text-[#171923] hover:bg-stone-100 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onJumpToMemoryForm();
              }}
              className="mt-2 w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors cursor-pointer"
            >
              Isi Kenangan
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
