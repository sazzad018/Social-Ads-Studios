import React, { useState, useEffect } from "react";
import api from "../lib/api";
import {
  Trash2,
  Plus,
  LogOut,
  Video,
  Image as ImageIcon,
  LayoutDashboard,
  FileText,
  MonitorPlay,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [videos, setVideos] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [salesReports, setSalesReports] = useState<any[]>([]);
  const [fbAdsResults, setFBAdsResults] = useState<any[]>([]);
  const [heroVideo, setHeroVideo] = useState<any>(null);
  const [whatWeDoVideos, setWhatWeDoVideos] = useState<any[]>([]);
  const [trackingSettings, setTrackingSettings] = useState({
    fbPixelId: "",
    fbAccessToken: "",
    fbTestEventCode: "",
    ga4MeasurementId: "",
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    url: "",
    format: "youtube",
  });
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    url: "",
    format: "landscape",
  });
  const [newScreenshot, setNewScreenshot] = useState({ title: "", url: "" });
  const [newSalesReport, setNewSalesReport] = useState({
    title: "",
    url: "",
    description: "",
  });
  const [newFBAdsResult, setNewFBAdsResult] = useState({ title: "", url: "" });
  const [newHeroVideo, setNewHeroVideo] = useState({
    url: "",
    backgroundUrl: "",
    thumbnailUrl: "",
  });
  const [newWhatWeDoVideo, setNewWhatWeDoVideo] = useState({
    title: "",
    url: "",
    thumbnailUrl: "",
  });

  const [activeTab, setActiveTab] = useState("portfolio"); // portfolio, screenshots, sales, hero, whatwedo, tracking

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        });
    }
  }, []);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [vRes, pRes, sRes, srRes, fbRes, hRes, wRes, tRes] =
        await Promise.all([
          api.get("/videos"),
          api.get("/photos"),
          api.get("/screenshots"),
          api.get("/salesReports"),
          api.get("/fbAdsResults"),
          api.get("/settings/heroVideo"),
          api.get("/whatWeDoVideos"),
          api.get("/settings/tracking_private"),
        ]);

      if (Array.isArray(vRes.data)) setVideos(vRes.data);
      if (Array.isArray(pRes.data)) setPhotos(pRes.data);
      if (Array.isArray(sRes.data)) setScreenshots(sRes.data);
      if (Array.isArray(srRes.data)) setSalesReports(srRes.data);
      if (Array.isArray(fbRes.data)) setFBAdsResults(fbRes.data);

      if (hRes.data) {
        setHeroVideo(hRes.data);
        setNewHeroVideo({
          url: hRes.data.url || "",
          backgroundUrl: hRes.data.backgroundUrl || "",
          thumbnailUrl: hRes.data.thumbnailUrl || "",
        });
      }

      if (Array.isArray(wRes.data)) setWhatWeDoVideos(wRes.data);

      if (tRes.data) {
        setTrackingSettings(tRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;
      setUser(res.data.user);
    } catch (err: any) {
      setError("ইমেইল বা পাসওয়ার্ড ভুল।");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;
    try {
      await api.post("/videos", { ...newVideo, createdAt: Date.now() });
      setNewVideo({ title: "", url: "", format: "youtube" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await api.delete(`/videos/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.url) return;
    try {
      await api.post("/photos", { ...newPhoto, createdAt: Date.now() });
      setNewPhoto({ title: "", url: "", format: "landscape" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await api.delete(`/photos/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenshot.title || !newScreenshot.url) return;
    try {
      await api.post("/screenshots", {
        ...newScreenshot,
        createdAt: Date.now(),
      });
      setNewScreenshot({ title: "", url: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteScreenshot = async (id: string) => {
    try {
      await api.delete(`/screenshots/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSalesReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalesReport.title || !newSalesReport.url) return;
    try {
      await api.post("/salesReports", {
        ...newSalesReport,
        createdAt: Date.now(),
      });
      setNewSalesReport({ title: "", url: "", description: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSalesReport = async (id: string) => {
    try {
      await api.delete(`/salesReports/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFBAdsResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFBAdsResult.title || !newFBAdsResult.url) return;
    try {
      await api.post("/fbAdsResults", {
        ...newFBAdsResult,
        createdAt: Date.now(),
      });
      setNewFBAdsResult({ title: "", url: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFBAdsResult = async (id: string) => {
    try {
      await api.delete(`/fbAdsResults/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveHeroVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/settings/heroVideo", {
        ...newHeroVideo,
        updatedAt: Date.now(),
      });
      alert("Hero Video Updated Successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveWhatWeDoVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newWhatWeDoVideo.title ||
      !newWhatWeDoVideo.url ||
      !newWhatWeDoVideo.thumbnailUrl
    )
      return;
    try {
      await api.post("/whatWeDoVideos", {
        ...newWhatWeDoVideo,
        createdAt: Date.now(),
      });
      setNewWhatWeDoVideo({ title: "", url: "", thumbnailUrl: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTrackingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/settings/tracking_private", {
        ...trackingSettings,
        updatedAt: Date.now(),
      });
      alert("ট্র্যাকিং সেটিংস সফলভাবে আপডেট করা হয়েছে!");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWhatWeDoVideo = async (id: string) => {
    try {
      await api.delete(`/whatWeDoVideos/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedPhotos = async () => {
    if (!confirm("আপনি কি ফটোগ্রাফি ডেমো ছবিগুলো যুক্ত করতে চান?")) return;
    try {
      const demoPhotos = [
        {
          title: "Elegant Watch",
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Fashion Model",
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
          format: "portrait",
          createdAt: Date.now(),
        },
        {
          title: "Modern Workspace",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Luxury Perfume",
          url: "https://images.unsplash.com/photo-1541643600914-78b084683601",
          format: "portrait",
          createdAt: Date.now(),
        },
        {
          title: "Gourmet Food",
          url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Tech Gadgets",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
          format: "square",
          createdAt: Date.now(),
        },
      ];
      for (const p of demoPhotos) await api.post("/photos", p);
      alert("ডেমো ছবিগুলো সফলভাবে যুক্ত করা হয়েছে!");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedDemoData = async () => {
    if (
      !confirm(
        "আপনি কি ডেমো ডাটা যুক্ত করতে চান? এটি আপনার বর্তমান ডাটার সাথে নতুন কিছু ডেমো কন্টেন্ট যুক্ত করবে।",
      )
    )
      return;

    try {
      // Seed Videos
      const demoVideos = [
        {
          title: "Premium Fashion Shoot",
          url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          format: "youtube",
          createdAt: Date.now(),
        },
        {
          title: "Product Showcase - Gadget",
          url: "https://www.youtube.com/watch?v=7yL1V6W0YpA",
          format: "reel",
          createdAt: Date.now(),
        },
      ];
      for (const v of demoVideos) await api.post("/videos", v);

      // Seed Photos
      const demoPhotos = [
        {
          title: "Elegant Watch",
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Fashion Model",
          url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
          format: "portrait",
          createdAt: Date.now(),
        },
        {
          title: "Modern Workspace",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Luxury Perfume",
          url: "https://images.unsplash.com/photo-1541643600914-78b084683601",
          format: "portrait",
          createdAt: Date.now(),
        },
        {
          title: "Gourmet Food",
          url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          format: "landscape",
          createdAt: Date.now(),
        },
        {
          title: "Tech Gadgets",
          url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
          format: "square",
          createdAt: Date.now(),
        },
      ];
      for (const p of demoPhotos) await api.post("/photos", p);

      // Seed Screenshots
      const demoScreenshots = [
        {
          title: "Client Review 1",
          url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
          createdAt: Date.now(),
        },
        {
          title: "Client Review 2",
          url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
          createdAt: Date.now(),
        },
      ];
      for (const s of demoScreenshots) await api.post("/screenshots", s);

      // Seed Sales Reports
      const demoSales = [
        {
          title: "Q1 Growth Report",
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
          description: "Significant growth in e-commerce sector.",
          createdAt: Date.now(),
        },
      ];
      for (const sr of demoSales) await api.post("/salesReports", sr);

      alert("ডেমো ডাটা সফলভাবে যুক্ত করা হয়েছে!");
      fetchData();
    } catch (err) {
      alert("ডেমো ডাটা যুক্ত করতে সমস্যা হয়েছে।");
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-zinc-950">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            এডমিন লগইন
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
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
              <label className="block text-zinc-400 text-sm mb-2">
                পাসওয়ার্ড
              </label>
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
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "portfolio" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            পোর্টফোলিও (ভিডিও/ছবি)
          </button>
          <button
            onClick={() => setActiveTab("screenshots")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "screenshots" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            ক্লায়েন্ট স্ক্রিনশট
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "sales" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            সেলস রিপোর্ট
          </button>
          <button
            onClick={() => setActiveTab("fbads")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "fbads" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            ফেসবুক অ্যাড রেজাল্ট
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "hero" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            হিরো সেকশন ভিডিও
          </button>
          <button
            onClick={() => setActiveTab("whatwedo")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "whatwedo" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            আমরা যা করি (ভিডিও)
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "tracking" ? "bg-brand-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            ট্র্যাকিং ও অ্যানালিটিক্স
          </button>
        </div>

        {activeTab === "portfolio" && (
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
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="ভিডিওর লিংক (YouTube বা Server URL)"
                    value={newVideo.url}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, url: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <select
                    value={newVideo.format}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, format: e.target.value })
                    }
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
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-zinc-500 text-sm">
                        {video.format} •{" "}
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
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
                    onChange={(e) =>
                      setNewPhoto({ ...newPhoto, title: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="ছবির লিংক (Image URL)"
                    value={newPhoto.url}
                    onChange={(e) =>
                      setNewPhoto({ ...newPhoto, url: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <select
                    value={newPhoto.format}
                    onChange={(e) =>
                      setNewPhoto({ ...newPhoto, format: e.target.value })
                    }
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
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-white font-medium">{photo.title}</h4>
                      <p className="text-zinc-500 text-sm">
                        {photo.format} •{" "}
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
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

        {activeTab === "screenshots" && (
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
                    onChange={(e) =>
                      setNewScreenshot({
                        ...newScreenshot,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="স্ক্রিনশট ইমেজ লিংক (Reels Size 9:16)"
                    value={newScreenshot.url}
                    onChange={(e) =>
                      setNewScreenshot({
                        ...newScreenshot,
                        url: e.target.value,
                      })
                    }
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
                {screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="bg-zinc-900 p-2 rounded-xl border border-zinc-800 relative group"
                  >
                    <img
                      src={screenshot.url}
                      alt={screenshot.title}
                      className="w-full aspect-[9/16] object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl p-2 text-center">
                      <p className="text-white text-sm font-medium mb-2">
                        {screenshot.title}
                      </p>
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

        {activeTab === "sales" && (
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
                    onChange={(e) =>
                      setNewSalesReport({
                        ...newSalesReport,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="রিপোর্টের ইমেজ লিংক"
                    value={newSalesReport.url}
                    onChange={(e) =>
                      setNewSalesReport({
                        ...newSalesReport,
                        url: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <textarea
                    placeholder="বিস্তারিত বিবরণ (ঐচ্ছিক)"
                    value={newSalesReport.description}
                    onChange={(e) =>
                      setNewSalesReport({
                        ...newSalesReport,
                        description: e.target.value,
                      })
                    }
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
                {salesReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-4 items-center"
                  >
                    <img
                      src={report.url}
                      alt={report.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{report.title}</h4>
                      <p className="text-zinc-400 text-sm line-clamp-2">
                        {report.description}
                      </p>
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

        {activeTab === "fbads" && (
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
                    onChange={(e) =>
                      setNewFBAdsResult({
                        ...newFBAdsResult,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <input
                    type="url"
                    placeholder="রেজাল্ট ইমেজ লিংক"
                    value={newFBAdsResult.url}
                    onChange={(e) =>
                      setNewFBAdsResult({
                        ...newFBAdsResult,
                        url: e.target.value,
                      })
                    }
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
              <h3 className="text-lg font-bold text-white">
                সব ফেসবুক অ্যাড রেজাল্ট
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {fbAdsResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-zinc-900 p-2 rounded-xl border border-zinc-800 relative group"
                  >
                    <img
                      src={result.url}
                      alt={result.title}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl p-2 text-center">
                      <p className="text-white text-sm font-medium mb-2">
                        {result.title}
                      </p>
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

        {activeTab === "hero" && (
          <div className="max-w-2xl">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MonitorPlay className="text-brand-500" />
                হিরো সেকশন ভিডিও আপডেট করুন
              </h2>
              <form onSubmit={handleSaveHeroVideo} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    পপ-আপ ভিডিও URL (YouTube বা MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newHeroVideo.url}
                    onChange={(e) =>
                      setNewHeroVideo({ ...newHeroVideo, url: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    ব্যাকগ্রাউন্ড ভিডিও URL (MP4 recommended)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newHeroVideo.backgroundUrl}
                    onChange={(e) =>
                      setNewHeroVideo({
                        ...newHeroVideo,
                        backgroundUrl: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    থাম্বনেইল ইমেজ URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newHeroVideo.thumbnailUrl}
                    onChange={(e) =>
                      setNewHeroVideo({
                        ...newHeroVideo,
                        thumbnailUrl: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                {newHeroVideo.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-400 mb-2">
                      থাম্বনেইল প্রিভিউ:
                    </p>
                    <img
                      src={newHeroVideo.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full max-w-md rounded-xl border border-zinc-800"
                    />
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

        {activeTab === "whatwedo" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MonitorPlay className="text-brand-500" />
                'আমরা যা করি' সেকশন ভিডিও যোগ করুন
              </h2>
              <form onSubmit={handleSaveWhatWeDoVideo} className="space-y-4">
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    ভিডিও টাইটেল
                  </label>
                  <input
                    type="text"
                    placeholder="ভিডিওর নাম"
                    value={newWhatWeDoVideo.title}
                    onChange={(e) =>
                      setNewWhatWeDoVideo({
                        ...newWhatWeDoVideo,
                        title: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    ভিডিও URL (YouTube বা MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newWhatWeDoVideo.url}
                    onChange={(e) =>
                      setNewWhatWeDoVideo({
                        ...newWhatWeDoVideo,
                        url: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-sm mb-2">
                    থাম্বনেইল ইমেজ URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newWhatWeDoVideo.thumbnailUrl}
                    onChange={(e) =>
                      setNewWhatWeDoVideo({
                        ...newWhatWeDoVideo,
                        thumbnailUrl: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                {newWhatWeDoVideo.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-400 mb-2">
                      থাম্বনেইল প্রিভিউ:
                    </p>
                    <img
                      src={newWhatWeDoVideo.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full max-w-md rounded-xl border border-zinc-800"
                    />
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
                {whatWeDoVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-4 items-center"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-zinc-500 text-sm">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
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

        {activeTab === "tracking" && (
          <div className="max-w-2xl">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-brand-500" />
                ট্র্যাকিং ও অ্যানালিটিক্স সেটিংস
              </h2>
              <form onSubmit={handleSaveTrackingSettings} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-brand-500 font-bold border-b border-zinc-800 pb-2">
                    Facebook Pixel & CAPI
                  </h3>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 1234567890"
                      value={trackingSettings.fbPixelId}
                      onChange={(e) =>
                        setTrackingSettings({
                          ...trackingSettings,
                          fbPixelId: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      Facebook CAPI Access Token
                    </label>
                    <textarea
                      placeholder="EAAB..."
                      value={trackingSettings.fbAccessToken}
                      onChange={(e) =>
                        setTrackingSettings({
                          ...trackingSettings,
                          fbAccessToken: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 h-24 resize-none"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      এটি সার্ভার সাইড ট্র্যাকিংয়ের (CAPI) জন্য প্রয়োজন।
                    </p>
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      Facebook Test Event Code (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: TEST12345"
                      value={trackingSettings.fbTestEventCode}
                      onChange={(e) =>
                        setTrackingSettings({
                          ...trackingSettings,
                          fbTestEventCode: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      ইভেন্ট টেস্টিং করার সময় এটি ব্যবহার করুন।
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-brand-500 font-bold border-b border-zinc-800 pb-2">
                    Google Analytics 4
                  </h3>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">
                      GA4 Measurement ID
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: G-XXXXXXXXXX"
                      value={trackingSettings.ga4MeasurementId}
                      onChange={(e) =>
                        setTrackingSettings({
                          ...trackingSettings,
                          ga4MeasurementId: e.target.value,
                        })
                      }
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
