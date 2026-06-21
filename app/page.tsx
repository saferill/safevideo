"use client";

import { useState, useEffect } from "react";
import { Download, Link as LinkIcon, AlertCircle, CheckCircle2, Loader2, ArrowRight, ClipboardPaste, X, Plus, History, Film, Music, Trash2, Globe, Share2, Twitter, Facebook, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function parseMediaResult(result: any) {
  let title = "Extracted Media";
  let thumbnail = "";
  const downloads: { label: string, url: string }[] = [];

  if (result?.title) title = result.title;
  else if (result?.desc) title = result.desc;
  else if (Array.isArray(result) && result[0]?.title) title = result[0].title;

  if (result?.thumbnail) thumbnail = result.thumbnail;
  else if (result?.cover) thumbnail = result.cover;

  function extract(obj: any, parentKey = '') {
    if (typeof obj === 'string' && isUrl(obj)) {
      if (obj.match(/\.(jpeg|jpg|png|webp|gif)(\?.*)?$/i) || obj.includes('format=jpeg')) {
        if (!thumbnail) thumbnail = obj;
      } else {
        let label = parentKey ? parentKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Download Media';
        if (label === 'Url' || label === 'Video' || label === 'Link') label = 'Download Media';
        downloads.push({ label, url: obj });
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => extract(item, `${parentKey} ${idx + 1}`.trim()));
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        extract(value, key);
      });
    }
  }

  extract(result);

  if (downloads.length === 0 && result?.url && isUrl(result.url)) {
    downloads.push({ label: 'Download Media', url: result.url });
  }

  const uniqueDownloads = Array.from(new Map(downloads.map(item => [item.url, item])).values());
  return { title, thumbnail, downloads: uniqueDownloads };
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedUrl, setLastFetchedUrl] = useState("");

  const executeDownload = async (targetUrl: string) => {
    if (!targetUrl || targetUrl === lastFetchedUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLastFetchedUrl(targetUrl);

    try {
      const res = await fetch(`/api/download?url=${encodeURIComponent(targetUrl)}`, { method: "GET" });
      const data = await res.json();
      if (!data.Status) {
        setError(data.Error || "Failed to process the URL.");
      } else {
        setResult(data.Result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url) {
      setLastFetchedUrl("");
      return;
    }
    if (isUrl(url) && url !== lastFetchedUrl) {
      const timer = setTimeout(() => { executeDownload(url); }, 500);
      return () => clearTimeout(timer);
    }
  }, [url, lastFetchedUrl]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;
    executeDownload(url);
  };

  const parsedData = result ? parseMediaResult(result) : null;

  return (
    <div className="flex flex-col min-h-screen w-full relative overflow-hidden bg-zinc-950">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="h-[72px] flex items-center justify-between px-6 md:px-12 w-full max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity cursor-default">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="text-zinc-100 font-semibold text-[15px] tracking-wide">
            SafeVideo
          </span>
        </div>
        
        {/* Navigation & Language */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-zinc-100 transition-colors">TikTok</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Instagram</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">YouTube</a>
          </nav>
          
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          
          <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 shadow-sm">
            <Globe className="w-4 h-4" />
            <span>EN / ID</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center justify-center relative z-10">

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center w-full max-w-3xl mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-semibold tracking-tighter leading-none text-zinc-50 mb-6"
          >
            Universal Media Extraction
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-[50ch] mb-12"
          >
            Instantly securely retrieve videos and audio from any major social platform without limitations.
          </motion.p>

          {/* Input Component */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative"
          >
            <form onSubmit={handleDownload} className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="url"
                placeholder="Paste URL (e.g. TikTok, Instagram, YouTube)..."
                className="w-full h-[64px] bg-zinc-900/50 backdrop-blur-md text-zinc-100 text-lg px-14 rounded-2xl border border-white/10 placeholder:text-zinc-600 focus:border-blue-500/50 focus:bg-zinc-900/80 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
                required
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (!url) {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setUrl(text);
                      } catch (err) {
                        console.error("Clipboard access denied", err);
                      }
                    } else {
                      setUrl("");
                      setResult(null);
                      setError(null);
                    }
                  }}
                  disabled={loading}
                  className="h-[48px] px-6 bg-white text-zinc-950 font-semibold text-[15px] rounded-xl hover:bg-zinc-200 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:active:scale-100 transition-all flex items-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Fetching</>
                  ) : url ? (
                    <><X className="w-4 h-4" /> Clear</>
                  ) : (
                    <><ClipboardPaste className="w-4 h-4" /> Paste</>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-4 flex justify-center"
                >
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Logo Marquee */}
          <div className="w-full overflow-hidden mt-16 pt-8 border-t border-white/5 relative mask-image-linear">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap items-center gap-12"
            >
              {/* We duplicate the list to make the infinite scroll seamless */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-12 text-zinc-500 font-semibold tracking-widest uppercase text-sm">
                  <span>TikTok</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Instagram</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>YouTube</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>X (Twitter)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Reddit</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Threads</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Facebook</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Pinterest</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  <span>Douyin</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {parsedData && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full mt-10"
            >
              <div className="w-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-[0_32px_64px_rgba(0,0,0,0.5)]">

                {/* Thumbnail */}
                <div className="w-full md:w-[360px] h-[360px] md:h-auto bg-zinc-950 flex-shrink-0 relative overflow-hidden group">
                  {parsedData.thumbnail ? (
                    <img
                      src={parsedData.thumbnail}
                      alt="Thumbnail"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                      <Download className="w-12 h-12 mb-4" />
                      <span className="text-sm font-medium tracking-widest uppercase">No Preview</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />
                </div>

                {/* Details & Actions */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="absolute top-8 right-8">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                  </div>

                  <span className="text-zinc-500 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                    Ready to Download
                  </span>

                  <h3 className="text-2xl md:text-3xl font-medium text-zinc-50 leading-tight mb-8 line-clamp-2 pr-8">
                    {parsedData.title}
                  </h3>

                  {parsedData.downloads.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {parsedData.downloads.map((link, idx) => (
                        <a
                          key={idx}
                          href={`/api/force-download?url=${encodeURIComponent(link.url)}&filename=${encodeURIComponent(parsedData.title.replace(/[^a-zA-Z0-9_-]/g, '_'))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="w-full h-14 flex items-center justify-center gap-3 bg-zinc-800 text-zinc-50 rounded-xl font-medium text-[15px] border border-white/5 hover:bg-zinc-700 hover:border-white/10 active:scale-[0.98] transition-all"
                        >
                          <Download className="w-4 h-4 text-zinc-400" />
                          {link.label.includes('Download') ? link.label : `Download ${link.label}`}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full py-8 text-center rounded-xl bg-zinc-800/50 border border-white/5">
                      <p className="text-sm text-zinc-400">Media links could not be parsed.</p>
                    </div>
                  )}

                  {/* Share Buttons */}
                  {parsedData.downloads.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/5 w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                      <span className="text-xs font-medium text-zinc-500 uppercase flex items-center gap-2">
                        <Share2 className="w-3.5 h-3.5" /> Bagikan Website
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-green-500/20 hover:text-green-400 text-zinc-400 flex items-center justify-center transition-all border border-white/5">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-500/20 hover:text-blue-400 text-zinc-400 flex items-center justify-center transition-all border border-white/5">
                          <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-sky-500/20 hover:text-sky-400 text-zinc-400 flex items-center justify-center transition-all border border-white/5">
                          <Twitter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Features / Information Section */}
        <section className="w-full mt-24 flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-50 mb-4 tracking-tight">Everything you need to save media</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">
              Our universal extraction engine is designed for speed, privacy, and maximum compatibility across all major networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-start hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Lightning Fast</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Direct connections to media servers ensure your files are ready to download in milliseconds, with no bandwidth throttling.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-start hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20 mb-6">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Privacy First</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We do not track your downloads. Processing happens entirely in-memory and files are proxied securely without logging.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl flex flex-col items-start hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 mb-6">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Universal Support</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                One tool for all. Download without watermarks from TikTok, Instagram, Twitter, YouTube, Facebook, and 40+ other networks.
              </p>
            </div>
          </div>
        </section>

        {/* How to Download Section */}
        <section className="w-full mt-32 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-50 mb-4 tracking-tight">How to download media</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">
              Save any video or audio in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl relative">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-white/10 z-0" />

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100 font-medium text-lg mb-6 shadow-xl">
                1
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Copy Link</h3>
              <p className="text-sm text-zinc-400 max-w-[250px]">
                Find the video on the app or website and tap the "Share" button, then select "Copy Link".
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100 font-medium text-lg mb-6 shadow-xl">
                2
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Paste URL</h3>
              <p className="text-sm text-zinc-400 max-w-[250px]">
                Return to this page and tap the "Paste" button, or manually paste the link into the input field.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-100 font-medium text-lg mb-6 shadow-xl">
                3
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">Save to Device</h3>
              <p className="text-sm text-zinc-400 max-w-[250px]">
                Wait a few seconds for extraction, then click the blue download button to save the file.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full mt-32 mb-16 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-50 mb-4 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-4">
            <details className="group bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 text-zinc-100 font-medium cursor-pointer hover:bg-zinc-900/50 transition-colors outline-none">
                Is this downloader free to use?
                <Plus className="w-5 h-5 text-zinc-500 group-open:rotate-45 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                Yes, our universal media downloader is 100% free with no hidden fees or download limits.
              </div>
            </details>

            <details className="group bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 text-zinc-100 font-medium cursor-pointer hover:bg-zinc-900/50 transition-colors outline-none">
                Will downloaded videos have a watermark?
                <Plus className="w-5 h-5 text-zinc-500 group-open:rotate-45 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                No. Whenever possible, our engine extracts the original, raw video file without any platform watermarks (especially for TikTok and Douyin).
              </div>
            </details>

            <details className="group bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 text-zinc-100 font-medium cursor-pointer hover:bg-zinc-900/50 transition-colors outline-none">
                Where are the files saved on my device?
                <Plus className="w-5 h-5 text-zinc-500 group-open:rotate-45 transition-transform duration-300" />
              </summary>
              <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                By default, downloaded files are saved to your browser's designated "Downloads" folder. On mobile devices, they will appear in your Photos or Files app depending on the OS.
              </div>
            </details>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center relative z-10 border-t border-white/5 flex flex-col gap-1 items-center justify-center">
        <p className="text-xs text-zinc-500 font-medium">
          SafeVideo &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-zinc-600 font-medium tracking-wide">
          by safe_rill
        </p>
      </footer>
    </div>
  );
}
