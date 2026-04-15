import { Link } from 'react-router-dom';
import { Video, Instagram, Facebook, Youtube, MapPin, Phone, Mail, ExternalLink, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-brand-500 text-zinc-950 p-1.5 rounded-lg">
                <Video size={20} className="fill-zinc-950" />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-[#E85D22]">সোশ্যাল</span>
                <span className="text-white">অ্যাড</span>
                <span className="text-[#FFC107]">স্টুডিও</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              আমরা ই-কমার্স এবং ফ্যাশন ব্র্যান্ডের সেলস বাড়াতে সাহায্য করার জন্য ভিডিও এবং ফটো কন্টেন্ট তৈরি করি।
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.facebook.com/SocialAdsStudio/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-brand-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-brand-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-brand-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">কুইক লিংক</h3>
            <ul className="space-y-3">
              <li><Link to="/videos" className="text-zinc-400 hover:text-white text-sm transition-colors">ভিডিও</Link></li>
              <li><Link to="/photos" className="text-zinc-400 hover:text-white text-sm transition-colors">ছবি</Link></li>
              <li><a href="/#services" className="text-zinc-400 hover:text-white text-sm transition-colors">সার্ভিসেস</a></li>
              <li><a href="/#process" className="text-zinc-400 hover:text-white text-sm transition-colors">কাজের ধাপ</a></li>
              <li><a href="/#pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">প্যাকেজ</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">ক্যাটাগরি</h3>
            <ul className="space-y-3">
              <li><Link to="/photos" className="text-zinc-400 hover:text-white text-sm transition-colors">ফটোগ্রাফি</Link></li>
              <li><Link to="/videos" className="text-zinc-400 hover:text-white text-sm transition-colors">ভিডিও</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-sm">চন্দ্রিমা মডেল টাউন, রোড নাম্বার ৫<br/>মোহাম্মদপুর, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <span className="text-zinc-400 text-sm">০১৯৩৫২৫২০০৭</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <span className="text-zinc-400 text-sm">hello@socialadstudio.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sister Concern Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center">
              <ExternalLink size={20} className="text-brand-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">আমরা হচ্ছি সিস্টার কনসার্ন</p>
              <p className="text-white font-semibold">সোশ্যাল অ্যাড এক্সপার্ট এর</p>
            </div>
          </div>
          <a 
            href="https://socialads.expert" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            ওয়েবসাইট ভিজিট করুন <ArrowRight size={16} />
          </a>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} সোশ্যাল অ্যাড স্টুডিও। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <Link to="/admin" className="hover:text-white transition-colors">এডমিন লগইন</Link>
            <a href="#" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</a>
            <a href="#" className="hover:text-white transition-colors">টার্মস অফ সার্ভিস</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
