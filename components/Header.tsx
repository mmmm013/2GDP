'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import stiLogo from '@/images/gpm_logo copy 2.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isKleighDomain, setIsKleighDomain] = useState(false);

  useEffect(() => {
    setIsKleighDomain(window.location.hostname.includes('2kleigh.com'));
  }, []);

  // MOBILE FIX: Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <nav className="w-full bg-[#2A1506] shadow-lg border-b border-[#5C3A1E]/40 relative z-50">
      {/* MOBILE FIX: safe-area-inset-top for notch devices */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-2 pt-[env(safe-area-inset-top)]">
        {/* LEFT: GPM Identity - Logo + Business Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#C8A882]/60 shadow-md">
            <Image
              src={stiLogo}
              alt="G Putnam Music Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#C8A882] tracking-wide leading-tight group-hover:text-[#D07CC8] transition-colors">G Putnam Music</span>
            <span className="text-[10px] text-[#C8A882]/70 uppercase tracking-widest leading-tight">
              {isKleighDomain ? 'KLEIGH Project - Tier 2 Brand' : 'The One Stop Song Shop'}
            </span>
          </div>
        </Link>

        {isKleighDomain && (
          <span className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.18em] text-[#F5e6c8]/70 border border-[#C8A882]/30 rounded-full px-3 py-1">
            KLEIGH
          </span>
        )}

        {/* CENTER: Spacer */}
        <div className="flex-1" />

        {/* RIGHT: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/heroes" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Heroes</Link>
          <Link href="/uru" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">URU</Link>
          <Link href="/gift" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">Gift</Link>
          <Link href="/kupid" className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide transition-colors">kUpId</Link>
          <Link href="/join" className="text-sm bg-[#C8A882] text-[#2A1506] px-4 py-1.5 rounded-full font-bold text-center hover:bg-[#D07CC8] transition-colors tracking-wide">Join</Link>
        </div>

        {/* Mobile Hamburger - MOBILE FIX: 44px+ touch target */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#C8A882] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown - MOBILE FIX: 44px+ touch targets, body scroll lock */}
      {menuOpen && (
        <div className="md:hidden bg-[#2A1506] border-t border-[#5C3A1E]/40 px-4 py-4 flex flex-col gap-1">
          <Link href="/heroes" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide min-h-[44px] flex items-center">Heroes</Link>
          <Link href="/uru" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide min-h-[44px] flex items-center">URU</Link>
          <Link href="/gift" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide min-h-[44px] flex items-center">Gift</Link>
          <Link href="/kupid" onClick={() => setMenuOpen(false)} className="text-sm text-[#C4A882] hover:text-[#C8A882] font-medium tracking-wide min-h-[44px] flex items-center">kUpId</Link>
          <Link href="/join" onClick={() => setMenuOpen(false)} className="text-sm bg-[#C8A882] text-[#2A1506] px-4 py-3 rounded-full font-bold text-center hover:bg-[#D07CC8] transition-colors tracking-wide mt-2">Join</Link>
        </div>
      )}
    </nav>
  );
}
