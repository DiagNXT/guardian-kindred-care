import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  Audio,
  staticFile,
  interpolateColors,
} from 'remotion';

// --- CONFIGURATION ---
const SCENES = {
  intro: { start: 0, duration: 150 },
  medication: { start: 150, duration: 150 },
  ocr: { start: 300, duration: 210 },
  voice: { start: 510, duration: 150 },
  dashboard: { start: 660, duration: 180 },
  videocall: { start: 840, duration: 150 },
  features: { start: 990, duration: 210 },
  emotional: { start: 1200, duration: 180 },
  outro: { start: 1380, duration: 240 },
};

const COLORS = {
  primary: '#1e5fa8',
  primaryDark: '#0b305e',
  secondary: '#f5921b',
  secondaryDark: '#b8680a',
  accent: '#10b981',
  background: '#040b15',
  cardBg: 'rgba(30, 41, 59, 0.4)',
  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textMuted: '#94a3b8',
};

// --- CORE PREMIUM COMPONENTS ---

const AmbientGlow = ({ color, x, y, size, delay = 0 }: any) => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.sin(frame / 40 + delay) * 0.2;
  const moveX = Math.sin(frame / 60 + delay) * 80;
  const moveY = Math.cos(frame / 50 + delay) * 80;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        opacity: 0.4,
        transform: `translate(${moveX}px, ${moveY}px) scale(${scale})`,
      }}
    />
  );
};

const FadeSlideUp = ({ children, delay = 0, duration = 30, yOffset = 50 }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 80 } });

  return (
    <div style={{
      opacity: interpolate(anim, [0, 1], [0, 1]),
      transform: `translateY(${interpolate(anim, [0, 1], [yOffset, 0])}px)`,
      width: '100%', height: '100%',
    }}>
      {children}
    </div>
  );
};

const TextReveal = ({ text, delay = 0, size = 64, color = COLORS.text, weight = 'bold', gradient = false }: any) => {
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', gap: size * 0.25, flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((word: string, i: number) => (
        <FadeSlideUp key={i} delay={delay + i * 5} yOffset={30}>
          <span style={{
            fontSize: size,
            fontWeight: weight,
            color: gradient ? 'transparent' : color,
            backgroundImage: gradient ? `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.textMuted} 100%)` : 'none',
            WebkitBackgroundClip: gradient ? 'text' : 'none',
            letterSpacing: '-0.03em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            {word}
          </span>
        </FadeSlideUp>
      ))}
    </div>
  );
};

const GlassCard = ({ children, style = {}, delay = 0 }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });

  return (
    <div style={{
      background: COLORS.glassBg,
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: `1px solid ${COLORS.glassBorder}`,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      borderRadius: 30,
      transform: `scale(${interpolate(scale, [0, 1], [0.95, 1])})`,
      opacity: interpolate(scale, [0, 1], [0, 1]),
      overflow: 'hidden',
      ...style
    }}>
      {children}
    </div>
  );
};

const AuraLogo = ({ size = 100, animated = false }: any) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = animated ? spring({ frame, fps, config: { damping: 12, stiffness: 80 } }) : 1;
  const pulse = animated ? 1 + Math.sin(frame / 20) * 0.05 : 1;

  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.25,
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: size * 0.15,
      transform: `scale(${scale}) scale(${pulse})`,
      boxShadow: `0 20px 40px rgba(30, 95, 168, 0.4)`,
    }}>
      <Img src={staticFile('logo.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
};

const PhoneMockup = ({ children, delay = 0, style = {} }: any) => {
  return (
    <FadeSlideUp delay={delay} yOffset={100}>
      <div style={{
        width: 420, height: 850,
        background: '#09090b',
        borderRadius: 55, border: '12px solid #27272a',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #3f3f46',
        position: 'relative', overflow: 'hidden',
        ...style
      }}>
        {/* Dynamic Island */}
        <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', width: 120, height: 35, background: '#000', borderRadius: 20, zIndex: 100 }} />
        <div style={{ width: '100%', height: '100%', background: COLORS.background, position: 'relative' }}>
          {children}
        </div>
      </div>
    </FadeSlideUp>
  );
};

// --- SCENES ---

const Scene1_Intro = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <AmbientGlow color={COLORS.secondary} x="40%" y="30%" size={900} />
      <AmbientGlow color={COLORS.primary} x="60%" y="60%" size={1000} delay={45} />
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <FadeSlideUp delay={0}>
          <span style={{ fontSize: 120, filter: 'drop-shadow(0 0 30px rgba(245, 146, 27, 0.6))' }}>🍂</span>
        </FadeSlideUp>
        <div style={{ marginTop: 60, transform: 'scale(1.2)' }}>
          <TextReveal text="Every 3 seconds," size={72} delay={30} />
          <div style={{ marginTop: 20 }}>
            <TextReveal text="a senior falls at home." size={72} color={COLORS.secondary} delay={50} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene2_Medication = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <AmbientGlow color={COLORS.primary} x="-10%" y="-10%" size={800} />
      <AmbientGlow color={COLORS.secondary} x="70%" y="50%" size={800} delay={20} />
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', padding: '0 100px', gap: 100 }}>
        <div style={{ flex: 1 }}>
          <TextReveal text="Smart Medication Reminders" size={76} gradient delay={10} />
          <div style={{ marginTop: 30 }}>
            <FadeSlideUp delay={40}>
              <p style={{ color: COLORS.textMuted, fontSize: 36, lineHeight: 1.5, letterSpacing: '-0.02em' }}>
                Never let a dose be forgotten.<br />Intelligent alerts sent straight to their device,<br />exactly when they need them.
              </p>
            </FadeSlideUp>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 50 }}>
            {['Morning', 'Afternoon', 'Night'].map((time, i) => (
              <FadeSlideUp delay={60 + (i * 15)} key={i}>
                <div style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, padding: '15px 30px', borderRadius: 100, color: COLORS.text, fontSize: 24, fontWeight: 'bold' }}>{time}</div>
              </FadeSlideUp>
            ))}
          </div>
        </div>
        <PhoneMockup delay={30} style={{ transform: 'rotate(-5deg)' }}>
          <div style={{ background: `linear-gradient(180deg, ${COLORS.primaryDark} 0%, #000 100%)`, height: '100%', padding: '80px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, border: '2px solid rgba(255,255,255,0.2)' }}>💊</div>
              <p style={{ color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 30 }}>Time for Medicine</p>
              <p style={{ color: COLORS.textMuted, fontSize: 22, marginTop: 10 }}>Metformin 500mg</p>
            </div>
            <div style={{ background: 'rgba(245, 146, 27, 0.2)', border: '1px solid rgba(245, 146, 27, 0.4)', padding: '25px', borderRadius: 25, marginTop: 50 }}>
              <p style={{ color: COLORS.secondary, fontSize: 24, fontWeight: 'bold', margin: 0 }}>⚠️ Take after breakfast</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, margin: '10px 0 0 0' }}>1 tablet with water</p>
            </div>
            <div style={{ background: COLORS.accent, padding: '25px', borderRadius: 25, marginTop: 40, textAlign: 'center', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
              <p style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', margin: 0 }}>✓ TAP TO CONFIRM</p>
            </div>
          </div>
        </PhoneMockup>
      </div>
    </AbsoluteFill>
  );
};

const Scene3_OCR = () => {
  const frame = useCurrentFrame();
  const scanLine = interpolate(frame, [40, 160], [-50, 750], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const items = [
    { n: 'Metformin 500mg', t: 'After Food' },
    { n: 'Amlodipine 5mg', t: 'Before Food' },
    { n: 'Atorvastatin 10mg', t: 'Night Time' }
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <AmbientGlow color={COLORS.secondary} x="50%" y="20%" size={900} />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '60px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <TextReveal text="Smart Prescription Scan" size={64} gradient delay={10} />
        </div>
        <div style={{ display: 'flex', gap: 60, flex: 1 }}>
          <GlassCard delay={30} style={{ flex: 1, padding: 50, position: 'relative' }}>
            <p style={{ fontSize: 32, color: COLORS.textMuted, marginTop: 0 }}>Input: Camera</p>
            <div style={{ background: '#fff', width: '100%', height: 500, borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
              {/* Dummy Paper */}
              <div style={{ padding: 40, color: '#000', fontFamily: 'serif' }}>
                <h1 style={{ fontSize: 48, borderBottom: '2px solid #ccc', paddingBottom: 20 }}>Dr. Ramesh Clinic</h1>
                <p style={{ fontSize: 32, fontFamily: 'cursive', margin: '30px 0', color: '#1f2937' }}>1. Metformin 500mg (1-0-1) AF</p>
                <p style={{ fontSize: 32, fontFamily: 'cursive', margin: '30px 0', color: '#1f2937' }}>2. Amlodipine 5mg (1-0-0) BF</p>
                <p style={{ fontSize: 32, fontFamily: 'cursive', margin: '30px 0', color: '#1f2937' }}>3. Atorvastatin 10mg (0-0-1)</p>
              </div>
              {/* Scanning Laser */}
              <div style={{ position: 'absolute', top: scanLine, width: '100%', height: 6, background: COLORS.primary, boxShadow: `0 0 30px 10px ${COLORS.primaryLight}`, zIndex: 10 }} />
              <div style={{ position: 'absolute', top: 0, height: scanLine, width: '100%', background: 'rgba(30, 95, 168, 0.15)', zIndex: 5 }} />
            </div>
          </GlassCard>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 60 }}>
            {items.map((it, i) => (
              <FadeSlideUp key={i} delay={80 + (i * 30)}>
                <div style={{ background: `linear-gradient(90deg, rgba(30, 95, 168, 0.4) 0%, transparent 100%)`, borderLeft: `6px solid ${COLORS.secondary}`, padding: '30px 40px', borderRadius: '0 20px 20px 0' }}>
                  <h3 style={{ fontSize: 36, color: COLORS.text, margin: 0 }}>{it.n}</h3>
                  <p style={{ fontSize: 24, color: COLORS.accent, margin: '10px 0 0 0', fontWeight: 'bold' }}>{it.t}</p>
                </div>
              </FadeSlideUp>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4_Voice = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <AmbientGlow color={COLORS.primary} x="50%" y="50%" size={1200} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <FadeSlideUp delay={20}>
          <div style={{ width: 250, height: 250, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${100 + Math.sin(frame / 10) * 50}px ${COLORS.primary}`, position: 'relative' }}>
            <span style={{ fontSize: 100, zIndex: 10 }}>🤖</span>
            {/* Ripples */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{ position: 'absolute', inset: -20 * i, borderRadius: '50%', border: `2px solid rgba(255,255,255,${0.3 / i})`, transform: `scale(${1 + Math.sin(frame / (15 * i)) * 0.1})` }} />
            ))}
          </div>
        </FadeSlideUp>
        <div style={{ marginTop: 80, textAlign: 'center' }}>
          <TextReveal text="AI Companion" size={80} gradient delay={40} />
          <FadeSlideUp delay={60}>
            <p style={{ color: COLORS.textMuted, fontSize: 36, marginTop: 20 }}>Voice enabled. Speaks their language.</p>
            <div style={{ display: 'inline-block', background: 'rgba(245, 146, 27, 0.2)', padding: '15px 40px', borderRadius: 40, color: COLORS.secondary, fontSize: 24, fontWeight: 'bold', marginTop: 30, border: `1px solid rgba(245, 146, 27, 0.3)` }}>Hindi & English Supported</div>
          </FadeSlideUp>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene5_Dashboard = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background, padding: '80px 100px' }}>
      <AmbientGlow color={COLORS.secondary} x="-20%" y="-20%" size={800} />
      <TextReveal text="Caregiver Dashboard" size={72} gradient delay={10} />
      <FadeSlideUp delay={30} yOffset={20}>
        <p style={{ color: COLORS.textMuted, fontSize: 32, marginTop: 10 }}>Complete visibility, total peace of mind.</p>
      </FadeSlideUp>
      <div style={{ display: 'flex', gap: 40, marginTop: 60, height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <GlassCard delay={40} style={{ padding: 40 }}>
            <h3 style={{ color: COLORS.textMuted, fontSize: 28, margin: 0 }}>Medication Adherence</h3>
            <p style={{ color: COLORS.accent, fontSize: 80, fontWeight: 'bold', margin: '10px 0 0 0' }}>98%</p>
          </GlassCard>
          <GlassCard delay={55} style={{ padding: 40 }}>
            <h3 style={{ color: COLORS.textMuted, fontSize: 28, margin: 0 }}>Daily Activity</h3>
            <p style={{ color: COLORS.text, fontSize: 60, fontWeight: 'bold', margin: '10px 0 0 0' }}>🏃 Optimal</p>
          </GlassCard>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <GlassCard delay={70} style={{ padding: 50, background: `linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(30, 41, 59, 0.4) 100%)`, border: '1px solid rgba(239, 68, 68, 0.3)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
              <span style={{ fontSize: 50 }}>🚨</span>
              <h2 style={{ color: COLORS.danger, fontSize: 40, margin: 0 }}>Action Required</h2>
            </div>
            <p style={{ color: '#fff', fontSize: 28, lineHeight: 1.5 }}>Mom has not confirmed her 2:00 PM medication.</p>
            <div style={{ marginTop: 50, background: COLORS.danger, padding: '20px', borderRadius: 20, textAlign: 'center', color: '#fff', fontSize: 28, fontWeight: 'bold', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)' }}>
              Call Now
            </div>
          </GlassCard>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene6_VideoCall = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1, position: 'relative', background: '#1c2636' }}>
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 60, left: 60, background: 'rgba(0,0,0,0.6)', padding: '15px 30px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
            <p style={{ color: '#fff', fontSize: 32, margin: 0, fontWeight: 'bold' }}>Daughter</p>
          </div>
        </div>
        <div style={{ width: 10, background: COLORS.secondary, height: '100%', boxShadow: `0 0 30px ${COLORS.secondary}` }} />
        <div style={{ flex: 1, position: 'relative', background: '#0d131f' }}>
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: 60, left: 60, background: 'rgba(0,0,0,0.6)', padding: '15px 30px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
            <p style={{ color: '#fff', fontSize: 32, margin: 0, fontWeight: 'bold' }}>Father</p>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 60, width: '100%', textAlign: 'center' }}>
        <GlassCard delay={20} style={{ display: 'inline-block', padding: '20px 50px' }}>
          <h2 style={{ color: '#fff', fontSize: 40, margin: 0, letterSpacing: '-0.02em' }}>Seamless Connection</h2>
        </GlassCard>
      </div>
      {/* Pulsing heart center */}
      <FadeSlideUp delay={40} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: COLORS.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 60px ${COLORS.danger}` }}>
          <span style={{ fontSize: 60 }}>♥️</span>
        </div>
      </FadeSlideUp>
    </AbsoluteFill>
  );
};

const Scene7_Features = () => {
  const features = [
    { i: '🏥', t: 'Smart Health Stats' },
    { i: '🔔', t: 'Real-time Alerts' },
    { i: '📱', t: 'One-Tap Calling' },
    { i: '🔊', t: 'Voice Control' },
    { i: '📄', t: 'OCR Scanning' },
    { i: '🛡️', t: 'Secure & Private' },
  ];
  return (
    <AbsoluteFill style={{ background: COLORS.background, padding: '100px' }}>
      <AmbientGlow color={COLORS.primary} x="30%" y="20%" size={1000} />
      <TextReveal text="Intelligent Support" size={80} gradient delay={10} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 80 }}>
        {features.map((f, i) => (
          <GlassCard key={i} delay={40 + (i * 10)} style={{ padding: '40px 30px', display: 'flex', alignItems: 'center', gap: 30 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{f.i}</div>
            <p style={{ color: COLORS.text, fontSize: 32, margin: 0, fontWeight: '600' }}>{f.t}</p>
          </GlassCard>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Scene8_Emotional = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <AmbientGlow color={COLORS.secondary} x="50%" y="50%" size={1500} opacity={0.5} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <FadeSlideUp delay={20}>
          <span style={{ fontSize: 120, filter: `drop-shadow(0 0 50px ${COLORS.secondary})` }}>🌟</span>
        </FadeSlideUp>
        <div style={{ marginTop: 60, textAlign: 'center' }}>
          <TextReveal text="Because every moment matters." size={86} delay={40} />
          <FadeSlideUp delay={70}>
            <p style={{ color: COLORS.textMuted, fontSize: 40, marginTop: 40, fontStyle: 'italic', maxWidth: 1000, lineHeight: 1.5 }}>
              Empowering them with independence.<br />Providing you with peace of mind.
            </p>
          </FadeSlideUp>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene9_Outro = () => {
  const frame = useCurrentFrame();
  const bgOpacity = Math.min(1, frame / 30);
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <div style={{ position: 'absolute', inset: 0, opacity: bgOpacity, background: `radial-gradient(circle at 50% 50%, ${COLORS.primaryDark} 0%, ${COLORS.background} 100%)` }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', zIndex: 10 }}>
        <AuraLogo size={240} animated />
        <div style={{ marginTop: 60 }}>
          <TextReveal text="AURA Care" size={120} gradient delay={30} />
        </div>
        <FadeSlideUp delay={60}>
          <p style={{ color: COLORS.secondary, fontSize: 42, letterSpacing: '0.05em', marginTop: 20 }}>INTELLIGENT SUPPORT</p>
        </FadeSlideUp>
        <FadeSlideUp delay={90}>
          <div style={{ marginTop: 80, background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1e3a8a 100%)`, padding: '25px 80px', borderRadius: 50, boxShadow: `0 20px 40px rgba(30, 95, 168, 0.4)`, border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ color: '#fff', fontSize: 36, fontWeight: 'bold' }}>Available Now</span>
          </div>
        </FadeSlideUp>
      </div>
    </AbsoluteFill>
  );
};

// --- MAIN COMPOSITION ---

export const AuraCareAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <Audio src={staticFile('music.mp3')} volume={0.4} />
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}><Scene1_Intro /></Sequence>
      <Sequence from={SCENES.medication.start} durationInFrames={SCENES.medication.duration}><Scene2_Medication /></Sequence>
      <Sequence from={SCENES.ocr.start} durationInFrames={SCENES.ocr.duration}><Scene3_OCR /></Sequence>
      <Sequence from={SCENES.voice.start} durationInFrames={SCENES.voice.duration}><Scene4_Voice /></Sequence>
      <Sequence from={SCENES.dashboard.start} durationInFrames={SCENES.dashboard.duration}><Scene5_Dashboard /></Sequence>
      <Sequence from={SCENES.videocall.start} durationInFrames={SCENES.videocall.duration}><Scene6_VideoCall /></Sequence>
      <Sequence from={SCENES.features.start} durationInFrames={SCENES.features.duration}><Scene7_Features /></Sequence>
      <Sequence from={SCENES.emotional.start} durationInFrames={SCENES.emotional.duration}><Scene8_Emotional /></Sequence>
      <Sequence from={SCENES.outro.start} durationInFrames={SCENES.outro.duration}><Scene9_Outro /></Sequence>
    </AbsoluteFill>
  );
};
