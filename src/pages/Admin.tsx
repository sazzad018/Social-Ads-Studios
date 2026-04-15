import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Trash2, Plus, LogOut, Video, Image as ImageIcon, LayoutDashboard, FileText, MonitorPlay, BarChart3, Settings } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [videos, setVideos] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [salesReports, setSalesReports] = useState<any[]>([]);
  const [fbAdsResults, setFBAdsResults] = useState<any[]>([]);
  const [heroVideo, setHeroVideo] = useState<any>(null);
  const [whatWeDoVideos, setWhatWeDoVideos] = useState<any[]>([]);
  const [trackingSettings, setTrackingSettings] = useState({
    fbPixelId: '',
    fbAccessToken: '',
    fbTestEventCode: '',
    ga4MeasurementId: ''
  });
  
  const [newVideo, setNewVideo] = useState({ title: '', url: '', format: 'youtube' });
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '', format: 'landscape' });
  const [newScreenshot, setNewScreenshot] = useState({ title: '', url: '' });
  const [newSalesReport, setNewSalesReport] = useState({ title: '', url: '', description: '' });
  const [newFBAdsResult, setNewFBAdsResult] = useState({ title: '', url: '' });
  const [newHeroVideo, setNewHeroVideo] = useState({ url: '', backgroundUrl: '', thumbnailUrl: '' });
  const [newWhatWeDoVideo, setNewWhatWeDoVideo] = useState({ title: '', url: '', thumbnailUrl: '' });

  const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, screenshots, sales, hero, whatwedo, tracking

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const qVideos = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const unsubscribeVideos = onSnapshot(qVideos, (snapshot) => {
      setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'videos');
    });

    const qPhotos = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const unsubscribePhotos = onSnapshot(qPhotos, (snapshot) => {
      setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'photos');
    });

    const qScreenshots = query(collection(db, 'screenshots'), orderBy('createdAt', 'desc'));
    const unsubscribeScreenshots = onSnapshot(qScreenshots, (snapshot) => {
      setScreenshots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'screenshots');
    });

    const qSalesReports = query(collection(db, 'salesReports'), orderBy('createdAt', 'desc'));
    const unsubscribeSalesReports = onSnapshot(qSalesReports, (snapshot) => {
      setSalesReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'salesReports');
    });
    
    const qFBAdsResults = query(collection(db, 'fbAdsResults'), orderBy('createdAt', 'desc'));
    const unsubscribeFBAdsResults = onSnapshot(qFBAdsResults, (snapshot) => {
      setFBAdsResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'fbAdsResults');
    });

    const unsubscribeHeroVideo = onSnapshot(doc(db, 'settings', 'heroVideo'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHeroVideo(data);
        setNewHeroVideo({ 
          url: data.url || '', 
          backgroundUrl: data.backgroundUrl || '',
          thumbnailUrl: data.thumbnailUrl || '' 
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/heroVideo');
    });

    const qWhatWeDoVideos = query(collection(db, 'whatWeDoVideos'), orderBy('createdAt', 'desc'));
    const unsubscribeWhatWeDoVideos = onSnapshot(qWhatWeDoVideos, (snapshot) => {
      setWhatWeDoVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'whatWeDoVideos');
    });

    const unsubscribeTracking = onSnapshot(doc(db, 'settings', 'tracking'), (docSnap) => {
      if (docSnap.exists()) {
        setTrackingSettings(docSnap.data() as any);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/tracking');
    });

    return () => {
      unsubscribeVideos();
      unsubscribePhotos();
      unsubscribeScreenshots();
      unsubscribeSalesReports();
      unsubscribeFBAdsResults();
      unsubscribeHeroVideo();
      unsubscribeWhatWeDoVideos();
      unsubscribeTracking();
    };
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      if (email === 'sheikhhasan749@gmail.com' && password === 'Hasan#333') {
        // If it's the master credentials, try to create the user if they don't exist
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            setError('');
            return;
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              setError('এই ইমেইলটি ইতিমধ্যে ব্যবহার করা হয়েছে, কিন্তু পাসওয়ার্ডটি মিলছে না। অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
            } else {
              setError(`অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে: ${createErr.message}`);
            }
          }
        } else if (err.code === 'auth/wrong-password') {
          setError('পাসওয়ার্ডটি ভুল। আপনি কি আগে অন্য পাসওয়ার্ড ব্যবহার করেছিলেন?');
        } else {
          setError(`লগইন ব্যর্থ হয়েছে: ${err.message} (${err.code})`);
        }
      } else {
        setError('ইমেইল বা পাসওয়ার্ড ভুল।');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;
    try {
      await addDoc(collection(db, 'videos'), {
        ...newVideo,
        createdAt: Date.now()
      });
      setNewVideo({ title: '', url: '', format: 'youtube' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'videos');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `videos/${id}`);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.url) return;
    try {
      await addDoc(collection(db, 'photos'), {
        ...newPhoto,
        createdAt: Date.now()
      });
      setNewPhoto({ title: '', url: '', format: 'landscape' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'photos');
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'photos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `photos/${id}`);
    }
  };

  const handleAddScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenshot.title || !newScreenshot.url) return;
    try {
      await addDoc(collection(db, 'screenshots'), {
        ...newScreenshot,
        createdAt: Date.now()
      });
      setNewScreenshot({ title: '', url: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'screenshots');
    }
  };

  const handleDeleteScreenshot = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'screenshots', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `screenshots/${id}`);
    }
  };

  const handleAddSalesReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalesReport.title || !newSalesReport.url) return;
    try {
      await addDoc(collection(db, 'salesReports'), {
        ...newSalesReport,
        createdAt: Date.now()
      });
      setNewSalesReport({ title: '', url: '', description: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'salesReports');
    }
  };

  const handleDeleteSalesReport = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'salesReports', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `salesReports/${id}`);
    }
  };

  const handleAddFBAdsResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFBAdsResult.title || !newFBAdsResult.url) return;
    try {
      await addDoc(collection(db, 'fbAdsResults'), {
        ...newFBAdsResult,
        createdAt: Date.now()
      });
      setNewFBAdsResult({ title: '', url: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'fbAdsResults');
    }
  };

  const handleDeleteFBAdsResult = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fbAdsResults', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `fbAdsResults/${id}`);
    }
  };

  const handleSaveHeroVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'heroVideo'), {
        ...newHeroVideo,
        updatedAt: Date.now()
      });
      alert('Hero Video Updated Successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/heroVideo');
    }
  };

  const handleSaveWhatWeDoVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhatWeDoVideo.title || !newWhatWeDoVideo.url || !newWhatWeDoVideo.thumbnailUrl) return;
    try {
      await addDoc(collection(db, 'whatWeDoVideos'), {
        ...newWhatWeDoVideo,
        createdAt: Date.now()
      });
      setNewWhatWeDoVideo({ title: '', url: '', thumbnailUrl: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'whatWeDoVideos');
    }
  };

  const handleSaveTrackingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'tracking'), {
        ...trackingSettings,
        updatedAt: Date.now()
      });
      alert('ট্র্যাকিং সেটিংস সফলভাবে আপডেট করা হয়েছে!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/tracking');
    }
  };

  const handleDeleteWhatWeDoVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'whatWeDoVideos', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `whatWeDoVideos/${id}`);
    }
  };

  const handleSeedPhotos = async () => {
    if (!confirm('আপনি কি ফটোগ্রাফি ডেমো ছবিগুলো যুক্ত করতে চান?')) return;
    try {
      const demoPhotos = [
        { title: "Elegant Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", format: "landscape", createdAt: Date.now() },
        { title: "Fashion Model", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", format: "portrait", createdAt: Date.now() },
        { title: "Modern Workspace", url: "https://images.unsplash.com/photo-1497366216548-37526070297c", format: "landscape", createdAt: Date.now() },
        { title: "Luxury Perfume", url: "https://images.unsplash.com/photo-1541643600914-78b084683601", format: "portrait", createdAt: Date.now() },
        { title: "Gourmet Food", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", format: "landscape", createdAt: Date.now() },
        { title: "Tech Gadgets", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", format: "square", createdAt: Date.now() }
      ];
      for (const p of demoPhotos) await addDoc(collection(db, 'photos'), p);
      alert('ডেমো ছবিগুলো সফলভাবে যুক্ত করা হয়েছে!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'photos');
    }
  };

  const handleSeedDemoData = async () => {
    if (!confirm('আপনি কি ডেমো ডাটা যুক্ত করতে চান? এটি আপনার বর্তমান ডাটার সাথে নতুন কিছু ডেমো কন্টেন্ট যুক্ত করবে।')) return;
    
    try {
      // Seed Videos
      const demoVideos = [
        { title: "Premium Fashion Shoot", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", format: "youtube", createdAt: Date.now() },
        { title: "Product Showcase - Gadget", url: "https://www.youtube.com/watch?v=7yL1V6W0YpA", format: "reel", createdAt: Date.now() }
      ];
      for (const v of demoVideos) await addDoc(collection(db, 'videos'), v);

      // Seed Photos
      const demoPhotos = [
        { title: "Elegant Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", format: "landscape", createdAt: Date.now() },
        { title: "Fashion Model", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", format: "portrait", createdAt: Date.now() },
        { title: "Modern Workspace", url: "https://images.unsplash.com/photo-1497366216548-37526070297c", format: "landscape", createdAt: Date.now() },
        { title: "Luxury Perfume", url: "https://images.unsplash.com/photo-1541643600914-78b084683601", format: "portrait", createdAt: Date.now() },
        { title: "Gourmet Food", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", format: "landscape", createdAt: Date.now() },
        { title: "Tech Gadgets", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c", format: "square", createdAt: Date.now() }
      ];
      for (const p of demoPhotos) await addDoc(collection(db, 'photos'), p);

      // Seed Screenshots
      const demoScreenshots = [
        { title: "Client Review 1", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df", createdAt: Date.now() },
        { title: "Client Review 2", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df", createdAt: Date.now() }
      ];
      for (const s of demoScreenshots) await addDoc(collection(db, 'screenshots'), s);

      // Seed Sales Reports
      const demoSales = [
        { title: "Q1 Growth Report", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f", description: "Significant growth in e-commerce sector.", createdAt: Date.now() }
      ];
      for (const sr of demoSales) await addDoc(collection(db, 'salesReports'), sr);

      alert('ডেমো ডাটা সফলভাবে যুক্ত করা হয়েছে!');
    } catch (err) {
      alert('ডেমো ডাটা যুক্ত করতে সমস্যা হয়েছে।');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-zinc-950">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">এডমিন লগইন</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">ইমেইল</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">পাসওয়ার্ড</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">এডমিন ড্যাশবোর্ড</h1>
          <div className="flex gap-4">
            <button 
              onClick={handleSeedDemoData}
              className="flex items-center gap-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 px-4 py-2 rounded-lg border border-brand-500/20 transition-colors"
            >
              <Plus size={18} />
              ডেমো ডাটা যুক্ত করুন
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-800 transition-colors"
            >
              <LogOut size={18} />
              লগআউট
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800 pb-4">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'portfolio' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            পোর্টফোলিও (ভিডিও/ছবি)
          </button>
          <button 
            onClick={() => setActiveTab('screenshots')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'screenshots' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            ক্লায়েন্ট স্ক্রিনশট
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'sales' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            সেলস রিপোর্ট
          </button>
          <button 
            onClick={() => setActiveTab('fbads')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'fbads' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            ফেসবুক অ্যাড রেজাল্ট
          </button>
          <button 
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'hero' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            হিরো সেকশন ভিডিও
          </button>
          <button 
            onClick={() => setActiveTab('whatwedo')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'whatwedo' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            আমরা যা করি (ভিডিও)
          </button>
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'tracking' ? 'bg-brand-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
          >
            ট্র্যাকিং ও অ্যানালিটিক্স
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Videos Section */}
            <div className="space-y-8">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Video className="text-brand-500" />
                  নতুন ভিডিও যোগ করুন
                </h2>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="ভিডিওর টাইটেল" 
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="ভিডিওর লিংক (YouTube বা Server URL)" 
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <select 
                    value={newVideo.format}
                    onChange={(e) => setNewVideo({...newVideo, format: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="youtube">YouTube Format</option>
                    <option value="square">Square Format (1:1)</option>
                    <option value="reel">Reels Format (9:16)</option>
                  </select>
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Plus size={20} />
                    ভিডিও যোগ করুন
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">সব ভিডিও</h3>
                {videos.map(video => (
                  <div key={video.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-zinc-500 text-sm">{video.format} • {new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteVideo(video.id)}
                      className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div className="space-y-8">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ImageIcon className="text-brand-500" />
                  নতুন ছবি যোগ করুন
                </h2>
                <form onSubmit={handleAddPhoto} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="ছবির টাইটেল" 
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="ছবির লিংক (Image URL)" 
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <select 
                    value={newPhoto.format}
                    onChange={(e) => setNewPhoto({...newPhoto, format: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="landscape">Landscape (16:9)</option>
                    <option value="portrait">Portrait (4:5)</option>
                    <option value="square">Square (1:1)</option>
                  </select>
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Plus size={20} />
                    ছবি যোগ করুন
                  </button>
                </form>
                <button 
                  onClick={handleSeedPhotos}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-zinc-800 text-zinc-400 font-bold py-2 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  <Plus size={16} />
                  ডেমো ছবিগুলো যুক্ত করুন
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">সব ছবি</h3>
                {photos.map(photo => (
                  <div key={photo.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{photo.title}</h4>
                      <p className="text-zinc-500 text-sm">{photo.format} • {new Date(photo.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screenshots' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <LayoutDashboard className="text-brand-500" />
                  নতুন ক্লায়েন্ট স্ক্রিনশট যোগ করুন
                </h2>
                <form onSubmit={handleAddScreenshot} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="ক্লায়েন্টের নাম / টাইটেল" 
                    value={newScreenshot.title}
                    onChange={(e) => setNewScreenshot({...newScreenshot, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="স্ক্রিনশট ইমেজ লিংক (Reels Size 9:16)" 
                    value={newScreenshot.url}
                    onChange={(e) => setNewScreenshot({...newScreenshot, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Plus size={20} />
                    স্ক্রিনশট যোগ করুন
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">সব স্ক্রিনশট</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {screenshots.map(screenshot => (
                  <div key={screenshot.id} className="bg-zinc-900 p-2 rounded-xl border border-zinc-800 relative group">
                    <img src={screenshot.url} alt={screenshot.title} className="w-full aspect-[9/16] object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl p-2 text-center">
                      <p className="text-white text-sm font-medium mb-2">{screenshot.title}</p>
                      <button 
                        onClick={() => handleDeleteScreenshot(screenshot.id)}
                        className="text-red-500 hover:text-red-400 p-2 bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="text-brand-500" />
                  নতুন সেলস রিপোর্ট যোগ করুন
                </h2>
                <form onSubmit={handleAddSalesReport} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="রিপোর্টের টাইটেল (যেমন: Client X ROAS 5x)" 
                    value={newSalesReport.title}
                    onChange={(e) => setNewSalesReport({...newSalesReport, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="রিপোর্টের ইমেজ লিংক" 
                    value={newSalesReport.url}
                    onChange={(e) => setNewSalesReport({...newSalesReport, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <textarea 
                    placeholder="বিস্তারিত বিবরণ (ঐচ্ছিক)" 
                    value={newSalesReport.description}
                    onChange={(e) => setNewSalesReport({...newSalesReport, description: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 h-24 resize-none"
                  />
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Plus size={20} />
                    রিপোর্ট যোগ করুন
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">সব সেলস রিপোর্ট</h3>
              <div className="flex flex-col gap-4">
                {salesReports.map(report => (
                  <div key={report.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-4 items-center">
                    <img src={report.url} alt={report.title} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{report.title}</h4>
                      <p className="text-zinc-400 text-sm line-clamp-2">{report.description}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteSalesReport(report.id)}
                      className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fbads' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="text-brand-500" />
                  নতুন ফেসবুক অ্যাড রেজাল্ট যোগ করুন
                </h2>
                <form onSubmit={handleAddFBAdsResult} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="রেজাল্ট টাইটেল" 
                    value={newFBAdsResult.title}
                    onChange={(e) => setNewFBAdsResult({...newFBAdsResult, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="রেজাল্ট ইমেজ লিংক" 
                    value={newFBAdsResult.url}
                    onChange={(e) => setNewFBAdsResult({...newFBAdsResult, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    <Plus size={20} />
                    রেজাল্ট যোগ করুন
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">সব ফেসবুক অ্যাড রেজাল্ট</h3>
              <div className="grid grid-cols-2 gap-4">
                {fbAdsResults.map(result => (
                  <div key={result.id} className="bg-zinc-900 p-2 rounded-xl border border-zinc-800 relative group">
                    <img src={result.url} alt={result.title} className="w-full aspect-video object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl p-2 text-center">
                      <p className="text-white text-sm font-medium mb-2">{result.title}</p>
                      <button 
                        onClick={() => handleDeleteFBAdsResult(result.id)}
                        className="text-red-500 hover:text-red-400 p-2 bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="max-w-2xl">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MonitorPlay className="text-brand-500" />
                হিরো সেকশন ভিডিও আপডেট করুন
              </h2>
              <form onSubmit={handleSaveHeroVideo} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">পপ-আপ ভিডিও URL (YouTube বা MP4)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newHeroVideo.url}
                    onChange={(e) => setNewHeroVideo({...newHeroVideo, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">ব্যাকগ্রাউন্ড ভিডিও URL (MP4 recommended)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newHeroVideo.backgroundUrl}
                    onChange={(e) => setNewHeroVideo({...newHeroVideo, backgroundUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">থাম্বনেইল ইমেজ URL</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newHeroVideo.thumbnailUrl}
                    onChange={(e) => setNewHeroVideo({...newHeroVideo, thumbnailUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                
                {newHeroVideo.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-400 mb-2">থাম্বনেইল প্রিভিউ:</p>
                    <img src={newHeroVideo.thumbnailUrl} alt="Thumbnail Preview" className="w-full max-w-md rounded-xl border border-zinc-800" />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors mt-4"
                >
                  সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'whatwedo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MonitorPlay className="text-brand-500" />
                'আমরা যা করি' সেকশন ভিডিও যোগ করুন
              </h2>
              <form onSubmit={handleSaveWhatWeDoVideo} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">ভিডিও টাইটেল</label>
                  <input 
                    type="text" 
                    placeholder="ভিডিওর নাম" 
                    value={newWhatWeDoVideo.title}
                    onChange={(e) => setNewWhatWeDoVideo({...newWhatWeDoVideo, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">ভিডিও URL (YouTube বা MP4)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newWhatWeDoVideo.url}
                    onChange={(e) => setNewWhatWeDoVideo({...newWhatWeDoVideo, url: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">থাম্বনেইল ইমেজ URL</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={newWhatWeDoVideo.thumbnailUrl}
                    onChange={(e) => setNewWhatWeDoVideo({...newWhatWeDoVideo, thumbnailUrl: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                
                {newWhatWeDoVideo.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-400 mb-2">থাম্বনেইল প্রিভিউ:</p>
                    <img src={newWhatWeDoVideo.thumbnailUrl} alt="Thumbnail Preview" className="w-full max-w-md rounded-xl border border-zinc-800" />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors mt-4"
                >
                  <Plus size={20} />
                  ভিডিও যোগ করুন
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">সব ভিডিও</h3>
              <div className="flex flex-col gap-4">
                {whatWeDoVideos.map(video => (
                  <div key={video.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-4 items-center">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-zinc-500 text-sm">{new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteWhatWeDoVideo(video.id)}
                      className="text-red-500 hover:text-red-400 p-2 bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="max-w-2xl">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-brand-500" />
                ট্র্যাকিং ও অ্যানালিটিক্স সেটিংস
              </h2>
              <form onSubmit={handleSaveTrackingSettings} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-brand-500 font-bold border-b border-zinc-800 pb-2">Facebook Pixel & CAPI</h3>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Facebook Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: 1234567890" 
                      value={trackingSettings.fbPixelId}
                      onChange={(e) => setTrackingSettings({...trackingSettings, fbPixelId: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Facebook CAPI Access Token</label>
                    <textarea 
                      placeholder="EAAB..." 
                      value={trackingSettings.fbAccessToken}
                      onChange={(e) => setTrackingSettings({...trackingSettings, fbAccessToken: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 h-24 resize-none"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">এটি সার্ভার সাইড ট্র্যাকিংয়ের (CAPI) জন্য প্রয়োজন।</p>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Facebook Test Event Code (ঐচ্ছিক)</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: TEST12345" 
                      value={trackingSettings.fbTestEventCode}
                      onChange={(e) => setTrackingSettings({...trackingSettings, fbTestEventCode: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">ইভেন্ট টেস্টিং করার সময় এটি ব্যবহার করুন।</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-brand-500 font-bold border-b border-zinc-800 pb-2">Google Analytics 4</h3>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">GA4 Measurement ID</label>
                    <input 
                      type="text" 
                      placeholder="যেমন: G-XXXXXXXXXX" 
                      value={trackingSettings.ga4MeasurementId}
                      onChange={(e) => setTrackingSettings({...trackingSettings, ga4MeasurementId: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 text-zinc-950 font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors mt-4"
                >
                  সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
