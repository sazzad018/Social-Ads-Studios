import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, CheckCircle2, ArrowRight, Camera, Video, Clapperboard, MonitorPlay, PenTool, Scissors, TrendingUp, Layout, MessageCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { trackEvent } from '../lib/tracking';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustStrip />
      <WhatWeDoSection />
      <WhyDifferentSection />
      <CategoryPortfolio />
      <ClientScreenshots />
      <SalesReports />
      <ProcessSection />
      <UseCasesSection />
      <RawToFinalSection />
      <PricingSection />
      <TestimonialsSection />
      <FBAdsResultsSection />
      <FAQSection />
      <AboutSection />
      <FinalCTASection />
    </div>
  );
}

function HeroSection() {
  const [heroVideo, setHeroVideo] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchHeroVideo = async () => {
      try {
        const response = await axios.get('/api/settings/heroVideo');
        if (response.data) {
          setHeroVideo(response.data);
        }
      } catch (error) {
        console.error('Error fetching hero video:', error);
      }
    };
    fetchHeroVideo();
  }, []);

  return (
    <section className="relative pt-24 pb-12 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Video/Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-zinc-950/85 z-10"></div>
        {heroVideo?.backgroundUrl ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-40"
            src={heroVideo.backgroundUrl}
          ></video>
        ) : (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071&auto=format&fit=crop" 
            alt="Studio Background" 
            className="w-full h-full object-cover"
          />
        )}
        {/* Colorful glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px] z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] z-10"></div>
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
          <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">প্রিমিয়াম প্রোডাকশন স্টুডিও</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto mb-4 md:mb-6 leading-tight"
        >
          স্ক্রিপ্ট থেকে স্ক্রিন — আমরা তৈরি করি <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-brand-500 to-rose-500">সেলস-ফোকাসড</span> কন্টেন্ট
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed"
        >
          ফ্যাশন, ফুড, গ্যাজেট এবং ই-কমার্স ব্র্যান্ডের জন্য প্রোডাক্ট ভিডিও, ফটোশুট, রিলস এবং অ্যাড ক্রিয়েটিভ — সবকিছু এক জায়গায়।
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {heroVideo?.url ? (
            <button 
              onClick={() => {
                setIsVideoPlaying(true);
                trackEvent('ViewContent', { content_name: 'Hero Portfolio Video', content_type: 'video' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Play size={18} className="fill-zinc-950" />
              পোর্টফোলিও ভিডিও দেখুন
            </button>
          ) : (
            <a 
              href="#portfolio" 
              onClick={() => trackEvent('ViewContent', { content_name: 'Portfolio Section', content_type: 'section' })}
              className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 font-semibold rounded-full hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Play size={18} className="fill-zinc-950" />
              পোর্টফোলিও দেখুন
            </a>
          )}
          <a 
            href="https://wa.me/8801935252007" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('Contact', { method: 'WhatsApp', value: 'Hero Button' })}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-zinc-950 font-semibold rounded-full hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            বুকিংয়ের জন্য হোয়াটসঅ্যাপ করুন
          </a>
        </motion.div>

        {/* Hero Video Player Modal */}
        {isVideoPlaying && heroVideo?.url && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800">
              <button 
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 z-10 bg-zinc-900/80 text-white p-2 rounded-full hover:bg-brand-500 transition-colors"
              >
                ✕
              </button>
              {heroVideo.url.includes('youtube.com') || heroVideo.url.includes('youtu.be') ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${heroVideo.url.split('v=')[1]?.split('&')[0] || heroVideo.url.split('/').pop()}?autoplay=1`} 
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={heroVideo.url} controls autoPlay className="w-full h-full object-contain"></video>
              )}
            </div>
          </div>
        )}

        {/* Hero Video Thumbnail Preview (Optional, if they want it visible on the hero section itself) */}
        {heroVideo?.thumbnailUrl && !isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-12 relative rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer group shadow-2xl"
            onClick={() => setIsVideoPlaying(true)}
          >
            <img src={heroVideo.thumbnailUrl} alt="Portfolio Video Thumbnail" className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-500/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <Play size={32} className="fill-zinc-950 text-zinc-950 ml-2" />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-cyan-500" />
            <span>স্ক্রিপ্ট থেকে এডিট: ফুল সার্ভিস</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent-400" />
            <span>অ্যাড-ফ্রেন্ডলি ক্রিয়েটিভ</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-500" />
            <span>দ্রুত ডেলিভারি</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="py-10 border-y border-zinc-900 bg-zinc-950/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-zinc-500 mb-6 uppercase tracking-widest"
        >
          যেসব ক্ষেত্রে ব্র্যান্ডগুলো আমাদের ওপর আস্থা রাখে
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-80 hover:opacity-100 transition-all duration-500"
        >
          <div className="text-lg font-bold text-zinc-300 hover:text-brand-400 transition-colors flex items-center gap-2">
            <Video size={20} className="text-brand-500" /> ভিডিওগ্রাফি
          </div>
          <div className="text-lg font-bold text-zinc-300 hover:text-cyan-400 transition-colors flex items-center gap-2">
            <Camera size={20} className="text-cyan-500" /> ফটোগ্রাফি
          </div>
          <div className="text-lg font-bold text-zinc-300 hover:text-accent-400 transition-colors flex items-center gap-2">
            <MonitorPlay size={20} className="text-accent-500" /> রিলস ও শর্টস
          </div>
          <div className="text-lg font-bold text-zinc-300 hover:text-rose-400 transition-colors flex items-center gap-2">
            <TrendingUp size={20} className="text-rose-500" /> অ্যাড ক্রিয়েটিভ
          </div>
          <div className="text-lg font-bold text-zinc-300 hover:text-green-400 transition-colors flex items-center gap-2">
            <Layout size={20} className="text-green-500" /> ওয়েবসাইট ডেভেলপমেন্ট
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-zinc-400 mt-6 text-sm max-w-2xl mx-auto"
        >
          আমরা এই সার্ভিসগুলো অত্যন্ত প্রফেশনালি প্রদান করি, যাতে আপনার ব্র্যান্ডের কোয়ালিটি এবং সেলস দুটোই বৃদ্ধি পায়।
        </motion.p>
      </div>
    </section>
  );
}

function WhatWeDoSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('/api/whatWeDoVideos');
        const docs = response.data;
        if (Array.isArray(docs)) {
          setVideos(docs);
          if (docs.length > 0 && !activeVideo) {
            setActiveVideo(docs[0]);
          }
        } else {
          console.error('API returned non-array data for whatWeDoVideos:', docs);
        }
      } catch (error) {
        console.error('Error fetching what we do videos:', error);
      }
    };
    fetchVideos();
  }, [activeVideo]);

  const services = [
    { icon: <Video size={24} />, title: "প্রোডাক্ট ভিডিও প্রোডাকশন", desc: "আপনার প্রোডাক্টকে আকর্ষণীয়ভাবে তুলে ধরতে কমার্শিয়াল ভিডিও।", featured: true },
    { icon: <Camera size={24} />, title: "প্রোডাক্ট ফটোগ্রাফি", desc: "ওয়েবসাইট ও সোশ্যাল মিডিয়ার জন্য ক্রিস্প ও স্টাইলিশ ছবি।", featured: true },
    { icon: <MonitorPlay size={24} />, title: "রিলস ও শর্ট-ফর্ম", desc: "ইন্সটাগ্রাম ও টিকটকের জন্য এঙ্গেজিং ভার্টিকাল কন্টেন্ট।", featured: false },
    { icon: <Clapperboard size={24} />, title: "ওভিসি / টিভিসি প্রোডাকশন", desc: "ব্র্যান্ডের পরিচিতি বাড়াতে ফুল-স্কেল কমার্শিয়াল।", featured: false },
    { icon: <PenTool size={24} />, title: "স্ক্রিপ্ট ও কনসেপ্ট", desc: "আমরা এমন হুক ও স্ক্রিপ্ট লিখি যা মানুষের মনোযোগ ধরে রাখে।", featured: false },
    { icon: <Scissors size={24} />, title: "ভিডিও এডিটিং", desc: "মোশন গ্রাফিক্স ও সাউন্ডসহ অ্যাড-রেডি ফাস্ট-পেসড এডিটিং।", featured: false },
    { icon: <TrendingUp size={24} />, title: "ফেসবুক অ্যাড সাপোর্ট", desc: "CPA কমানোর জন্য বিশেষভাবে তৈরি কন্টেন্ট।", featured: false },
    { icon: <Layout size={24} />, title: "ওয়েবসাইট ডেভেলপমেন্ট", desc: "ভিডিওর ট্রাফিককে সেলসে কনভার্ট করতে ল্যান্ডিং পেজ।", featured: false },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">আমরা যা করি</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-base md:text-lg">আপনার ব্র্যান্ডকে প্রফেশনালি প্রেজেন্ট করতে এবং সেলস বাড়াতে যা যা প্রয়োজন।</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Video Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-4 md:space-y-6"
          >
            <div 
              className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 group cursor-pointer shadow-2xl"
              onClick={() => {
                if (activeVideo) {
                  setIsVideoPlaying(true);
                  trackEvent('ViewContent', { content_name: activeVideo.title || 'Service Video', content_type: 'video' });
                }
              }}
            >
              {activeVideo?.thumbnailUrl ? (
                <img 
                  src={activeVideo.thumbnailUrl} 
                  alt={activeVideo.title || "Service Details Video"} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Video size={40} className="text-zinc-700" />
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform">
                  <Play size={20} className="fill-zinc-950 ml-1" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-zinc-950 to-transparent">
                <p className="text-white font-bold text-base md:text-lg">{activeVideo?.title || "আমাদের সার্ভিস সম্পর্কে বিস্তারিত দেখুন"}</p>
                <p className="text-zinc-400 text-xs md:text-sm">ভিডিওটি প্লে করতে ক্লিক করুন</p>
              </div>
            </div>

            {/* Video Playlist (if multiple) */}
            {videos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {videos.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVideo(v)}
                    className={cn(
                      "flex-shrink-0 w-24 md:w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all",
                      activeVideo?.id === v.id ? "border-brand-500 scale-95" : "border-zinc-800 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-zinc-900/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                <CheckCircle2 size={16} className="text-brand-500" />
                কেন আমাদের ভিডিও দেখবেন?
              </h4>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                এই ভিডিওগুলোতে আমরা বিস্তারিত আলোচনা করেছি কীভাবে আমরা স্ক্রিপ্ট থেকে ফাইনাল এডিট পর্যন্ত প্রতিটি ধাপ সম্পন্ন করি এবং কীভাবে আমাদের কন্টেন্ট আপনার ব্র্যান্ডের সেলস বৃদ্ধিতে সরাসরি ভূমিকা রাখে।
              </p>
            </div>
          </motion.div>

          {/* Services Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {services.map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className={cn(
                  "p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 hover:-translate-y-1 group",
                  s.featured 
                    ? "bg-zinc-900/80 border-zinc-800 hover:border-brand-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                    : "bg-zinc-950/80 border-zinc-900 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-transform group-hover:scale-110",
                  s.featured ? "bg-brand-500 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "bg-zinc-900 text-zinc-300 group-hover:text-cyan-400"
                )}>
                  {React.cloneElement(s.icon as React.ReactElement, { size: 18 })}
                </div>
                <h3 className={cn("font-bold mb-1 text-sm md:text-base", s.featured ? "text-white" : "text-zinc-200")}>{s.title}</h3>
                <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Player Modal */}
        {isVideoPlaying && activeVideo?.url && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 md:p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
              <button 
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-zinc-900/80 text-white p-2 rounded-full hover:bg-brand-500 transition-colors"
              >
                ✕
              </button>
              {activeVideo.url.includes('youtube.com') || activeVideo.url.includes('youtu.be') ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${activeVideo.url.split('v=')[1]?.split('&')[0] || activeVideo.url.split('/').pop()}?autoplay=1`} 
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={activeVideo.url} controls autoPlay className="w-full h-full object-contain"></video>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WhyDifferentSection() {
  const points = [
    { title: "আইডিয়া ও কনসেপ্ট সাপোর্ট", desc: "আমরা শুধু ক্যামেরা ধরি না, আপনার অডিয়েন্সের জন্য কোনটা কাজ করবে তা নিয়ে ব্রেইনস্টর্ম করি।" },
    { title: "শুটের আগে স্ক্রিপ্টরাইটিং", desc: "লাইট অন করার আগেই প্রতিটি ভিডিওর হুক, বডি এবং কল-টু-অ্যাকশন প্ল্যান করা থাকে।" },
    { title: "স্টুডিও-কোয়ালিটি প্রোডাকশন", desc: "প্রতিটি শুটের জন্য প্রফেশনাল লাইটিং, প্রিমিয়াম ক্যামেরা এবং অভিজ্ঞ ক্রু।" },
    { title: "অ্যাডের জন্য অপ্টিমাইজড এডিটিং", desc: "ফেসবুক ও ইন্সটাগ্রামের জন্য ফাস্ট কাট, এঙ্গেজিং ক্যাপশন এবং পারফেক্ট মিউজিক সিঙ্ক।" },
    { title: "ক্যাটাগরি-ভিত্তিক স্ট্র্যাটেজি", desc: "ফ্যাশনের জন্য কী কাজ করবে আর ফুডের জন্য কী—আমরা সে অনুযায়ী কাজ করি।" },
    { title: "ফুল গ্রোথ সাপোর্ট", desc: "অ্যাড সেটআপ বা ল্যান্ডিং পেজে সাহায্য লাগবে? আমরা এন্ড-টু-এ্যান্ড সাপোর্ট দিই।" }
  ];

  return (
    <section className="py-16 md:py-24 bg-zinc-900 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              আমরা শুধু শুট করি না।<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-400 to-cyan-400">আমরা এমন কন্টেন্ট বানাই যা সেলস বাড়ায়।</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              বেশিরভাগ স্টুডিও শুধু র-ফুটেজ বা সাধারণ ভিডিও ধরিয়ে দেয়। আমরা সোশ্যাল মিডিয়ায় বিক্রির সাইকোলজি বুঝে কন্টেন্ট তৈরি করি, যাতে তা আসলেই কনভার্ট করে।
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 text-accent-400 font-semibold hover:text-cyan-400 transition-colors group">
              প্রজেক্ট নিয়ে কথা বলুন <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {points.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-zinc-950/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-accent-500/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-accent-500/10 text-accent-400 flex items-center justify-center mb-4 font-bold group-hover:bg-accent-500 group-hover:text-white transition-colors shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">{p.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryPortfolio() {
  return (
    <section id="portfolio" className="py-16 md:py-24 bg-zinc-900 relative">
      <div className="absolute top-1/2 left-0 w-full h-[300px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-6">আমাদের পোর্টফোলিও</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            আপনার ব্র্যান্ডের জন্য আমরা কী ধরনের কন্টেন্ট তৈরি করি তা দেখতে নিচের ক্যাটাগরিগুলো ভিজিট করুন।
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Photography Category */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative h-64 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop" 
              alt="Photography Portfolio" 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 backdrop-blur-md flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 transition-transform">
                <Camera size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">ফটোগ্রাফি</h3>
              <Link 
                to="/photos" 
                onClick={() => trackEvent('ViewContent', { content_name: 'Photography Portfolio', content_type: 'category' })}
                className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-full hover:bg-cyan-500 hover:text-white transition-all shadow-lg"
              >
                সব ছবি দেখুন
              </Link>
            </div>
          </motion.div>

          {/* Video Category */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative h-80 rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all duration-500 shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop" 
              alt="Video Portfolio" 
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 backdrop-blur-md flex items-center justify-center mb-6 border border-brand-500/30 group-hover:scale-110 transition-transform">
                <Video size={32} className="text-brand-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">ভিডিও</h3>
              <Link 
                to="/videos" 
                onClick={() => trackEvent('ViewContent', { content_name: 'Video Portfolio', content_type: 'category' })}
                className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-full hover:bg-brand-500 hover:text-white transition-all shadow-lg"
              >
                সব ভিডিও দেখুন
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ClientScreenshots() {
  const [screenshots, setScreenshots] = useState<any[]>([]);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await axios.get('/api/screenshots');
        setScreenshots(response.data);
      } catch (error) {
        console.error('Error fetching screenshots:', error);
      }
    };
    fetchScreenshots();
  }, []);

  if (screenshots.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          আমাদের ক্লায়েন্টদের পেজ
        </motion.h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">যাদের সাথে আমরা কাজ করেছি তাদের কিছু ঝলক</p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex">
        <div className="flex animate-marquee whitespace-nowrap gap-6 px-3">
          {/* Duplicate the array to create an infinite loop effect */}
          {[...screenshots, ...screenshots].map((shot, i) => (
            <div key={`${shot.id}-${i}`} className="relative w-[280px] md:w-[320px] aspect-[9/16] rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800 group">
              <img src={shot.url} alt={shot.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white font-medium truncate">{shot.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SalesReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/salesReports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching sales reports:', error);
      }
    };
    fetchReports();
  }, []);

  if (reports.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-900 relative border-t border-zinc-800">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">আমাদের কাজের ফলাফল</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">ভিডিও অ্যাড দিয়ে আমাদের ক্লায়েন্টদের সেলস রিপোর্ট</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={report.id} 
              className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-colors group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={report.url} alt={report.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{report.title}</h3>
                {report.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed">{report.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: "01", title: "রিকোয়ারমেন্ট আলোচনা", desc: "আমরা আপনার ব্র্যান্ড, টার্গেট অডিয়েন্স এবং ক্যাম্পেইনের লক্ষ্য বুঝি।" },
    { num: "02", title: "কনসেপ্ট ও স্ক্রিপ্ট প্ল্যানিং", desc: "শুটের জন্য হুক, ভিজ্যুয়াল স্টাইল এবং স্ক্রিপ্ট তৈরি করা।" },
    { num: "03", title: "শুট প্ল্যানিং", desc: "মডেল, প্রপস, লোকেশন এবং শিডিউল ঠিক করা।" },
    { num: "04", title: "প্রোডাকশন ডে", desc: "আমাদের প্রফেশনাল স্টুডিও ক্রু দিয়ে শুট সম্পন্ন করা।" },
    { num: "05", title: "এডিটিং ও রিভিউ", desc: "পোস্ট-প্রোডাকশন, কালার গ্রেডিং এবং মোশন গ্রাফিক্স যুক্ত করা।" },
    { num: "06", title: "ফাইনাল ডেলিভারি", desc: "প্রতিটি প্ল্যাটফর্মের জন্য অপ্টিমাইজ করা অ্যাড-রেডি ক্রিয়েটিভ বুঝিয়ে দেওয়া।" },
  ];

  return (
    <section id="process" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">আইডিয়া থেকে <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-brand-400">ফাইনাল ডেলিভারি</span></h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">আপনার সময় বাঁচাতে এবং সেরা রেজাল্ট দিতে আমাদের গোছানো কাজের ধাপ।</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-24 right-24 h-[1px] bg-gradient-to-r from-zinc-800 via-brand-500/30 to-zinc-800 z-0"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="relative z-10 bg-zinc-950/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-cyan-500/50 transition-colors group"
            >
              <div className="text-5xl font-black text-zinc-900 mb-4 group-hover:text-cyan-500/20 transition-colors">{step.num}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    "ফেসবুক অ্যাড ক্রিয়েটিভ",
    "প্রোডাক্ট লঞ্চ ক্যাম্পেইন",
    "নতুন কালেকশন ড্রপ",
    "সিজনাল প্রমোশন",
    "ব্র্যান্ড অ্যাওয়ারনেস রিলস",
    "ওয়েবসাইট ব্যানার ও প্রোডাক্ট পেজ"
  ];

  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ব্র্যান্ডগুলো আমাদের কন্টেন্ট কোথায় ব্যবহার করে</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">কাস্টমার জার্নির প্রতিটি ধাপের জন্য ডিজাইন করা ভার্সেটাইল অ্যাসেট।</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {useCases.map((useCase, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="bg-zinc-950 border border-zinc-800 px-6 py-3 rounded-full flex items-center gap-2 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all cursor-default"
            >
              <CheckCircle2 size={16} className="text-rose-500" />
              <span className="text-zinc-300 font-medium">{useCase}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-zinc-900 border-t border-zinc-800 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-zinc-950 mb-8 shadow-[0_0_30px_rgba(245,158,11,0.5)]"
          >
            <Video size={32} className="fill-zinc-950" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-8"
          >
            আমরা সেইসব ই-কমার্স ব্র্যান্ডের সাথে কাজ করি যাদের <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-400">শুধু একটি ক্যামেরা ক্রু-এর চেয়ে বেশি কিছু প্রয়োজন।</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 leading-relaxed mb-12"
          >
            আমরা ফেসবুক সেলিং, ব্র্যান্ড গ্রোথ এবং ডিজিটাল প্রেজেন্সের জন্য প্রোডাক্ট-ফোকাসড ক্রিয়েটিভ কন্টেন্ট তৈরি করি। আমাদের অ্যাপ্রোচ সিনেমাটিক কোয়ালিটির সাথে ডিরেক্ট-রেসপন্স মার্কেটিং প্রিন্সিপালকে যুক্ত করে।
          </motion.p>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              { title: "আমরা কারা", desc: "ডিরেক্টর, এডিটর এবং মার্কেটারদের একটি টিম যারা এমন ভিজ্যুয়াল স্টোরিটেলিংয়ে বিশ্বাসী যা সেলস আনে।" },
              { title: "কাদের জন্য আমরা", desc: "ফ্যাশন ব্র্যান্ড, গ্যাজেট সেলার, ফুড বিজনেস এবং গ্রোয়িং লোকাল ই-কমার্স স্টোর।" },
              { title: "আমাদের অ্যাপ্রোচ", desc: "স্ট্র্যাটেজি ফার্স্ট। লাইটিং নিয়ে ভাবার আগেই আমরা হুক এবং অফার প্ল্যান করি।" }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                key={i} 
                className="bg-zinc-950/80 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-brand-500/30 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RawToFinalSection() {
  return (
    <section className="py-24 md:py-32 bg-zinc-950 overflow-hidden relative">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[150px]"
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs md:text-sm font-bold mb-6 tracking-wider uppercase"
          >
            Transformation Journey
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black mb-6 leading-tight"
          >
            সাধারণ প্রোডাক্ট থেকে <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-accent-400 to-rose-400">স্ক্রল-স্টপিং ক্রিয়েটিভ</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-base md:text-xl font-medium"
          >
            দেখুন কীভাবে একটি সাধারণ প্রোডাক্ট হাই-কনভার্টিং অ্যাডে রূপান্তরিত হয়। আমাদের ক্রিয়েটিভ টাচ আপনার ব্র্যান্ডকে করে তুলবে অনন্য।
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Before Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-2/5 flex flex-col"
          >
            <div className="group relative flex-grow bg-zinc-900/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all duration-500">
              <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-zinc-800/80 backdrop-blur text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-zinc-700">
                Before
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" 
                  alt="Raw Product" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">র-প্রোডাক্ট ইমেজ</h4>
                <p className="text-sm text-zinc-500 mt-2">সাধারণ ব্যাকগ্রাউন্ড ও লাইটিং</p>
              </div>
            </div>
          </motion.div>

          {/* Transformation Arrow */}
          <div className="flex flex-col items-center justify-center py-4 lg:py-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center text-zinc-950 shadow-[0_0_40px_rgba(245,158,11,0.4)] relative z-10">
                <ArrowRight size={32} className="lg:rotate-0 rotate-90" />
              </div>
            </motion.div>
            <div className="mt-4 hidden lg:block">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-brand-500/50"
              >
                <div className="w-px h-24 bg-gradient-to-b from-brand-500 to-transparent mx-auto"></div>
              </motion.div>
            </div>
          </div>

          {/* After Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-2/5 flex flex-col"
          >
            <div className="group relative flex-grow bg-zinc-900/50 backdrop-blur-sm p-5 md:p-6 rounded-[2rem] border border-brand-500/30 hover:border-brand-500/60 transition-all duration-500 shadow-[0_20px_50px_rgba(245,158,11,0.1)]">
              <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-brand-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                After
              </div>
              <div className="absolute -top-3 -right-3 z-20 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg rotate-12 shadow-xl animate-bounce">
                HIGH CONVERTING!
              </div>
              
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 mb-6 relative group/img">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" 
                  alt="Final Ad" 
                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-full bg-brand-500/90 backdrop-blur-sm text-zinc-950 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6)] cursor-pointer group/play"
                  >
                    <Play size={28} className="fill-zinc-950 ml-1 group-hover/play:scale-110 transition-transform" />
                  </motion.div>
                </div>

                {/* Ad UI Elements */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="bg-zinc-950/90 backdrop-blur-md p-3 rounded-xl border border-zinc-800/50 shadow-2xl transform -translate-y-2 group-hover/img:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Campaign</p>
                    </div>
                    <p className="text-xs font-black text-white">Premium Watch Collection</p>
                    <p className="text-[10px] text-zinc-400">socialads.studio</p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-brand-500 text-zinc-950 text-xs font-black px-5 py-2.5 rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] cursor-pointer"
                  >
                    Shop Now
                  </motion.div>
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">ফাইনাল অ্যাড-রেডি ক্রিয়েটিভ</h4>
                <p className="text-sm text-brand-400 mt-2 font-bold">প্রফেশনাল এডিটিং ও কালার গ্রেডিং</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const packages = [
    {
      name: "স্টার্টার শুট",
      desc: "নতুন প্রোডাক্ট বা সিঙ্গেল ক্যাম্পেইন টেস্ট করার জন্য পারফেক্ট।",
      features: ["১টি প্রোডাক্ট", "১টি শর্ট ভিডিও (১৫-৩০ সেকেন্ড)", "১০টি এডিটেড ছবি", "বেসিক স্ক্রিপ্টিং", "স্ট্যান্ডার্ড ডেলিভারি"],
      highlight: false
    },
    {
      name: "গ্রোথ প্যাকেজ",
      desc: "ফেসবুক ও ইন্সটাগ্রাম অ্যাড স্কেল করার জন্য।",
      features: ["৩টি পর্যন্ত প্রোডাক্ট", "৩টি শর্ট ভিডিও / রিলস", "৩০টি এডিটেড ছবি", "অ্যাড-ফোকাসড স্ক্রিপ্টিং", "মোশন গ্রাফিক্স অন্তর্ভুক্ত"],
      highlight: true
    },
    {
      name: "ব্র্যান্ড প্যাকেজ",
      desc: "ফুল কালেকশন লঞ্চের জন্য কম্প্রিহেন্সিভ কন্টেন্ট।",
      features: ["ফুল কালেকশন শুট", "মাল্টি-ভিডিও ডেলিভারি", "মডেল সোর্সিং", "প্রিমিয়াম কালার গ্রেডিং", "প্রায়োরিটি ডেলিভারি"],
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">প্যাকেজসমূহ</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">স্বচ্ছ প্রাইসিং। নির্দিষ্ট প্রয়োজনের জন্য কাস্টম কোটেশন পাওয়া যায়।</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {packages.map((pkg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              key={i} 
              className={cn(
                "relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 hover:-translate-y-2",
                pkg.highlight 
                  ? "bg-zinc-900 border-brand-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]" 
                  : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:shadow-xl"
              )}
            >
              {pkg.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-400 to-brand-600 text-zinc-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  সবচেয়ে জনপ্রিয়
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-zinc-400 text-sm mb-8">{pkg.desc}</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className={pkg.highlight ? "text-brand-500" : "text-zinc-500"} />
                    <span className="text-sm text-zinc-300">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact" 
                onClick={() => trackEvent('Lead', { content_name: pkg.name, content_category: 'Pricing' })}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-center transition-all duration-300",
                  pkg.highlight
                    ? "bg-brand-500 text-zinc-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600"
                )}
              >
                কাস্টম কোটেশন নিন
              </a>
            </motion.div>
          ))}
        </div>

        <StudioHireSection />
      </div>
    </section>
  );
}

function StudioHireSection() {
  const weekdayRates = [
    { hours: "২ ঘণ্টা স্টুডিও হায়ার", price: "২৫০০ টাকা", note: "(শুধুমাত্র পুরনো ক্লায়েন্টদের জন্য)" },
    { hours: "৪ ঘণ্টা স্টুডিও হায়ার", price: "৪০০০ টাকা", note: "" },
    { hours: "৬ ঘণ্টা স্টুডিও হায়ার", price: "৪৫০০ টাকা", note: "" },
    { hours: "৮ ঘণ্টা স্টুডিও হায়ার", price: "৫০০০ টাকা", note: "" },
  ];

  const weekendRates = [
    { hours: "২ ঘণ্টা স্টুডিও হায়ার", price: "৩০০০ টাকা", note: "(শুধুমাত্র পুরনো ক্লায়েন্টদের জন্য)" },
    { hours: "৪ ঘণ্টা স্টুডিও হায়ার", price: "৪৫০০ টাকা", note: "" },
    { hours: "৬ ঘণ্টা স্টুডিও হায়ার", price: "৫০০০ টাকা", note: "" },
    { hours: "৮ ঘণ্টা স্টুডিও হায়ার", price: "৫৫০০ টাকা", note: "" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto"
    >
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl md:rounded-[2.5rem] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 md:p-12 text-zinc-950">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div>
              <h3 className="text-2xl md:text-4xl font-black mb-2 md:mb-3">স্টুডিও রেন্টিং সার্ভিস</h3>
              <p className="text-sm md:text-base font-medium opacity-90 max-w-xl">
                আমাদের স্টুডিও স্পেস, প্রপস, ব্যাকড্রপ, লাইট এবং ওয়াইফাই সহ সবকিছুই আপনার শুটের জন্য প্রস্তুত।
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/30">
              <p className="text-[10px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">অতিরিক্ত সময়</p>
              <p className="text-lg md:text-2xl font-black">৫০০ টাকা / ঘণ্টা</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Weekdays */}
            <div>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-cyan-500" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white">রবিবার থেকে বৃহস্পতিবার</h4>
              </div>
              <div className="space-y-3 md:space-y-4">
                {weekdayRates.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-5 rounded-xl md:rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/30 transition-colors group">
                    <div>
                      <p className="font-bold text-zinc-200 group-hover:text-white transition-colors text-sm md:text-base">{rate.hours}</p>
                      {rate.note && <p className="text-[10px] md:text-xs text-zinc-500 mt-0.5 md:mt-1">{rate.note}</p>}
                    </div>
                    <p className="text-lg md:text-xl font-black text-cyan-400">{rate.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekends */}
            <div>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-brand-500" />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-white">শুক্রবার ও শনিবার (উইকেন্ড)</h4>
              </div>
              <div className="space-y-3 md:space-y-4">
                {weekendRates.map((rate, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-5 rounded-xl md:rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-brand-500/30 transition-colors group">
                    <div>
                      <p className="font-bold text-zinc-200 group-hover:text-white transition-colors text-sm md:text-base">{rate.hours}</p>
                      {rate.note && <p className="text-[10px] md:text-xs text-zinc-500 mt-0.5 md:mt-1">{rate.note}</p>}
                    </div>
                    <p className="text-lg md:text-xl font-black text-brand-400">{rate.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="space-y-3 md:space-y-4">
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                <span className="text-brand-500 font-bold">***</span> অ্যাটেলিয়ার (Atelier) এর সরবরাহকৃত লাইট বা ইকুইপমেন্ট ছাড়া অন্য কিছু ব্যবহার করলে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।
              </p>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                <span className="text-brand-500 font-bold">***</span> কাস্টম সেশন টাইমিং সম্ভব। আপনার প্রয়োজন অনুযায়ী আমাদের সাথে আলোচনা করুন।
              </p>
            </div>
            <div className="bg-zinc-950 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <div className="flex-grow text-center sm:text-left">
                <p className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2">পেমেন্ট মেথড</p>
                <p className="text-white font-bold text-sm md:text-base">নগদ / বিকাশ: +৮৮০১৭৯৮২০৫১৪৩</p>
              </div>
              <a 
                href="tel:+8801798205143"
                onClick={() => trackEvent('Contact', { method: 'Phone', value: 'Studio Hire' })}
                className="w-full sm:w-auto px-6 py-2.5 md:py-3 bg-zinc-900 text-white rounded-full font-bold border border-zinc-800 hover:border-brand-500 transition-all text-center text-sm md:text-base"
              >
                কল করুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { quote: "তারা আমাদের ফেসবুক অ্যাড পারফরম্যান্স পুরোপুরি বদলে দিয়েছে। ভিডিওগুলো শুধু সুন্দরই না, আসলেই সেলস আনে।", author: "রহিম উ.", brand: "লোকাল ফ্যাশন ব্র্যান্ড" },
    { quote: "দ্রুত ডেলিভারি এবং অসাধারণ কোয়ালিটি। আমাদের স্ক্রিপ্টও লিখতে হয়নি, তারা এ থেকে জেড পর্যন্ত সব সামলেছে।", author: "সাদিয়া ম.", brand: "স্কিনকেয়ার ই-কমার্স" },
    { quote: "ঢাকায় আমাদের সেরা স্টুডিও অভিজ্ঞতা। সোশ্যাল মিডিয়ায় কী কাজ করে সে সম্পর্কে তাদের ধারণা অসাধারণ।", author: "তানভীর হ.", brand: "গ্যাজেট স্টোর" },
  ];

  return (
    <section className="py-16 md:py-24 bg-zinc-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">গ্রোয়িং ব্র্যান্ডগুলোর আস্থার জায়গা</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">শুধু আমাদের কথায় বিশ্বাস করবেন না। আমাদের ক্লায়েন্টরা কী বলে শুনুন।</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              key={i} 
              className="bg-zinc-950 p-6 md:p-8 rounded-xl md:rounded-2xl border border-zinc-800 hover:border-rose-500/30 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(244,63,94,0.1)] transition-all duration-300 group"
            >
              <div className="flex gap-1 mb-4 md:mb-6">
                {[1,2,3,4,5].map(star => (
                  <motion.svg 
                    initial={{ opacity: 0, rotate: -180 }}
                    whileInView={{ opacity: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + star * 0.1 }}
                    key={star} 
                    className="w-4 h-4 md:w-5 md:h-5 text-brand-500 fill-current group-hover:text-brand-400 transition-colors" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </motion.svg>
                ))}
              </div>
              <p className="text-zinc-300 mb-4 md:mb-6 italic leading-relaxed text-sm md:text-base">"{t.quote}"</p>
              <div>
                <p className="font-bold text-white group-hover:text-rose-400 transition-colors text-sm md:text-base">{t.author}</p>
                <p className="text-[10px] md:text-sm text-zinc-500">{t.brand}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Shoot booking কিভাবে করবো?", a: "আমাদের WhatsApp-এ নক দিয়ে আপনার requirement জানালে আমরা একটি custom quote এবং available date জানিয়ে দিবো।" },
    { q: "Script কি আপনারা করে দেন?", a: "হ্যাঁ, আমাদের in-house creative team আছে যারা আপনার প্রোডাক্ট এবং টার্গেট অডিয়েন্স অনুযায়ী script এবং concept তৈরি করে দেয়।" },
    { q: "Model arrange করা যাবে?", a: "অবশ্যই। আমাদের সাথে বেশ কিছু প্রফেশনাল মডেলের কোলাবোরেশন আছে। আপনার প্রয়োজন অনুযায়ী আমরা মডেল arrange করে দিবো।" },
    { q: "কত দিনে delivery দেন?", a: "সাধারণত শুট শেষ হওয়ার পর ৩-৫ কর্মদিবসের মধ্যে আমরা ফাইনাল এডিটেড ভিডিও ডেলিভারি দিয়ে থাকি। তবে প্রজেক্টের সাইজ অনুযায়ী সময় কম-বেশি হতে পারে।" },
    { q: "Facebook ad-এর জন্য optimized video দেন?", a: "হ্যাঁ, আমাদের মূল ফোকাসই হলো ad-ready creative বানানো। আমরা Facebook এবং Instagram-এর best practices ফলো করে ভিডিও এডিট করি।" },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">সাধারণ জিজ্ঞাসা (FAQ)</h2>
          <p className="text-zinc-400 text-sm md:text-base">আপনার মনে কোনো প্রশ্ন থাকলে এখানে উত্তর খুঁজে পেতে পারেন।</p>
        </motion.div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className={cn(
                "border rounded-xl overflow-hidden transition-all duration-300",
                openIndex === i 
                  ? "bg-zinc-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]" 
                  : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              )}
            >
              <button 
                className="w-full px-4 md:px-6 py-3 md:py-4 text-left flex items-center justify-between font-semibold text-white focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={cn("transition-colors duration-300 text-sm md:text-base", openIndex === i ? "text-cyan-400" : "")}>{faq.q}</span>
                <span className={cn("transition-all duration-300", openIndex === i ? "text-cyan-400 rotate-180" : "text-zinc-500")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </button>
              <div className={cn("px-4 md:px-6 overflow-hidden transition-all duration-300 ease-in-out", openIndex === i ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0")}>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FBAdsResultsSection() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/api/fbAdsResults');
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          console.warn("API returned non-array data for FB Ads Results, using demo data");
        }
      } catch (error) {
        console.warn("API not connected, using demo data for FB Ads Results");
      }
    };
    fetchResults();
  }, []);

  const demoResults = [
    { id: 'demo1', url: 'https://picsum.photos/seed/fb1/800/450' },
    { id: 'demo2', url: 'https://picsum.photos/seed/fb2/800/450' },
    { id: 'demo3', url: 'https://picsum.photos/seed/fb3/800/450' },
    { id: 'demo4', url: 'https://picsum.photos/seed/fb4/800/450' },
    { id: 'demo5', url: 'https://picsum.photos/seed/fb5/800/450' },
    { id: 'demo6', url: 'https://picsum.photos/seed/fb6/800/450' },
  ];

  const displayResults = results.length >= 6 ? results.slice(0, 6) : demoResults;
  
  // Split into two rows of 3
  const firstRow = displayResults.slice(0, 3);
  const secondRow = displayResults.slice(3, 6);

  const MarqueeRow = ({ items, reverse = false }: { items: any[], reverse?: boolean }) => (
    <div className="flex overflow-hidden gap-6 py-4">
      <motion.div 
        animate={{ 
          x: ["0%", "-50%"] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-6 min-w-full shrink-0"
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div 
            key={`${item.id}-${i}`} 
            onClick={() => setSelectedImage(item.url)}
            className="w-[300px] md:w-[400px] aspect-video rounded-xl overflow-hidden border border-zinc-800 shrink-0 cursor-pointer hover:border-brand-500/50 transition-colors"
          >
            <img 
              src={item.url} 
              alt="FB Ads Result" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="py-24 bg-zinc-900 relative border-t border-zinc-800 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">ভিডিও এড দ্বারা ক্লায়েন্টের সেলস ডিটেইলস দেখুন</h2>
        </motion.div>

        <div className="space-y-2">
          <MarqueeRow items={firstRow} />
          <MarqueeRow items={secondRow} />
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-brand-500 transition-colors p-2"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged Result" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      )}
    </section>
  );
}

function FinalCTASection() {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('Lead', {
      content_name: 'Contact Form',
      business_name: business
    });
    const text = `হ্যালো, আমি ${name}। আমার ব্যবসার নাম ${business}।\n\n${message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/8801935252007?text=${encodedText}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-brand-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-zinc-950 rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl border border-zinc-800">
          <div className="text-center mb-8 md:mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-5xl font-black text-white mb-4 md:mb-6"
            >
              আপনার প্রজেক্ট নিয়ে আলোচনা করুন
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 font-medium text-base md:text-lg max-w-2xl mx-auto"
            >
              নিচের ফর্মটি পূরণ করুন এবং সরাসরি আমাদের WhatsApp-এ মেসেজ পাঠান।
            </motion.p>
          </div>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleWhatsAppSubmit} 
            className="space-y-4 md:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-zinc-400 text-xs md:text-sm mb-1.5 md:mb-2 font-medium">আপনার নাম</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-brand-500 transition-colors text-sm md:text-base"
                  placeholder="আপনার নাম লিখুন"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs md:text-sm mb-1.5 md:mb-2 font-medium">ব্যবসার নাম</label>
                <input 
                  type="text" 
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-brand-500 transition-colors text-sm md:text-base"
                  placeholder="আপনার ব্যবসার নাম"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs md:text-sm mb-1.5 md:mb-2 font-medium">কী ধরনের সার্ভিস চাচ্ছেন?</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-brand-500 transition-colors h-24 md:h-32 resize-none text-sm md:text-base"
                placeholder="আপনার রিকোয়ারমেন্ট বিস্তারিত লিখুন..."
                required
              ></textarea>
            </div>
            <div className="text-center">
              <button 
                type="submit"
                className="bg-brand-500 text-zinc-950 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold inline-flex items-center gap-2 hover:bg-brand-600 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] text-sm md:text-base"
              >
                <MessageCircle size={18} />
                WhatsApp-এ মেসেজ পাঠান
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

