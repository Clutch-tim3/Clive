export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Striker's adaptive learning caught our red team exercise that traditional EDR completely missed. The antibody system is revolutionary.",
      author: "Sarah Chen",
      title: "Lead Security Researcher",
      company: "TechCorp Security",
      avatar: "SC"
    },
    {
      quote: "After implementing Striker, our mean time to detect dropped by 85%. The nightly adaptation cycles keep it ahead of emerging threats.",
      author: "Marcus Rodriguez",
      title: "CISO",
      company: "FinSecure Bank",
      avatar: "MR"
    },
    {
      quote: "The competition pushed the boundaries of what we thought was possible. Striker evolved significantly during the testing period.",
      author: "Dr. Elena Volkov",
      title: "Principal Researcher",
      company: "Advanced Threat Labs",
      avatar: "EV"
    }
  ];

  const caseStudies = [
    {
      title: "Nation-State APT Campaign Neutralized",
      description: "Striker detected and contained a sophisticated supply chain attack that bypassed 7 commercial EDR solutions. The adaptive response prevented lateral movement across 200+ endpoints.",
      metrics: ["Detection: <5 minutes", "Containment: 100%", "False Positives: 0"],
      icon: "🛡️"
    },
    {
      title: "Ransomware Prevention Success",
      description: "A novel ransomware variant was stopped mid-encryption when Striker recognized behavioral patterns from a previous antibody. Data loss prevented on 50TB of critical files.",
      metrics: ["Files Protected: 500,000+", "Downtime: 0 hours", "Recovery Cost: R0"],
      icon: "🔒"
    },
    {
      title: "Zero-Day Exploit Mitigation",
      description: "During a penetration test, Striker identified and blocked a zero-day privilege escalation exploit before it could be chained with other vulnerabilities.",
      metrics: ["Detection Rate: 98%", "Response Time: <2 seconds", "Adaptation: Automatic"],
      icon: "⚡"
    }
  ];

  const winners = [
    {
      name: "Alex Thompson",
      handle: "@alx_thm",
      achievement: "First to bypass Layer 3 defenses",
      prize: "R25,000 Quarterly Elite",
      technique: "Novel memory injection method",
      avatar: "AT"
    },
    {
      name: "Priya Patel",
      handle: "@priya_sec",
      achievement: "72-hour undetected persistence",
      prize: "R5,000 Monthly Open",
      technique: "Advanced living-off-the-land tactics",
      avatar: "PP"
    },
    {
      name: "David Kim",
      handle: "@dkim_research",
      achievement: "Multi-stage attack chain success",
      prize: "R100,000 Annual Championship",
      technique: "AI-assisted evasion techniques",
      avatar: "DK"
    }
  ];

  return (
    <section style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>

        {/* Community Stats */}
        <div style={{ textAlign:'center', marginBottom:'80px' }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
            Trusted by Security Professionals
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'24px', marginTop:'40px' }}>
            {[
              { number: '500+', label: 'Active Researchers' },
              { number: '12,847', label: 'Antibodies Created' },
              { number: '98.7%', label: 'Detection Accuracy' },
              { number: '24/7', label: 'Adaptive Learning' }
            ].map(stat => (
              <div key={stat.label} style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'32px', color:'rgba(220,80,80,0.95)', marginBottom:'4px' }}>{stat.number}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom:'80px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'32px', textAlign:'center' }}>
            What Security Experts Say
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(350px,1fr))', gap:'24px' }}>
            {testimonials.map(testimonial => (
              <div key={testimonial.author} style={{ padding:'32px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px' }}>
                <div style={{ fontFamily:"'Libre Baskerville',serif", fontStyle:'italic', fontSize:'15px', color:'rgba(255,255,255,0.8)', lineHeight:1.6, marginBottom:'20px' }}>
                  "{testimonial.quote}"
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'50%',
                    background:'rgba(220,80,80,0.2)', border:'1px solid rgba(220,80,80,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(220,80,80,0.9)',
                    flexShrink:0
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'#fff', fontWeight:500 }}>{testimonial.author}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.5)' }}>
                      {testimonial.title} · {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div style={{ marginBottom:'80px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'32px', textAlign:'center' }}>
            Real-World Success Stories
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'24px' }}>
            {caseStudies.map(study => (
              <div key={study.title} style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
                <div style={{ fontSize:'32px', marginBottom:'16px' }}>{study.icon}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'12px' }}>{study.title}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:'20px' }}>{study.description}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                  {study.metrics.map(metric => (
                    <div key={metric} style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(220,80,80,0.8)', display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ color:'rgba(80,200,120,0.85)' }}>•</span>
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Winners */}
        <div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'32px', textAlign:'center' }}>
            Hall of Fame
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>
            {winners.map(winner => (
              <div key={winner.name} style={{ padding:'24px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                  <div style={{
                    width:'48px', height:'48px', borderRadius:'50%',
                    background:'rgba(220,80,80,0.2)', border:'1px solid rgba(220,80,80,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'DM Mono',monospace", fontSize:'14px', color:'rgba(220,80,80,0.9)',
                    flexShrink:0
                  }}>
                    {winner.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'#fff', fontWeight:500 }}>{winner.name}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.5)' }}>{winner.handle}</div>
                  </div>
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(220,80,80,0.9)', marginBottom:'8px', letterSpacing:'0.05em' }}>
                  {winner.prize}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.7)', marginBottom:'8px' }}>
                  {winner.achievement}
                </div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgba(255,255,255,0.5)', letterSpacing:'0.05em', textTransform:'uppercase' }}>
                  Technique: {winner.technique}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}