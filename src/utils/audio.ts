// Web Audio API Sound Synthesizer for Rangpur Durga Puja (রংপুর শারদোৎসব)
// Generates realistic Dhak drum strikes, Shankha (conch), Ghanta (bell), and Kanshi (brass)
// Completely client-side, zero external audio dependency!

class PujaAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private activeSequenceTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : 0.7, this.ctx.currentTime);
    }
    if (mute && this.activeSequenceTimer) {
      this.stopSequence();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Deep resonant bass dhak strike ("DHA") with authentic wooden body resonance
  public playDhakBass(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    
    // Fundamental membrane oscillator (pitch drop 155Hz -> 58Hz)
    const oscMain = this.ctx.createOscillator();
    const oscSub = this.ctx.createOscillator();
    const gainMain = this.ctx.createGain();
    const gainSub = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    oscMain.type = 'triangle';
    oscMain.frequency.setValueAtTime(155, t);
    oscMain.frequency.exponentialRampToValueAtTime(58, t + 0.16);

    // Deep sub-harmonic punch for chest-thumping bass
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(95, t);
    oscSub.frequency.exponentialRampToValueAtTime(45, t + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, t);
    filter.frequency.exponentialRampToValueAtTime(160, t + 0.28);
    filter.Q.setValueAtTime(3.2, t);

    gainMain.gain.setValueAtTime(0.95 * intensity, t);
    gainMain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    gainSub.gain.setValueAtTime(0.7 * intensity, t);
    gainSub.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    // Bamboo stick slap on leather skin
    const noise = this.createDrumSnap(t, 0.035, 0.45 * intensity);

    oscMain.connect(filter);
    oscSub.connect(filter);
    filter.connect(gainMain);
    gainMain.connect(this.masterGain);

    if (noise) noise.connect(this.masterGain);

    oscMain.start(t);
    oscSub.start(t);
    oscMain.stop(t + 0.42);
    oscSub.stop(t + 0.48);
  }

  // Crisp rim/stick strike on dhak ("TIN" / "TA") using Bessel circular membrane mode ratios
  public playDhakRim(pitch: number = 440, intensity: number = 0.95) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    
    // Inharmonic Bessel circular membrane modes (1.0 : 1.59 : 2.13)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(pitch, t);
    osc1.frequency.exponentialRampToValueAtTime(pitch * 0.72, t + 0.09);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(pitch * 1.59, t);
    osc2.frequency.exponentialRampToValueAtTime(pitch * 1.1, t + 0.07);

    osc3.type = 'square';
    osc3.frequency.setValueAtTime(pitch * 2.13, t);
    osc3.frequency.exponentialRampToValueAtTime(pitch * 1.4, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 1.35, t);
    filter.Q.setValueAtTime(4.8, t);

    gain.gain.setValueAtTime(0.85 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    // Sharp stick slap transient
    const noise = this.createDrumSnap(t, 0.015, 0.4 * intensity);

    osc1.connect(gain);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    if (noise) noise.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + 0.2);
    osc2.stop(t + 0.2);
    osc3.stop(t + 0.2);
  }

  // Rapid iconic Dhak roll ("DHA-KUTING-TIN-DHA")
  public playDhakRoll() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Play rapid roll notes
    this.playDhakRim(480, 0.7);
    setTimeout(() => this.playDhakRim(520, 0.8), 65);
    setTimeout(() => this.playStickClick(0.85), 130);
    setTimeout(() => this.playDhakRim(460, 0.9), 195);
    setTimeout(() => {
      this.playDhakBass(1.0);
      this.playKanshi(0.65);
    }, 270);
  }

  // Wooden stick click ("KATING")
  public playStickClick(intensity: number = 0.8) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

    gain.gain.setValueAtTime(0.5 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Brass Kanshi (holy bronze plate chime)
  public playKanshi(intensity: number = 0.75) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const freqs = [1280, 2450, 3100, 4200];
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    gain.connect(this.masterGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + 0.95);
    });
  }

  // Sacred Shankha (Conch Shell) with authentic breath harmonics
  public playShankha() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const duration = 2.4;
    const baseFreq = 345;

    const gain = this.ctx.createGain();
    // Swell like lungs blowing conch
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.65, t + 0.45);
    gain.gain.setValueAtTime(0.65, t + 1.6);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    gain.connect(this.masterGain);

    const harmonics = [1, 2, 3, 4];
    harmonics.forEach((harmonic, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      
      // Slight natural vibrato
      osc.frequency.setValueAtTime(baseFreq * harmonic, t);
      osc.frequency.linearRampToValueAtTime(baseFreq * harmonic + (idx * 3), t + 0.6);
      osc.frequency.linearRampToValueAtTime(baseFreq * harmonic - (idx * 2), t + 1.8);

      const amp = 0.4 / (idx + 1);
      hGain.gain.setValueAtTime(amp, t);
      osc.connect(hGain);
      hGain.connect(gain);

      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
  }

  // Classical plucked Veena note chime (Saraswati)
  public playVeenaChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    // Notes of Indian classical raga (Sa - Ga - Pa - Sa')
    const freqs = [293.66, 369.99, 440.0, 587.33]; // D, F#, A, D'

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = t + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.35, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.85);
    });
  }

  // Auspicious golden coin / wealth sprinkle chime (Lakshmi)
  public playCoinChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const noteTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.65);
    });
  }

  // Bell (Ghanta) sound with metallic ring
  public playGhanta() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const baseFreq = 2100;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  // Helper noise burst for drum head impact
  private createDrumSnap(time: number, dur: number, amp: number): GainNode | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.Q.setValueAtTime(2.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(amp, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    whiteNoise.connect(filter);
    filter.connect(gain);

    whiteNoise.start(time);
    whiteNoise.stop(time + dur);
    return gain;
  }

  // Rhythm loop player
  public startSequence(
    pattern: { type: 'bass' | 'rim' | 'stick' | 'kanshi'; delay: number }[],
    bpm: number = 110,
    onStep?: (index: number) => void
  ) {
    this.stopSequence();
    if (this.isMuted) return;
    this.initContext();

    const beatInterval = (60 / bpm) * 1000;
    let stepIndex = 0;

    const runStep = () => {
      const current = pattern[stepIndex % pattern.length];
      if (current.type === 'bass') this.playDhakBass(1.0);
      else if (current.type === 'rim') this.playDhakRim(440, 0.9);
      else if (current.type === 'stick') this.playStickClick(0.85);
      else if (current.type === 'kanshi') this.playKanshi(0.65);

      if (onStep) onStep(stepIndex % pattern.length);
      stepIndex++;

      const nextDelay = current.delay * beatInterval;
      this.activeSequenceTimer = window.setTimeout(runStep, Math.max(40, nextDelay));
    };

    runStep();
  }

  public stopSequence() {
    if (this.activeSequenceTimer !== null) {
      clearTimeout(this.activeSequenceTimer);
      this.activeSequenceTimer = null;
    }
  }

  public isPlayingSequence(): boolean {
    return this.activeSequenceTimer !== null;
  }
}

export const pujaAudio = new PujaAudioEngine();
