/**
 * Generative sound for the site, synthesised live with the Web Audio API.
 * No audio files: an evolving chord pad, soft wind, the odd bell, and short
 * interface sounds. Nothing plays until the visitor chooses to enter with sound.
 */

type Ctx = AudioContext;

const CHORDS: number[][] = [
  // Dmaj9, Bm9, Gmaj7(#11), A6/9 — open voicings, slow and warm
  [146.83, 220.0, 329.63, 369.99, 554.37],
  [123.47, 185.0, 293.66, 369.99, 554.37],
  [98.0, 196.0, 293.66, 369.99, 554.37],
  [110.0, 164.81, 277.18, 369.99, 493.88],
];
const BELLS = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];

class AudioEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private ambient: GainNode | null = null;
  private ui: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private analyser: AnalyserNode | null = null;
  private voices: { oscs: OscillatorNode[]; filter: BiquadFilterNode }[] = [];
  private chordIndex = 0;
  private timers: number[] = [];
  private started = false;
  private enabled = false;
  private levels = new Uint8Array(32);

  get isEnabled() {
    return this.enabled;
  }

  private ensure(): Ctx | null {
    if (typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.82;
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    this.ambient = ctx.createGain();
    this.ambient.gain.value = 0.55;
    this.ambient.connect(this.master);

    this.ui = ctx.createGain();
    this.ui.gain.value = 0.9;
    this.ui.connect(this.master);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(ctx, 3.8, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.7;
    this.reverb.connect(wet);
    wet.connect(this.ambient);

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx || !this.enabled) return;
      if (document.hidden) this.fadeTo(0, 0.4);
      else {
        void this.ctx.resume();
        this.fadeTo(1, 1.2);
      }
    });
    return ctx;
  }

  private impulse(ctx: Ctx, seconds: number, decay: number) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return buffer;
  }

  private fadeTo(value: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  private startAmbient() {
    const ctx = this.ctx;
    if (!ctx || !this.ambient || !this.reverb || this.started) return;
    this.started = true;
    const now = ctx.currentTime;

    // Pad: two slightly detuned oscillators per chord tone, each through a breathing low-pass.
    CHORDS[0].forEach((freq, i) => {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 700 + i * 120;
      filter.Q.value = 0.7;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + i * 0.013;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 350;
      lfo.connect(lfoDepth).connect(filter.frequency);
      lfo.start(now);

      const amp = ctx.createGain();
      amp.gain.value = 0.045 / (1 + i * 0.25);
      const ampLfo = ctx.createOscillator();
      ampLfo.frequency.value = 0.07 + i * 0.021;
      const ampDepth = ctx.createGain();
      ampDepth.gain.value = 0.018 / (1 + i * 0.25);
      ampLfo.connect(ampDepth).connect(amp.gain);
      ampLfo.start(now);

      const oscs = [-6, 5].map((cents, k) => {
        const osc = ctx.createOscillator();
        osc.type = k === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = cents;
        osc.connect(filter);
        osc.start(now);
        return osc;
      });

      filter.connect(amp);
      amp.connect(this.reverb!);
      const dry = ctx.createGain();
      dry.gain.value = 0.35;
      amp.connect(dry).connect(this.ambient!);
      this.voices.push({ oscs, filter });
    });

    // Wind: looping noise through a wandering band-pass.
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 500;
    band.Q.value = 0.5;
    const windLfo = ctx.createOscillator();
    windLfo.frequency.value = 0.05;
    const windDepth = ctx.createGain();
    windDepth.gain.value = 260;
    windLfo.connect(windDepth).connect(band.frequency);
    windLfo.start(now);
    const windGain = ctx.createGain();
    windGain.gain.value = 0.02;
    noise.connect(band).connect(windGain).connect(this.ambient);
    noise.start(now);

    // Slowly move through the chord loop.
    this.timers.push(window.setInterval(() => this.nextChord(), 14000));
    this.scheduleBell();
  }

  private nextChord() {
    if (!this.ctx) return;
    this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
    const chord = CHORDS[this.chordIndex];
    const now = this.ctx.currentTime;
    this.voices.forEach((voice, i) => {
      voice.oscs.forEach((osc) => osc.frequency.setTargetAtTime(chord[i], now, 2.2));
    });
  }

  private scheduleBell() {
    const delay = 4000 + Math.random() * 6000;
    this.timers.push(
      window.setTimeout(() => {
        if (this.enabled && !document.hidden) this.bell(BELLS[Math.floor(Math.random() * BELLS.length)], 0.025);
        this.scheduleBell();
      }, delay),
    );
  }

  private bell(freq: number, level: number) {
    const ctx = this.ctx;
    if (!ctx || !this.reverb) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const over = ctx.createOscillator();
    over.type = "sine";
    over.frequency.value = freq * 2.01;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(level, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3);
    const overGain = ctx.createGain();
    overGain.gain.value = 0.3;
    osc.connect(gain);
    over.connect(overGain).connect(gain);
    gain.connect(this.reverb);
    gain.connect(this.ui!);
    osc.start(now);
    over.start(now);
    osc.stop(now + 3.1);
    over.stop(now + 3.1);
  }

  private blip(from: number, to: number, duration: number, level: number, type: OscillatorType = "sine") {
    const ctx = this.ctx;
    if (!ctx || !this.enabled || !this.ui) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(this.ui);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  /** Turn sound on or off. Must first be called from a click or key press. */
  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) {
      const ctx = this.ensure();
      if (!ctx) return;
      void ctx.resume();
      this.startAmbient();
      this.fadeTo(1, 1.6);
    } else {
      this.fadeTo(0, 0.5);
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    }
  }

  hover() {
    this.blip(1800, 1300, 0.05, 0.02);
  }

  click() {
    this.blip(700, 340, 0.07, 0.05);
  }

  toggle(on: boolean) {
    if (on) this.blip(520, 1040, 0.12, 0.05);
    else this.blip(1040, 520, 0.12, 0.05);
  }

  open() {
    this.blip(260, 780, 0.35, 0.035, "triangle");
  }

  message() {
    if (this.enabled) this.bell(880, 0.03);
  }

  /** Four rough frequency bands, 0..1, for the equaliser icon. */
  getLevels(): number[] {
    if (!this.analyser || !this.enabled) return [0, 0, 0, 0];
    this.analyser.getByteFrequencyData(this.levels);
    const band = (a: number, b: number) => {
      let sum = 0;
      for (let i = a; i < b; i++) sum += this.levels[i];
      return sum / ((b - a) * 255);
    };
    return [band(1, 3), band(3, 6), band(6, 10), band(10, 16)];
  }

  /** Read text aloud when sound is on. */
  speak(text: string) {
    if (!this.enabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utterance.voice =
      voices.find((v) => /en-(GB|IN|US)/.test(v.lang) && /female|samantha|google/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null;
    utterance.rate = 1.02;
    utterance.pitch = 1.05;
    utterance.volume = 0.9;
    synth.speak(utterance);
  }
}

export const audio = new AudioEngine();
