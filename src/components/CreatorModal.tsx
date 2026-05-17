import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Globe, X, Sparkles, Code2, Cpu } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreatorModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-gold/15 bg-gradient-to-b from-[#111] to-[#0A0A0A] shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Gold top glow */}
            <div
              className="absolute inset-x-0 top-0 h-32 opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.18), transparent 60%)" }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:border-gold/40 hover:text-gold"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <div className="relative z-10 flex flex-col items-center px-8 pb-10 pt-8 text-center">
              {/* Avatar */}
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Animated ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-gold via-gold-bright to-gold-deep opacity-60 blur-sm animate-pulse" />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/30 shadow-gold">
                  {/* Placeholder — swap src for actual image */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
                    <span className="font-display text-4xl font-bold text-gold-gradient select-none">
                      SS
                    </span>
                  </div>
                  {/* Uncomment below and remove the div above when you have an image */}
                  {/* <img
                    src="YOUR_IMAGE_URL_HERE"
                    alt="Saladi Subrahmanyam"
                    className="h-full w-full object-cover"
                  /> */}
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-gold/30 bg-[#0A0A0A] px-3 py-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    <Sparkles className="h-3 w-3" /> Vibe Coder
                  </span>
                </div>
              </motion.div>

              {/* Name */}
              <motion.h2
                className="mt-5 font-display text-2xl font-semibold text-foreground sm:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Saladi Subrahmanyam
              </motion.h2>

              {/* Caption */}
              <motion.p
                className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                Creator of CineScript
              </motion.p>

              {/* Description */}
              <motion.p
                className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                AI-Augmented Full Stack Developer skilled in building intelligent web applications by integrating advanced LLMs and modern cloud services. Transforming ideas into production-ready solutions with collaborative AI workflows.
              </motion.p>

              {/* Tech badges */}
              <motion.div
                className="mt-5 flex flex-wrap items-center justify-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                {[
                  { icon: Code2, label: "Full Stack" },
                  { icon: Cpu, label: "AI / LLMs" },
                  { icon: Sparkles, label: "Vibe Coding" },
                ].map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-muted-foreground"
                  >
                    <b.icon className="h-3 w-3 text-gold/80" />
                    {b.label}
                  </span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="mt-7 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-foreground transition hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                >
                  <Linkedin className="h-4 w-4 transition group-hover:scale-110" />
                  LinkedIn
                </a>
                <a
                  href="https://portfolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2.5 text-sm text-gold transition hover:border-gold/40 hover:bg-gold/10"
                >
                  <Globe className="h-4 w-4 transition group-hover:scale-110" />
                  Portfolio
                </a>
              </motion.div>

              {/* Hint to replace image */}
              <motion.p
                className="mt-6 text-[10px] italic text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Replace the avatar in CreatorModal.tsx — search for "YOUR_IMAGE_URL_HERE"
              </motion.p>
            </div>

            {/* Bottom gold line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
