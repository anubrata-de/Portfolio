"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useExperience } from "@/context/Experience";
import { audio } from "@/lib/audio";
import { answer, type Note, type Reply } from "@/lib/assistant/knowledge";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "anu"; text: string; reply?: Reply; typed: number; startedAt?: number };

const MAX_QUESTION = 200;
const STARTERS = ["Who is Anubrata?", "What are his best projects?", "What's his tech stack?", "Is he open to internships?", "How do I contact him?"];

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognition(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function AskAnu() {
  const { assistantOpen, setAssistantOpen, introDone, calm, sound, menuOpen } = useExperience();
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "anu", text: "Hey, I'm Anu! Ask me anything about Anubrata's work, or tap a question below.", typed: 999 },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [hint, setHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const recognitionRef = useRef<Recognition | null>(null);

  // A one-time greeting bubble after the intro
  useEffect(() => {
    if (!introDone) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("anu-hint") === "1";
    } catch {
      /* ignore */
    }
    if (seen) return;
    const show = window.setTimeout(() => setHint(true), 2600);
    const hide = window.setTimeout(() => {
      setHint(false);
      try {
        sessionStorage.setItem("anu-hint", "1");
      } catch {
        /* ignore */
      }
    }, 9000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [introDone]);

  useEffect(() => {
    const id = window.setTimeout(() => setVoiceAvailable(getRecognition() !== null), 0);
    return () => window.clearTimeout(id);
  }, []);

  const close = useCallback(() => {
    setAssistantOpen(false);
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    launcherRef.current?.focus();
  }, [setAssistantOpen]);

  useEffect(() => {
    if (!assistantOpen) return;
    audio.open();
    const focus = window.setTimeout(() => inputRef.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [assistantOpen, close]);

  // Typewriter for the latest answer, timed by the clock so slow devices keep pace
  const last = messages[messages.length - 1];
  useEffect(() => {
    if (!last || last.role !== "anu" || last.typed >= last.text.length) return;
    const id = window.setTimeout(() => {
      const elapsed = performance.now() - (last.startedAt ?? performance.now());
      const typed = Math.min(last.text.length, Math.max(last.typed + 1, Math.floor(elapsed * 0.11)));
      setMessages((list) => list.map((m) => (m.id === last.id && m.role === "anu" ? { ...m, typed } : m)));
    }, 24);
    return () => window.clearTimeout(id);
  }, [last]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: calm ? "auto" : "smooth" });
  }, [messages, thinking, calm]);

  function ask(question: string) {
    const text = question.trim().slice(0, MAX_QUESTION);
    if (!text || thinking) return;
    setInput("");
    setMessages((list) => [...list, { id: nextId.current++, role: "user", text }]);
    setThinking(true);
    window.setTimeout(
      () => {
        const reply = answer(text);
        setThinking(false);
        setMessages((list) => [
          ...list,
          {
            id: nextId.current++,
            role: "anu",
            text: reply.text,
            reply,
            typed: calm ? reply.text.length : 0,
            startedAt: performance.now(),
          },
        ]);
        audio.message();
        audio.speak(reply.text);
      },
      calm ? 0 : 420,
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(input);
  }

  function toggleVoice() {
    const Ctor = getRecognition();
    if (!Ctor) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.interimResults = true;
    let transcript = "";
    rec.onresult = (e) => {
      transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    rec.onend = () => {
      setListening(false);
      if (transcript.trim()) ask(transcript);
    };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  const lastReply = [...messages]
    .reverse()
    .find((m): m is Extract<Message, { role: "anu" }> => m.role === "anu" && m.reply !== undefined)?.reply;
  const suggestions: string[] =
    lastReply && lastReply.related.length > 0
      ? lastReply.related.map((n: Note) => n.question)
      : messages.length <= 1
        ? STARTERS
        : [];

  return (
    <>
      <div className={cn("anu-launcher", introDone && !menuOpen && "is-visible")}>
        {hint && !assistantOpen && (
          <p className="anu-hint" role="status">
            Hi! I&apos;m Anu. Ask me about Anubrata&apos;s projects, skills or how to reach him.
          </p>
        )}
        <button
          ref={launcherRef}
          type="button"
          className="anu-launcher__orb"
          aria-label="Ask Anu, the site assistant"
          aria-expanded={assistantOpen}
          aria-controls="anu-panel"
          data-cursor="open"
          data-cursor-label="Ask"
          onClick={() => {
            setHint(false);
            setAssistantOpen(true);
          }}
        >
          <span className="orb orb--small" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="anu-panel"
        className={cn("anu", assistantOpen && "is-open")}
        role="dialog"
        aria-modal="true"
        aria-label="Ask Anu"
        aria-hidden={!assistantOpen}
        inert={!assistantOpen}
      >
        <div className="anu__top">
          <p className="anu__note">Answers come from notes on this site, matched to your question. No AI model involved.</p>
          <button type="button" className="anu__close" onClick={close}>
            Close <Icon name="close" />
          </button>
        </div>

        <div className="anu__stage" aria-hidden="true">
          <span className={cn("orb orb--large", (thinking || listening) && "is-busy")}>
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className="anu__chat">
          <div className="anu__messages" ref={listRef} aria-live="polite" data-lenis-prevent>
            {messages.map((m) =>
              m.role === "user" ? (
                <p key={m.id} className="anu__bubble anu__bubble--user">
                  {m.text}
                </p>
              ) : (
                <div key={m.id} className="anu__bubble anu__bubble--anu">
                  <p>
                    {m.text.slice(0, m.typed)}
                    {m.typed < m.text.length && <span className="anu__caret" aria-hidden="true" />}
                  </p>
                  {m.reply?.match && m.typed >= m.text.length && (
                    <p className="anu__source">
                      {m.reply.match.note.href ? (
                        <Link href={m.reply.match.note.href} onClick={close}>
                          Source: {m.reply.match.note.source}
                        </Link>
                      ) : (
                        <span>Source: {m.reply.match.note.source}</span>
                      )}
                      <span className="anu__score">match {m.reply.match.score.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              ),
            )}
            {thinking && (
              <p className="anu__bubble anu__bubble--anu anu__thinking" aria-label="Anu is thinking">
                <span />
                <span />
                <span />
              </p>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="anu__chips">
              {suggestions.map((s) => (
                <button key={s} type="button" className="chip" onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="anu__form" onSubmit={onSubmit}>
            {voiceAvailable && (
              <button
                type="button"
                className={cn("anu__mic", listening && "is-on")}
                onClick={toggleVoice}
                aria-pressed={listening}
                aria-label={listening ? "Stop listening" : "Ask with your voice"}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                  <rect x="7" y="2.5" width="6" height="10" rx="3" fill="currentColor" />
                  <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <label htmlFor="anu-input" className="visually-hidden">
              Ask a question
            </label>
            <input
              id="anu-input"
              ref={inputRef}
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={listening ? "Listening…" : "Ask me anything…"}
              autoComplete="off"
              maxLength={MAX_QUESTION}
            />
            <button type="submit" className="anu__send" disabled={!input.trim() || thinking}>
              Ask
            </button>
          </form>
          <p className="anu__foot">
            {sound ? "Answers are read aloud while sound is on." : "Turn sound on to hear answers read aloud."}
          </p>
        </div>
      </div>
    </>
  );
}
