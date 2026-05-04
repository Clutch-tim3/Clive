export default function CompetitionRules() {
  return (
    <section style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'100px 48px' }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'clamp(42px,5vw,72px)', letterSpacing:'-0.03em', lineHeight:1.0, marginBottom:'24px' }}>
          Competition Rules & Regulations
        </h2>
        <p style={{ fontStyle:'italic', fontSize:'15px', color:'rgba(255,255,255,0.4)', lineHeight:1.85, maxWidth:'580px', marginBottom:'56px' }}>
          The Break the Shield competition is designed to test the limits of adaptive security.
          Below are the complete rules, guidelines, and legal requirements for participation.
        </p>

        {/* Core Rules */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Core Competition Rules
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(350px,1fr))', gap:'24px' }}>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>RULE 1</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>72-Hour Detection Window</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                You must maintain an active attack for 72 continuous hours without detection.
                Detection at any point during this period results in immediate disqualification.
                The timer starts from the moment of your first attack action.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>RULE 2</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Sandbox Environment Only</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                All attacks must occur within the designated Striker sandbox environment.
                Real-world testing or attacks against production systems are strictly prohibited.
                Sandbox access is granted through your Clive API key.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>RULE 3</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>One Attempt Per Person</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Each participant is limited to one active competition entry at a time.
                Multiple accounts or coordinated attacks are grounds for permanent disqualification.
                Previous winners are ineligible for future competitions.
              </div>
            </div>
            <div style={{ padding:'24px', background:'rgba(180,20,20,0.08)', border:'1px solid rgba(220,80,80,0.15)', borderRadius:'16px' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9px', letterSpacing:'0.16em', color:'rgba(220,80,80,0.7)', marginBottom:'12px' }}>RULE 4</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'20px', color:'#fff', marginBottom:'8px' }}>Judging by Detection</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                Success is determined solely by Striker&apos;s detection systems.
                Manual review may be conducted for verification, but automated detection is the primary metric.
                Appeals are not permitted; system logs are final.
              </div>
            </div>
          </div>
        </div>

        {/* Allowed vs Prohibited */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Allowed Actions & Prohibited Activities
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(80,200,120,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                ALLOWED TECHNIQUES
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {[
                  'Process injection and manipulation',
                  'File system enumeration and modification',
                  'Network reconnaissance and exploitation',
                  'Memory-based attacks (ROP, shellcode)',
                  'Privilege escalation attempts',
                  'Custom malware development and deployment',
                  'Social engineering simulations (within sandbox)',
                  'Zero-day exploit research and testing'
                ].map(allowed => (
                  <li key={allowed} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                    <span style={{ color:'rgba(80,200,120,0.85)', flexShrink:0, marginTop:'2px' }}>✓</span>
                    <span>{allowed}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(220,80,80,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                PROHIBITED ACTIVITIES
              </div>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {[
                  'Attacks on production systems or external networks',
                  'DDoS attacks or resource exhaustion beyond testing',
                  'Malicious actions against other participants',
                  'Attempting to compromise Striker&apos;s integrity',
                  'Using the competition for illegal activities',
                  'Sharing or selling competition environment access',
                  'Coordinated attacks between multiple participants',
                  'Attempts to reverse-engineer or tamper with Striker'
                ].map(prohibited => (
                  <li key={prohibited} style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(255,255,255,0.6)', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'flex-start', gap:'10px' }}>
                    <span style={{ color:'rgba(220,80,80,0.85)', flexShrink:0, marginTop:'2px' }}>✗</span>
                    <span>{prohibited}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline and Judging */}
        <div style={{ marginBottom:'64px' }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Competition Timeline & Judging Criteria
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px' }}>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(91,148,210,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                COMPETITION TIMELINE
              </div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'14px', color:'rgba(255,255,255,0.7)', lineHeight:1.7 }}>
                <strong style={{ color:'#fff' }}>Registration:</strong> Open continuously, no application required.<br/><br/>
                <strong style={{ color:'#fff' }}>Attempt Window:</strong> 72 hours from attack initiation.<br/><br/>
                <strong style={{ color:'#fff' }}>Verification Period:</strong> Up to 24 hours for manual review.<br/><br/>
                <strong style={{ color:'#fff' }}>Prize Distribution:</strong> Within 7 business days of verification.<br/><br/>
                <strong style={{ color:'#fff' }}>New Antibodies:</strong> Incorporated within 24 hours of detection.
              </div>
            </div>
            <div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'12px', color:'rgba(210,150,50,0.9)', marginBottom:'16px', letterSpacing:'0.1em' }}>
                JUDGING CRITERIA
              </div>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'14px', color:'rgba(255,255,255,0.7)', lineHeight:1.7 }}>
                <strong style={{ color:'#fff' }}>Detection Threshold:</strong> Any automated alert or response action.<br/><br/>
                <strong style={{ color:'#fff' }}>False Positives:</strong> Manual verification for borderline cases.<br/><br/>
                <strong style={{ color:'#fff' }}>Innovation Bonus:</strong> Novel techniques may qualify for special recognition.<br/><br/>
                <strong style={{ color:'#fff' }}>Impact Assessment:</strong> Severity scoring based on MITRE ATT&CK mapping.<br/><br/>
                <strong style={{ color:'#fff' }}>Community Vote:</strong> Top contenders may be subject to community review.
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimers */}
        <div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:300, fontSize:'28px', color:'#fff', marginBottom:'20px' }}>
            Legal Disclaimers & Liability Waivers
          </h3>
          <div style={{ padding:'32px', background:'rgba(220,80,80,0.05)', border:'1px solid rgba(220,80,80,0.2)', borderRadius:'16px' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:'rgba(255,255,255,0.8)', lineHeight:1.6, marginBottom:'20px' }}>
              By participating in the Break the Shield competition, you acknowledge and agree to the following terms:
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'20px' }}>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(220,80,80,0.9)', marginBottom:'12px', letterSpacing:'0.1em' }}>
                  ASSUMPTION OF RISK
                </div>
                <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                  Participants understand that cybersecurity research involves inherent risks.
                  Clive and its affiliates are not liable for any damages, data loss, or security incidents
                  that may occur during participation.
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(220,80,80,0.9)', marginBottom:'12px', letterSpacing:'0.1em' }}>
                  INTELLECTUAL PROPERTY
                </div>
                <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                  All techniques, tools, and methodologies developed during the competition remain
                  the intellectual property of the participant. However, successful attacks may be
                  documented and shared for educational purposes.
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(220,80,80,0.9)', marginBottom:'12px', letterSpacing:'0.1em' }}>
                  CODE OF CONDUCT
                </div>
                <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                  Participants must conduct themselves ethically and professionally.
                  Harassment, doxxing, or malicious behavior towards other participants or Clive staff
                  will result in immediate disqualification and potential legal action.
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'rgba(220,80,80,0.9)', marginBottom:'12px', letterSpacing:'0.1em' }}>
                  GOVERNING LAW
                </div>
                <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>
                  This competition is governed by the laws of South Africa.
                  Any disputes will be resolved through binding arbitration in Cape Town, South Africa.
                  Participants waive their right to jury trial and class action lawsuits.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}