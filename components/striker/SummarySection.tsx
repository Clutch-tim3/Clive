export default function SummarySection() {
  return (
    <div style={{ marginTop:'64px', marginBottom:'64px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px' }}>
        {/* What is Striker? */}
        <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'16px' }}>
            What is Striker?
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {[
              'Adaptive EDR desktop app on Mahoraga engine',
              'Real-time monitoring (processes, network, files, memory)',
              'Antibody system with nightly retraining'
            ].map(item => (
              <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Competition */}
        <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'16px' }}>
            Competition
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {[
              '"Break the Shield" - 72-hour undetected attack challenge',
              'Monthly (R5k), Quarterly (R25k), Annual (R100k) prizes',
              'Every detection improves Striker permanently'
            ].map(item => (
              <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing Tiers */}
        <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'16px' }}>
            Pricing Tiers
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {[
              'Free: Real-time detection, 100-entry archive',
              'Developer (R299/mo): Unlimited archive, MITRE mapping',
              'Pro (R799/mo): Cloud sync, collective intelligence'
            ].map(item => (
              <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Specs */}
        <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'16px' }}>
            Technical Specs
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {[
              'Multi-platform (Windows/macOS/Linux)',
              '<2% CPU, <50MB RAM resource usage',
              'MITRE ATT&CK technique mapping',
              '98.7% detection accuracy'
            ].map(item => (
              <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Community Impact */}
        <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'22px', color:'#fff', marginBottom:'16px' }}>
            Community Impact
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0 }}>
            {[
              '500+ active researchers',
              '12,847 antibodies created',
              'Real-world success stories'
            ].map(item => (
              <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}