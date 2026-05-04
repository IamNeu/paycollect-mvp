import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('en')
  const [scrolled, setScrolled] = useState(false)
  const [activeReport, setActiveReport] = useState('pg')
  const [annual, setAnnual] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (en, ph) => lang === 'en' ? en : ph

  const prices = {
    starter: { monthly: 0, annual: 0 },
    growth:  { monthly: 2990, annual: 2392 },
    scale:   { monthly: 7990, annual: 6392 },
  }

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F3; color: #1C1C1E; line-height: 1.6; overflow-x: hidden; }
        :root {
          --teal: #0B4F6C; --teal-d: #083A52; --teal-l: #1A7BA4;
          --amber: #F5A623; --amber-d: #D4881A; --amber-l: #FBBF4D;
          --cream: #FAF8F3; --cream-d: #F0ECE3;
          --ink: #1C1C1E; --ink-m: #4A4A52; --ink-l: #8A8A96;
          --border: #E4DFD5; --green: #1A8A5C; --green-l: #E6F7F0;
        }
        @keyframes rotateSun { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeLeft { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .lp-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
          font-size: .875rem; padding: 12px 24px; border-radius: 8px;
          cursor: pointer; border: none; transition: all .2s ease;
          white-space: nowrap; text-decoration: none;
        }
        .lp-btn-primary { background: var(--teal); color: white; box-shadow: 0 4px 16px rgba(11,79,108,.3); }
        .lp-btn-primary:hover { background: var(--teal-d); transform: translateY(-1px); }
        .lp-btn-amber { background: var(--amber); color: var(--teal-d); font-weight: 800; box-shadow: 0 4px 16px rgba(245,166,35,.35); }
        .lp-btn-amber:hover { background: var(--amber-d); transform: translateY(-1px); }
        .lp-btn-outline { background: transparent; color: var(--teal); border: 2px solid var(--teal); }
        .lp-btn-outline:hover { background: var(--teal); color: white; }
        .lp-btn-ghost { background: rgba(255,255,255,.15); color: white; border: 1.5px solid rgba(255,255,255,.25); }
        .lp-btn-ghost:hover { background: rgba(255,255,255,.25); }
        .lp-btn-lg { padding: 15px 32px; font-size: 1rem; border-radius: 14px; }
        .lp-btn-xl { padding: 18px 40px; font-size: 1.05rem; border-radius: 14px; }
        .eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--amber); }
        .display { font-family: 'Playfair Display', serif; font-weight: 900; line-height: 1.08; letter-spacing: -1.5px; }
        .display-xl { font-size: clamp(2.6rem, 5.5vw, 4.2rem); }
        .display-lg { font-size: clamp(2rem, 3.5vw, 3rem); }
        .container { max-width: 1140px; margin: 0 auto; padding: 0 5%; }
        .section { padding: 96px 0; }
        .section-header { text-align: center; margin-bottom: 56px; }
        .section-header .display { color: var(--teal-d); margin: 10px 0 14px; }
        .section-header p { font-size: .97rem; color: var(--ink-m); max-width: 520px; margin: 0 auto; line-height: 1.7; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 5%', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(250,248,243,.95)', backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #E4DFD5' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(11,79,108,.07)' : 'none',
        transition: 'all .3s'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>
          <div style={{
            width: '38px', height: '38px', background: 'var(--teal)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif", fontWeight: 900, color: 'var(--amber)', fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(11,79,108,.3)'
          }}>P</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--teal-d)', letterSpacing: '-.3px' }}>
            Pay<span style={{ color: 'var(--amber)' }}>Collect</span>
          </div>
        </div>

        {/* Nav links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none' }}>
          {[['Channels','#channels'],['Features','#features'],['Reports','#reports'],['Pricing','#pricing']].map(([label, href]) => (
            <li key={label}>
              <a href={href} style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--ink-m)', textDecoration: 'none', transition: 'color .18s' }}
                onMouseEnter={e => e.target.style.color='var(--teal)'}
                onMouseLeave={e => e.target.style.color='var(--ink-m)'}
              >{label}</a>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language toggle */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#F0ECE3', borderRadius: '100px', padding: '3px', border: '1.5px solid #E4DFD5' }}>
            {['EN','FIL'].map(l => (
              <button key={l} onClick={() => setLang(l === 'EN' ? 'en' : 'ph')} style={{
                padding: '5px 14px', borderRadius: '100px', fontSize: '.73rem', fontWeight: 700,
                cursor: 'pointer', border: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: (lang === 'en' && l === 'EN') || (lang === 'ph' && l === 'FIL') ? 'var(--teal)' : 'transparent',
                color: (lang === 'en' && l === 'EN') || (lang === 'ph' && l === 'FIL') ? 'white' : 'var(--ink-l)',
                transition: 'all .18s'
              }}>{l}</button>
            ))}
          </div>
          <button className="lp-btn lp-btn-outline" onClick={() => navigate('/login')} style={{ padding: '8px 18px' }}>Log in</button>
          <button className="lp-btn lp-btn-amber" onClick={() => navigate('/login')} style={{ padding: '8px 18px' }}>Get started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '110px 5% 80px', position: 'relative', overflow: 'hidden',
        background: 'var(--teal-d)'
      }}>
        {/* Rotating sun rays */}
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%', width: '90vw', height: '90vw',
          background: 'conic-gradient(from 0deg, transparent 0deg, transparent 16deg, rgba(245,166,35,.07) 16deg, rgba(245,166,35,.07) 18deg, transparent 18deg)',
          borderRadius: '50%', pointerEvents: 'none',
          animation: 'rotateSun 80s linear infinite'
        }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #FAF8F3 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
        {/* Glows */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'var(--teal-l)', top: '-100px', right: '5%', borderRadius: '50%', filter: 'blur(60px)', opacity: .35, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'var(--amber)', bottom: '10%', left: '20%', borderRadius: '50%', filter: 'blur(60px)', opacity: .15, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', maxWidth: '1140px', margin: '0 auto', width: '100%' }}>

          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)', borderRadius: '100px', padding: '6px 16px 6px 8px', fontSize: '.75rem', fontWeight: 700, color: '#FBBF4D', marginBottom: '24px', animation: 'fadeUp .6s ease both' }}>
              <div style={{ width: '22px', height: '22px', background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem' }}>🇵🇭</div>
              {t('Built for Philippine Merchants', 'Para sa mga Negosyante sa Pilipinas')}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2.8rem, 5vw, 4rem)', lineHeight: 1.08, letterSpacing: '-2px', color: 'white', marginBottom: '22px', animation: 'fadeUp .7s ease .1s both' }}>
              {t(<>Kolektahin ang<br />bawat <em style={{ fontStyle: 'italic', color: '#FBBF4D' }}>piso</em> —<br />on time.</>, <>Kolektahin ang<br />bawat <em style={{ fontStyle: 'italic', color: '#FBBF4D' }}>piso</em> —<br />sa tamang oras.</>)}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '460px', animation: 'fadeUp .7s ease .2s both' }}>
              {t('Send payment requests, track collections, and reconcile — all in one place. GCash, Maya, card, OTC.', 'Magpadala ng payment requests, subaybayan ang mga koleksyon, at i-reconcile — lahat sa isang lugar. GCash, Maya, card, OTC.')}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '44px', animation: 'fadeUp .7s ease .3s both' }}>
              <button className="lp-btn lp-btn-amber lp-btn-xl" onClick={() => navigate('/login')}>
                {t('Start collecting free →', 'Magsimulang mag-kolekta nang libre →')}
              </button>
              <button className="lp-btn lp-btn-ghost lp-btn-lg" onClick={() => navigate('/login')}>
                {t('Request a demo', 'Humiling ng demo')}
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', animation: 'fadeUp .7s ease .4s both' }}>
              <div style={{ display: 'flex' }}>
                {[['JD','#1a7ba4'],['MS','#8a3ab9'],['RC','#1a8a5c'],['AP','#e05c2a']].map(([init, bg], i) => (
                  <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--teal-d)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 700, color: 'white', marginLeft: i === 0 ? 0 : '-8px' }}>{init}</div>
                ))}
              </div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.4 }}>
                <strong style={{ color: 'rgba(255,255,255,.85)' }}>8,400+ merchants</strong><br />
                {t('already collecting on PayCollect', 'gumagamit na ng PayCollect')}
              </div>
            </div>
          </div>

          {/* Right — Dashboard card */}
          <div style={{ position: 'relative', animation: 'fadeLeft .9s ease .2s both' }}>
            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,.3), 0 8px 24px rgba(0,0,0,.15)', overflow: 'hidden', transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)', transition: 'transform .5s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'perspective(1200px) rotateY(-2deg) rotateX(1deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'perspective(1200px) rotateY(-6deg) rotateX(3deg)'}
            >
              {/* Topbar */}
              <div style={{ background: 'linear-gradient(90deg, var(--teal-d), var(--teal))', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                <span style={{ color: 'var(--amber)', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.85rem', marginLeft: '6px' }}>PayCollect</span>
                {['Dashboard','Collect','Customers','Reports'].map((item, i) => (
                  <span key={item} style={{ color: i === 0 ? 'white' : 'rgba(255,255,255,.4)', fontSize: '.67rem', marginLeft: '10px', fontWeight: 600, borderBottom: i === 0 ? '1.5px solid var(--amber)' : 'none', paddingBottom: i === 0 ? '1px' : 0 }}>{item}</span>
                ))}
              </div>
              {/* Body */}
              <div style={{ padding: '14px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '12px' }}>
                  {[
                    { num: '₱3.18M', lbl: 'Collected', hero: true },
                    { num: '₱420K', lbl: 'Outstanding', hero: false },
                    { num: '94%', lbl: 'Collection Rate', hero: false },
                    { num: '1,284', lbl: 'Customers', hero: false },
                  ].map(s => (
                    <div key={s.lbl} style={{ background: s.hero ? 'linear-gradient(135deg, var(--teal), var(--teal-d))' : '#FAF8F3', borderRadius: '9px', padding: '9px', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.95rem', color: s.hero ? '#FBBF4D' : 'var(--teal-d)' }}>{s.num}</div>
                      <div style={{ fontSize: '.56rem', color: s.hero ? 'rgba(255,255,255,.5)' : 'var(--ink-l)', marginTop: '1px', fontWeight: 600 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                {/* Rows */}
                {[
                  { name: 'Maria Santos', amt: '₱25,000', ch: 'GCash', status: 'Paid', sc: '#d1fae5', tc: '#065f46' },
                  { name: 'Jose Reyes', amt: '₱50,000', ch: 'Maya', status: 'Pending', sc: '#fef3c7', tc: '#92400e' },
                  { name: 'Ana Cruz', amt: '₱18,500', ch: 'Visa', status: 'Partial', sc: '#dbeafe', tc: '#1e40af' },
                  { name: 'Carlo Villanueva', amt: '₱12,000', ch: 'OTC', status: 'Paid', sc: '#d1fae5', tc: '#065f46' },
                ].map(r => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px', fontSize: '.64rem', borderBottom: '1px solid #F0ECE3', borderRadius: '5px' }}>
                    <span style={{ flex: 1.5, fontWeight: 600 }}>{r.name}</span>
                    <span style={{ flex: 1, fontWeight: 700 }}>{r.amt}</span>
                    <span style={{ flex: .8, color: '#8a8a96' }}>{r.ch}</span>
                    <span style={{ flex: .8 }}><span style={{ background: r.sc, color: r.tc, fontSize: '.56rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{r.status}</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notifications */}
            <div style={{ position: 'absolute', top: '-18px', right: '-24px', background: 'white', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.75rem', border: '1px solid #E4DFD5', animation: 'floatY 3.5s ease-in-out infinite', zIndex: 10 }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>💸</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.88rem', color: 'var(--teal-d)' }}>₱25,000</div>
                <div style={{ fontSize: '.6rem', color: 'var(--ink-l)' }}>{t('Payment received', 'Natanggap ang bayad')}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '48px', left: '-32px', background: 'white', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,.2)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.75rem', border: '1px solid #E4DFD5', animation: 'floatY 3.5s ease-in-out 1.8s infinite', zIndex: 10 }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>📋</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.88rem', color: 'var(--teal-d)' }}>1,284</div>
                <div style={{ fontSize: '.6rem', color: 'var(--ink-l)' }}>{t('Customers tracked', 'Mga customer na sinusubaybayan')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: 'var(--amber)', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '60px', animation: 'ticker 20s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            [
              { num: '₱1.2B+', lbl: t('payments processed', 'mga bayad na naiproseso') },
              { num: '8,400+', lbl: t('merchants in PH', 'mga mangangalakal sa PH') },
              { num: '94%', lbl: t('avg collection rate', 'avg na collection rate') },
              { num: 'T+1', lbl: t('settlement to your bank', 'settlement sa iyong bangko') },
              { num: 'BSP', lbl: t('licensed & regulated', 'lisensyado at regulated') },
            ].map((item, i) => (
              <div key={`${rep}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '40px', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem', color: 'var(--teal-d)' }}>{item.num}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--teal-d)', opacity: .7 }}>{item.lbl}</div>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'rgba(8,58,82,.2)' }} />
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ── CHANNELS ── */}
      <section className="section" id="channels" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <p className="eyebrow">{t('PAYMENT CHANNELS', 'MGA PARAAN NG PAGBABAYAD')}</p>
              <h2 className="display display-lg" style={{ color: 'var(--teal-d)', margin: '10px 0 16px' }}>
                {t('Every way Filipinos pay', 'Lahat ng paraan ng pagbabayad ng mga Pilipino')}
              </h2>
              <p style={{ color: 'var(--ink-m)', marginBottom: '32px', lineHeight: 1.7 }}>
                {t('Your customers choose how they pay — GCash, Maya, Visa/Mastercard, InstaPay bank transfer, QR Ph, or cash over the counter at 7-Eleven, Bayad Center, and LBC. You receive in one place.',
                   'Pinipili ng iyong mga customer kung paano sila magbabayad — GCash, Maya, Visa/Mastercard, InstaPay, QR Ph, o cash sa 7-Eleven, Bayad Center, at LBC. Ang lahat ay matatanggap mo sa isang lugar.')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                {[
                  { icon: '💚', name: 'GCash', type: t('E-Wallet','E-Wallet') },
                  { icon: '🔵', name: 'Maya', type: t('E-Wallet','E-Wallet') },
                  { icon: '💳', name: 'Visa / MC', type: t('Credit & Debit','Kredit at Debit') },
                  { icon: '🏦', name: 'InstaPay', type: t('Bank Transfer','Bank Transfer') },
                  { icon: '🏪', name: '7-Eleven', type: t('Over-the-Counter','Sa Tindahan') },
                  { icon: '📱', name: 'QR Ph', type: t('National QR','National QR') },
                ].map(ch => (
                  <div key={ch.name} style={{ background: '#FAF8F3', border: '1.5px solid #E4DFD5', borderRadius: '12px', padding: '14px', textAlign: 'center', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--teal)'; e.currentTarget.style.background='#f0f7fb'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#E4DFD5'; e.currentTarget.style.background='#FAF8F3'; }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{ch.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '.84rem', color: 'var(--teal-d)' }}>{ch.name}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--ink-l)', marginTop: '2px' }}>{ch.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow box */}
            <div style={{ background: '#FAF8F3', border: '1.5px solid #E4DFD5', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--ink-l)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                {t('How a collection works', 'Paano gumagana ang koleksyon')}
              </div>
              {[
                { n: 1, title: t('Create a payment request','Gumawa ng payment request'), desc: t('Enter customer name, amount, and due date. Done in 30 seconds.','I-enter ang pangalan ng customer, halaga, at due date. Tapos sa 30 segundo.'), time: '30 sec' },
                { n: 2, title: t('Customer gets notified','Naabisuhan ang customer'), desc: t('Instant SMS and email with a personalised payment link. English or Tagalog.','Agad na SMS at email na may personalisadong payment link. Ingles o Tagalog.'), time: t('Instant','Agad') },
                { n: 3, title: t('Customer pays their way','Nagbabayad ang customer'), desc: t('GCash, Maya, card, OTC — no app download required.','GCash, Maya, card, OTC — walang kailangang mag-download ng app.'), time: '< 2 min' },
                { n: 4, title: t('You get paid','Matatanggap mo ang bayad'), desc: t('Real-time dashboard update. Net funds settled to your bank T+1.','Real-time na update sa dashboard. Net funds na-settle sa bangko T+1.'), time: 'T+1' },
              ].map((step, i) => (
                <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', paddingBottom: i < 3 ? '18px' : 0, marginBottom: i < 3 ? '18px' : 0, borderBottom: i < 3 ? '1px solid #E4DFD5' : 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.84rem', flexShrink: 0 }}>{step.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--teal-d)', marginBottom: '4px' }}>{step.title}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--ink-m)', lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                  <div style={{ background: 'var(--amber)', color: 'var(--teal-d)', fontSize: '.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', flexShrink: 0 }}>{step.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" id="features" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{t('PLATFORM FEATURES','MGA FEATURE NG PLATFORM')}</p>
            <h2 className="display display-lg" style={{ color: 'var(--teal-d)', margin: '10px 0 14px' }}>
              {t('Built for how you actually collect','Ginawa para sa tunay na paraan ng iyong koleksyon')}
            </h2>
            <p>{t('From sending a single invoice to managing 5,000 monthly instalments — PayCollect handles every scale.','Mula sa pagpapadala ng isang invoice hanggang sa pamamahala ng 5,000 buwanang installment.')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {[
              { icon: '💸', title: t('Smart Payment Requests','Matalinong Payment Requests'), desc: t('Create one-time or recurring requests (weekly, fortnightly, monthly). Schedule a full series in one go.','Gumawa ng one-time o recurring requests. Mag-iskedyul ng buong series sa isang go.'), tags: [t('One-time','Isang beses'), t('Recurring','Paulit-ulit'), 'Auto-remind'], bg: 'linear-gradient(135deg, #0B4F6C, #1A7BA4)', light: false },
              { icon: '📋', title: t('Bulk Operations','Bulk Operations'), desc: t('Upload 5,000 payment requests or 10,000 customers at once from Excel or CSV. Instant per-row error validation.','Mag-upload ng 5,000 payment requests o 10,000 customers nang sabay-sabay mula sa Excel o CSV.'), tags: ['5,000 rows','Excel / CSV', t('Partial payments','Bahagyang bayad')], bg: '#FBBF4D', light: true },
              { icon: '👥', title: t('Customer Directory','Direktoryo ng Customer'), desc: t("Every customer's complete history — total paid, outstanding balance, on-time rate, and average days to pay.",'Kumpletong kasaysayan ng bawat customer — kabuuang bayad, natitirang balanse, on-time rate.'), tags: [t('Payment history','Kasaysayan'), 'Lifetime stats', t('Tags','Mga tag')], bg: '#1A8A5C', light: false },
              { icon: '📊', title: t('Reconciliation & Settlement','Rekonsiliasyon at Settlement'), desc: t('Daily recon reports in two formats: by Payment Gateway or by your own Merchant Reference.','Araw-araw na recon reports sa dalawang format: ayon sa Payment Gateway o Merchant Reference.'), tags: ['Recon by PG','Recon by Ref','Settlement'], bg: 'linear-gradient(135deg, #0B4F6C, #1A7BA4)', light: false },
              { icon: '🔗', title: t('Developer API & Webhooks','Developer API at Webhooks'), desc: t('18 REST API endpoints with full documentation. Webhooks deliver real-time events to your ERP.','18 REST API endpoints na may kumpletong dokumentasyon. Real-time events sa iyong ERP.'), tags: ['REST API','Webhooks','Node / Python / PHP'], bg: '#FBBF4D', light: true },
              { icon: '🌏', title: t('Philippines-First','Para sa Pilipinas'), desc: t('BSP-licensed. Notifications in Tagalog or English. PHP-native reporting. GCash and Maya direct integrations.','Lisensyado ng BSP. Mga notipikasyon sa Tagalog o Ingles. GCash at Maya direktang integrasyon.'), tags: ['BSP Licensed','Tagalog / English','₱ Peso'], bg: '#1A8A5C', light: false },
            ].map(feat => (
              <div key={feat.title} style={{ background: feat.bg, borderRadius: '20px', padding: '28px', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 48px rgba(0,0,0,.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{feat.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.1rem', color: feat.light ? 'var(--teal-d)' : 'white', marginBottom: '10px' }}>{feat.title}</h3>
                <p style={{ fontSize: '.84rem', color: feat.light ? 'rgba(8,58,82,.7)' : 'rgba(255,255,255,.75)', lineHeight: 1.6, marginBottom: '16px' }}>{feat.desc}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {feat.tags.map(tag => (
                    <span key={tag} style={{ background: feat.light ? 'rgba(8,58,82,.12)' : 'rgba(255,255,255,.15)', color: feat.light ? 'var(--teal-d)' : 'white', fontSize: '.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REPORTS ── */}
      <section className="section" id="reports" style={{ background: 'var(--teal-d)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg at 70% 50%, transparent 0deg, transparent 16deg, rgba(245,166,35,.05) 16deg, rgba(245,166,35,.05) 18deg, transparent 18deg)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header">
            <p className="eyebrow" style={{ color: '#FBBF4D' }}>{t('RECONCILIATION & SETTLEMENT','REKONSILIASYON AT SETTLEMENT')}</p>
            <h2 className="display display-lg" style={{ color: 'white', margin: '10px 0 14px' }}>
              {t('Know exactly where every peso landed','Malaman kung saan napunta ang bawat piso')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.55)' }}>
              {t('Three report types designed for Philippine merchant accounting and BSP compliance.','Tatlong uri ng ulat para sa accounting at pagsunod sa BSP.')}
            </p>
          </div>

          {/* Report tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[['pg', t('🏦 Recon by PG','🏦 Recon by PG')], ['mr', t('📋 Recon by Merchant Ref','📋 Recon by Merchant Ref')], ['st', t('💰 Settlement','💰 Settlement')]].map(([id, label]) => (
              <button key={id} onClick={() => setActiveReport(id)} style={{
                padding: '10px 22px', borderRadius: '8px', fontSize: '.84rem', fontWeight: 700, cursor: 'pointer', border: '1.5px solid',
                background: activeReport === id ? 'var(--amber)' : 'transparent',
                color: activeReport === id ? 'var(--teal-d)' : 'rgba(255,255,255,.6)',
                borderColor: activeReport === id ? 'var(--amber)' : 'rgba(255,255,255,.2)',
                transition: 'all .2s'
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(activeReport === 'pg' ? [
                { title: t('Per-channel breakdown','Breakdown bawat channel'), desc: t('Separate rows for GCash, Maya, Visa/MC, InstaPay, and OTC — match each peso to its gateway transaction ID.','Hiwalay na mga row para sa GCash, Maya, Visa/MC, InstaPay, at OTC.') },
                { title: t('Centavo-accurate','Tumpak hanggang sentimo'), desc: t('All amounts in PHP with exact centavo values — no rounding differences in your month-end close.','Lahat ng halaga sa PHP na may eksaktong sentimo.') },
                { title: t('Auto-download on schedule','Auto-download ayon sa iskedyul'), desc: t('Daily, weekly, or monthly email delivery. Or pull via API into your accounting system.','Araw-araw, lingguhanan, o buwanang email delivery.') },
                { title: t('MDR fee detail','Detalye ng MDR fee'), desc: t('Gross collected, MDR fee, VAT on MDR, and net — per transaction row.','Gross, MDR fee, VAT sa MDR, at net — bawat row.') },
              ] : activeReport === 'mr' ? [
                { title: t('Map to your own invoice numbers','I-map sa iyong sariling invoice numbers'), desc: t('Incoming payments matched to your internal order ID, OR number, or account code automatically.','Awtomatikong naitutugma sa iyong internal na order ID o account code.') },
                { title: t('BIR-aligned columns','Mga column na nakahanay sa BIR'), desc: t('Column format aligned to Philippine OR requirements for digital receipts.','Format ng column na nakahanay sa mga kinakailangan ng Philippine OR.') },
                { title: t('Unmatched transaction alerts','Mga alerto sa hindi naitugmang transaksyon'), desc: t('Any payment that cannot be matched is flagged separately for review.','Ang anumang bayad na hindi matugma ay hiwalay na nafi-flag para sa pagsusuri.') },
                { title: t('Export to ERP','I-export sa ERP'), desc: t('CSV and XLSX formats. API endpoint returns JSON for direct ERP journal entry posting.','CSV at XLSX na format. Nagbabalik ang API endpoint ng JSON para sa ERP.') },
              ] : [
                { title: t('Net vs gross per batch','Net vs gross bawat batch'), desc: t('Gross collected, fees deducted, and the exact net PHP amount credited to your bank.','Gross na nakolekta, mga bayad na ibinawas, at ang eksaktong net PHP na halaga.') },
                { title: t('T+1 settlement detail','Detalye ng T+1 settlement'), desc: t('See exactly which transactions made it into each bank credit.','Tingnan kung aling mga transaksyon ang napasama sa bawat bank credit.') },
                { title: t('VAT on fees breakdown','Breakdown ng VAT sa mga bayad'), desc: t('12% VAT on MDR fees shown separately — ready for BIR input tax credit.','12% VAT sa MDR fees na ipinapakita nang hiwalay — handa para sa BIR.') },
                { title: t('Monthly summary','Buwanang buod'), desc: t('Auto-generated monthly settlement summary for your finance team.','Awtomatikong nabubuong buwanang settlement summary para sa iyong finance team.') },
              ]).map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 800, color: 'var(--teal-d)', flexShrink: 0 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'white', marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock report table */}
            <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '.84rem', color: 'white' }}>Reconciliation Report</span>
                <span style={{ background: 'var(--amber)', color: 'var(--teal-d)', fontSize: '.68rem', fontWeight: 800, padding: '2px 10px', borderRadius: '20px' }}>by PG · Nov 2025</span>
              </div>
              <div style={{ padding: '0 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr .7fr .7fr .6fr .6fr', padding: '10px 0', fontSize: '.65rem', fontWeight: 700, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <span>Merchant Ref</span><span>Channel</span><span>Gross (₱)</span><span>MDR</span><span>Net (₱)</span>
                </div>
                {[
                  ['INV-20241','GCash','25,000.00','-550.00','24,450.00'],
                  ['INV-20242','Maya','50,000.00','-1,100.00','48,900.00'],
                  ['INV-20243','Visa','18,500.00','-370.00','18,130.00'],
                ].map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr .7fr .7fr .6fr .6fr', padding: '10px 0', fontSize: '.78rem', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                    <span style={{ color: 'white', fontWeight: 600 }}>{row[0]}</span>
                    <span style={{ color: 'rgba(255,255,255,.6)' }}>{row[1]}</span>
                    <span style={{ color: 'rgba(255,255,255,.6)' }}>{row[2]}</span>
                    <span style={{ color: '#FBBF4D' }}>{row[3]}</span>
                    <span style={{ color: '#6ee7b7', fontWeight: 700 }}>{row[4]}</span>
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr .7fr .7fr .6fr .6fr', padding: '12px 0', fontSize: '.78rem', borderTop: '1px solid rgba(255,255,255,.15)', fontWeight: 700 }}>
                  <span style={{ color: 'white' }}>{t('Total','Kabuuan')}</span><span></span>
                  <span style={{ color: 'white' }}>93,500.00</span>
                  <span style={{ color: '#FBBF4D' }}>-2,020.00</span>
                  <span style={{ color: '#6ee7b7' }}>91,480.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{t('GETTING STARTED','PAANO MAGSIMULA')}</p>
            <h2 className="display display-lg" style={{ color: 'var(--teal-d)', margin: '10px 0 14px' }}>
              {t('Up and collecting in one afternoon','Maaari nang mag-kolekta sa loob ng isang hapon')}
            </h2>
            <p>{t('No technical setup. No hardware. No long contracts. Sign up, verify your business, and send your first payment request today.','Walang teknikal na pag-setup. Walang hardware. Walang mahabang kontrata.')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
            {[
              { icon: '🏢', n: '01', title: t('Register your business','I-register ang iyong negosyo'), desc: t('Sign up with your SEC or DTI registration. BSP KYB completed in 1–2 business days.','Mag-sign up gamit ang iyong SEC o DTI registration. BSP KYB sa loob ng 1–2 araw ng negosyo.'), bg: '#0B4F6C' },
              { icon: '⚙️', n: '02', title: t('Set up your portal','I-set up ang iyong portal'), desc: t('Upload your logo, choose Tagalog or English, and link your settlement bank account.','I-upload ang iyong logo, pumili ng Tagalog o Ingles, at i-link ang iyong settlement bank account.'), bg: '#F5A623' },
              { icon: '📤', n: '03', title: t('Add your customers','Idagdag ang iyong mga customer'), desc: t('Import your customer list from Excel, or add them one by one. Tags, recurring schedules — all ready.','I-import ang iyong listahan ng customer mula sa Excel, o idagdag sila isa-isa.'), bg: '#1A8A5C' },
              { icon: '✅', n: '04', title: t('Collect and reconcile','Kolektahin at i-reconcile'), desc: t('Send requests, watch payments land in real time, download your daily recon report automatically.','Magpadala ng mga request, panoorin ang mga bayad na dumating sa real time.'), bg: '#1A7BA4' },
            ].map((step, i) => (
              <div key={step.n} style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 16px', boxShadow: `0 8px 24px ${step.bg}40` }}>{step.icon}</div>
                <div style={{ fontSize: '.68rem', fontWeight: 800, color: 'var(--amber)', letterSpacing: '1px', marginBottom: '8px' }}>STEP {step.n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1rem', color: 'var(--teal-d)', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '.82rem', color: 'var(--ink-m)', lineHeight: 1.6 }}>{step.desc}</p>
                {i < 3 && <div style={{ width: '40px', height: '2px', background: 'var(--amber)', margin: '20px auto 0', opacity: .4 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" id="pricing" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">{t('TRANSPARENT PRICING','MALINAW NA PRESYO')}</p>
            <h2 className="display display-lg" style={{ color: 'var(--teal-d)', margin: '10px 0 14px' }}>
              {t('Simple peso pricing — no surprises','Simpleng presyo sa piso — walang sorpresa')}
            </h2>
            <p>{t('No setup fees. No hidden charges. Pay only for what you use.','Walang setup fee. Walang nakatagong bayad. Magbayad lamang para sa iyong ginagamit.')}</p>
          </div>

          {/* Billing toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '40px' }}>
            <span style={{ fontSize: '.88rem', fontWeight: annual ? 600 : 800, color: annual ? 'var(--ink-l)' : 'var(--teal-d)' }}>{t('Monthly','Buwanan')}</span>
            <div onClick={() => setAnnual(!annual)} style={{ width: '44px', height: '24px', borderRadius: '100px', background: annual ? 'var(--teal)' : '#E4DFD5', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: annual ? '23px' : '3px', transition: 'left .2s', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
            </div>
            <span style={{ fontSize: '.88rem', fontWeight: annual ? 800 : 600, color: annual ? 'var(--teal-d)' : 'var(--ink-l)' }}>{t('Annual','Taunan')}</span>
            <span style={{ background: 'var(--amber)', color: 'var(--teal-d)', fontSize: '.72rem', fontWeight: 800, padding: '3px 12px', borderRadius: '20px' }}>{t('Save 20%','Makatipid ng 20%')}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {[
              {
                tier: 'Starter', featured: false,
                amount: annual ? prices.starter.annual : prices.starter.monthly,
                txn: t('+ 1.5% per transaction','+ 1.5% bawat transaksyon'),
                period: t('Up to 50 requests / month','Hanggang 50 requests / buwan'),
                features: [t('All payment channels','Lahat ng payment channels'), t('Payment links','Mga payment link'), t('Customer directory','Direktoryo ng customer'), t('Basic reports','Mga basic na ulat'), t('Email support','Email support')],
                cta: t('Start for free','Magsimula nang libre'), ctaStyle: 'outline'
              },
              {
                tier: 'Growth', featured: true,
                amount: annual ? prices.growth.annual : prices.growth.monthly,
                txn: t('+ 1.2% per transaction','+ 1.2% bawat transaksyon'),
                period: t('Up to 500 requests / month','Hanggang 500 requests / buwan'),
                features: [t('Everything in Starter','Lahat ng nasa Starter'), t('Bulk upload (5,000 rows)','Bulk upload (5,000 rows)'), t('Recurring schedules','Recurring schedules'), t('Recon & settlement reports','Recon at settlement reports'), t('Webhook events','Webhook events'), t('Priority support','Priority support')],
                cta: t('Start free trial','Simulan ang libreng trial'), ctaStyle: 'amber'
              },
              {
                tier: 'Scale', featured: false,
                amount: annual ? prices.scale.annual : prices.scale.monthly,
                txn: t('+ 0.9% per transaction','+ 0.9% bawat transaksyon'),
                period: t('Unlimited requests','Walang limitasyong requests'),
                features: [t('Everything in Growth','Lahat ng nasa Growth'), t('Full API access (18 endpoints)','Full API access (18 endpoints)'), t('Team accounts (up to 10)','Team accounts (hanggang 10)'), t('White-label payment pages','White-label payment pages'), t('Dedicated account manager','Dedicated account manager'), t('SLA 99.9% uptime','SLA 99.9% uptime')],
                cta: t('Contact sales','Makipag-ugnayan'), ctaStyle: 'primary'
              },
            ].map(plan => (
              <div key={plan.tier} style={{
                background: plan.featured ? 'var(--teal-d)' : 'white',
                borderRadius: '20px', padding: '32px',
                border: plan.featured ? 'none' : '1.5px solid #E4DFD5',
                boxShadow: plan.featured ? '0 20px 60px rgba(11,79,108,.3)' : '0 2px 8px rgba(11,79,108,.06)',
                position: 'relative', transform: plan.featured ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform .2s, box-shadow .2s'
              }}>
                {plan.featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--amber)', color: 'var(--teal-d)', fontSize: '.72rem', fontWeight: 800, padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⭐ {t('Most Popular','Pinaka-Popular')}</div>}
                <div style={{ fontWeight: 800, fontSize: '.84rem', color: plan.featured ? 'rgba(255,255,255,.6)' : 'var(--ink-l)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{plan.tier}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '.9rem', color: plan.featured ? 'rgba(255,255,255,.7)' : 'var(--ink-l)' }}>₱</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '2.8rem', color: plan.featured ? 'white' : 'var(--teal-d)', letterSpacing: '-2px' }}>{plan.amount.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '.78rem', color: plan.featured ? 'var(--amber-l)' : 'var(--ink-m)', marginBottom: '4px', fontWeight: 600 }}>{plan.txn}</div>
                <div style={{ fontSize: '.75rem', color: plan.featured ? 'rgba(255,255,255,.45)' : 'var(--ink-l)', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${plan.featured ? 'rgba(255,255,255,.1)' : '#E4DFD5'}` }}>{plan.period}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '.82rem', color: plan.featured ? 'rgba(255,255,255,.8)' : 'var(--ink-m)' }}>
                      <span style={{ color: plan.featured ? 'var(--amber-l)' : 'var(--green)', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%', padding: '13px', borderRadius: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: '.9rem', cursor: 'pointer', transition: 'all .2s',
                    border: plan.ctaStyle === 'outline' ? `2px solid ${plan.featured ? 'rgba(255,255,255,.3)' : 'var(--teal)'}` : 'none',
                    background: plan.ctaStyle === 'amber' ? 'var(--amber)' : plan.ctaStyle === 'primary' ? 'var(--teal-l)' : 'transparent',
                    color: plan.ctaStyle === 'amber' ? 'var(--teal-d)' : plan.featured ? 'white' : 'var(--teal)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: 'var(--amber)', padding: '80px 5%', textAlign: 'center' }}>
        <p style={{ fontSize: '.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--teal-d)', opacity: .6, marginBottom: '12px' }}>
          {t('START TODAY','MAGSIMULA NGAYON')}
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--teal-d)', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1 }}>
          {t('Ready to collect every peso?','Handa ka nang kolektahin ang bawat piso?')}
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--teal-d)', opacity: .7, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
          {t('Join 8,400+ Philippine merchants already using PayCollect. Free to start, no setup fees.','Sumali sa 8,400+ Philippine merchants na gumagamit na ng PayCollect. Libre magsimula.')}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="lp-btn lp-btn-primary lp-btn-xl" onClick={() => navigate('/login')}>
            {t('Create free account →','Gumawa ng libreng account →')}
          </button>
          <button className="lp-btn lp-btn-outline lp-btn-xl" onClick={() => navigate('/login')} style={{ border: '2px solid var(--teal-d)', color: 'var(--teal-d)' }}>
            {t('Talk to sales','Kausapin ang sales')}
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--teal-d)', color: 'rgba(255,255,255,.55)', padding: '64px 5% 32px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--teal-l)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 900, color: 'var(--amber)', fontSize: '1rem' }}>P</div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Pay<span style={{ color: 'var(--amber)' }}>Collect</span></span>
              </div>
              <p style={{ fontSize: '.82rem', lineHeight: 1.7, marginBottom: '16px', maxWidth: '240px' }}>
                {t('The payment collection platform built for the Philippines. BSP-licensed. T+1 settlement.','Ang payment collection platform na ginawa para sa Pilipinas. BSP-lisensyado. T+1 settlement.')}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['BSP Licensed','PCI DSS'].map(badge => (
                  <span key={badge} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '.65rem', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>{badge}</span>
                ))}
              </div>
            </div>
            {/* Links */}
            {[
              { title: t('Product','Produkto'), links: [t('Features','Mga Feature'), t('Pricing','Presyo'), t('API Docs','API Docs'), t('Changelog','Changelog')] },
              { title: t('Company','Kumpanya'), links: [t('About','Tungkol sa amin'), t('Blog','Blog'), t('Careers','Mga trabaho'), t('Contact','Makipag-ugnayan')] },
              { title: t('Legal','Legal'), links: ['Privacy Policy','Terms of Service','Cookie Policy','BSP License'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.35)', marginBottom: '16px' }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.55)', marginBottom: '10px', cursor: 'pointer', transition: 'color .18s' }}
                    onMouseEnter={e => e.target.style.color='white'}
                    onMouseLeave={e => e.target.style.color='rgba(255,255,255,.55)'}
                  >{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '.78rem' }}>© 2026 PayCollect Technologies Inc. · Philippines · All rights reserved.</div>
            <div style={{ fontSize: '.78rem' }}>{t('Made with ❤️ for Filipino merchants','Ginawa nang may ❤️ para sa mga negosyanteng Pilipino')}</div>
          </div>
        </div>
      </footer>
    </>
  )
}
