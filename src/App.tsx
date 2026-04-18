/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  Sparkles, 
  Youtube, 
  Type, 
  FileText, 
  Hash, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Loader2,
  ChevronRight,
  TrendingUp,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { generateSEOContent, SEOSection } from "./services/gemini";

type Tab = {
  id: SEOSection;
  name: string;
  icon: any;
  description: string;
};

const tabs: Tab[] = [
  { id: "titles", name: "Titles", icon: Type, description: "Viral & Clicky Titles" },
  { id: "descriptions", name: "Descriptions", icon: FileText, description: "High-Convert Descriptions" },
  { id: "hashtags", name: "Hashtags", icon: Hash, description: "Trending Tags" },
  { id: "thumbnails", name: "Thumbnails", icon: ImageIcon, description: "Thumbnail Concepts" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<SEOSection>("titles");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const output = await generateSEOContent(activeTab, input);
      setResult(output);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-border p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-youtube-red p-2 rounded-lg">
            <Youtube className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">CreatorHub</span>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResult("");
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                activeTab === tab.id 
                  ? "bg-youtube-red/10 text-youtube-red ring-1 ring-youtube-red/20" 
                  : "hover:bg-gray-50 text-gray-500"
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-youtube-red" : ""}`} />
              <div>
                <p className={`font-bold text-sm ${activeTab === tab.id ? "text-youtube-dark" : ""}`}>{tab.name}</p>
                <p className="text-xs opacity-60 font-medium">{tab.description}</p>
              </div>
              {activeTab === tab.id && <ChevronRight className="ml-auto w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="mt-10 p-4 bg-gray-50 rounded-2xl border border-dashed border-border">
          <div className="flex items-center gap-2 text-youtube-red mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">SEO Tip</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Include high-volume keywords in your first 150 characters of the description for better ranking.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50/50 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <header className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-border text-[10px] font-bold uppercase tracking-widest text-gray-400"
            >
              <Sparkles className="w-3 h-3 text-youtube-red" />
              AI Powered Optimization
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-youtube-dark leading-tight">
              Optimize for <span className="text-youtube-red italic">Growth.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl font-medium">
              Paste your video topic or transcript summary below and let our AI craft the perfect SEO metadata.
            </p>
          </header>

          {/* Input Section */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4" />
                Video Context / Topic
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: A travel vlog about the best street food in Tokyo, focusing on Ramen and Sushi hotspots..."
                className="input-field min-h-[140px] resize-none text-base"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-14"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Crafting Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate {tabs.find(t => t.id === activeTab)?.name}
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold">Generated Results</h3>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-xs font-bold bg-white border border-border px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All
                      </>
                    )}
                  </button>
                </div>

                <div className="glass-card p-8 bg-white relative overflow-hidden">
                  <div className="prose prose-sm max-w-none font-medium text-gray-700 leading-relaxed">
                    <Markdown>{result}</Markdown>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-youtube-red/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-xs font-medium">
          <p>© 2026 CreatorHub SEO Wizard. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-youtube-dark transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-youtube-dark transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-youtube-dark transition-colors">Support</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
