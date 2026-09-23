let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

function strike(ctx, time) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.4, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
  gain.connect(ctx.destination);

  [880, 1320, 2200].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const partialGain = ctx.createGain();
    partialGain.gain.value = i === 0 ? 1 : 0.35;
    osc.connect(partialGain);
    partialGain.connect(gain);
    osc.start(time);
    osc.stop(time + 0.85);
  });
}

export function playBellPattern(pattern) {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  let t = ctx.currentTime + 0.05;
  pattern.forEach((strikesInGroup) => {
    for (let i = 0; i < strikesInGroup; i++) {
      strike(ctx, t);
      t += 0.35;
    }
    t += 0.35;
  });
}
