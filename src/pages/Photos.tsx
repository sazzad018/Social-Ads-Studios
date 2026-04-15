import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/tracking';

export default function Photos() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(qPhotos, (snapshot) => {
      const dbPhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (dbPhotos.length === 0) {
        setPhotos([
          { id: 'demo1', title: "Elegant Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", format: "landscape", createdAt: Date.now() },
          { id: 'demo2', title: "Fashion Model", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", format: "portrait", createdAt: Date.now() },
          { id: 'demo3', title: "Modern Workspace", url: "https://images.unsplash.com/photo-1497366216548-37526070297c", format: "landscape", createdAt: Date.now() },
          { id: 'demo4', title: "Luxury Perfume", url: "https://images.unsplash.com/photo-1541643600914-78b084683601", format: "portrait", createdAt: Date.now() },
          { id: 'demo5', title: "Gourmet Food", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", format: "landscape", createdAt: Date.now() },
          { id: 'demo6', title: "Tech Gadgets", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", format: "square", createdAt: Date.now() }
        ]);
      } else {
        setPhotos(dbPhotos);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'photos');
    });

    return () => unsubscribe();
  }, []);

  const getFormatClasses = (format: string) => {
    switch (format) {
      case 'landscape':
        return 'aspect-video'; // 16:9
      case 'portrait':
        return 'aspect-[4/5]'; // 4:5
      case 'square':
        return 'aspect-square'; // 1:1
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">আমাদের ফটোগ্রাফি পোর্টফোলিও</h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
            প্রোডাক্ট এবং ব্র্যান্ডের জন্য আমাদের তোলা সেরা কিছু ছবি দেখুন।
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: i % 3 * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                className="break-inside-avoid group cursor-pointer relative rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all duration-500 shadow-xl hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                onClick={() => trackEvent('ViewContent', { content_name: photo.title, content_type: 'photo', content_id: photo.id })}
              >
                <div className={cn("relative w-full bg-zinc-900", getFormatClasses(photo.format))}>
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8">
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-brand-500/20 backdrop-blur-md text-[8px] md:text-[10px] font-bold text-brand-400 rounded-md border border-brand-500/30 uppercase tracking-widest">
                        {photo.format}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-white group-hover:text-brand-300 transition-colors leading-tight">{photo.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {photos.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-500">
                এখনও কোন ছবি যুক্ত করা হয়নি।
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
