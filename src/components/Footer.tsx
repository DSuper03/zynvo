import { useState } from "react";
import {
  Twitter, Mail, MapPin, ArrowRight, Heart,
  Instagram, ExternalLink
} from "lucide-react";

// ─── CONFIGURE YOUR SOCIAL POSTS HERE ────────────────────────────────────────
const instagramPosts = [
  {
    id: "ig1",
    permalink: "https://www.instagram.com/reel/DQjEXRrkWvA/",
    caption: "A post shared by Zynvo (@zynvo.social)",
  },
  {
    id: "ig2",
    permalink: "https://www.instagram.com/reel/DUNkZWukZUe/",
    caption: "A post shared by Zynvo (@zynvo.social)",
  },
  {
    id: "ig3",
    permalink: "https://www.instagram.com/reel/DUflpyJEbRn/",
    caption: "A post shared by Zynvo (@zynvo.social)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const productLinks = ["Features","Pricing","Event Management","Club Directory","Member Portal","Analytics Dashboard","Mobile App"];
const resourceLinks = ["Documentation","Community Forum","Video Tutorials","Best Practices","Success Stories"];

export default function FooterWithSocial() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }

        /* ── Social section ── */
        .social-section { background: #fcd34d; padding: 80px 24px; }
        .social-tab { padding: 9px 24px; border-radius: 30px; border: 1.5px solid #fde68a; background: white; font-weight: 800; font-size: 13.5px; cursor: pointer; font-family: 'Nunito', sans-serif; color: #78350f; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
        .social-tab.active { background: #fbbf24; border-color: #fbbf24; color: #1a1a1a; }
        .social-tab:hover:not(.active) { background: #fef3c7; }

        /* ── Instagram cards ── */
        .ig-card { border-radius: 18px; overflow: hidden; border: 1.5px solid #fde68a; background: white; cursor: pointer; transition: transform 0.22s, box-shadow 0.22s; position: relative; }
        .ig-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(251,191,36,0.3); }
        .ig-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .reel-badge { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.65); color: white; border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px; backdrop-filter: blur(4px); }
        .ig-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%); display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; opacity: 0; transition: opacity 0.22s; }
        .ig-card:hover .ig-overlay { opacity: 1; }

        /* ── Footer ── */
        .footer-root { background: #fcd34d; color: #1a1a1a; position: relative; overflow: hidden; }
        .footer-link { display: flex; align-items: center; gap: 7px; font-size: 13.5px; color: #78350f; text-decoration: none; transition: color 0.18s, gap 0.18s; font-weight: 600; padding: 2px 0; }
        .footer-link:hover { color: #1a1a1a; gap: 10px; }
        .social-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.55); display: flex; align-items: center; justify-content: center; color: #78350f; transition: background 0.2s, transform 0.18s; border: 1.5px solid #fde68a; text-decoration: none; }
        .social-icon-btn:hover { background: #1a1a1a; color: #fbbf24; transform: scale(1.12); }
        .subscribe-input { flex: 1; border-radius: 11px; border: 1.5px solid #fbbf24; background: rgba(255,255,255,0.7); padding: 10px 14px; font-size: 13.5px; font-family: 'Nunito', sans-serif; outline: none; color: #1a1a1a; transition: border 0.2s; }
        .subscribe-input:focus { border-color: #92400e; background: white; }
        .subscribe-btn { border-radius: 11px; border: none; background: #1a1a1a; color: #fbbf24; padding: 10px 20px; font-weight: 900; font-size: 13.5px; cursor: pointer; font-family: 'Nunito', sans-serif; transition: background 0.2s, transform 0.15s; white-space: nowrap; }
        .subscribe-btn:hover { background: #333; transform: scale(1.04); }

        .ig-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media(max-width:700px) { .ig-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:460px) { .ig-grid { grid-template-columns: 1fr; } }

        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
        @media(max-width:860px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:560px) { .footer-grid { grid-template-columns: 1fr; } }

        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.2s; }
      `}</style>

      {/* ════════════════════════════════════════
          SOCIAL SHOWCASE SECTION
      ════════════════════════════════════════ */}
      <section className="social-section">
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>

          {/* heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#1a1a1a" }}>
              Follow Our Journey
            </span>
            <div style={{ width: 48, height: 4, background: "#fbbf24", borderRadius: 2, margin: "10px auto 14px" }} />
            <p style={{ fontSize: 15, color: "#78350f", fontWeight: 600, maxWidth: 480, margin: "0 auto" }}>
              Stay connected — see what we're building, sharing, and celebrating.
            </p>
          </div>

          {/* ── Instagram ── */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Instagram size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: "#1a1a1a" }}>@zynvo.social</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>Instagram</div>
                </div>
              </div>
              <a href="https://www.instagram.com/zynvo.social/" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:800, color:"#78350f", textDecoration:"none", background:"#fef3c7", padding:"7px 16px", borderRadius:30, border:"1.5px solid #fde68a" }}>
                Follow <ExternalLink size={13} />
              </a>
            </div>

            <div className="ig-grid">
              {instagramPosts.map((post, i) => (
                <div key={post.id} className={`ig-card fade-up d${i + 1}`} style={{ padding: 10 }}>
                  <iframe
                    src={`${post.permalink}embed/captioned/`}
                    title={`Instagram embed ${i + 1}`}
                    style={{ width: "100%", minHeight: 640, border: 0, borderRadius: 12 }}
                    scrolling="no"
                    allowFullScreen
                    loading="lazy"
                  />
                  <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, lineHeight: 1.45, margin: "8px 4px 4px" }}>
                    {post.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="footer-root">
        {/* decorative blobs */}
        <div style={{ position:"absolute", top:-80, right:-80, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.18)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:60, left:-60, width:180, height:180, borderRadius:"50%", background:"rgba(245,158,11,0.2)", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:1060, margin:"0 auto", padding:"64px 24px 0" }}>
          <div className="footer-grid">

            {/* ── Col 1: brand + newsletter ── */}
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:"#1a1a1a", marginBottom:6 }}>
                Zynvo
              </div>
              <p style={{ fontSize:14, color:"#78350f", lineHeight:1.65, marginBottom:18, fontWeight:600, maxWidth:340 }}>
                Empowering college students to connect, collaborate, and create lasting memories through dynamic club and society experiences.
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Mail size={15} color="#92400e" />
                  <span style={{ fontSize:13.5, color:"#78350f", fontWeight:700 }}>dsuper03.dev@gmail.com</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <MapPin size={15} color="#92400e" />
                  <span style={{ fontSize:13.5, color:"#78350f", fontWeight:700 }}>New Delhi, India</span>
                </div>
              </div>

              {/* newsletter */}
              <div style={{ background:"rgba(255,255,255,0.5)", borderRadius:16, padding:20, border:"1.5px solid rgba(251,191,36,0.5)", backdropFilter:"blur(8px)" }}>
                <div style={{ fontWeight:900, fontSize:15, marginBottom:4, color:"#1a1a1a" }}>Stay Updated 📬</div>
                <p style={{ fontSize:12.5, color:"#78350f", marginBottom:14, fontWeight:600, lineHeight:1.5 }}>
                  Get the latest events, clubs, and campus activities.
                </p>
                {subscribed ? (
                  <div style={{ background:"#dcfce7", border:"1.5px solid #86efac", borderRadius:10, padding:"10px 14px", fontSize:13, fontWeight:800, color:"#15803d", textAlign:"center" }}>
                    ✅ You're subscribed! Welcome aboard.
                  </div>
                ) : (
                  <div style={{ display:"flex", gap:8 }}>
                    <input className="subscribe-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <button className="subscribe-btn" onClick={() => email && setSubscribed(true)}>Subscribe</button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Col 2: Product links ── */}
            <div>
              <h3 style={{ fontSize:17, fontWeight:900, color:"#1a1a1a", borderBottom:"1.5px solid rgba(251,191,36,0.5)", paddingBottom:8, marginBottom:16 }}>
                Product
              </h3>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:6 }}>
                {productLinks.map(item => (
                  <li key={item}>
                    <a href="#" className="footer-link">
                      <ArrowRight size={13} /> {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3: Resources + Socials ── */}
            <div>
              <h3 style={{ fontSize:17, fontWeight:900, color:"#1a1a1a", borderBottom:"1.5px solid rgba(251,191,36,0.5)", paddingBottom:8, marginBottom:16 }}>
                Resources
              </h3>
              <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:6, marginBottom:30 }}>
                {resourceLinks.map(item => (
                  <li key={item}>
                    <a href="#" className="footer-link">
                      <ArrowRight size={13} /> {item}
                    </a>
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize:15, fontWeight:900, color:"#1a1a1a", marginBottom:14 }}>Connect With Us</h3>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <a href="https://x.com/Zynvonow" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Twitter / X">
                  <Twitter size={17} />
                </a>
                <a href="https://www.instagram.com/zynvo.social/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram">
                  <Instagram size={17} />
                </a>
                <a href="mailto:dsuper03.dev@gmail.com" className="social-icon-btn" title="Email">
                  <Mail size={17} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ marginTop:48, borderTop:"1.5px solid rgba(251,191,36,0.5)", background:"rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth:1060, margin:"0 auto", padding:"14px 24px", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <p style={{ fontSize:13, color:"#78350f", fontWeight:700 }}>© 2025 Zynvo. All rights reserved.</p>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy Policy","Terms of Service","Cookie Policy"].map(link => (
                <a key={link} href="#" style={{ fontSize:13, color:"#78350f", fontWeight:700, textDecoration:"none", transition:"color 0.18s" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#1a1a1a")} onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#78350f")}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(0,0,0,0.06)", borderTop:"1px solid rgba(251,191,36,0.3)" }}>
          <div style={{ maxWidth:1060, margin:"0 auto", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, color:"#78350f", fontWeight:700 }}>
            Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> for students everywhere
          </div>
        </div>
      </footer>
    </div>
  );
}

