import { useState, useEffect, useRef } from "react";

// ─── Color Palette & Design Tokens ───
const COLORS = {
  primaryGreen: "blue",
  darkGreen: "#16A34A",
  saffron: "#F97316",
  darkBrown: "#3D2B1F",
  warmCream: "#FDF6EC",
  lightCream: "#FEF9F3",
  cardBg: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  accent: "#B45309",
  border: "#E5E7EB",
  success: "#16A34A",
  gold: "#D97706",
};


// ─── Shared Styles ───
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --green: #22C55E;
    --dark-green: #16A34A;
    --saffron: #F97316;
    --brown: #3D2B1F;
    --cream: #FDF6EC;
    --light-cream: #FEF9F3;
    --accent: #B45309;
    --text: #1A1A1A;
    --text-secondary: #6B7280;
  }

  body { font-family: 'Inter', sans-serif; background: var(--cream); color: var(--text); }

  .playfair { font-family: 'Playfair Display', serif; }

  .fade-in {
    opacity: 0;
    transform: translateY(24px);
    animation: fadeUp 0.7s ease forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes countUp {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  }

  .btn-primary {
    background: linear-gradient(135deg, #22C55E, #16A34A);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34,197,94,0.35);
  }

  .btn-outline {
    background: transparent;
    color: var(--brown);
    border: 2px solid var(--brown);
    padding: 12px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-outline:hover {
    background: var(--brown);
    color: white;
  }

  .section-pad {
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--saffron);
    margin-bottom: 12px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    color: var(--brown);
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .section-subtitle {
    font-size: 17px;
    color: var(--text-secondary);
    max-width: 600px;
    line-height: 1.7;
  }

  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }

  @media (max-width: 768px) {
    .section-pad { padding: 48px 16px; }
    .hide-mobile { display: none !important; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
  }
`;

// ─── Animated Counter Hook ───
function useCounter(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration, start]);

  return [count, ref];
}

// ═══════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════
function Navbar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "how", label: "How It Works" },
    { id: "projects", label: "Projects" },
    { id: "impact", label: "Impact" },
    { id: "contact", label: "Contact" },
    { id: "report", label: "Report Issue" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(253,246,236,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: scrolled ? 64 : 72, transition: "height 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => { setPage("home"); }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 18,
          }}>&#8377;</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: COLORS.darkBrown }}>
              एक रुपया
            </div>
            <div style={{ fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1 }}>ONE RUPEE ONE CHANGE</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {navLinks.map(link => (
            <span key={link.id}
              onClick={() => setPage(link.id)}
              style={{
                fontSize: 14, fontWeight: currentPage === link.id ? 600 : 400,
                color: currentPage === link.id ? COLORS.darkGreen : COLORS.textSecondary,
                cursor: "pointer", transition: "color 0.2s",
                borderBottom: currentPage === link.id ? "2px solid #22C55E" : "2px solid transparent",
                paddingBottom: 4,
              }}>{link.label}</span>
          ))}
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}
            onClick={() => { setPage("donate"); }}>
            Donate &#8377;1
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div style={{ display: "none", cursor: "pointer" }}
          className="show-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}>
          <div style={{ width: 24, height: 2, background: COLORS.darkBrown, marginBottom: 5 }} />
          <div style={{ width: 24, height: 2, background: COLORS.darkBrown, marginBottom: 5 }} />
          <div style={{ width: 18, height: 2, background: COLORS.darkBrown }} />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: "white", padding: 24, borderRadius: "0 0 16px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}>
          {navLinks.map(link => (
            <div key={link.id}
              onClick={() => { setPage(link.id); setMobileOpen(false); }}
              style={{
                padding: "12px 0", fontSize: 16, fontWeight: 500,
                color: currentPage === link.id ? COLORS.darkGreen : COLORS.textPrimary,
                cursor: "pointer", borderBottom: "1px solid #f0f0f0",
              }}>{link.label}</div>
          ))}
          <button className="btn-primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
            onClick={() => { setPage("donate"); setMobileOpen(false); }}>
            Donate &#8377;1
          </button>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════
function HomePage({ setPage }) {
  const [totalDonations, donRef] = useCounter(1875430, 2500);
  const [activeDonors, actRef] = useCounter(25430, 2000);
  const [projectsCompleted, projRef] = useCounter(128, 1500);
  const [livesImpacted, livesRef] = useCounter(45320, 2200);

  const stats = [
    { label: "Total Raised", value: `₹${totalDonations.toLocaleString("en-IN")}`, ref: donRef, icon: "💰" },
    { label: "Active Donors", value: activeDonors.toLocaleString("en-IN"), ref: actRef, icon: "👥" },
    { label: "Projects Done", value: projectsCompleted, ref: projRef, icon: "✅" },
    { label: "Lives Impacted", value: `${livesImpacted.toLocaleString("en-IN")}+`, ref: livesRef, icon: "❤️" },
  ];

  const projects = [
    { title: "School Furniture", location: "Govt. Primary School, Bastar", progress: 80, raised: "₹2,40,000", goal: "₹3,00,000", category: "Education", img: "🏫" },
    { title: "Drinking Water", location: "Village Kanker, Chhattisgarh", progress: 100, raised: "₹3,10,000", goal: "₹3,10,000", category: "Water & Sanitation", img: "🚰" },
    { title: "Hospital Beds", location: "CHC Narayanpur, Chhattisgarh", progress: 45, raised: "₹67,500", goal: "₹1,50,000", category: "Healthcare", img: "🏥" },
  ];

  const trustBadges = [
    { label: "12A (10A)", status: "Obtained", desc: "Income-tax exemption" },
    { label: "80G (18G)", status: "Obtained", desc: "50% tax deduction for donors" },
    { label: "CSR-1", status: "Obtained", desc: "Eligible for corporate CSR" },
    { label: "Asset-Only", status: "Policy", desc: "No cash, no consumables" },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: `linear-gradient(135deg, ${COLORS.warmCream} 0%, #FFF7ED 50%, #ECFDF5 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -100, right: -100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.08), transparent)",
        }} />
        <div style={{
          position: "absolute", bottom: -50, left: -50,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.06), transparent)",
        }} />

        <div className="section-pad fade-in" style={{ width: "100%", paddingTop: 120 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-block", padding: "6px 16px", borderRadius: 20,
                background: "rgba(34,197,94,0.1)", color: COLORS.darkGreen,
                fontSize: 13, fontWeight: 600, marginBottom: 24,
              }}>
                🟢 Pan-India NGO &middot; Asset-Only Model
              </div>

              <h1 className="playfair" style={{
                fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 800,
                color: COLORS.darkBrown, lineHeight: 1.1, marginBottom: 8,
              }}>
                एक रुपया —
              </h1>
              <h1 className="playfair" style={{
                fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 800,
                color: COLORS.darkBrown, lineHeight: 1.1, marginBottom: 8,
              }}>
                एक बदलाव.
              </h1>
              <p style={{
                fontSize: "clamp(18px, 2.5vw, 22px)", color: COLORS.accent,
                fontWeight: 500, marginBottom: 24, fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}>
                One Rupee — One Change.
              </p>
              <p style={{
                fontSize: 17, color: COLORS.textSecondary, lineHeight: 1.8,
                maxWidth: 500, marginBottom: 36,
              }}>
                हर दिन, एक रुपया। हर दिन, एक बेहतर कल। We transform ₹1 daily micro-donations
                into permanent fixed assets — desks, benches, hospital beds, water systems —
                for government schools and hospitals across India.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ fontSize: 17, padding: "16px 36px" }}
                  onClick={() => { setPage("donate"); }}>
                  ❤️ Donate ₹1/Day
                </button>
                <button className="btn-outline"
                  onClick={() => { setPage("projects"); }}>
                  Explore Projects →
                </button>
              </div>

              <div style={{
                display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap",
              }}>
                {trustBadges.map((b, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 8,
                    background: "rgba(34,197,94,0.06)", fontSize: 12, fontWeight: 600,
                    color: COLORS.darkGreen,
                  }}>
                    ✓ {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual - Impact Card */}
            <div className="hide-mobile" style={{ position: "relative" }}>
              <div style={{
                background: "white", borderRadius: 24, padding: 32,
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.04)",
                animation: "float 4s ease-in-out infinite",
              }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36, color: "white",
                  }}>₹</div>
                  <div className="playfair" style={{ fontSize: 28, fontWeight: 700, color: COLORS.darkBrown }}>
                    Your Impact Card
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
                    Real-time transparency
                  </div>
                </div>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
                }}>
                  {[
                    { label: "₹1/Day", sub: "Your contribution" },
                    { label: "100%", sub: "Goes to assets" },
                    { label: "80G", sub: "Tax deduction" },
                    { label: "Photo Proof", sub: "Before & After" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: 16, borderRadius: 12,
                      background: COLORS.lightCream, textAlign: "center",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.darkGreen }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                background: "white", borderRadius: 16, padding: "12px 20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                display: "flex", alignItems: "center", gap: 10,
                animation: "float 3s ease-in-out infinite 0.5s",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: COLORS.primaryGreen, animation: "pulse 2s infinite",
                }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>₹30 donated just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section style={{ background: COLORS.darkBrown, padding: "48px 24px" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32,
        }}>
          {stats.map((s, i) => (
            <div key={i} ref={s.ref} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div className="playfair" style={{
                fontSize: 36, fontWeight: 700, color: "white",
                animation: "countUp 0.5s ease",
              }}>{s.value}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ₹1 MATTERS ── */}
      <section className="section-pad">
        <div className="section-label">WHY ₹1 MATTERS</div>
        <h2 className="section-title">Small change, permanent change.</h2>
        <p className="section-subtitle" style={{ marginBottom: 48 }}>
          Every rupee goes directly to fixed assets — things you can see, touch, and photograph years later.
        </p>

        <div className="grid-3">
          {[
            { icon: "🪑", title: "Permanent", desc: "A bench lasts 10+ years. Your ₹1 today still serves a child in 2036.", color: "#22C55E" },
            { icon: "📸", title: "Visible", desc: "Every project gets before/after photos. Anyone can walk in and see the change.", color: "#F97316" },
            { icon: "🧾", title: "Auditable", desc: "GST bills + photos = proof. Every rupee is traceable, every asset is documented.", color: "#B45309" },
          ].map((item, i) => (
            <div key={i} className="hover-lift" style={{
              background: "white", borderRadius: 20, padding: 36,
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: `${item.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 28, marginBottom: 20,
              }}>{item.icon}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 12 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.7 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section style={{ background: "#F8F4EE", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <div className="section-label">FEATURED PROJECTS</div>
              <h2 className="section-title">Where your rupee is going.</h2>
            </div>
            <button className="btn-outline hide-mobile"
              onClick={() => { setPage("projects"); }}>
              View All →
            </button>
          </div>

          <div className="grid-3">
            {projects.map((p, i) => (
              <div key={i} className="hover-lift" style={{
                background: "white", borderRadius: 20, overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  height: 180, background: `linear-gradient(135deg, ${COLORS.warmCream}, #E8F5E9)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64, position: "relative",
                }}>
                  {p.img}
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: p.progress === 100 ? COLORS.primaryGreen : COLORS.saffron,
                    color: "white", fontSize: 11, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 8,
                  }}>
                    {p.progress === 100 ? "✓ Completed" : p.category}
                  </span>
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 4 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
                    {p.location}
                  </p>
                  {/* Progress bar */}
                  <div style={{
                    height: 8, borderRadius: 4,
                    background: "#E5E7EB", overflow: "hidden", marginBottom: 12,
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 4,
                      width: `${p.progress}%`,
                      background: p.progress === 100
                        ? "linear-gradient(90deg, #22C55E, #16A34A)"
                        : "linear-gradient(90deg, #F97316, #F59E0B)",
                      transition: "width 1s ease",
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: COLORS.darkGreen }}>{p.raised} raised</span>
                    <span style={{ color: COLORS.textSecondary }}>of {p.goal}</span>
                  </div>
                  <button style={{
                    width: "100%", marginTop: 16, padding: "10px 0",
                    background: COLORS.darkBrown, color: "white",
                    border: "none", borderRadius: 10, fontWeight: 600,
                    fontSize: 14, cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                    onClick={() => { setPage("donate"); }}>
                    {p.progress === 100 ? "View Details" : "Support This Project"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS PREVIEW ── */}
      <section className="section-pad">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="section-title">From ₹1 to a school bench.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Seven steps. Every project. No exceptions.
          </p>
        </div>

        <div style={{
          display: "flex", gap: 12, overflowX: "auto", paddingBottom: 16,
        }}>
          {[
            { step: "01", title: "Request", desc: "School/hospital submits online form" },
            { step: "02", title: "Audit", desc: "Team reviews within 7 working days" },
            { step: "03", title: "Budget", desc: "Bill of materials prepared, Director approves" },
            { step: "04", title: "Visible", desc: "Project listed on portal for donors" },
            { step: "05", title: "Procure", desc: "Local vendor with GST bills" },
            { step: "06", title: "Complete", desc: "Photos, videos, completion certificate" },
            { step: "07", title: "Closure", desc: "Donor update via push, email, WhatsApp" },
          ].map((s, i) => (
            <div key={i} style={{
              minWidth: 150, flex: "1 0 auto",
              background: i < 5 ? "white" : COLORS.darkBrown,
              color: i < 5 ? COLORS.textPrimary : "white",
              borderRadius: 16, padding: 20, textAlign: "center",
              border: i < 5 ? "1px solid rgba(0,0,0,0.06)" : "none",
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800,
                color: i < 5 ? COLORS.saffron : COLORS.saffron,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 8,
              }}>{s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button className="btn-outline"
            onClick={() => { setPage("how"); }}>
            Learn More →
          </button>
        </div>
      </section>

      {/* ── ASSET-ONLY POLICY ── */}
      <section style={{
        background: COLORS.darkBrown, padding: "64px 24px",
        color: "white", textAlign: "center",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="section-label" style={{ color: COLORS.saffron }}>OUR PROMISE</div>
          <h2 className="playfair" style={{
            fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700,
            marginBottom: 16, lineHeight: 1.3,
          }}>
            "If you cannot photograph it three years later, we did not fund it."
          </h2>
          <p style={{ fontSize: 16, opacity: 0.7, lineHeight: 1.7, marginBottom: 32 }}>
            Fixed Asset Provisioning Only — no cash transfers, no medicines, no salaries,
            no consumables. Every rupee becomes something permanent, visible, and auditable.
          </p>
          <button className="btn-primary" style={{ fontSize: 16 }}
            onClick={() => { setPage("donate"); }}>
            Start Giving ₹1/Day →
          </button>
        </div>
      </section>

      {/* ── DONATION TIERS PREVIEW ── */}
      <section className="section-pad">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">WAYS TO GIVE</div>
          <h2 className="section-title">Five ways to give. One rupee at a time.</h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20,
        }}>
          {[
            { plan: "Daily", amount: "₹1/day", mode: "UPI / QR", highlight: false },
            { plan: "Monthly", amount: "₹30/mo", mode: "NACH / AutoPay", highlight: true },
            { plan: "Annual", amount: "₹365/yr", mode: "Auto-debit", highlight: false },
            { plan: "CSR", amount: "Custom", mode: "Bank Transfer", highlight: false },
            { plan: "Sponsor", amount: "Per-Project", mode: "Bank Transfer", highlight: false },
          ].map((t, i) => (
            <div key={i} className="hover-lift" style={{
              background: t.highlight ? COLORS.darkBrown : "white",
              color: t.highlight ? "white" : COLORS.textPrimary,
              borderRadius: 20, padding: 28, textAlign: "center",
              border: t.highlight ? "none" : "1px solid rgba(0,0,0,0.06)",
              position: "relative", cursor: "pointer",
            }}
              onClick={() => { setPage("donate"); }}>
              {t.highlight && (
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  background: COLORS.saffron, color: "white",
                  fontSize: 10, fontWeight: 700, padding: "3px 12px",
                  borderRadius: 10, textTransform: "uppercase",
                }}>Popular</div>
              )}
              <div style={{ fontSize: 12, fontWeight: 600, color: t.highlight ? COLORS.saffron : COLORS.saffron, marginBottom: 8 }}>
                {t.plan}
              </div>
              <div className="playfair" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                {t.amount}
              </div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>{t.mode}</div>
              <div style={{
                fontSize: 12, fontWeight: 600, marginTop: 8,
                color: t.highlight ? "#4ADE80" : COLORS.darkGreen,
              }}>
                50% Tax Benefit under 80G
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Report an Issue CTA */}
      <section style={{
        background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #F97316, #EA580C)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 32,
          }}>
            ⚠️
          </div>
          <div className="section-label" style={{ color: COLORS.saffron }}>FOR SCHOOLS & HOSPITALS</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>
            Report an infrastructure issue
          </h2>
          <p style={{
            fontSize: 17, color: COLORS.textSecondary, lineHeight: 1.7,
            maxWidth: 600, margin: "0 auto 32px",
          }}>
            Is your government school or hospital facing infrastructure problems?
            Submit a request with photos and details — our team will assess and prioritize it.
          </p>
          <button className="btn-primary"
            onClick={() => { setPage("report"); }}
            style={{ fontSize: 18, padding: "16px 40px", background: "linear-gradient(135deg, #F97316, #EA580C)" }}>
            📋 Submit Issue Request
          </button>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32, flexWrap: "wrap" }}>
            {[
              { icon: "🏫", label: "School Issues" },
              { icon: "🏥", label: "Hospital Issues" },
              { icon: "📷", label: "Photo Evidence" },
              { icon: "✅", label: "Track Progress" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COLORS.darkBrown, fontWeight: 500 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  ABOUT PAGE
// ═══════════════════════════════════════
function AboutPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.warmCream}, #E8F5E9)`,
        padding: "80px 24px",
      }}>
        <div className="section-pad fade-in" style={{ padding: "0 0" }}>
          <div className="section-label">WHO WE ARE</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
            One rupee at a time,<br />we rebuild India's foundations.
          </h1>
          <p className="section-subtitle" style={{ fontSize: 18 }}>
            Pan-India NGO &middot; Asset-only model &middot; Built for transparency
          </p>
        </div>
      </section>

      {/* Org Overview */}
      <section className="section-pad">
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            <h2 className="section-title" style={{ fontSize: 32 }}>Organization Overview</h2>
            <div style={{ marginTop: 24 }}>
              {[
                { label: "Type", value: "Non-Governmental Organization (NGO) / Non-Profit" },
                { label: "Legal Structure", value: "Society / Section 8 Company" },
                { label: "Registration", value: "12A (10A) · 80G (18G) · CSR-1" },
                { label: "Geography", value: "Pan-India — Priority: Rural, Tribal & Forest Agency Areas" },
                { label: "Beneficiaries", value: "Students & Patients in Government Schools & Hospitals" },
                { label: "Model", value: "Fixed Asset Provisioning Only — no cash, no consumables" },
                { label: "Donation", value: "₹1/day — opt-in micro-donation; ₹30/mo or ₹365/yr auto-debit" },
                { label: "Transparency", value: "Before & After photos/videos · Donor portal · Mobile app · Bills public" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "16px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div style={{ minWidth: 120, fontSize: 13, fontWeight: 600, color: COLORS.saffron }}>{item.label}</div>
                  <div style={{ fontSize: 15, color: COLORS.textPrimary, lineHeight: 1.6 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: COLORS.darkBrown, borderRadius: 24, padding: 36, color: "white",
          }}>
            <h3 className="playfair" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
              Vision, Mission & Motto
            </h3>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.saffron, marginBottom: 8 }}>VISION</div>
              <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7 }}>
                An India where no government school lacks a bench and no government hospital lacks a bed —
                funded entirely by the collective power of ₹1-a-day micro-donations.
              </p>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.saffron, marginBottom: 8 }}>MISSION</div>
              <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.7 }}>
                To channel millions of ₹1 daily contributions into verified, photographed,
                and auditable fixed assets for under-resourced public institutions across India.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.saffron, marginBottom: 8 }}>MOTTO</div>
              <p className="playfair" style={{ fontSize: 22, fontStyle: "italic", color: COLORS.saffron }}>
                "एक रुपया · एक बदलाव"
              </p>
              <p style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>One Rupee · One Change</p>
            </div>
          </div>
        </div>
      </section>

      {/* What we do NOT fund */}
      <section style={{ background: "#F8F4EE", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">DISCIPLINE BY DESIGN</div>
          <h2 className="section-title">What we <em>do not</em> fund.</h2>
          <p className="section-subtitle" style={{ marginBottom: 40 }}>
            Saying "no" with conviction is what makes "yes" verifiable.
          </p>

          <div className="grid-2">
            <div style={{
              background: COLORS.darkBrown, borderRadius: 20, padding: 36, color: "white",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginBottom: 16, letterSpacing: 2 }}>
                ✕ OUT OF SCOPE
              </div>
              {[
                "Direct cash transfers to individuals or families",
                "Medical treatment costs or medicines",
                "School fees or private tuition",
                "Salaries of school / hospital staff",
                "Food, clothing, or consumables",
                "Any movable or perishable assets",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 15, opacity: 0.9,
                }}>
                  <span style={{ color: "#EF4444" }}>✕</span> {item}
                </div>
              ))}
            </div>

            <div>
              <h3 className="playfair" style={{ fontSize: 24, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 16 }}>
                Fixed assets create permanent, visible change.
              </h3>
              <p style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 32 }}>
                They cannot be quietly consumed. They are harder to misuse, easier to audit,
                and they outlast the donation by years. Every rupee leaves a photograph behind.
              </p>
              <div className="grid-3" style={{ gap: 16 }}>
                {[
                  { title: "Permanent", sub: "A bench lasts 10+ years" },
                  { title: "Visible", sub: "Anyone can walk in & see it" },
                  { title: "Auditable", sub: "Bill + photo = proof" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "white", borderRadius: 16, padding: 24, textAlign: "center",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}>
                    <div className="playfair" style={{ fontSize: 20, fontWeight: 700, color: COLORS.saffron }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad">
        <div className="section-label">THE TEAM</div>
        <h2 className="section-title">A lean team of six.</h2>
        <p className="section-subtitle" style={{ marginBottom: 40 }}>
          Two strategists. Three operators. One field verifier.
        </p>

        <div className="grid-3">
          {[
            { pos: "Director 1", role: "Strategic oversight · donor relations · legal compliance", ctc: "₹40,000" },
            { pos: "Director 2", role: "Approvals · partnerships · external representation", ctc: "₹40,000" },
            { pos: "Manager", role: "Operations · vendor coordination · project execution", ctc: "₹25,000" },
            { pos: "Receptionist", role: "Front desk · donor queries · phone / email · data entry", ctc: "₹15,000" },
            { pos: "Site Visitor", role: "Physical verification · project supervision · before/after docs", ctc: "₹18,000" },
            { pos: "Tech & CRM", role: "Website / app / CRM ops · payment reconciliation", ctc: "₹22,000" },
          ].map((p, i) => (
            <div key={i} className="hover-lift" style={{
              background: "white", borderRadius: 16, padding: 24,
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.saffron}20, ${COLORS.primaryGreen}20)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 16,
              }}>
                {i < 2 ? "👔" : i === 4 ? "🏃" : "💼"}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.darkBrown }}>{p.pos}</h3>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6, marginTop: 8 }}>{p.role}</p>
              <div style={{
                marginTop: 12, fontSize: 14, fontWeight: 600, color: COLORS.darkGreen,
              }}>CTC: {p.ctc}/mo</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: 24, borderRadius: 16,
          background: COLORS.darkBrown, color: "white", textAlign: "center",
        }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Total Monthly Payroll: </span>
          <span className="playfair" style={{ fontSize: 24, fontWeight: 700 }}>₹1,60,000</span>
          <span style={{ fontSize: 14, opacity: 0.6, marginLeft: 8 }}>· 6-month cost: ₹9,60,000</span>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  HOW IT WORKS PAGE
// ═══════════════════════════════════════
function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { num: "01", title: "Request Submission", desc: "School or hospital fills the online form on our portal. Basic info, category of need, photos & videos of the issue uploaded.", icon: "📋", color: "#F97316" },
    { num: "02", title: "Backend Audit", desc: "Team reviews within 7 working days. Site Visitor dispatched for physical verification when needed.", icon: "🔍", color: "#3B82F6" },
    { num: "03", title: "Budget Sanctioning", desc: "Bill of Materials prepared, Director approves budget, project listed publicly on Portal as 'Upcoming'.", icon: "📊", color: "#8B5CF6" },
    { num: "04", title: "Donor Visibility", desc: "Project goes live on app & web. Donors can optionally 'sponsor' specific projects of their choice.", icon: "👁️", color: "#22C55E" },
    { num: "05", title: "Procurement & Execution", desc: "Local vendor procurement with GST bills. Site Visitor supervises work. Before photos/videos archived.", icon: "🔨", color: "#EF4444" },
    { num: "06", title: "Completion & Docs", desc: "After photos/videos captured, bills uploaded, beneficiary institution signs a completion certificate.", icon: "✅", color: "#14B8A6" },
    { num: "07", title: "Donor Update & Public Closure", desc: "Push notification + email + WhatsApp sent to every active donor. Before/After gallery and bill summary shared.", icon: "🎉", color: "#D97706" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.warmCream}, #FFF7ED)`,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div className="section-label">FROM REQUEST TO RECEIPT</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
            Project execution workflow.
          </h1>
          <p className="section-subtitle" style={{ fontSize: 18 }}>
            Seven steps. Every project. No exceptions.
          </p>
          <div style={{
            marginTop: 16, padding: "8px 20px", borderRadius: 8,
            background: `${COLORS.saffron}15`, display: "inline-block",
            fontSize: 14, fontWeight: 600, color: COLORS.saffron,
          }}>
            SLA Target: Request → Completed within 45–60 days
          </div>
        </div>
      </section>

      {/* Interactive Steps */}
      <section className="section-pad">
        <div className="grid-2" style={{ gap: 48 }}>
          {/* Step Navigator */}
          <div>
            {steps.map((s, i) => (
              <div key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  display: "flex", gap: 16, padding: "20px 16px",
                  borderRadius: 16, cursor: "pointer",
                  background: activeStep === i ? "white" : "transparent",
                  boxShadow: activeStep === i ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
                  border: activeStep === i ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
                  transition: "all 0.3s ease", marginBottom: 8,
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: activeStep === i ? s.color : `${s.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: activeStep === i ? 22 : 18,
                  transition: "all 0.3s ease",
                }}>
                  {activeStep === i ? <span style={{ filter: "brightness(10)" }}>{s.icon}</span> : s.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: s.color,
                    letterSpacing: 1, marginBottom: 4,
                  }}>STEP {s.num}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.darkBrown }}>{s.title}</div>
                  {activeStep === i && (
                    <p style={{
                      fontSize: 14, color: COLORS.textSecondary,
                      lineHeight: 1.6, marginTop: 8, animation: "fadeUp 0.3s ease",
                    }}>{s.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Step Detail Card */}
          <div className="hide-mobile" style={{ position: "sticky", top: 100 }}>
            <div style={{
              background: COLORS.darkBrown, borderRadius: 24, padding: 48,
              color: "white", minHeight: 400,
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{ fontSize: 64, marginBottom: 24 }}>{steps[activeStep].icon}</div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: steps[activeStep].color,
                letterSpacing: 2, marginBottom: 8,
              }}>STEP {steps[activeStep].num}</div>
              <h3 className="playfair" style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
                {steps[activeStep].title}
              </h3>
              <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.8 }}>
                {steps[activeStep].desc}
              </p>
              <div style={{
                marginTop: 32, display: "flex", gap: 8,
              }}>
                {steps.map((_, i) => (
                  <div key={i} style={{
                    width: i === activeStep ? 32 : 8, height: 8, borderRadius: 4,
                    background: i === activeStep ? steps[activeStep].color : "rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease", cursor: "pointer",
                  }} onClick={() => setActiveStep(i)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-layer Ecosystem */}
      <section style={{ background: "#F8F4EE", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">THE DIGITAL BACKBONE</div>
          <h2 className="section-title">A three-layer digital ecosystem.</h2>
          <p className="section-subtitle" style={{ marginBottom: 40 }}>
            Donor side. Demand side. Internal. One platform tying ₹1 to one renovated classroom.
          </p>

          <div className="grid-3">
            {[
              {
                layer: "01 · DONOR-FACING",
                title: "Website & Mobile App",
                items: ["QR / UPI / Auto-debit / Cards", "Before-After gallery for every project", "Donor login & ledger", "Auto-generated 80G receipts"],
                quote: "For the donor who wants to see where the money went.",
              },
              {
                layer: "02 · DEMAND SIDE",
                title: "Request Management Portal",
                items: ["Online form for schools & hospitals", "Captures institution name, UDISE, location", "Photo/video uploads", "Status tracker: Submitted → Completed"],
                quote: "Communities decide what they need.",
              },
              {
                layer: "03 · INTERNAL OPS",
                title: "CRM & Backend Dashboard",
                items: ["Donor CRM — profiles, payment history", "Project Management — budgets, bills", "Vendor Management — registration & records", "Financial Reports — real-time reconciliation"],
                quote: "",
              },
            ].map((layer, i) => (
              <div key={i} style={{
                background: i === 2 ? COLORS.darkBrown : "white",
                color: i === 2 ? "white" : COLORS.textPrimary,
                borderRadius: 20, overflow: "hidden",
                border: i < 2 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}>
                <div style={{
                  background: i === 2 ? "rgba(255,255,255,0.08)" : COLORS.darkBrown,
                  padding: "16px 24px",
                  color: i === 2 ? COLORS.saffron : "white",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 4,
                    color: COLORS.saffron }}>{layer.layer}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{layer.title}</div>
                </div>
                <div style={{ padding: 24 }}>
                  {layer.items.map((item, j) => (
                    <div key={j} style={{
                      display: "flex", gap: 8, alignItems: "flex-start",
                      padding: "8px 0", fontSize: 14,
                      color: i === 2 ? "rgba(255,255,255,0.85)" : COLORS.textSecondary,
                      borderLeft: `2px solid ${COLORS.saffron}`,
                      paddingLeft: 12, marginBottom: 8,
                    }}>{item}</div>
                  ))}
                  {layer.quote && (
                    <p className="playfair" style={{
                      fontSize: 14, fontStyle: "italic", marginTop: 24,
                      color: i === 2 ? "rgba(255,255,255,0.6)" : COLORS.accent,
                    }}>{layer.quote}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  PROJECTS PAGE
// ═══════════════════════════════════════
function ProjectsPage({ setPage }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Education", "Healthcare", "Water & Sanitation", "Infrastructure"];

  const projects = [
    { title: "Smart Classrooms Initiative", location: "Govt. Primary School, Bastar, Rajasthan", category: "Education", progress: 72, budget: "₹2,00,000", spent: "₹1,44,000", status: "In Progress" },
    { title: "Clean Water for Rural India", location: "Village Kanker, Madhya Pradesh", category: "Water & Sanitation", progress: 58, budget: "₹8,50,000", spent: "₹4,93,000", status: "In Progress" },
    { title: "Nutrition Support for Children", location: "PHC Narayanpur, Uttar Pradesh", category: "Healthcare", progress: 65, budget: "₹6,00,000", spent: "₹3,90,000", status: "In Progress" },
    { title: "School Furniture — Desks & Benches", location: "Govt. School Doneswara, Chhattisgarh", category: "Education", progress: 100, budget: "₹3,10,000", spent: "₹3,10,000", status: "Completed" },
    { title: "Hospital Beds for CHC", location: "CHC Narayanpur, Chhattisgarh", category: "Healthcare", progress: 45, budget: "₹1,50,000", spent: "₹67,500", status: "In Progress" },
    { title: "Classroom Painting & Repair", location: "Govt. Middle School, Maharashtra", category: "Infrastructure", progress: 100, budget: "₹1,50,000", spent: "₹1,50,000", status: "Completed" },
    { title: "Women Empowerment Program", location: "Community Center, Maharashtra", category: "Infrastructure", progress: 40, budget: "₹9,00,000", spent: "₹3,60,000", status: "In Progress" },
    { title: "School Infrastructure Upgrade", location: "Govt. High School, Karnataka", category: "Education", progress: 80, budget: "₹7,50,000", spent: "₹6,00,000", status: "In Progress" },
  ];

  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.warmCream}, #ECFDF5)`,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div className="section-label">OUR PROJECTS</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
            Every rupee, accounted for.
          </h1>
          <p className="section-subtitle">
            Browse active and completed projects. Each one has a bill, a photo, and a story.
          </p>
        </div>
      </section>

      <section className="section-pad">
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              padding: "8px 20px", borderRadius: 10,
              border: filter === cat ? "none" : "1px solid rgba(0,0,0,0.1)",
              background: filter === cat ? COLORS.darkBrown : "white",
              color: filter === cat ? "white" : COLORS.textPrimary,
              fontSize: 14, fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s",
            }}>{cat}</button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid-2">
          {filtered.map((p, i) => (
            <div key={i} className="hover-lift" style={{
              background: "white", borderRadius: 20, padding: 28,
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
                    background: p.status === "Completed" ? "#DCFCE7" : "#FEF3C7",
                    color: p.status === "Completed" ? "#16A34A" : "#D97706",
                  }}>{p.status}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginTop: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>{p.location}</p>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
                  background: COLORS.lightCream, color: COLORS.accent,
                }}>{p.category}</span>
              </div>

              <div style={{ height: 8, borderRadius: 4, background: "#E5E7EB", overflow: "hidden", marginBottom: 12 }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${p.progress}%`,
                  background: p.progress === 100
                    ? "linear-gradient(90deg, #22C55E, #16A34A)"
                    : "linear-gradient(90deg, #F97316, #F59E0B)",
                }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 16 }}>
                <span><strong>{p.progress}%</strong> complete</span>
                <span style={{ color: COLORS.textSecondary }}>{p.spent} of {p.budget}</span>
              </div>

              <button style={{
                width: "100%", padding: "10px 0",
                background: p.status === "Completed" ? COLORS.lightCream : "linear-gradient(135deg, #22C55E, #16A34A)",
                color: p.status === "Completed" ? COLORS.darkBrown : "white",
                border: p.status === "Completed" ? "1px solid rgba(0,0,0,0.1)" : "none",
                borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
                onClick={() => { if (p.status !== "Completed") { setPage("donate"); } }}>
                {p.status === "Completed" ? "View Before/After →" : "Support This Project →"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  DONATE PAGE
// ═══════════════════════════════════════
function DonatePage() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [step, setStep] = useState(1);
  const [upiId, setUpiId] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPAN, setDonorPAN] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const plans = [
    { label: "Daily", amount: 1, display: "₹1/day", mode: "UPI · QR · Manual", tax: "50% under 80G" },
    { label: "Monthly", amount: 30, display: "₹30/mo", mode: "NACH · UPI AutoPay", tax: "50% under 80G", popular: true },
    { label: "Annual", amount: 365, display: "₹365/yr", mode: "Auto-debit · One-time", tax: "50% under 80G" },
    { label: "CSR", amount: 0, display: "Custom", mode: "Bank Transfer / NEFT", tax: "100% CSR eligible" },
    { label: "Sponsor", amount: 0, display: "Per-Project", mode: "Bank Transfer", tax: "50% under 80G" },
  ];

  const selectedAmount = selectedPlan === 3 || selectedPlan === 4
    ? (customAmount || 0)
    : plans[selectedPlan].amount;

  const [autoDebitType, setAutoDebitType] = useState("nach");
  const [mandateAmount, setMandateAmount] = useState(selectedAmount || 30);
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [autoDebitUpi, setAutoDebitUpi] = useState("");

  const paymentMethods = [
    { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
    { id: "autodebit", label: "Auto-Debit", icon: "🔄", desc: "NACH / UPI AutoPay" },
    { id: "card", label: "Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
    { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
    { id: "qr", label: "QR Code", icon: "📷", desc: "Scan & Pay instantly" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, #ECFDF5, ${COLORS.warmCream})`,
        padding: "60px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div className="section-label">DONATE</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
            Five ways to give. One rupee at a time.
          </h1>
          <p className="section-subtitle">
            From a student's ₹1 to a corporation's CSR cheque — all roads route through the same audited account.
          </p>
        </div>
      </section>

      <section className="section-pad">
        {!showReceipt ? (
          <div className="grid-2" style={{ gap: 48, alignItems: "start" }}>
            {/* Left: Donation Form */}
            <div>
              {/* Step indicator */}
              <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                {["Choose Plan", "Your Details", "Payment"].map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8, flex: 1,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: step > i + 1 ? COLORS.primaryGreen : step === i + 1 ? COLORS.darkBrown : "#E5E7EB",
                      color: step >= i + 1 ? "white" : COLORS.textSecondary,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                    }}>{step > i + 1 ? "✓" : i + 1}</div>
                    <span style={{
                      fontSize: 13, fontWeight: step === i + 1 ? 600 : 400,
                      color: step === i + 1 ? COLORS.darkBrown : COLORS.textSecondary,
                    }}>{s}</span>
                    {i < 2 && <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />}
                  </div>
                ))}
              </div>

              {/* Step 1: Plan Selection */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: COLORS.darkBrown }}>
                    Choose your giving plan
                  </h3>
                  <div style={{ display: "grid", gap: 12 }}>
                    {plans.map((plan, i) => (
                      <div key={i}
                        onClick={() => setSelectedPlan(i)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "16px 20px", borderRadius: 14,
                          border: selectedPlan === i ? `2px solid ${COLORS.primaryGreen}` : "1px solid rgba(0,0,0,0.08)",
                          background: selectedPlan === i ? "#F0FDF4" : "white",
                          cursor: "pointer", transition: "all 0.2s", position: "relative",
                        }}>
                        {plan.popular && (
                          <div style={{
                            position: "absolute", top: -8, right: 12,
                            background: COLORS.saffron, color: "white",
                            fontSize: 10, fontWeight: 700, padding: "2px 8px",
                            borderRadius: 6,
                          }}>POPULAR</div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            border: `2px solid ${selectedPlan === i ? COLORS.primaryGreen : "#D1D5DB"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {selectedPlan === i && (
                              <div style={{
                                width: 10, height: 10, borderRadius: "50%",
                                background: COLORS.primaryGreen,
                              }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.darkBrown }}>{plan.label}</div>
                            <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{plan.mode}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="playfair" style={{ fontSize: 22, fontWeight: 700, color: COLORS.darkBrown }}>
                            {plan.display}
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.darkGreen, fontWeight: 600 }}>{plan.tax}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(selectedPlan === 3 || selectedPlan === 4) && (
                    <div style={{ marginTop: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown }}>
                        Enter Amount (₹)
                      </label>
                      <input type="number" value={customAmount}
                        onChange={e => setCustomAmount(e.target.value)}
                        placeholder="e.g. 50,000"
                        style={{
                          width: "100%", padding: "12px 16px", borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.1)", fontSize: 16,
                          marginTop: 8, outline: "none",
                        }} />
                    </div>
                  )}

                  <button className="btn-primary" style={{ width: "100%", marginTop: 24, justifyContent: "center", fontSize: 16 }}
                    onClick={() => setStep(2)}>
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 2: Donor Details */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: COLORS.darkBrown }}>
                    Your details (for 80G receipt)
                  </h3>
                  {[
                    { label: "Full Name", value: donorName, set: setDonorName, placeholder: "Enter your full name" },
                    { label: "Email Address", value: donorEmail, set: setDonorEmail, placeholder: "your@email.com" },
                    { label: "PAN Number (for 80G)", value: donorPAN, set: setDonorPAN, placeholder: "ABCDE1234F" },
                  ].map((field, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                        {field.label}
                      </label>
                      <input type="text" value={field.value}
                        onChange={e => field.set(e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%", padding: "12px 16px", borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.1)", fontSize: 15,
                          outline: "none",
                        }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => setStep(3)}>
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: COLORS.darkBrown }}>
                    Choose payment method
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {paymentMethods.map(m => (
                      <div key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          padding: "16px", borderRadius: 14, textAlign: "center",
                          border: paymentMethod === m.id ? `2px solid ${COLORS.primaryGreen}` : "1px solid rgba(0,0,0,0.08)",
                          background: paymentMethod === m.id ? "#F0FDF4" : "white",
                          cursor: "pointer", transition: "all 0.2s",
                        }}>
                        <div style={{ fontSize: 28 }}>{m.icon}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{m.label}</div>
                        <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{m.desc}</div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === "upi" && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                        Enter UPI ID
                      </label>
                      <input type="text" value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        style={{
                          width: "100%", padding: "12px 16px", borderRadius: 10,
                          border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                        }} />
                    </div>
                  )}

                  {paymentMethod === "autodebit" && (
                    <div style={{ marginBottom: 16 }}>
                      {/* Auto-debit type toggle */}
                      <div style={{
                        display: "flex", gap: 8, marginBottom: 20,
                        background: "#F3F4F6", borderRadius: 12, padding: 4,
                      }}>
                        {[
                          { id: "nach", label: "NACH Mandate", icon: "🏦" },
                          { id: "upi_autopay", label: "UPI AutoPay", icon: "📱" },
                        ].map(t => (
                          <button key={t.id} onClick={() => setAutoDebitType(t.id)} style={{
                            flex: 1, padding: "10px 16px", borderRadius: 10, border: "none",
                            background: autoDebitType === t.id ? "white" : "transparent",
                            boxShadow: autoDebitType === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                            cursor: "pointer", fontSize: 13, fontWeight: 600,
                            color: autoDebitType === t.id ? COLORS.darkBrown : COLORS.textSecondary,
                            transition: "all 0.2s",
                          }}>
                            {t.icon} {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Info banner */}
                      <div style={{
                        padding: 16, borderRadius: 12, marginBottom: 20,
                        background: "#F0FDF4", border: "1px solid #BBF7D0",
                        display: "flex", gap: 12, alignItems: "flex-start",
                      }}>
                        <span style={{ fontSize: 20 }}>🔄</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkGreen }}>
                            {autoDebitType === "nach" ? "NACH e-Mandate" : "UPI AutoPay"}
                          </div>
                          <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6, marginTop: 4 }}>
                            {autoDebitType === "nach"
                              ? "Set up a recurring mandate via your bank. Amount auto-debited monthly. Cancel anytime from the app."
                              : "Authorize recurring payments via UPI. Processed via NPCI framework. Cancel anytime from your UPI app."
                            }
                          </div>
                        </div>
                      </div>

                      {/* Mandate amount */}
                      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                        Monthly Mandate Amount (₹)
                      </label>
                      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        {[30, 100, 365, 1000].map(amt => (
                          <button key={amt} onClick={() => setMandateAmount(amt)} style={{
                            flex: 1, padding: "10px 0", borderRadius: 10,
                            border: mandateAmount === amt ? `2px solid ${COLORS.primaryGreen}` : "1px solid rgba(0,0,0,0.1)",
                            background: mandateAmount === amt ? "#F0FDF4" : "white",
                            fontSize: 15, fontWeight: 600, cursor: "pointer",
                            color: mandateAmount === amt ? COLORS.darkGreen : COLORS.textPrimary,
                            transition: "all 0.2s",
                          }}>₹{amt}</button>
                        ))}
                      </div>

                      {autoDebitType === "nach" ? (
                        <div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                              Bank Account Number
                            </label>
                            <input type="text" value={bankAccount}
                              onChange={e => setBankAccount(e.target.value)}
                              placeholder="Enter account number"
                              style={{
                                width: "100%", padding: "12px 16px", borderRadius: 10,
                                border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                              }} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                              IFSC Code
                            </label>
                            <input type="text" value={ifscCode}
                              onChange={e => setIfscCode(e.target.value)}
                              placeholder="e.g. SBIN0001234"
                              style={{
                                width: "100%", padding: "12px 16px", borderRadius: 10,
                                border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                              }} />
                          </div>
                          <div style={{
                            padding: 12, borderRadius: 10, background: COLORS.lightCream,
                            fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6,
                          }}>
                            Your bank will send an OTP to verify the mandate. Debit on the 1st of each month.
                            Maximum mandate: ₹{mandateAmount}/month. You can cancel anytime from the app or your bank.
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                              UPI ID for AutoPay
                            </label>
                            <input type="text" value={autoDebitUpi}
                              onChange={e => setAutoDebitUpi(e.target.value)}
                              placeholder="yourname@upi"
                              style={{
                                width: "100%", padding: "12px 16px", borderRadius: 10,
                                border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                              }} />
                          </div>
                          <div style={{
                            padding: 12, borderRadius: 10, background: COLORS.lightCream,
                            fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6,
                          }}>
                            A mandate request will be sent to your UPI app. Approve it once — debit
                            happens automatically on the 1st of each month. Cancel anytime from your UPI app.
                            Powered by NPCI UPI AutoPay framework.
                          </div>
                        </div>
                      )}

                      {/* Frequency display */}
                      <div style={{
                        marginTop: 16, padding: 16, borderRadius: 12,
                        background: COLORS.darkBrown, color: "white",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <div>
                          <div style={{ fontSize: 12, opacity: 0.6 }}>Recurring Amount</div>
                          <div className="playfair" style={{ fontSize: 24, fontWeight: 700 }}>₹{mandateAmount}/month</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, opacity: 0.6 }}>Annual Impact</div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.saffron }}>
                            ₹{(mandateAmount * 12).toLocaleString("en-IN")}/year
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "qr" && (
                    <div style={{
                      padding: 32, borderRadius: 16, background: "white",
                      border: "1px solid rgba(0,0,0,0.06)", textAlign: "center", marginBottom: 16,
                    }}>
                      <div style={{
                        width: 180, height: 180, margin: "0 auto",
                        background: `repeating-conic-gradient(${COLORS.darkBrown} 0% 25%, white 0% 50%) 0 0 / 20px 20px`,
                        borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: COLORS.primaryGreen, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "white", fontWeight: 800, fontSize: 18,
                        }}>₹</div>
                      </div>
                      <p style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 12 }}>
                        Scan with any UPI app to pay
                      </p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div>
                      {[
                        { label: "Card Number", placeholder: "1234 5678 9012 3456" },
                        { label: "Expiry", placeholder: "MM/YY" },
                        { label: "CVV", placeholder: "***" },
                      ].map((f, i) => (
                        <div key={i} style={{ marginBottom: 12 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkBrown, display: "block", marginBottom: 6 }}>
                            {f.label}
                          </label>
                          <input type="text" placeholder={f.placeholder}
                            style={{
                              width: "100%", padding: "12px 16px", borderRadius: 10,
                              border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                            }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                    <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-primary" style={{
                      flex: 1, justifyContent: "center", fontSize: 16,
                      animation: "pulse 2s infinite",
                    }}
                      onClick={() => setShowReceipt(true)}>
                      {paymentMethod === "autodebit" ? `🔄 Set Up ₹${mandateAmount}/mo Auto-Debit` : `❤️ Donate ₹${selectedAmount}`} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary Card */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{
                background: "white", borderRadius: 20, padding: 28,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 20 }}>
                  Donation Summary
                </h3>
                <div style={{
                  padding: 20, borderRadius: 14, background: COLORS.lightCream,
                  textAlign: "center", marginBottom: 20,
                }}>
                  <div style={{ fontSize: 13, color: COLORS.textSecondary }}>You're donating</div>
                  <div className="playfair" style={{
                    fontSize: 48, fontWeight: 800, color: COLORS.darkGreen, margin: "8px 0",
                  }}>₹{selectedAmount}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.accent }}>
                    {plans[selectedPlan].label} Plan
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16 }}>
                  {[
                    { label: "Tax Benefit", value: plans[selectedPlan].tax },
                    { label: "80G Receipt", value: "Auto-generated" },
                    { label: "Cancellation", value: "Anytime, friction-free" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "8px 0", fontSize: 13,
                    }}>
                      <span style={{ color: COLORS.textSecondary }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: COLORS.darkGreen }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: 20, padding: 16, borderRadius: 12,
                  background: "#F0FDF4", border: "1px solid #BBF7D0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>🔒</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.darkGreen }}>100% Secure</div>
                      <div style={{ fontSize: 11, color: COLORS.textSecondary }}>256-bit SSL encryption</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success / Receipt */
          <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }} className="fade-in">
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px",
              background: "linear-gradient(135deg, #22C55E, #16A34A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 40, color: "white",
            }}>✓</div>
            <h2 className="playfair" style={{ fontSize: 36, color: COLORS.darkBrown, marginBottom: 8 }}>
              Thank you, {donorName || "Donor"}!
            </h2>
            <p style={{ fontSize: 17, color: COLORS.textSecondary, marginBottom: 32, lineHeight: 1.7 }}>
              Your donation of <strong>₹{selectedAmount}</strong> has been received.
              Your 80G receipt will be emailed to <strong>{donorEmail || "your email"}</strong>.
            </p>

            <div style={{
              background: "white", borderRadius: 20, padding: 28,
              border: "1px solid rgba(0,0,0,0.06)", textAlign: "left",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.saffron, letterSpacing: 2 }}>
                    80G TAX RECEIPT
                  </div>
                  <div className="playfair" style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown }}>
                    एक रुपया — एक बदलाव
                  </div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 800,
                }}>₹</div>
              </div>
              {[
                { l: "Donor", v: donorName || "—" },
                { l: "PAN", v: donorPAN || "—" },
                { l: "Amount", v: `₹${selectedAmount}` },
                { l: "Receipt No.", v: `EREB-${Date.now().toString().slice(-6)}` },
                { l: "Date", v: new Date().toLocaleDateString("en-IN") },
                { l: "80G Number", v: "XXXXX (Obtained)" },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)",
                  fontSize: 14,
                }}>
                  <span style={{ color: COLORS.textSecondary }}>{r.l}</span>
                  <span style={{ fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ marginTop: 32, fontSize: 16 }}
              onClick={() => { setShowReceipt(false); setStep(1); }}>
              Make Another Donation
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  IMPACT DASHBOARD PAGE
// ═══════════════════════════════════════
function ImpactPage() {
  const [donors, dRef] = useCounter(25430, 2000);
  const [projects, pRef] = useCounter(128, 1500);
  const [schools, sRef] = useCounter(12, 1200);
  const [hospitals, hRef] = useCounter(4, 1000);
  const [students, stRef] = useCounter(5000, 2200);
  const [states, stateRef] = useCounter(5, 1000);

  const kpis = [
    { label: "Active Monthly Donors", value: `${donors.toLocaleString("en-IN")}+`, ref: dRef },
    { label: "Projects Completed", value: projects, ref: pRef },
    { label: "States Covered", value: states, ref: stateRef },
    { label: "Schools Improved", value: schools, ref: sRef },
    { label: "Hospitals / PHCs", value: hospitals, ref: hRef },
    { label: "Students Benefited", value: `${students.toLocaleString("en-IN")}+`, ref: stRef },
  ];

  const transparency = [
    { label: "Total donations received", metric: "Live Counter", desc: "Updated every minute on website + app dashboard" },
    { label: "Spent on projects", metric: "Total disbursed", desc: "Each project has its own bill receipt downloadable" },
    { label: "Admin ratio", metric: "Target < 30%", desc: "Admin cost ÷ total receipts. Always public." },
    { label: "Beneficiaries", metric: "Students & patients", desc: "Counted by institution, district, state" },
    { label: "Bills & Audits", metric: "Downloadable", desc: "GST bills + audit PDFs open to all donors" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.warmCream}, #E0F2FE)`,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div className="section-label">IMPACT & KPIs</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
            What success looks like.
          </h1>
          <p className="section-subtitle">
            Ten KPIs by month six. Five live numbers on the public dashboard. Anyone can audit.
          </p>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="section-pad">
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16,
        }}>
          {kpis.map((kpi, i) => (
            <div key={i} ref={kpi.ref} style={{
              background: i < 3 ? COLORS.darkBrown : "white",
              color: i < 3 ? "white" : COLORS.textPrimary,
              borderRadius: 16, padding: 24,
              border: i >= 3 ? "1px solid rgba(0,0,0,0.06)" : "none",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 2,
                color: COLORS.saffron, marginBottom: 8, textTransform: "uppercase",
              }}>{kpi.label}</div>
              <div className="playfair" style={{ fontSize: 36, fontWeight: 700 }}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency Dashboard */}
      <section style={{ background: "#F8F4EE", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">PUBLIC TRANSPARENCY DASHBOARD</div>
          <h2 className="section-title">Five live numbers. Always public.</h2>

          <div className="grid-3" style={{ marginTop: 40 }}>
            {transparency.map((t, i) => (
              <div key={i} className="hover-lift" style={{
                background: "white", borderRadius: 16, padding: 24,
                border: "1px solid rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.saffron, letterSpacing: 1, marginBottom: 8 }}>
                  {t.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 8 }}>
                  {t.metric}
                </div>
                <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Assessment */}
      <section className="section-pad">
        <div className="section-label">RISK ASSESSMENT</div>
        <h2 className="section-title">The risks we see. The shields we built.</h2>
        <p className="section-subtitle" style={{ marginBottom: 40 }}>
          Nine risks across operations, compliance, and reputation. Each one has a named mitigation.
        </p>

        <div style={{
          background: "white", borderRadius: 20, overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 80px 80px 3fr",
            padding: "12px 20px", background: COLORS.lightCream,
            fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.accent,
          }}>
            <span>RISK</span><span>PROB.</span><span>IMPACT</span><span>MITIGATION</span>
          </div>
          {[
            { risk: "Slow donor acquisition", prob: "Medium", impact: "High", mitigation: "Pre-launch influencer partnerships · viral #1RupeeChallenge" },
            { risk: "Auto-debit failure / churn", prob: "Medium", impact: "Medium", mitigation: "WhatsApp reminders · frictionless re-subscribe flow" },
            { risk: "Fake / fraudulent requests", prob: "Medium", impact: "High", mitigation: "Site Visitor physical verification mandatory before approval" },
            { risk: "Vendor quality issues", prob: "Medium", impact: "Medium", mitigation: "Minimum 2 vendor quotes · quality check before payment release" },
            { risk: "Regulatory / compliance", prob: "Low", impact: "High", mitigation: "Dedicated CA on retainer · quarterly compliance review" },
            { risk: "Technology downtime", prob: "Low", impact: "Medium", mitigation: "Cloud hosting with 99.9% SLA · daily automated backups" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 80px 80px 3fr",
              padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.04)",
              fontSize: 14, alignItems: "center",
            }}>
              <span style={{ fontWeight: 500 }}>{r.risk}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                background: r.prob === "Medium" ? "#FEF3C7" : "#DCFCE7",
                color: r.prob === "Medium" ? "#D97706" : "#16A34A",
                display: "inline-block", width: "fit-content",
              }}>{r.prob}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                background: r.impact === "High" ? "#FEE2E2" : "#FEF3C7",
                color: r.impact === "High" ? "#EF4444" : "#D97706",
                display: "inline-block", width: "fit-content",
              }}>{r.impact}</span>
              <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{r.mitigation}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  CONTACT PAGE
// ═══════════════════════════════════════
function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{
        background: `linear-gradient(135deg, ${COLORS.warmCream}, #FFF7ED)`,
        padding: "80px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }} className="fade-in">
          <div className="section-label">GET IN TOUCH</div>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
            Let's build something together.
          </h1>
          <p className="section-subtitle">
            Whether you're a school, hospital, donor, CSR partner, or volunteer — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="grid-2" style={{ gap: 48 }}>
          {/* Contact Form */}
          <div>
            {!sent ? (
              <div style={{
                background: "white", borderRadius: 20, padding: 32,
                border: "1px solid rgba(0,0,0,0.06)",
              }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 24 }}>
                  Send us a message
                </h3>
                {[
                  { label: "Your Name", placeholder: "Enter your full name", type: "text" },
                  { label: "Email Address", placeholder: "your@email.com", type: "email" },
                  { label: "I am a...", placeholder: "", type: "select" },
                  { label: "Message", placeholder: "Tell us how we can help...", type: "textarea" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <label style={{
                      fontSize: 13, fontWeight: 600, color: COLORS.darkBrown,
                      display: "block", marginBottom: 6,
                    }}>{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea placeholder={f.placeholder} rows={4} style={{
                        width: "100%", padding: "12px 16px", borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.1)", fontSize: 15,
                        outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif",
                      }} />
                    ) : f.type === "select" ? (
                      <select style={{
                        width: "100%", padding: "12px 16px", borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.1)", fontSize: 15,
                        outline: "none", background: "white",
                      }}>
                        <option>Individual Donor</option>
                        <option>School / Hospital</option>
                        <option>CSR Partner</option>
                        <option>Volunteer</option>
                        <option>Influencer / Media</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <input type={f.type} placeholder={f.placeholder} style={{
                        width: "100%", padding: "12px 16px", borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.1)", fontSize: 15, outline: "none",
                      }} />
                    )}
                  </div>
                ))}
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                  onClick={() => setSent(true)}>
                  Send Message →
                </button>
              </div>
            ) : (
              <div style={{
                background: "#F0FDF4", borderRadius: 20, padding: 48,
                textAlign: "center", border: "1px solid #BBF7D0",
              }} className="fade-in">
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 className="playfair" style={{ fontSize: 28, color: COLORS.darkBrown }}>Message Sent!</h3>
                <p style={{ color: COLORS.textSecondary, marginTop: 8 }}>
                  We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <div style={{
              background: COLORS.darkBrown, borderRadius: 20, padding: 36,
              color: "white", marginBottom: 24,
            }}>
              <h3 className="playfair" style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
                Contact Information
              </h3>
              {[
                { icon: "📧", label: "Email", value: "hello@ekrupaya.org" },
                { icon: "📞", label: "Phone", value: "+91 XXXXX XXXXX" },
                { icon: "📍", label: "Office", value: "Pan-India Operations" },
                { icon: "🕐", label: "Hours", value: "Mon–Sat, 9AM–6PM IST" },
              ].map((c, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, alignItems: "center",
                  padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{c.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div style={{
              background: "white", borderRadius: 20, padding: 28,
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 16 }}>
                Quick Links
              </h4>
              {[
                { label: "For Schools/Hospitals", desc: "Submit a request for infrastructure support" },
                { label: "For CSR Partners", desc: "Download our CSR-1 credentials & impact reports" },
                { label: "For Volunteers", desc: "Join our Site Visitor or outreach programs" },
                { label: "For Media", desc: "Press kit, impact stories, and brand assets" },
              ].map((link, i) => (
                <div key={i} style={{
                  padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.04)",
                  cursor: "pointer",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.darkGreen }}>{link.label}</div>
                  <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{link.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════
function Footer({ setPage }) {
  return (
    <footer style={{
      background: COLORS.darkBrown, color: "white", padding: "64px 24px 32px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40, marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #22C55E, #16A34A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 16,
              }}>₹</div>
              <div className="playfair" style={{ fontSize: 18, fontWeight: 700 }}>एक रुपया · एक बदलाव</div>
            </div>
            <p style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.7 }}>
              One Rupee — One Change. Transforming government schools
              and hospitals through micro-donations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: COLORS.saffron, marginBottom: 16 }}>
              ORGANIZATION
            </h4>
            {["About Us", "How It Works", "Projects", "Impact"].map((link, i) => (
              <div key={i} style={{
                padding: "6px 0", fontSize: 14, opacity: 0.7, cursor: "pointer",
              }}
                onClick={() => setPage(["about", "how", "projects", "impact"][i])}>{link}</div>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: COLORS.saffron, marginBottom: 16 }}>
              SUPPORT
            </h4>
            {["Donate", "CSR Partnerships", "Volunteer", "Contact"].map((link, i) => (
              <div key={i} style={{
                padding: "6px 0", fontSize: 14, opacity: 0.7, cursor: "pointer",
              }}
                onClick={() => setPage(i === 0 ? "donate" : "contact")}>{link}</div>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: COLORS.saffron, marginBottom: 16 }}>
              COMPLIANCE
            </h4>
            {[
              "12A (10A) — Obtained",
              "80G (18G) — Obtained",
              "CSR-1 — Obtained",
              "FCRA — To Apply",
            ].map((item, i) => (
              <div key={i} style={{ padding: "6px 0", fontSize: 13, opacity: 0.6 }}>
                {i < 3 ? "✓" : "○"} {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 24, display: "flex",
          justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ fontSize: 13, opacity: 0.5 }}>
            © 2026 एक रुपया · एक बदलाव. All rights reserved. | DPR v1.0 · Internal
          </div>
          <div style={{ fontSize: 13, opacity: 0.5 }}>
            Built with transparency. Audited quarterly.
          </div>
        </div>
      </div>
    </footer>
  );
}


// ═══════════════════════════════════════
//  REPORT ISSUE PAGE
// ═══════════════════════════════════════
function ReportIssuePage({ setPage }) {
  const [formData, setFormData] = useState({
    name: "", phone: "", pinCode: "", category: "school",
    institutionName: "", district: "", state: "", issueTitle: "",
    issueDescription: "", urgency: "medium",
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [issuePhotos, setIssuePhotos] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIssuePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) setIssuePhotos(prev => [...prev, ...previews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeIssuePhoto = (index) => {
    setIssuePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.issueTitle || !formData.issueDescription) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", border: "1px solid " + COLORS.border,
    borderRadius: 12, fontSize: 15, fontFamily: "Inter, sans-serif",
    background: "white", outline: "none", transition: "border-color 0.3s",
  };

  const labelStyle = {
    fontSize: 14, fontWeight: 600, color: COLORS.darkBrown, marginBottom: 6, display: "block",
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.warmCream, paddingTop: 100 }}>
        <div style={{
          maxWidth: 600, margin: "0 auto", padding: "60px 24px", textAlign: "center",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 40,
          }}>✓</div>
          <h2 className="playfair" style={{ fontSize: 32, color: COLORS.darkBrown, marginBottom: 16 }}>
            Issue Reported Successfully!
          </h2>
          <p style={{ fontSize: 16, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 12 }}>
            Thank you, <strong>{formData.name}</strong>. Your report for <strong>{formData.institutionName || "the institution"}</strong> has been received.
          </p>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 }}>
            Reference ID: <strong>ERI-{Date.now().toString(36).toUpperCase()}</strong><br />
            Our team will review and reach out within 48 hours.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setFormData({ name: "", phone: "", pinCode: "", category: "school", institutionName: "", district: "", state: "", issueTitle: "", issueDescription: "", urgency: "medium" }); setProfilePreview(null); setIssuePhotos([]); }}>
              Report Another Issue
            </button>
            <button className="btn-outline" onClick={() => setPage("home")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.warmCream, paddingTop: 90 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div className="section-label" style={{ color: COLORS.saffron }}>REPORT AN ISSUE</div>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          School / Hospital Issue Request
        </h1>
        <p className="section-subtitle" style={{ marginBottom: 40 }}>
          Help us identify infrastructure problems in government schools and hospitals.
          Fill in the details below and our team will assess the situation.
        </p>

        {/* Profile Section */}
        <div style={{
          background: "white", borderRadius: 20, padding: 32,
          border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>👤</span> Your Profile
          </h3>

          <div style={{ display: "flex", gap: 24, marginBottom: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Profile Photo */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: profilePreview ? "none" : "linear-gradient(135deg, #E5E7EB, #D1D5DB)",
                backgroundImage: profilePreview ? "url(" + profilePreview + ")" : "none",
                backgroundSize: "cover", backgroundPosition: "center",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "3px dashed " + COLORS.border, cursor: "pointer",
                overflow: "hidden", position: "relative",
              }}
                onClick={() => document.getElementById("profile-photo-input").click()}
              >
                {!profilePreview && <span style={{ fontSize: 28, color: COLORS.textSecondary }}>📷</span>}
              </div>
              <input id="profile-photo-input" type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleProfilePhoto} />
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 8 }}>Upload Photo</div>
            </div>

            {/* Name, Phone, Pin Code */}
            <div style={{ flex: 1, minWidth: 250 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name <span style={{ color: "#EF4444" }}>*</span></label>
                <input style={inputStyle} placeholder="Enter your full name"
                  value={formData.name} onChange={e => handleChange("name", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Phone Number <span style={{ color: "#EF4444" }}>*</span></label>
                  <input style={inputStyle} placeholder="+91 XXXXX XXXXX" type="tel"
                    value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>PIN Code</label>
                  <input style={inputStyle} placeholder="6-digit PIN" maxLength={6}
                    value={formData.pinCode} onChange={e => handleChange("pinCode", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Details Section */}
        <div style={{
          background: "white", borderRadius: 20, padding: 32,
          border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🏢</span> Issue Details
          </h3>

          {/* Category Selection */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Category <span style={{ color: "#EF4444" }}>*</span></label>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "school", label: "🏫 Government School", color: "#3B82F6" },
                { value: "hospital", label: "🏥 Government Hospital", color: "#EF4444" },
              ].map(cat => (
                <button key={cat.value}
                  onClick={() => handleChange("category", cat.value)}
                  style={{
                    flex: 1, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    border: formData.category === cat.value ? "2px solid " + cat.color : "1px solid " + COLORS.border,
                    background: formData.category === cat.value ? cat.color + "10" : "white",
                    fontSize: 14, fontWeight: formData.category === cat.value ? 600 : 400,
                    color: formData.category === cat.value ? cat.color : COLORS.textSecondary,
                    transition: "all 0.2s ease",
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Institution Details */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Institution Name</label>
            <input style={inputStyle}
              placeholder={formData.category === "school" ? "e.g. Govt. Primary School, Village Name" : "e.g. CHC Narayanpur"}
              value={formData.institutionName} onChange={e => handleChange("institutionName", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>District</label>
              <input style={inputStyle} placeholder="District name"
                value={formData.district} onChange={e => handleChange("district", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} placeholder="State name"
                value={formData.state} onChange={e => handleChange("state", e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Issue Title <span style={{ color: "#EF4444" }}>*</span></label>
            <input style={inputStyle} placeholder="e.g. Broken desks in Class 3"
              value={formData.issueTitle} onChange={e => handleChange("issueTitle", e.target.value)} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Describe the Issue <span style={{ color: "#EF4444" }}>*</span></label>
            <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
              placeholder="Describe the issue in detail — what is broken, how many students/patients are affected, how long has this been a problem?"
              value={formData.issueDescription} onChange={e => handleChange("issueDescription", e.target.value)} />
          </div>

          {/* Urgency */}
          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Urgency Level</label>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "low", label: "Low", color: "#22C55E" },
                { value: "medium", label: "Medium", color: "#F59E0B" },
                { value: "high", label: "High", color: "#EF4444" },
              ].map(u => (
                <button key={u.value}
                  onClick={() => handleChange("urgency", u.value)}
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    border: formData.urgency === u.value ? "2px solid " + u.color : "1px solid " + COLORS.border,
                    background: formData.urgency === u.value ? u.color + "15" : "white",
                    fontSize: 14, fontWeight: formData.urgency === u.value ? 600 : 400,
                    color: formData.urgency === u.value ? u.color : COLORS.textSecondary,
                    transition: "all 0.2s ease",
                  }}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Issue Photos Section */}
        <div style={{
          background: "white", borderRadius: 20, padding: 32,
          border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.darkBrown, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>📸</span> Issue Photos
          </h3>
          <p style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 }}>
            Upload up to 5 photos showing the issue. Clear photos help our team assess the situation faster.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {issuePhotos.map((photo, i) => (
              <div key={i} style={{
                width: 120, height: 120, borderRadius: 12, overflow: "hidden",
                position: "relative", border: "1px solid " + COLORS.border,
              }}>
                <img src={photo} alt={"Issue " + (i + 1)} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                }} />
                <button onClick={() => removeIssuePhoto(i)} style={{
                  position: "absolute", top: 4, right: 4,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)", color: "white",
                  border: "none", cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>x</button>
              </div>
            ))}

            {issuePhotos.length < 5 && (
              <div
                onClick={() => document.getElementById("issue-photos-input").click()}
                style={{
                  width: 120, height: 120, borderRadius: 12,
                  border: "2px dashed " + COLORS.border,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", gap: 4, background: COLORS.lightCream,
                  transition: "border-color 0.3s",
                }}>
                <span style={{ fontSize: 28, color: COLORS.textSecondary }}>+</span>
                <span style={{ fontSize: 12, color: COLORS.textSecondary }}>Add Photo</span>
              </div>
            )}
          </div>
          <input id="issue-photos-input" type="file" accept="image/*" multiple
            style={{ display: "none" }} onChange={handleIssuePhotos} />
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button className="btn-primary"
            onClick={handleSubmit}
            style={{
              fontSize: 18, padding: "18px 48px", width: "100%", maxWidth: 400,
              justifyContent: "center",
            }}>
            📋 Submit Issue Report
          </button>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 12 }}>
            By submitting, you confirm the information provided is accurate to the best of your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════
// ═══════════════════════════════════════
//  BACK BUTTON COMPONENT
// ═══════════════════════════════════════
function BackButton({ goBack }) {
  return (
    <button onClick={goBack} style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 999,
      width: 48, height: 48, borderRadius: "50%",
      background: COLORS.darkBrown, color: "white",
      border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease", fontSize: 20,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = COLORS.saffron; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = COLORS.darkBrown; }}
      title="Go back"
    >
      ←
    </button>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageHistory, setPageHistory] = useState(["home"]);

  const navigateTo = (page) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (pageHistory.length <= 1) return;
    const newHistory = [...pageHistory];
    newHistory.pop();
    const previousPage = newHistory[newHistory.length - 1];
    setPageHistory(newHistory);
    setCurrentPage(previousPage);
    window.scrollTo(0, 0);
  };

  const canGoBack = pageHistory.length > 1;

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setPage={navigateTo} />;
      case "about": return <AboutPage />;
      case "how": return <HowItWorksPage />;
      case "projects": return <ProjectsPage setPage={navigateTo} />;
      case "donate": return <DonatePage />;
      case "impact": return <ImpactPage />;
      case "contact": return <ContactPage />;
      case "report": return <ReportIssuePage setPage={navigateTo} />;
      default: return <HomePage setPage={navigateTo} />;
    }
  };

  return (
    <div>
      <style>{globalStyles}</style>
      <Navbar currentPage={currentPage} setPage={navigateTo} />
      {renderPage()}
      {canGoBack && <BackButton goBack={goBack} />}
      <Footer setPage={navigateTo} />
    </div>
  );
}
