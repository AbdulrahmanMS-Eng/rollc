"use client";

import { useState } from "react";
import type { Dictionary } from "@/dictionaries/types";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function NewsletterForm({ dict }: { dict: Dictionary }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = () => {
    if (EMAIL_RE.test(email.trim())) {
      setMsg(dict.footer.subscribeOk);
      setEmail("");
    } else {
      setMsg(dict.footer.subscribeErr);
    }
  };

  return (
    <>
      <div className="news-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder={dict.footer.emailPlaceholder}
          aria-label={dict.a11y.email}
        />
        <button onClick={onSubmit}>{dict.footer.subscribe}</button>
      </div>
      <div className="news-ok">{msg}</div>
    </>
  );
}
