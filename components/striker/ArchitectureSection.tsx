export default function ArchitectureSection() {
  return (
    <section style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
          The Mahoraga Engine
        </h2>
        <p style={{ fontStyle:'italic', fontSize:'15px', color:'rgba(255,255,255,0.4)', lineHeight:1.85, maxWidth:'580px', marginBottom:'56px' }}>
          Striker&apos;s adaptive intelligence is powered by the Mahoraga engine, a multi-layered detection system that learns from every encounter.
          Below is a detailed breakdown of its architecture, capabilities, and limitations.
        </p>

        {/* Architecture Overview */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Architecture Overview
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'24px' }}>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>LAYER 1</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Sensor Array</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Real-time monitoring of process creation, file system events, network connections, and memory patterns.
                Uses ETW (Event Tracing for Windows), eBPF (Linux), and EndpointSecurity (macOS) frameworks.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>LAYER 2</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Analysis Engine</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Multi-stage classification pipeline combining signature-based detection, behavioral analysis, and ML models.
                Maps threats to MITRE ATT&CK framework for comprehensive attack chain recognition.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>LAYER 3</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Response Module</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Automated neutralization with graduated response options: process termination, file quarantine, network isolation, and user alerts.
                All responses are logged and can be configured per policy.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>LAYER 4</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Antibody Archive</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Persistent learning system that archives detected threats as &quot;antibodies&quot;.
                Nightly retraining cycle incorporates new samples into the detection models for permanent immunity.
              </div>
            </div>
          </div>
        </div>

        {/* Antibody System */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            The Antibody System
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', alignItems:'start' }}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(220,80,80,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                HOW IT WORKS
              </div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'14px', color:'rgba(255,255,255,0.7)', lineHeight:1.7, marginBottom:'20px' }}>
                When Striker detects a novel threat, it creates an &quot;antibody&quot; — a structured record containing:
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {[
                  'Behavioral signatures and IOCs',
                  'MITRE ATT&CK technique mappings',
                  'Detection confidence scores',
                  'Response effectiveness metrics',
                  'Timestamp and environmental context'
                ].map(item => (
                  <li key={item} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'10px' }}>
                    <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0 }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(220,80,80,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                ADAPTATION CYCLES
              </div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'14px', color:'rgba(255,255,255,0.7)', lineHeight:1.7 }}>
                <strong style={{ color:'#fff' }}>Daily Learning:</strong> New antibodies are incorporated into detection models during nightly retraining cycles.<br/><br/>
                <strong style={{ color:'#fff' }}>Community Sync:</strong> Pro and Enterprise tiers benefit from federated intelligence sharing across all installations.<br/><br/>
                <strong style={{ color:'#fff' }}>False Positive Mitigation:</strong> Antibodies include confidence scoring to reduce false positives over time.
              </div>
            </div>
          </div>
        </div>

        {/* Detection Mechanisms */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Detection Mechanisms & Response Types
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'20px' }}>
            {[
              { title:'Signature-Based', desc:'Known malware signatures, file hashes, and IOC patterns.', response:'Immediate quarantine' },
              { title:'Behavioral Analysis', desc:'Anomaly detection in process chains, memory usage, and network patterns.', response:'Process suspension' },
              { title:'ML Classification', desc:'Deep learning models trained on antibody archive for novel threat recognition.', response:'Graduated response' },
              { title:'Heuristic Rules', desc:'Expert-crafted rules for common attack techniques and privilege escalation.', response:'Network isolation' }
            ].map(mech => (
              <div key={mech.title} style={{ padding:'20px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'18px', color:'#fff', marginBottom:'8px' }}>{mech.title}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', color:'rgba(255,255,255,0.5)', lineHeight:1.5, marginBottom:'12px' }}>{mech.desc}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'8px', color:'rgba(220,80,80,0.8)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  Response: {mech.response}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities & Limitations */}
        <div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Capabilities & Limitations
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(80,200,120,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                STRENGTHS
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {[
                  'Continuous learning from real-world threats',
                  'Multi-platform support (Windows, macOS, Linux)',
                  'Low resource overhead (<2% CPU, <50MB RAM)',
                  'No cloud dependency for core functionality',
                  'Transparent operation with detailed logging'
                ].map(strength => (
                  <li key={strength} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                    <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0, marginTop:'2px' }}>✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(210,150,50,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                LIMITATIONS
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {[
                  'Requires initial training period (2-4 weeks recommended)',
                  'Limited effectiveness against zero-day exploits until learned',
                  'Performance impact during high-frequency attack scenarios',
                  'Dependency on host OS security frameworks',
                  'No protection against physical access or supply chain attacks'
                ].map(limit => (
                  <li key={limit} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                    <span style={{ color:'rgba(210,150,50,0.85)', flexShrink:0, marginTop:'2px' }}>!</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}