'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getBrandFromHostname, getBrandConfig, type BrandConfig } from '@/config/brandConfig';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [brandConfig, setBrandConfig] = useState<BrandConfig | null>(null);

  useEffect(() => {
    // Resolve brand from current hostname
    const brand = getBrandFromHostname(window.location.hostname);
    setBrandConfig(getBrandConfig(brand));
  }, []);

  // Fallback while loading
  if (!brandConfig) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF5]/90 backdrop-blur-md border-b border-[#8B4513]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-black text-[#8B4513] tracking-tighter">
            Loading...
          </Link>
        </div>
      </nav>
    );
  }

  const { navLinks, ctaButton, logoText, brand, theme, name } = brandConfig;
  const isKFS = brand === 'KFS';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFF5]/90 backdrop-blur-md border-b border-[#8B4513]/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className={`font-serif text-2xl font-black tracking-tighter hover:opacity-80 transition ${
          isKFS ? 'text-[#FF6B35]' : 'text-[#8B4513]'
        }`}>
          {isKFS ? 'Kids Fun Songs' : 'Dream the Stream'}
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors relative group ${
                isKFS
                  ? 'text-[#FF6B35] hover:text-[#00BCD4]'
                  : 'text-[#2C2418] hover:text-[#8B4513]'
              }`}
            >
              {link.name}
              {/* Underline on Hover */}
              <span className={`absolute -bottom-2 left-1/2 w-0 h-0.5 transition-all group-hover:w-full group-hover:left-0 ${
                isKFS ? 'bg-[#00BCD4]' : 'bg-[#DAA520]'
              }`}></span>
            </Link>
          ))}

          {/* CTA BUTTON */}
          <Link
            href={ctaButton.href}
            className={`text-white px-6 py-2 rounded-full text-xs font-black tracking-widest transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform ${
              isKFS
                ? 'bg-[#FF6B35] hover:bg-[#E55A2B]'
                : 'bg-[#A85220] hover:bg-[#8B4513]'
            }`}
          >
            {ctaButton.text}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden text-[#8B4513]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-[#FFFFF5] border-t border-[#8B4513]/10 p-6 absolute w-full shadow-xl">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`text-lg font-bold ${
                isKFS ? 'text-[#FF6B35]' : 'text-[#2C2418]'
              }`} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
