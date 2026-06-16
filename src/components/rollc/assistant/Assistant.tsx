"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { currency, type Locale, type Product } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import type { CategoryKind } from "@/components/rollc/category/categoryPageData";
import {
  getAssistantReply,
  HOME_CHIPS,
  PRODUCT_CHIPS,
  type AssistantReply,
  type QuickQuestion,
  type ProductLink,
} from "./assistantEngine";
import styles from "./Assistant.module.css";

// ── Types ─────────────────────────────────────────────────────

type UserMsg    = { id: string; role: "user"; text: string };
type AssistMsg  = { id: string; role: "assistant"; reply: AssistantReply };
type TypingMsg  = { id: string; role: "typing" };
type ChatMsg    = UserMsg | AssistMsg | TypingMsg;

export interface ShoppingAssistantProps {
  page: "home" | "category" | "product";
  category?: CategoryKind;
  product?: Product;
}

// ── Helpers ───────────────────────────────────────────────────

let _counter = 0;
const uid = () => `m${Date.now()}-${_counter++}`;

function t(text: AssistantReply["text"], locale: Locale): string {
  if (typeof text === "string") return text;
  return text[locale];
}

function playNotif(muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.065, ctx.currentTime + 0.045);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
    setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch {
    // AudioContext unavailable
  }
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
        <span>+966 55 205 5514</span>
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
  const { locale, selectedProduct } = useRollcStore();

  const [open, setOpen]                   = useState(false);
  const [messages, setMessages]           = useState<ChatMsg[]>([]);
  const [input, setInput]                 = useState("");
  const [busy, setBusy]                   = useState(false);
  const [muted, setMuted]                 = useState(false);
  const [hasPending, setHasPending]       = useState(false);
  const [emailValue, setEmailValue]       = useState("");
  const [emailError, setEmailError]       = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const closeRef   = useRef<HTMLButtonElement>(null);
  const greetedRef = useRef(false);
  const prevQvRef  = useRef<string | null>(null);

  // Effective product context: QuickView takes precedence over PDP prop
  const activeProduct = selectedProduct ?? product;

  // Session key for this page context
  const contextKey =
    page === "product" && activeProduct
      ? `rollc-ast-greeted-product-${activeProduct.id}`
      : page === "category" && category
      ? `rollc-ast-greeted-category-${category}`
      : "rollc-ast-greeted-home";

  // ── Core: add a reply ──────────────────────────────────────

  const pushReply = useCallback((reply: AssistantReply, typingId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId ? ({ id: typingId, role: "assistant", reply } as AssistMsg) : m
      )
    );
    setBusy(false);
  }, []);

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

  // ── Greeting trigger ───────────────────────────────────────

  const triggerGreeting = useCallback(
    async (autoOpen: boolean, soundOnOpen = true) => {
      if (greetedRef.current) return;
      if (ssGet(contextKey)) return;
      greetedRef.current = true;

      if (autoOpen && !ssGet("rollc-ast-dismissed")) {
        setOpen(true);
        if (soundOnOpen) playNotif(muted);
      } else {
        setHasPending(true);
      }

      const typingId = uid();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" } as TypingMsg]);
      setBusy(true);

      const reply = await getAssistantReply({ locale, page, category, product: activeProduct ?? undefined });
      pushReply(reply, typingId);
      ssSet(contextKey);
    },
    [contextKey, locale, muted, page, category, activeProduct, pushReply]
  );

  // ── Proactive trigger per page ─────────────────────────────

  // Home: wait for hero to scroll out of view
  useEffect(() => {
    if (page !== "home") return;
    const hero = document.querySelector(".hero") as HTMLElement | null;
    if (!hero) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) triggerGreeting(true);
      },
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // triggerGreeting via ref to avoid re-subscribing

  // Category / product: trigger after a short mount delay
  useEffect(() => {
    if (page === "home") return;
    const timer = setTimeout(() => triggerGreeting(true), 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // QuickView: react to selectedProduct changes
  useEffect(() => {
    if (!selectedProduct) { prevQvRef.current = null; return; }
    if (selectedProduct.id === prevQvRef.current) return;
    prevQvRef.current = selectedProduct.id;

    // Send a product greeting whenever a NEW product opens in QuickView
    const doGreet = async () => {
      const typingId = uid();
      setMessages((prev) => [...prev, { id: typingId, role: "typing" } as TypingMsg]);
      setBusy(true);
      const reply = await getAssistantReply({
        locale,
        page,
        category,
        product: selectedProduct,
      });
      pushReply(reply, typingId);
    };

    if (open) {
      doGreet();
    } else {
      setHasPending(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  // ── Scroll to bottom on new messages ──────────────────────

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (!open) return;
    setHasPending(false);
    const t = setTimeout(() => inputRef.current?.focus(), 280);
    return () => clearTimeout(t);
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
    setOpen(true);
    setHasPending(false);
    // If no messages yet and greeting was dismissed, trigger manually
    if (messages.length === 0 && !busy) {
      greetedRef.current = false; // allow re-run
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
    const val = emailValue.trim();
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
    const confirmId = uid();
    setMessages((prev) => [
      ...prev,
      {
        id: confirmId,
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

  // Last assistant reply (for chips + email capture)
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant") as AssistMsg | undefined;
  const chips: QuickQuestion[] = lastAssistant?.reply.suggestions
    ?? (activeProduct ? PRODUCT_CHIPS : HOME_CHIPS);

  const showEmailCapture =
    !emailSubmitted &&
    !!lastAssistant?.reply.askEmail &&
    lastAssistant === ([...messages].reverse().find((m) => m.role === "assistant") as AssistMsg | undefined);

  // Header label
  const headerSub = locale === "ar" ? "رولك · مساعد التسوّق" : "Rollc · Shopping Assistant";
  const headerName = activeProduct
    ? activeProduct.name[locale]
    : locale === "ar" ? "مساعد رولك" : "Rollc Assistant";

  // ── JSX ───────────────────────────────────────────────────

  return (
    <div className={styles.root}>
      {/* Launcher */}
      <button
        className={`${styles.launcher} ${open ? styles.launcherOpen : ""}`}
        aria-label={open
          ? (locale === "ar" ? "إغلاق مساعد التسوّق" : "Close shopping assistant")
          : (locale === "ar" ? "افتح مساعد التسوّق" : "Open shopping assistant")}
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

      {/* Chat panel */}
      <div
        id="rollc-chat-panel"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label={locale === "ar" ? "مساعد التسوّق" : "Shopping Assistant"}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className={styles.header}>
          {activeProduct && (
            <img
              src={activeProduct.img}
              alt={activeProduct.name[locale]}
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

            // assistant
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

        {/* Input row */}
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
