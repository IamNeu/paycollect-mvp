import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPageUS() {
  const navigate = useNavigate()
  const [lang, setLang] = useState('en')
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(-1)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (en, es) => (lang === 'en' ? en : es)

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF8F3; color: #1C1C1E; line-height: 1.6; overflow-x: hidden; }
        :root {
          --navy: #0f3460; --navy-d: #0a2545; --red: #e94560;
          --amber: #f5a623; --amber-d: #d4881a;
          --cream: #FAF8F3; --ink-m: #4A4A52; --border: #E4DFD5;
        }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .lp-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700;
          font-size: .875rem; padding: 12px 24px; border-radius: 10px;
          cursor: pointer; border: none; transition: all .2s ease; white-space: nowrap;
        }
        .lp-btn-navy { background: var(--navy); color: white; }
        .lp-btn-navy:hover { background: var(--navy-d); transform: translateY(-1px); }
        .lp-btn-red { background: var(--red); color: white; box-shadow: 0 4px 16px rgba(233,69,96,.35); }
        .lp-btn-red:hover { opacity: .92; transform: translateY(-1px); }
        .lp-btn-amber { background: var(--amber); color: var(--navy); font-weight: 800; }
        .lp-btn-amber:hover { background: var(--amber-d); transform: translateY(-1px); }
        .lp-btn-outline { background: transparent; color: var(--navy); border: 2px solid var(--navy); }
        .lp-btn-outline:hover { background: var(--navy); color: white; }
        .lp-btn-ghost { background: rgba(255,255,255,.12); color: white; border: 1.5px solid rgba(255,255,255,.25); }
        .lp-btn-ghost:hover { background: rgba(255,255,255,.2); }
        .lp-btn-xl { padding: 16px 32px; font-size: 1rem; border-radius: 12px; }
        .container { max-width: 1140px; margin: 0 auto; padding: 0 5%; }
        .section { padding: 88px 0; }
        .eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--amber); }
        .display { font-family: 'Playfair Display', serif; font-weight: 900; line-height: 1.1; letter-spacing: -1px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '70px', padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,.97)' : 'rgba(255,255,255,.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #E4DFD5' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(15,52,96,.08)' : 'none',
        transition: 'all .3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
          <div style={{ width: '38px', height: '38px', background: '#e94560', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>P</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.15rem', color: '#0f3460' }}>
            Pay<span style={{ color: '#f5a623' }}>Collect</span>
          </span>
        </div>

        <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none' }}>
          {[['Features', '#features'], ['Pricing', '#pricing'], ['How it works', '#how-it-works']].map(([label, href]) => (
            <li key={label}>
              <a href={href} style={{ fontSize: '.85rem', fontWeight: 600, color: '#4A4A52', textDecoration: 'none' }}>{t(label, label === 'Features' ? 'Funciones' : label === 'Pricing' ? 'Precios' : 'Cómo funciona')}</a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: '#F0ECE3', borderRadius: '100px', padding: '3px', border: '1.5px solid #E4DFD5' }}>
            {['EN', 'ES'].map((l) => (
              <button key={l} type="button" onClick={() => setLang(l === 'EN' ? 'en' : 'es')} style={{
                padding: '5px 14px', borderRadius: '100px', fontSize: '.73rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                background: (lang === 'en' && l === 'EN') || (lang === 'es' && l === 'ES') ? '#0f3460' : 'transparent',
                color: (lang === 'en' && l === 'EN') || (lang === 'es' && l === 'ES') ? '#fff' : '#8A8A96',
              }}>{l}</button>
            ))}
          </div>
          <button type="button" className="lp-btn lp-btn-outline" onClick={() => navigate('/signin')} style={{ padding: '8px 18px' }}>
            {t('Log in', 'Iniciar sesión')}
          </button>
          <button type="button" className="lp-btn lp-btn-red" onClick={() => navigate('/signup')} style={{ padding: '8px 18px' }}>
            {t('Get Started', 'Comenzar')}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '110px 5% 80px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a2545 0%, #0f3460 50%, #0d2545 100%)',
      }}>
        <div style={{ position: 'absolute', width: '480px', height: '480px', background: '#1a5ca8', top: '-120px', right: '5%', borderRadius: '50%', filter: 'blur(80px)', opacity: .3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '280px', height: '280px', background: '#f5a623', bottom: '10%', left: '10%', borderRadius: '50%', filter: 'blur(60px)', opacity: .12, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center', maxWidth: '1140px', margin: '0 auto', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,166,35,.15)', border: '1px solid rgba(245,166,35,.3)', borderRadius: '100px', padding: '6px 16px', fontSize: '.75rem', fontWeight: 700, color: '#f5a623', marginBottom: '24px' }}>
              🇺🇸 {t('Built for US businesses', 'Para negocios en EE.UU.')}
            </div>
            <h1 className="display" style={{ fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', color: '#fff', marginBottom: '20px' }}>
              {t(<>Collect every <em style={{ fontStyle: 'italic', color: '#f5a623' }}>dollar</em> —<br />on time.</>, <>Cobra cada <em style={{ fontStyle: 'italic', color: '#f5a623' }}>dólar</em> —<br />a tiempo.</>)}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '460px' }}>
              {t('Send payment requests, track collections, and reconcile — all in one place. Stripe, PayPal, ACH, and more.', 'Envía solicitudes de pago, rastrea cobros y concilia — todo en un solo lugar.')}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" className="lp-btn lp-btn-red lp-btn-xl" onClick={() => navigate('/signup')}>
                {t('Start Free Trial →', 'Prueba gratis →')}
              </button>
              <button type="button" className="lp-btn lp-btn-ghost lp-btn-xl" onClick={() => navigate('/signup')}>
                {t('Watch Demo', 'Ver demo')}
              </button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div style={{ position: 'relative', animation: 'floatY 4s ease-in-out infinite' }}>
            <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,.35)', overflow: 'hidden', transform: 'perspective(1200px) rotateY(-5deg) rotateX(2deg)' }}>
              <div style={{ background: 'linear-gradient(90deg, #0f3460, #1a5ca8)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                <span style={{ color: '#f5a623', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.85rem', marginLeft: '6px' }}>PayCollect</span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
                  {[
                    { num: '$48,250', lbl: 'Collected', hero: true },
                    { num: '$6,120', lbl: 'Outstanding', hero: false },
                    { num: '98%', lbl: 'Rate', hero: false },
                  ].map((s) => (
                    <div key={s.lbl} style={{ background: s.hero ? 'linear-gradient(135deg, #0f3460, #0a2545)' : '#f8f9fa', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '.95rem', color: s.hero ? '#f5a623' : '#0f3460' }}>{s.num}</div>
                      <div style={{ fontSize: '.58rem', color: s.hero ? 'rgba(255,255,255,.5)' : '#888', fontWeight: 600 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                {[
                  { name: 'Acme Corp', amt: '$2,450.00', status: 'Paid' },
                  { name: 'Brightline LLC', amt: '$980.00', status: 'Pending' },
                  { name: 'Nova Retail', amt: '$1,200.00', status: 'Paid' },
                ].map((r) => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', fontSize: '.72rem', borderBottom: '1px solid #f0f2f7' }}>
                    <span style={{ flex: 1.5, fontWeight: 600 }}>{r.name}</span>
                    <span style={{ flex: 1, fontWeight: 700 }}>{r.amt}</span>
                    <span style={{ background: r.status === 'Paid' ? '#d1fae5' : '#fef3c7', color: r.status === 'Paid' ? '#065f46' : '#92400e', fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-14px', right: '-20px', background: '#fff', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 12px 40px rgba(0,0,0,.2)', fontSize: '.75rem', border: '1px solid #E4DFD5' }}>
              <div style={{ fontWeight: 800, color: '#0f3460' }}>$2,450.00</div>
              <div style={{ fontSize: '.6rem', color: '#888' }}>{t('Payment received', 'Pago recibido')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: '#f5a623', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '60px', animation: 'ticker 22s linear infinite', width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            [
              { num: '8,400+', lbl: t('US merchants', 'comerciantes en EE.UU.') },
              { num: '$2B+', lbl: t('collected monthly', 'cobrado mensualmente') },
              { num: '98%', lbl: t('collection rate', 'tasa de cobro') },
            ].map((item, i) => (
              <div key={`${rep}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '40px', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '1.2rem', color: '#0f3460' }}>{item.num}</div>
                  <div style={{ fontSize: '.72rem', color: '#0f3460', opacity: .75 }}>{item.lbl}</div>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'rgba(15,52,96,.2)' }} />
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ── PAYMENT CHANNELS ── */}
      <section className="section" id="channels" style={{ background: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow">{t('PAYMENT CHANNELS', 'CANALES DE PAGO')}</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0f3460', margin: '12px 0 16px' }}>
            {t('Every way Americans pay', 'Todas las formas de pago en EE.UU.')}
          </h2>
          <p style={{ color: '#4A4A52', maxWidth: '520px', margin: '0 auto 40px', fontSize: '.95rem' }}>
            {t('Accept payments through the channels your customers already use.', 'Acepta pagos por los canales que tus clientes ya usan.')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { icon: '⚡', name: 'Stripe', color: '#635bff' },
              { icon: '🅿️', name: 'PayPal', color: '#003087' },
              { icon: '🏦', name: 'ACH', color: '#0f3460' },
              { icon: '', name: 'Apple Pay', color: '#000' },
              { icon: 'G', name: 'Google Pay', color: '#4285F4' },
            ].map((ch) => (
              <div key={ch.name} style={{ width: '140px', padding: '20px 16px', background: '#f8f9fa', border: '1.5px solid #E4DFD5', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: ch.name === 'Google Pay' ? 800 : 400 }}>{ch.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.88rem', color: ch.color }}>{ch.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how-it-works" style={{ background: '#FAF8F3' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow">{t('HOW IT WORKS', 'CÓMO FUNCIONA')}</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0f3460', marginTop: '12px' }}>
              {t('Up and collecting in one afternoon', 'Cobrando en una tarde')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { icon: '🏢', n: '01', title: t('Create account', 'Crea tu cuenta'), desc: t('Sign up in minutes with your business email.', 'Regístrate en minutos con tu email empresarial.') },
              { icon: '🔗', n: '02', title: t('Connect Stripe', 'Conecta Stripe'), desc: t('Link your payment processor securely.', 'Vincula tu procesador de pagos de forma segura.') },
              { icon: '📤', n: '03', title: t('Send requests', 'Envía solicitudes'), desc: t('Email or SMS payment links to customers.', 'Enlaces de pago por email o SMS.') },
              { icon: '✅', n: '04', title: t('Get paid', 'Cobra'), desc: t('Track payments and reconcile in real time.', 'Rastrea pagos y concilia en tiempo real.') },
            ].map((step) => (
              <div key={step.n} style={{ textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#0f3460', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 14px' }}>{step.icon}</div>
                <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#f5a623', letterSpacing: '1px', marginBottom: '8px' }}>STEP {step.n}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f3460', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '.82rem', color: '#4A4A52', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" id="features" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow">{t('FEATURES', 'FUNCIONES')}</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0f3460', marginTop: '12px' }}>
              {t('Everything you need to collect', 'Todo lo que necesitas para cobrar')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '💸', title: t('Payment Requests', 'Solicitudes de pago'), desc: t('One-time or recurring requests with auto-reminders.', 'Solicitudes únicas o recurrentes con recordatorios.') },
              { icon: '📊', title: t('Real-time Dashboard', 'Panel en tiempo real'), desc: t('Track volume, pending requests, and active customers.', 'Rastrea volumen, pendientes y clientes activos.') },
              { icon: '👥', title: t('Customer Directory', 'Directorio de clientes'), desc: t('Full payment history and lifetime stats per customer.', 'Historial completo y estadísticas por cliente.') },
              { icon: '📋', title: t('Bulk Operations', 'Operaciones masivas'), desc: t('Upload thousands of requests from CSV or Excel.', 'Sube miles de solicitudes desde CSV o Excel.') },
              { icon: '🔗', title: t('API & Webhooks', 'API y Webhooks'), desc: t('Integrate with your ERP and accounting stack.', 'Integra con tu ERP y contabilidad.') },
              { icon: '🔒', title: t('PCI Compliant', 'Cumple PCI'), desc: t('Bank-grade security with Stripe-powered payments.', 'Seguridad bancaria con pagos vía Stripe.') },
            ].map((f) => (
              <div key={f.title} style={{ background: '#f8f9fa', border: '1.5px solid #E4DFD5', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f3460', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '.84rem', color: '#4A4A52', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" id="pricing" style={{ background: '#FAF8F3' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <p className="eyebrow">{t('PRICING', 'PRECIOS')}</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0f3460', margin: '12px 0 40px' }}>
            {t('Simple, transparent pricing', 'Precios simples y transparentes')}
          </h2>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '40px', border: '2px solid #0f3460', boxShadow: '0 20px 60px rgba(15,52,96,.12)' }}>
            <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>PayCollect Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '3rem', color: '#0f3460' }}>$10</span>
              <span style={{ color: '#888', fontWeight: 600 }}>/month</span>
            </div>
            <div style={{ background: '#fef3c7', color: '#92400e', fontSize: '.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '24px' }}>
              {t('7-day free trial', 'Prueba gratis de 7 días')}
            </div>
            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '28px' }}>
              {[t('Unlimited payment requests', 'Solicitudes ilimitadas'), t('Stripe & PayPal integration', 'Integración Stripe y PayPal'), t('Customer directory', 'Directorio de clientes'), t('Real-time dashboard', 'Panel en tiempo real'), t('Email support', 'Soporte por email')].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', fontSize: '.88rem', color: '#4A4A52' }}>
                  <span style={{ color: '#e94560', fontWeight: 800 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <button type="button" className="lp-btn lp-btn-red" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} onClick={() => navigate('/signup')}>
              {t('Start Free Trial', 'Comenzar prueba gratis')}
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow">{t('TESTIMONIALS', 'TESTIMONIOS')}</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#0f3460', marginTop: '12px' }}>
              {t('Trusted by US merchants', 'Confianza de comerciantes en EE.UU.')}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { quote: t('"PayCollect cut our collection time in half. The dashboard is exactly what we needed."', '"PayCollect redujo nuestro tiempo de cobro a la mitad."'), name: 'Sarah Jenkins', role: 'CFO, Brightline Media', init: 'SJ' },
              { quote: t('"Setup took 10 minutes. We were sending payment links the same day."', '"La configuración tomó 10 minutos. Enviamos enlaces el mismo día."'), name: 'Marcus Wu', role: 'Owner, Wu Consulting', init: 'MW' },
              { quote: t('"Finally a tool built for how small businesses actually collect payments."', '"Por fin una herramienta para cómo cobran las pequeñas empresas."'), name: 'Janice Thompson', role: 'Director, Acme Corp', init: 'JT' },
            ].map((item) => (
              <div key={item.name} style={{ background: '#f8f9fa', borderRadius: '16px', padding: '28px', border: '1.5px solid #E4DFD5' }}>
                <p style={{ fontSize: '.9rem', color: '#4A4A52', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>{item.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0f3460', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.75rem' }}>{item.init}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.88rem', color: '#0f3460' }}>{item.name}</div>
                    <div style={{ fontSize: '.75rem', color: '#888' }}>{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" id="faq" style={{ background: '#FAF8F3' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow">FAQ</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#0f3460', marginTop: '12px' }}>
              {t('Frequently asked questions', 'Preguntas frecuentes')}
            </h2>
          </div>
          {[
            { q: t('How does the 7-day free trial work?', '¿Cómo funciona la prueba gratis de 7 días?'), a: t('Sign up with a card — you won\'t be charged until day 8. Cancel anytime before then.', 'Regístrate con tarjeta — no se cobra hasta el día 8. Cancela antes si quieres.') },
            { q: t('Which payment methods can I accept?', '¿Qué métodos de pago puedo aceptar?'), a: t('Stripe, PayPal, ACH bank transfers, Apple Pay, and Google Pay through your connected processor.', 'Stripe, PayPal, transferencias ACH, Apple Pay y Google Pay.') },
            { q: t('Is PayCollect PCI compliant?', '¿PayCollect cumple con PCI?'), a: t('Yes. All card data is handled by Stripe — we never store raw card numbers on our servers.', 'Sí. Los datos de tarjeta los maneja Stripe — no almacenamos números de tarjeta.') },
            { q: t('Can I cancel anytime?', '¿Puedo cancelar en cualquier momento?'), a: t('Absolutely. No contracts, no cancellation fees. Manage your subscription from Settings.', 'Por supuesto. Sin contratos ni cargos por cancelación.') },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', marginBottom: '10px', border: '1.5px solid #E4DFD5', overflow: 'hidden' }}>
              <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', fontWeight: 700, fontSize: '.92rem', color: '#0f3460' }}>
                {item.q}
                <span style={{ color: '#e94560', fontSize: '1.2rem' }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 18px', fontSize: '.88rem', color: '#4A4A52', lineHeight: 1.7 }}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0f3460', padding: '80px 5%', textAlign: 'center' }}>
        <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '16px' }}>
          {t('Start collecting today', 'Empieza a cobrar hoy')}
        </h2>
        <p style={{ color: 'rgba(255,255,255,.65)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
          {t('Join 8,400+ merchants already using PayCollect. Free to start.', 'Únete a más de 8,400 comerciantes. Gratis para empezar.')}
        </p>
        <button type="button" className="lp-btn lp-btn-amber lp-btn-xl" onClick={() => navigate('/signup')}>
          {t('Get Started Free →', 'Comenzar gratis →')}
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0a2545', color: 'rgba(255,255,255,.55)', padding: '64px 5% 32px' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: '#e94560', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>P</div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Pay<span style={{ color: '#f5a623' }}>Collect</span></span>
              </div>
              <p style={{ fontSize: '.82rem', lineHeight: 1.7, maxWidth: '240px' }}>
                {t('The payment collection platform built for US businesses.', 'La plataforma de cobros para negocios en EE.UU.')}
              </p>
            </div>
            {[
              { title: t('Product', 'Producto'), links: [['Features', '#features'], ['Pricing', '#pricing'], ['How it works', '#how-it-works']] },
              { title: t('Company', 'Empresa'), links: [['About', '#'], ['Blog', '#'], ['Careers', '#']] },
              { title: t('Legal', 'Legal'), links: [['Cancellation', '/cancellation'], ['Privacy', '/privacy'], ['Terms', '/tos'], ['Support', '/support']] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.35)', marginBottom: '16px' }}>{col.title}</div>
                {col.links.map(([label, href]) => (
                  <div
                    key={label}
                    onClick={() => href.startsWith('/') ? navigate(href) : window.location.hash = href}
                    style={{ fontSize: '.84rem', marginBottom: '10px', cursor: 'pointer', color: 'rgba(255,255,255,.55)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.55)' }}
                  >{label}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '24px', fontSize: '.78rem', textAlign: 'center' }}>
            © 2026 PayCollect Technologies Inc. · United States · All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
