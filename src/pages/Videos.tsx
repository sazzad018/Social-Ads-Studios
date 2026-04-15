import { useState, useEffect } from 'react';
import api from '../lib/api';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            setVideos([
              { id: 'demo1', title: "Premium Fashion Shoot", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", format: "youtube", createdAt: Date.now() },
              { id: 'demo2', title: "Product Showcase - Gadget", url: "https://www.youtube.com/watch?v=7yL1V6W0YpA", format: "reel", createdAt: Date.now() }
            ]);
          } else {
            setVideos(response.data);
          }
        } else {
          console.error('API returned non-array data for videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);

  const getFormatClasses = (format: string) => {
    switch (format) {
      case 'youtube':
        return 'aspect-video'; // 16:9
      case 'square':
        return 'aspect-square'; // 1:1
      case 'reel':
        return 'aspect-[9/16]'; // 9:16
      default:
        return 'aspect-video';
    }
  };

  const getEmbedUrl = (url: string) => {
    // Basic YouTube URL to Embed URL conversion
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">আমাদের ভিডিও পোর্টফোলিও</h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
            বিভিন্ন ফরম্যাটে আমাদের তৈরি করা সেরা কিছু ভিডিও কন্টেন্ট দেখুন।
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: i % 3 * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="bg-zinc-900 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all duration-500 group hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                onClick={() => trackEvent('ViewContent', { content_name: video.title, content_type: 'video', content_id: video.id })}
              >
                <div className={cn("relative w-full bg-zinc-950", getFormatClasses(video.format))}>
                  {video.url.includes('youtube') || video.url.includes('youtu.be') ? (
                    <iframe 
                      src={getEmbedUrl(video.url)} 
                      title={video.title}
                      className="w-full h-full absolute top-0 left-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={video.url} 
                      controls 
                      className="w-full h-full object-cover absolute top-0 left-0"
                    ></video>
                  )}
                </div>
                <div className="p-5 md:p-8">
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-brand-500/10 text-[9px] md:text-[10px] font-bold text-brand-500 rounded-full border border-brand-500/20 uppercase tracking-widest">
                      {video.format}
                    </span>
                    <div className="h-px flex-grow bg-zinc-800"></div>
                  </div>
                  <h3 className="text-lg md:text-2xl font-black text-white group-hover:text-brand-400 transition-colors leading-tight">{video.title}</h3>
                </div>
              </motion.div>
            ))}
            
            {videos.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-500">
                এখনও কোন ভিডিও যুক্ত করা হয়নি।
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
