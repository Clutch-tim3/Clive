import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Striker — Adaptive Endpoint Security · Clive',
  description: 'Striker is an adaptive EDR desktop app that learns from every attack. Download free or join the 72-hour CTF sandbox competition.',
};

const DOWNLOADS = {
  windows: 'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-win.exe',
  macos:   'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-mac.dmg',
  linux:   'https://storage.googleapis.com/clive-6d22e.appspot.com/striker/striker-linux.AppImage',
};

const TIERS = [
  {
    name: 'Free',
    price: 'R0',
    desc: 'Permanent free access. No time limit.',
    features: [
      'Real-time threat detection',
      'Process, file & network monitoring',
      'Automatic neutralisation',
      'Local antibody archive (100 entries)',
      'Community support',
    ],
  },
  {
    name: 'Developer',
    price: 'R299/mo',
    featured: true,
    desc: 'For researchers and security engineers.',
    features: [
      'Everything in Free',
      'Unlimited antibody archive',
      'Nightly adaptation loop',
      'MITRE ATT&CK mapping',
      'Remediation reports',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: 'R799/mo',
    desc: 'For teams and enterprise environments.',
    features: [
      'Everything in Developer',
      'Cloud archive sync',
      'Federated collective intelligence',
      'Priority support + SLA',
      'Enterprise policy controls',
    ],
  },
];

const COMPETITION_PRIZES = [
  { round: 'Monthly Open',    prize: 'R5,000',  freq: 'Every month',  where: 'Reddit · HackTheBox · Discord' },
  { round: 'Quarterly Elite',  prize: 'R25,000', freq: 'Every quarter', where: 'Freelancer · Bugcrowd' },
  { round: 'Annual Championship', prize: 'R100,000', freq: 'Once a year', where: 'Invite only' },
];

export default function StrikerPage() {
  return (
    <main style={{ background:'#07070A', color:'#fff', fontFamily:"'Libre Baskerville',Georgia,serif" }}>

      {/* ── SECTION 1: THE APP ── */}
      <section id="app" style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(220,80,80,0.55)', marginBottom:'14px' }}>
          The App
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(52px,6vw,88px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
          Striker
        </h1>
        <p style={{ fontStyle:'italic', fontSize:'16px', color:'rgba(255,255,255,0.45)', lineHeight:1.85, maxWidth:'580px', marginBottom:'48px' }}>
          An adaptive endpoint detection and response system built on the Mahoraga engine.
          It monitors process activity, network traffic, file system events, and memory in real time.
          Unlike conventional antivirus, every threat it sees makes it permanently smarter.
        </p>

        {/* How it works — 4 steps */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'64px' }}>
          {[
            { n:'01', title:'Detect',   desc:'Process, network, and file sensors capture threat signals in real time.' },
            { n:'02', title:'Understand', desc:'The analysis engine classifies the attack and maps it to MITRE ATT&CK.' },
            { n:'03', title:'Neutralise', desc:'Automatic response — process kill, quarantine, or network isolation.' },
            { n:'04', title:'Evolve',    desc:'The threat is archived as an antibody. The model retrains overnight.' },
          ].map(step => (
            <div key={step.n} style={{ padding:'24px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderTop:'1.5px solid rgba(220,80,80,0.3)', borderRadius:'20px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.5)', marginBottom:'10px' }}>{step.n}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'8px' }}>{step.title}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', color:'rgba(255,255,255,0.35)', lineHeight:1.7 }}>{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Download buttons */}
        <div style={{ marginBottom:'48px' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:'16px' }}>
            Download for free
          </div>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            {[
              { label:'Windows (.exe)', icon:'⊞', href:DOWNLOADS.windows },
              { label:'macOS (.dmg)',   icon:'',   href:DOWNLOADS.macos   },
              { label:'Linux (.AppImage)', icon:'🐧', href:DOWNLOADS.linux   },
            ].map(dl => (
              <a key={dl.label} href={dl.href} style={{
                display:'flex', alignItems:'center', gap:'10px', padding:'12px 22px',
                borderRadius:'100px', background:'rgba(180,20,20,0.15)',
                border:'1px solid rgba(220,80,80,0.3)', color:'rgba(220,80,80,0.9)',
                fontFamily:"'DM Mono',monospace", fontSize:'10px', letterSpacing:'0.1em',
                textDecoration:'none', transition:'all .2s',
              }}>
                <span>{dl.icon}</span>
                <span>{dl.label}</span>
                <span style={{ marginLeft:'4px' }}>↓</span>
              </a>
            ))}
          </div>
          <p style={{ fontFamily:"'DM Mono',monospace", fontSize:'8.5px', color:'rgba(255,255,255,0.2)', marginTop:'12px' }}>
            After downloading, enter your Clive API key on first launch to activate your tier.
            Get your key from <Link href="/dashboard/apis" style={{ color:'rgba(91,148,210,0.7)' }}>My APIs</Link>.
          </p>
        </div>

        {/* Pricing tiers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {TIERS.map(tier => (
            <div key={tier.name} style={{
              padding:'28px', borderRadius:'24px',
              background: tier.featured ? 'rgba(180,20,20,0.12)' : 'rgba(255,255,255,0.03)',
              border: tier.featured ? '1.5px solid rgba(220,80,80,0.45)' : '1px solid rgba(255,255,255,0.08)',
              position:'relative',
            }}>
              {tier.featured && (
                <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)', background:'rgba(220,80,80,0.9)', color:'#fff', fontFamily:"'DM Mono',monospace", fontSize:'8px', letterSpacing:'0.14em', padding:'4px 14px', borderRadius:'100px' }}>
                  RECOMMENDED
                </div>
              )}
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'26px', color:'#fff', marginBottom:'4px' }}>{tier.name}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'20px', color: tier.featured ? 'rgba(220,80,80,0.9)' : '#fff', marginBottom:'8px' }}>{tier.price}</div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:'italic', fontSize:'12px', color:'rgba(255,255,255,0.35)', lineHeight:1.6, marginBottom:'20px' }}>{tier.desc}</div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {tier.features.map(f => (
                  <li key={f} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.55)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ color:'rgba(80,200,120,0.8)', flexShrink:0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth?redirect=/dashboard/apis" style={{
                display:'block', marginTop:'24px', padding:'11px', borderRadius:'100px', textAlign:'center',
                background: tier.featured ? 'rgba(180,20,20,0.8)' : 'transparent',
                border: `1px solid ${tier.featured ? 'rgba(220,80,80,0.4)' : 'rgba(255,255,255,0.15)'}`,
                color: tier.featured ? '#fff' : 'rgba(255,255,255,0.5)',
                fontFamily:"'DM Mono',monospace", fontSize:'9.5px', letterSpacing:'0.12em',
                textTransform:'uppercase', textDecoration:'none',
              }}>
                {tier.price === 'R0' ? 'Download free' : 'Get started →'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: THE COMPETITION ── */}
      <section id="competition" style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(220,80,80,0.55)', marginBottom:'14px' }}>
            The Competition
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
            Break the Shield.
          </h2>
          <p style={{ fontStyle:'italic', fontSize:'15px', color:'rgba(255,255,255,0.4)', lineHeight:1.85, maxWidth:'580px', marginBottom:'56px' }}>
            Striker is an adaptive system. The more it is attacked, the smarter it becomes.
            We run an ongoing competition: attack a live Striker installation in a sandboxed
            environment. If the system hasn&apos;t detected you after 72 continuous hours — you win.
          </p>

          {/* Win condition */}
          <div style={{
            padding:'24px 28px', borderRadius:'20px', marginBottom:'40px',
            background:'rgba(220,80,80,0.07)', border:'1px solid rgba(220,80,80,0.2)',
            display:'flex', alignItems:'center', gap:'20px',
          }}>
            <div style={{ fontSize:'32px', flexShrink:0 }}>🎯</div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(220,80,80,0.9)', marginBottom:'6px', letterSpacing:'0.08em' }}>WIN CONDITION</div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:'italic', fontSize:'14px', color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>
                Keep your attack undetected for <strong style={{ color:'#fff' }}>72 continuous hours</strong>.
                If Striker detects your attack before the timer ends — you lose.
                Every attack that Striker catches makes it permanently smarter.
              </div>
            </div>
          </div>

          {/* Sandbox preview */}
          <div style={{
            background:'#000', borderRadius:'20px', border:'1px solid rgba(220,80,80,0.2)',
            overflow:'hidden', marginBottom:'40px',
          }}>
            {/* Terminal header */}
            <div style={{
              background:'rgba(7,7,10,0.95)', borderBottom:'1px solid rgba(220,80,80,0.1)',
              padding:'12px 20px', display:'flex', alignItems:'center', gap:'8px',
            }}>
              <span style={{ width:'12px', height:'12px', borderRadius:'50%', background:'rgba(220,80,80,0.7)', display:'inline-block' }}/>
              <span style={{ width:'12px', height:'12px', borderRadius:'50%', background:'rgba(210,150,50,0.5)', display:'inline-block' }}/>
              <span style={{ width:'12px', height:'12px', borderRadius:'50%', background:'rgba(80,200,120,0.4)', display:'inline-block' }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.3)', marginLeft:'8px', letterSpacing:'0.1em' }}>striker@sandbox:~$ — BREAK THE SHIELD CTF</span>
            </div>
            {/* Terminal content */}
            <div style={{ padding:'20px 24px', fontFamily:"'DM Mono',monospace", fontSize:'10px', lineHeight:1.9 }}>
              {[
                ['dim','╔═══════════════════════════════════════════════════════╗'],
                ['dim','║  STRIKER · ADAPTIVE ENDPOINT SECURITY                 ║'],
                ['dim','║  Sandbox Terminal v1.0   ·   Donington Vale            ║'],
                ['dim','╚═══════════════════════════════════════════════════════╝'],
                ['dim',''],
                ['rgba(91,148,210,0.8)','[·] Connected to WIN-SRV-01 (10.0.0.12) · MEDIUM'],
                ['rgba(91,148,210,0.8)','[·] Striker EDR active on target. Proceed carefully.'],
                ['rgba(255,255,255,0.75)','striker@sandbox:~$ run ransomware_sim --target WIN-SRV-01'],
                ['rgba(91,148,210,0.8)','[·] Launching Ransomware Simulation...'],
                ['rgba(255,255,255,0.75)','> svchost32.exe spawned from C:\\Windows\\Temp'],
                ['rgba(210,150,50,0.9)','[!] Enumerating 847 sensitive files...'],
                ['rgba(255,255,255,0.75)','> file_001.docx → file_001.docx.locked ✓'],
                ['rgba(255,255,255,0.75)','> file_002.xlsx → file_002.xlsx.locked ✓'],
                ['rgba(220,80,80,0.9)','━'.repeat(52)],
                ['rgba(220,80,80,0.9)','[✗] STRIKER DETECTED YOUR ATTACK'],
                ['rgba(210,150,50,0.9)','[!] T1486 · Data Encrypted for Impact · Severity: 9/10'],
                ['rgba(91,148,210,0.8)','[·] Antibody #a3f2e1 created and archived'],
                ['rgba(80,200,120,0.9)','[·] Striker is now immune to this technique.'],
              ].map(([col,text]) => (
                <div key={text} style={{ color: col as string }}>{text as string}</div>
              ))}
            </div>
          </div>

          {/* Prize tiers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
            {COMPETITION_PRIZES.map(p => (
              <div key={p.round} style={{
                padding:'24px', borderRadius:'20px',
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.08)',
                borderTop:'1.5px solid rgba(220,80,80,0.3)',
              }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'24px', color:'rgba(220,80,80,0.9)', marginBottom:'4px' }}>{p.prize}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'#fff', marginBottom:'6px' }}>{p.round}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8.5px', color:'rgba(255,255,255,0.3)', marginBottom:'4px' }}>{p.freq}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgba(255,255,255,0.2)' }}>{p.where}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW TO JOIN ── */}
      <section id="join" style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(220,80,80,0.55)', marginBottom:'14px' }}>
          How to join
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
          Three steps.
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'56px' }}>
          {[
            { n:'1', title:'Create a Clive account', desc:'Sign up at clive.dev. Free, takes 30 seconds. Your API key gives you access to the sandbox.' },
            { n:'2', title:'Acquire Striker', desc:'Go to My APIs and acquire Striker on the free tier. You\'ll get your API key and sandbox access instantly.' },
            { n:'3', title:'Enter the competition', desc:'Use the in-app sandbox terminal or register on Reddit/Freelancer for a dedicated 72hr CTF environment.' },
          ].map(step => (
            <div key={step.n} style={{ padding:'28px', borderRadius:'20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{
                width:'36px', height:'36px', borderRadius:'50%',
                background:'rgba(220,80,80,0.15)', border:'1px solid rgba(220,80,80,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'DM Mono',monospace", fontSize:'13px', color:'rgba(220,80,80,0.9)',
                marginBottom:'16px',
              }}>{step.n}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'8px' }}>{step.title}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', color:'rgba(255,255,255,0.35)', lineHeight:1.75 }}>{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Final CTAs */}
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          <Link href="/auth?redirect=/dashboard/apis" style={{
            padding:'14px 36px', borderRadius:'100px',
            background:'rgba(180,20,20,0.8)', color:'white',
            border:'1px solid rgba(220,50,50,0.4)',
            fontFamily:"'DM Mono',monospace", fontSize:'11px',
            letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none',
            boxShadow:'0 8px 24px rgba(180,20,20,0.4)',
          }}>
            Get started free →
          </Link>
          <a href="https://reddit.com/r/netsec" target="_blank" rel="noopener" style={{
            padding:'14px 36px', borderRadius:'100px',
            color:'rgba(255,255,255,0.45)',
            border:'1px solid rgba(255,255,255,0.14)',
            fontFamily:"'DM Mono',monospace", fontSize:'10px',
            letterSpacing:'0.1em', textTransform:'uppercase', textDecoration:'none',
          }}>
            Find competition on Reddit ↗
          </a>
        </div>
      </section>

    </main>
  );
}
