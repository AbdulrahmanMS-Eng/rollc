"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { currency, type Locale, type Product } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import type { CategoryKind } from "@/components/rollc/category/categoryPageData";
import {
  getAssistantReply,
  HOME_CHIPS,
  PRODUCT_CHIPS,
  CATEGORY_CHIPS,
  getCategoryChips,
  type AssistantReply,
  type QuickQuestion,
  type ProductLink,
} from "./assistantEngine";
import styles from "./Assistant.module.css";

// ── Types ─────────────────────────────────────────────────────

type UserMsg   = { id: string; role: "user"; text: string };
type AssistMsg = { id: string; role: "assistant"; reply: AssistantReply };
type TypingMsg = { id: string; role: "typing" };
type ChatMsg   = UserMsg | AssistMsg | TypingMsg;

export interface ShoppingAssistantProps {
  page: "home" | "category" | "product";
  category?: CategoryKind;
  product?: Product;
}

// ── Module-level audio state ──────────────────────────────────

let _audioUnlocked = false;

function initAudioUnlock() {
  if (typeof window === "undefined" || _audioUnlocked) return;
  const unlock = () => { _audioUnlocked = true; };
  window.addEventListener("pointerdown",  unlock, { once: true, passive: true });
  window.addEventListener("keydown",      unlock, { once: true, passive: true });
  window.addEventListener("touchstart",   unlock, { once: true, passive: true });
}

function playNotif(muted: boolean) {
  if (muted || !_audioUnlocked || typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx  = new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659, ctx.currentTime + 0.09);
    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
    setTimeout(() => ctx.close().catch(() => {}), 1400);
  } catch {
    // AudioContext unavailable
  }
}

// ── Helpers ───────────────────────────────────────────────────

let _counter = 0;
const uid = () => `m${Date.now()}-${_counter++}`;

function t(text: AssistantReply["text"], locale: Locale): string {
  if (typeof text === "string") return text;
  return text[locale];
}

function ssGet(key: string) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function ssSet(key: string) {
  try { sessionStorage.setItem(key, "1"); } catch {}
}

// ── Sub-components ────────────────────────────────────────────

function ProductCard({ link, locale }: { link: ProductLink; locale: Locale }) {
  return (
    <a href={link.href} className={styles.productCard}>
      <img src={link.img} alt={link.name[locale]} className={styles.productCardImg} loading="lazy" />
      <div className={styles.productCardBody}>
        <span className={styles.productCardName}>{link.name[locale]}</span>
        <span className={styles.productCardPrice}>{link.price} {currency(locale)}</span>
      </div>
      <svg className={styles.productCardArrow} viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}

function ContactBlock() {
  return (
    <div className={styles.contactBlock}>
      <a href="tel:+966552055514" className={styles.contactLink}>
        <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.1-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.78 15.5Z" /></svg>
        <span><bdi dir="ltr">+966 55 205 5514</bdi></span>
      </a>
      <a href="mailto:customerservice@rollcksa.com" className={styles.contactLink}>
        <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" /><polyline points="22,6 12,13 2,6" /></svg>
        <span>customerservice@rollcksa.com</span>
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export function ShoppingAssistant({ page, category, product }: ShoppingAssistantProps) {
  const { locale, selectedProduct, assistantProduct, assistantNonce } = useRollcStore();

  const [open, setOpen]                     = useState(false);
  const [messages, setMessages]             = useState<ChatMsg[]>([]);
  const [input, setInput]                   = useState("");
  const [busy, setBusy]                     = useState(false);
  const [muted, setMuted]                   = useState(() => {
    try { return sessionStorage.getItem("rollc-ast-muted") === "1"; } catch { return false; }
  });
  const [hasPending, setHasPending]         = useState(false);
  const [emailValue, setEmailValue]         = useState("");
  const [emailError, setEmailError]         = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const scrollRef        = useRef<HTMLDivElement>(null);
  const inputRef         = useRef<HTMLInputElement>(null);
  const closeRef         = useRef<HTMLButtonElement>(null);
  const greetedRef       = useRef(false);   // component-lifetime guard
  const mutedRef         = useRef(muted);
  const lastQvProductRef = useRef<Product | null>(null);
  // Stable refs for async callbacks
  const localeRef        = useRef(locale);
  const pageRef          = useRef(page);
  const categoryRef      = useRef(category);
  const productRef       = useRef(product);
  const pushReplyRef     = useRef<(r: AssistantReply, id: string) => void>(() => {});

  // Keep refs current every render
  useEffect(() => { localeRef.current  = locale;   });
  useEffect(() => { pageRef.current    = page;     });
  useEffect(() => { categoryRef.current = category; });
  useEffect(() => { productRef.current = product;  });
  useEffect(() => {
    try { sessionStorage.setItem("rollc-ast-muted", muted ? "1" : "0"); } catch {}
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => { initAudioUnlock(); }, []);

  // ── Core: add a reply ──────────────────────────────────────

  const pushReply = useCallback((reply: AssistantReply, typingId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId ? ({ id: typingId, role: "assistant", reply } as AssistMsg) : m
      )
    );
    setBusy(false);
  }, []);

  // Keep stable ref for use inside timers/promises
  useEffect(() => { pushReplyRef.current = pushReply; }, [pushReply]);

  // Active product for sendMessage context — QV product takes priority
  const activeProduct = selectedProduct ?? product ?? lastQvProductRef.current ?? null;

  const sendMessage = useCallback(
    async (engineMsg: string, displayText: string) => {
      if (busy) return;
      setBusy(true);

      const userId   = uid();
      const typingId = uid();

      setMessages((prev) => [
        ...prev,
        { id: userId,   role: "user",   text: displayText } as UserMsg,
        { id: typingId, role: "typing" } as TypingMsg,
      ]);
      setInput("");

      const reply = await getAssistantReply({
        locale,
        page,
        category,
        product: activeProduct ?? undefined,
        userMessage: engineMsg,
      });

      pushReply(reply, typingId);
    },
    [busy, locale, page, category, activeProduct, pushReply]
  );

  // ── Home / category greeting (respects dismissed) ──────────
  //    Called only from hero observer and category timer.

  const triggerGreeting = useCallback(
    async (autoOpen: boolean, soundOnOpen = true) => {
      if (greetedRef.current) return;
      greetedRef.current = true;

      const wasDismissed = ssGet("rollc-ast-dismissed");
      if (autoOpen && !wasDismissed) {
        setOpen(true);
        if (soundOnOpen) playNotif(mutedRef.current);
      } else if (!wasDismissed) {
        setHasPending(true);
      }

      const typingId = uid();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" } as TypingMsg]);
      setBusy(true);
      const reply = await getAssistantReply({
        locale: localeRef.current,
        page:   pageRef.current,
        category: categoryRef.current,
        product:  productRef.current ?? undefined,
      });
      pushReplyRef.current(reply, typingId);
    },
    [] // all deps via refs — stable identity
  );

  // ── PDP: pulse launcher + prepare greeting (no auto-open) ──

  useEffect(() => {
    if (page !== "product") return;
    const timer = setTimeout(async () => {
      if (greetedRef.current) return;
      greetedRef.current = true;
      const typingId = uid();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" } as TypingMsg]);
      setBusy(true);
      const reply = await getAssistantReply({
        locale:   localeRef.current,
        page:     "product",
        category: categoryRef.current,
        product:  productRef.current ?? undefined,
      });
      pushReplyRef.current(reply, typingId);
      setHasPending(true);
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once on mount

  // ── Category: pulse launcher + prepare greeting (no auto-open) ─

  useEffect(() => {
    if (page !== "category") return;
    const timer = setTimeout(async () => {
      if (greetedRef.current) return;
      greetedRef.current = true;
      const typingId = uid();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" } as TypingMsg]);
      setBusy(true);
      const reply = await getAssistantReply({
        locale:   localeRef.current,
        page:     "category",
        category: categoryRef.current,
        product:  productRef.current ?? undefined,
      });
      pushReplyRef.current(reply, typingId);
      setHasPending(true);
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Home: hero scroll trigger ──────────────────────────────

  useEffect(() => {
    if (page !== "home") return;
    const hero = document.querySelector(".hero") as HTMLElement | null;
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) triggerGreeting(false); },
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Home: section-aware context prompts ───────────────────

  useEffect(() => {
    if (page !== "home") return;

    const sections: Array<{ selector: string; key: string; reply: AssistantReply }> = [
      {
        selector: "#categories",
        key: "rollc-ast-section-categories",
        reply: {
          text: {
            ar: "تصفح أقسامنا: الأرائك، الكراسي، الطاولات، الأسرة، والإكسسوارات. عن ماذا تبحث؟",
            en: "Browse our collections: sofas, chairs, tables, beds, and décor accents. What are you looking for?",
          },
          suggestions: CATEGORY_CHIPS,
        },
      },
      {
        selector: "#products",
        key: "rollc-ast-section-products",
        reply: {
          text: {
            ar: "هذه أبرز قطعنا هذا الموسم. هل تريد مساعدة في الاختيار؟",
            en: "These are our standout pieces this season. Can I help you choose?",
          },
          suggestions: [
            { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",  en: "Best sellers" } },
            { id: "q:budget",     label: { ar: "حسب الميزانية",   en: "By budget" } },
          ],
        },
      },
      {
        selector: "#branches",
        key: "rollc-ast-section-branches",
        reply: {
          text: {
            ar: "يمكنك زيارة أحد معارض رولك لتجربة القطع مباشرة، أو طلب استشارة تصميم عن بُعد.",
            en: "You can visit a Rollc showroom to experience pieces in person, or request a remote design consultation.",
          },
          suggestions: [
            { id: "q:consultant",       label: { ar: "تواصل مع المستشار",  en: "Talk to a consultant" } },
            { id: "q:delivery-install", label: { ar: "التوصيل والتركيب",   en: "Delivery & installation" } },
          ],
        },
      },
    ];

    const observers: IntersectionObserver[] = [];
    sections.forEach(({ selector, key, reply }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (ssGet(key) || ssGet("rollc-ast-dismissed")) { obs.disconnect(); return; }
          ssSet(key);
          setMessages((prev) => [...prev, { id: uid(), role: "assistant", reply } as AssistMsg]);
          setHasPending(true);
          obs.disconnect();
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── QuickView: pulse badge only (no auto-open on any device) ──

  useEffect(() => {
    if (!selectedProduct) return;

    const greetKey = `rollc-ast-qv-${selectedProduct.id}`;
    const alreadyGreeted = !!ssGet(greetKey);

    if (!alreadyGreeted) {
      ssSet(greetKey);
      const sp = selectedProduct;
      getAssistantReply({ locale: localeRef.current, page: "product", category: categoryRef.current, product: sp })
        .then((reply) => {
          setMessages((prev) => [...prev, { id: uid(), role: "assistant", reply } as AssistMsg]);
          lastQvProductRef.current = sp;
          setHasPending(true);
        });
    } else {
      setHasPending(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  // ── openAssistant(product) trigger: open, clear, fresh greeting ──

  useEffect(() => {
    if (!assistantNonce) return; // skip initial nonce=0
    setOpen(true);
    setHasPending(false);
    setInput("");
    setMessages([]);
    setBusy(true);
    const typingId = uid();
    setMessages([{ id: typingId, role: "typing" } as TypingMsg]);
    getAssistantReply({
      locale:   localeRef.current,
      page:     "product",
      category: categoryRef.current,
      product:  assistantProduct ?? undefined,
    }).then((reply) => pushReplyRef.current(reply, typingId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistantNonce]);

  // ── Scroll to bottom on new messages ──────────────────────

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (!open) return;
    setHasPending(false);
    const timer = setTimeout(() => inputRef.current?.focus(), 280);
    return () => clearTimeout(timer);
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Actions ───────────────────────────────────────────────

  const handleOpen = () => {
    // Never close QV — just open the panel alongside whatever is showing
    setOpen(true);
    setHasPending(false);
    if (messages.length === 0 && !busy) {
      greetedRef.current = false;
      triggerGreeting(false, false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    ssSet("rollc-ast-dismissed");
  };

  const handleChip = (chip: QuickQuestion) => {
    sendMessage(chip.id, chip.label[locale]);
  };

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || busy) return;
    sendMessage(msg, msg);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleEmailSend = () => {
    const val   = emailValue.trim();
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
    if (!valid) {
      setEmailError(locale === "ar" ? "فضلاً أدخل بريداً إلكترونياً صحيحاً" : "Please enter a valid email");
      return;
    }
    console.log("[Rollc Assistant] email captured:", val);
    setEmailSubmitted(true);
    setEmailError("");
    setEmailValue("");
    const productName = activeProduct?.name[locale] ?? (locale === "ar" ? "منتجك المختار" : "your selected product");
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: "assistant",
        reply: {
          text: locale === "ar"
            ? `تم ✦ سيتواصل معك فريق رولك بخصوص ${productName}.`
            : `Done ✦ The Rollc team will reach out about ${productName}.`,
        },
      } as AssistMsg,
    ]);
  };

  // ── Render helpers ─────────────────────────────────────────

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant") as AssistMsg | undefined;
  const chips: QuickQuestion[] = lastAssistant?.reply.suggestions
    ?? (activeProduct ? PRODUCT_CHIPS : page === "category" ? getCategoryChips(category) : HOME_CHIPS);

  // Product shown in the panel header
  const displayProduct = selectedProduct ?? lastQvProductRef.current ?? assistantProduct ?? product ?? null;

  const headerSub  = locale === "ar" ? "رولك · مساعد التسوّق" : "Rollc · Shopping Assistant";
  const headerName = displayProduct
    ? displayProduct.name[locale]
    : locale === "ar" ? "مساعد رولك" : "Rollc Assistant";

  // ── JSX ───────────────────────────────────────────────────

  return (
    <div className={styles.root}>
      {/* Launcher */}
      <button
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        aria-label={
          open
            ? (locale === "ar" ? "إغلاق مساعد التسوّق" : "Close shopping assistant")
            : (locale === "ar" ? "افتح مساعد التسوّق" : "Open shopping assistant")
        }
        aria-expanded={open}
        aria-controls="rollc-chat-panel"
        onClick={open ? handleClose : handleOpen}
      >
        {hasPending && !open && <span className={styles.badge} aria-hidden />}
        <span className={styles.dot} aria-hidden />
        {open ? (
          <svg className={styles.launcherIcon} viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className={styles.launcherIcon} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
          </svg>
        )}
      </button>

      {/* Chat panel — can be open alongside QV on desktop */}
      <div
        id="rollc-chat-panel"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label={locale === "ar" ? "مساعد التسوّق" : "Shopping Assistant"}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className={styles.header}>
          {displayProduct && (
            <img
              src={displayProduct.img}
              alt={displayProduct.name[locale]}
              className={styles.headerThumb}
            />
          )}
          <div className={styles.headerTitle}>
            <div className={styles.headerName}>{headerName}</div>
            <div className={styles.headerSub}>{headerSub}</div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.iconBtn}
              aria-label={muted
                ? (locale === "ar" ? "تشغيل الصوت" : "Unmute")
                : (locale === "ar" ? "كتم الصوت" : "Mute")}
              onClick={() => setMuted((v) => !v)}
            >
              {muted ? (
                <svg className={styles.mutedIcon} viewBox="0 0 24 24">
                  <path d="M11 5 6 9H2v6h4l5 4V5ZM23 9l-6 6M17 9l6 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
            <button
              ref={closeRef}
              className={styles.iconBtn}
              aria-label={locale === "ar" ? "إغلاق" : "Close"}
              onClick={handleClose}
            >
              <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages} ref={scrollRef}>
          {messages.map((msg) => {
            if (msg.role === "typing") {
              return (
                <div key={msg.id} className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                  <div className={styles.typingBubble} aria-label={locale === "ar" ? "يكتب…" : "Typing…"}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              );
            }

            if (msg.role === "user") {
              return (
                <div key={msg.id} className={`${styles.bubble} ${styles.bubbleUser}`}>
                  <div className={styles.bubbleText}>{msg.text}</div>
                </div>
              );
            }

            const { reply } = msg;
            const isLast = msg === ([...messages].reverse().find((m) => m.role === "assistant"));

            return (
              <div key={msg.id} className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                <div className={styles.bubbleText}>{t(reply.text, locale)}</div>

                {reply.productLinks && reply.productLinks.length > 0 && (
                  <div className={styles.productCards}>
                    {reply.productLinks.map((pl) => (
                      <ProductCard key={pl.id} link={pl} locale={locale} />
                    ))}
                  </div>
                )}

                {reply.showContact && <ContactBlock />}

                {isLast && reply.askEmail && !emailSubmitted && (
                  <div className={styles.emailCapture}>
                    <p className={styles.emailCaptureLead}>
                      {locale === "ar"
                        ? "اترك بريدك ونتواصل معك بخصوص هذا المنتج"
                        : "Leave your email and we'll reach out about this product"}
                    </p>
                    <div className={styles.emailRow}>
                      <input
                        className={styles.emailInput}
                        type="email"
                        value={emailValue}
                        onChange={(e) => { setEmailValue(e.target.value); setEmailError(""); }}
                        onKeyDown={(e) => { if (e.key === "Enter") handleEmailSend(); }}
                        placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                        aria-label={locale === "ar" ? "البريد الإلكتروني" : "Email address"}
                      />
                      <button className={styles.emailSend} onClick={handleEmailSend}>
                        {locale === "ar" ? "أرسل" : "Send"}
                      </button>
                    </div>
                    {emailError && <p className={styles.emailError} role="alert">{emailError}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick chips */}
        {chips.length > 0 && !busy && (
          <div className={styles.chips} role="list" aria-label={locale === "ar" ? "أسئلة سريعة" : "Quick questions"}>
            {chips.map((chip) => (
              <button
                key={chip.id}
                className={styles.chip}
                role="listitem"
                onClick={() => handleChip(chip)}
                disabled={busy}
              >
                {chip.label[locale]}
              </button>
            ))}
          </div>
        )}

        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={locale === "ar" ? "اكتب سؤالك…" : "Ask me anything…"}
            aria-label={locale === "ar" ? "رسالتك" : "Your message"}
            disabled={busy}
            maxLength={300}
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={busy || !input.trim()}
            aria-label={locale === "ar" ? "إرسال" : "Send"}
          >
            <svg viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
