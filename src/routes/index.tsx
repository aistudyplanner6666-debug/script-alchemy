import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InputForm } from "@/components/InputForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Toast } from "@/components/Toast";
import { SkeletonScript } from "@/components/Loader";
import { CreatorModal } from "@/components/CreatorModal";
import { generateMockScript, type Mood, type Script } from "@/lib/mockScript";
import { scriptApi } from "@/lib/api";
import { User } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CineScript · AI Bollywood Script Generator" },
      { name: "description", content: "Turn everyday moments into blockbuster Bollywood drama with AI-generated scripts, characters, and scenes." },
    ],
  }),
});

const STORAGE_KEY = "cinescript-history";

function Index() {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Script[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [creatorOpen, setCreatorOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3500);
    return () => clearTimeout(t);
  }, [error]);

  function persist(next: Script[]) {
    setHistory(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  async function handleGenerate(situation: string, mood: Mood) {
    setLoading(true);
    setError(null);
    setScript(null);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const next = await scriptApi.generate(situation, mood);
      setScript(next);
      const updated = [next, ...history].slice(0, 20);
      persist(updated);
      setTimeout(() => {
        document.getElementById("output")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Couldn't generate script. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CreatorModal open={creatorOpen} onClose={() => setCreatorOpen(false)} />
      <Navbar onHistoryClick={() => setHistoryOpen(true)} />
      <main className="relative">
        <Hero />
        <div className="relative z-10 px-6">
          <InputForm onGenerate={handleGenerate} loading={loading} />
        </div>

        <div id="output">
          {loading && (
            <section className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-6">
              <SkeletonScript />
            </section>
          )}
          {script && !loading && <OutputDisplay script={script} />}
        </div>

        {!script && !loading && (
          <section className="relative z-10 mx-auto mt-20 max-w-5xl px-6 pb-20">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { k: "01", t: "Drop a moment", d: "A memory, a mishap, a 3 AM thought." },
                { k: "02", t: "Pick a mood", d: "Dramatic, romantic, tragic, absurd." },
                { k: "03", t: "Get your blockbuster", d: "Title, cast, scenes, dialogues — instantly." },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl glass p-6">
                  <p className="font-display text-3xl text-gold-gradient">{s.k}</p>
                  <h4 className="mt-2 font-display text-lg font-semibold">{s.t}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          CineScript Studios · Crafted with <span className="text-gold">★</span> for cinema lovers
        </p>
        <motion.button
          onClick={() => setCreatorOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-xs font-medium tracking-wide text-gold transition hover:border-gold/40 hover:bg-gold/10"
        >
          <User className="h-3.5 w-3.5" />
          About Creator
        </motion.button>
      </footer>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={(s) => { setScript(s); setHistoryOpen(false); }}
        onClear={() => persist([])}
      />
      <Toast message={error} />
    </div>
  );
}
