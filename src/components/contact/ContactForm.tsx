"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { audio } from "@/lib/audio";

type Field = "topic" | "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { kind: "idle" | "sending" | "sent" | "mailto" | "error"; text?: string };

/**
 * Sends through Formspree when NEXT_PUBLIC_FORMSPREE_ID is set.
 * Without it, opens the visitor's email app with the message filled in.
 */
const RAW_FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";
// Only accept a plain form ID, so a mistyped value can never point the form elsewhere.
const FORMSPREE_ID = /^[a-zA-Z0-9]{4,32}$/.test(RAW_FORMSPREE_ID) ? RAW_FORMSPREE_ID : null;
const LIMITS = { name: 100, email: 200, message: 4000 } as const;

const topics = ["an internship or role", "a project to build together", "a question about my work", "something else"];
const sources = ["LinkedIn", "GitHub", "IIT Madras", "A friend or colleague", "Somewhere else"];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.get("topic")) errors.topic = "Pick what you're reaching out about.";
  if (!String(data.get("name") ?? "").trim()) errors.name = "Add your name so I know who's writing.";
  const email = String(data.get("email") ?? "").trim();
  if (!email) errors.email = "Add an email address so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "This email address looks incomplete.";
  const message = String(data.get("message") ?? "").trim();
  if (message.length < 10) errors.message = "Write at least a sentence about it.";
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = Object.keys(nextErrors)[0] as Field;
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    audio.click();
    const topic = String(data.get("topic"));
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const message = String(data.get("message")).trim();
    const source = String(data.get("source") ?? "");

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`About ${topic}, from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}${source ? `\nFound you through: ${source}` : ""}`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus({
        kind: "mailto",
        text: `Your email app should open with this message ready to send. If it didn't, write to ${site.email}.`,
      });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, message, source }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      audio.message();
      setStatus({ kind: "sent", text: "Message sent. I'll reply to the address you gave." });
    } catch {
      setStatus({ kind: "error", text: `The message didn't go through. Try again, or email ${site.email} directly.` });
    }
  }

  const err = (field: Field) =>
    errors[field] ? (
      <p id={`${field}-error`} className="form__error">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <fieldset className="form__row" aria-describedby={errors.topic ? "topic-error" : undefined}>
        <legend className="form__label">
          I&apos;m reaching out about…<span aria-hidden="true">*</span>
        </legend>
        <div className="form__choices">
          {topics.map((t) => (
            <label key={t} className="choice">
              <input type="radio" name="topic" value={t} />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {err("topic")}
      </fieldset>

      <div className="form__row">
        <label htmlFor="name" className="form__label">
          My name is…<span aria-hidden="true">*</span>
        </label>
        <div>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" maxLength={LIMITS.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {err("name")}
        </div>
      </div>

      <div className="form__row">
        <label htmlFor="email" className="form__label">
          Reach me at…<span aria-hidden="true">*</span>
        </label>
        <div>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={LIMITS.email} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
          {err("email")}
        </div>
      </div>

      <div className="form__row">
        <label htmlFor="message" className="form__label">
          What I&apos;m picturing…<span aria-hidden="true">*</span>
        </label>
        <div>
          <textarea
            id="message"
            name="message"
            rows={4}
            maxLength={LIMITS.message}
            placeholder="The role or project, the timeline, and what a good outcome looks like."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {err("message")}
        </div>
      </div>

      <fieldset className="form__row">
        <legend className="form__label">I found you through…</legend>
        <div className="form__choices">
          {sources.map((s) => (
            <label key={s} className="choice">
              <input type="radio" name="source" value={s} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form__submit">
        <button type="submit" className="pill pill--solid pill--large" disabled={status.kind === "sending"} data-magnetic>
          {status.kind === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">↳</span>
        </button>
        <p className="form__status" role="status" data-kind={status.kind}>
          {status.text}
        </p>
      </div>
    </form>
  );
}
