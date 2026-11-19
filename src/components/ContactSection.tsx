import { useState, useRef, FormEvent } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { CONTACT_CHANNELS, ContactChannel, PROFILE_INFO } from '../data/portfolioData';

function ContactIcon({ id }: { id: ContactChannel['id'] }) {
  switch (id) {
    case 'github':
      return <Github className="w-5 h-5" />;
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />;
    case 'instagram':
      return <Instagram className="w-5 h-5" />;
    case 'whatsapp':
      return <MessageCircle className="w-5 h-5" />;
    case 'email':
      return <Mail className="w-5 h-5" />;
  }
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [draftSent, setDraftSent] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 28%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 25,
    mass: 0.34,
  });
  const sectionScale = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : [0.96, 1]
  );
  const leftColX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-32, 0]
  );
  const leftColOpacity = useTransform(
    smoothProgress,
    [0, 0.75],
    prefersReducedMotion ? [1, 1] : [0.15, 1]
  );
  const rightColY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [44, 0]
  );
  const rightColOpacity = useTransform(
    smoothProgress,
    [0, 0.85],
    prefersReducedMotion ? [1, 1] : [0.15, 1]
  );

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } finally {
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2200);
    }
  };

  const handleDraftSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;
    setDraftSent(true);
    setSenderName('');
    setSenderEmail('');
    setMessageText('');
    setTimeout(() => setDraftSent(false), 4000);
  };

  return (
    <div className="bg-[#F6F6F7]">
      <motion.section
        id="contact"
        ref={sectionRef}
        style={{ scale: sectionScale }}
        className="relative bg-[#08080B] grid-dark text-zinc-100 rounded-t-[2rem] sm:rounded-t-[3.25rem] pt-20 sm:pt-28 pb-16 shadow-[0_-24px_60px_rgba(0,0,0,0.2)]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Portrait with Orbit Ring + Staggered Contact Directory */}
            <motion.div
              style={{ x: leftColX, opacity: leftColOpacity }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 120"
                    className="absolute inset-0 w-full h-full animate-spin-slow"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="57"
                      fill="none"
                      stroke="rgba(220,38,38,0.55)"
                      strokeWidth="1.5"
                      strokeDasharray="8 6"
                    />
                  </svg>
                  <div className="relative w-[86%] h-[86%] rounded-full overflow-hidden border border-white/15 bg-[#DC2626]/20">
                    <img
                      src={PROFILE_INFO.portraitSrc}
                      alt="Ahmadin Umair"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top scale-110"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-red-500">
                    Contact Me
                  </p>
                  <h2
                    style={{ textWrap: 'balance' }}
                    className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white"
                  >
                    Let&apos;s Connect &amp; Grow
                  </h2>
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md">
                Open to learning opportunities, student collaborations, and conversations about web
                development and software engineering.
              </p>

              <div className="divide-y divide-white/10 border-y border-white/10">
                {CONTACT_CHANNELS.map((channel, index) => {
                  const isCopied = copiedId === channel.id;

                  if (channel.href && !channel.isPlaceholder) {
                    const isMailto = channel.href.startsWith('mailto:');
                    return (
                      <motion.a
                        key={channel.id}
                        href={channel.href}
                        target={isMailto ? undefined : '_blank'}
                        rel={isMailto ? undefined : 'noopener noreferrer'}
                        initial={prefersReducedMotion ? false : { opacity: 0.4, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.02 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="group py-4 flex items-center justify-between gap-4 hover:bg-white/[0.03] px-2 -mx-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-200 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white group-hover:scale-105 transition-all duration-200 shrink-0">
                            <ContactIcon id={channel.id} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{channel.label}</p>
                            <p className="text-xs text-zinc-400 truncate">{channel.handle}</p>
                          </div>
                        </div>

                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-red-500 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                      </motion.a>
                    );
                  }

                  return (
                    <motion.button
                      key={channel.id}
                      type="button"
                      onClick={() => handleCopy(channel.id, channel.copyValue)}
                      initial={prefersReducedMotion ? false : { opacity: 0.4, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.02 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full text-left group py-4 flex items-center justify-between gap-4 hover:bg-white/[0.03] px-2 -mx-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="w-10 h-10 rounded-full bg-white/[0.02] border border-dashed border-zinc-600 flex items-center justify-center text-zinc-400 group-hover:border-red-500 group-hover:text-red-500 group-hover:scale-105 transition-all duration-200 shrink-0">
                          <ContactIcon id={channel.id} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-200">{channel.label}</p>
                          <p className="text-xs text-zinc-400 truncate">{channel.handle}</p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white shrink-0">
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-red-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Column: Message Composer + Bold Closing Typography */}
            <motion.div
              style={{ y: rightColY, opacity: rightColOpacity }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="bg-[#101015] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-white">Send a Quick Note</h3>
                  <p className="text-xs text-zinc-400">
                    Leave a quick message or reach out directly via WhatsApp, Email, GitHub,
                    LinkedIn, or Instagram.
                  </p>
                </div>

                <form onSubmit={handleDraftSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-300">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Budi Santoso"
                        className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 bg-[#08080B] border border-white/10 focus:border-red-500 rounded-lg focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-300">
                        Email or Handle
                      </label>
                      <input
                        id="contact-email"
                        type="text"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 bg-[#08080B] border border-white/10 focus:border-red-500 rounded-lg focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-300">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write a brief message about a project or collaboration..."
                      className="w-full px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 bg-[#08080B] border border-white/10 focus:border-red-500 rounded-lg focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#DC2626] hover:bg-red-500 rounded-full transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Prepare Message</span>
                    </button>

                    {draftSent && (
                      <p role="status" className="text-xs font-medium text-red-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Thank you! Message drafted locally.</span>
                      </p>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-5xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-none">
                    Thank You
                  </p>
                  <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mt-2">
                    {PROFILE_INFO.tagline} · 2026
                  </p>
                </div>
                <p className="font-mono text-xs text-zinc-500">Bogor, Indonesia</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-white/10 bg-[#060608] text-zinc-400">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {PROFILE_INFO.fullName} · {PROFILE_INFO.education}
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
