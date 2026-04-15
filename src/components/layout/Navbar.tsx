import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', href: '/' },
    { name: 'ভিডিও', href: '/videos', isRoute: true },
    { name: 'ছবি', href: '/photos', isRoute: true },
    { name: 'সার্ভিসেস', href: '/#services' },
    { name: 'কাজের ধাপ', href: '/#process' },
    { name: 'প্যাকেজ', href: '/#pricing' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'bg-zinc-950/80 backdrop-blur-md border-zinc-800 py-2 md:py-3' : 'bg-transparent py-3 md:py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 md:gap-2 group">
          <div className="bg-brand-500 text-zinc-950 p-1 md:p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <Video size={16} className="fill-zinc-950 md:hidden" />
            <Video size={20} className="fill-zinc-950 hidden md:block" />
          </div>
          <span className="text-lg md:text-2xl font-black tracking-tight flex items-center gap-1 md:gap-1.5">
            <span className="text-[#E85D22]">সোশ্যাল</span>
            <span className="text-white">অ্যাড</span>
            <span className="text-[#FFC107]">স্টুডিও</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="/#contact" 
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            onClick={() => trackEvent('Contact', { method: 'Navbar Link', value: 'Contact' })}
          >
            যোগাযোগ
          </a>
          <a
            href="https://wa.me/8801935252007"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('Contact', { method: 'WhatsApp', value: 'Navbar Button' })}
            className="bg-brand-500 hover:bg-brand-600 text-zinc-950 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            হোয়াটসঅ্যাপ করুন
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-zinc-300 hover:text-white p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-3 flex flex-col gap-3 shadow-xl">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 border-b border-zinc-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 border-b border-zinc-800/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            )
          ))}
          <a
            href="/#contact"
            className="text-sm font-medium text-zinc-300 hover:text-white py-1.5 border-b border-zinc-800/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            যোগাযোগ
          </a>
          <a
            href="https://wa.me/8801935252007"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-500 text-zinc-950 text-center font-bold text-sm px-5 py-2.5 rounded-lg mt-1"
            onClick={() => {
              trackEvent('Contact', { method: 'WhatsApp', value: 'Mobile Menu' });
              setIsMobileMenuOpen(false);
            }}
          >
            হোয়াটসঅ্যাপ করুন
          </a>
        </div>
      )}
    </header>
  );
}
