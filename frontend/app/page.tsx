"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from '../utils/translations';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [language, setLanguage] = useState('Français');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const savedLang = localStorage.getItem('app_language');
    if (savedLang) setLanguage(savedLang);

    setLoading(false);
  }, []);

  const t = translations[language] || translations['Français'];

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.refresh();
  };

  if (loading) return null;

  return (
    <main style={{
      width: '100%',
      minHeight: '100vh',
      background: 'transparent',
      color: '#333',
      overflowX: 'hidden',
      direction: language === 'العربية' ? 'rtl' : 'ltr'
    }}>

      {/* HERO SECTION (Full Screen) */}
      <div style={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: 'white',
        overflow: 'hidden',
        background: `url('/images/background-v2.png') center/cover no-repeat`
      }}>
        {/* Background Override for Hero */}

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%)'
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative', zIndex: 10,
          padding: '20px 30px 40px',
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center'
        }}>
          {/* Logo & Tagline */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '70px', height: '70px', borderRadius: '25px',
              background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
              boxShadow: '0 10px 30px rgba(255, 71, 87, 0.5)',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '2.5rem' }}>🔥</span>
            </div>
            <h1 className="font-heading" style={{
              fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '5px',
              letterSpacing: '-1px'
            }}>
              Fast Match.
            </h1>
            <p style={{ fontSize: '1.3rem', fontWeight: 300, opacity: 0.9 }}>
              {t['hero_tagline']}
            </p>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              onClick={() => router.push('/signup')}
              style={{
                width: '100%', padding: '18px', borderRadius: '100px', border: 'none',
                background: 'linear-gradient(to right, #ff6b6b, #ff4757)',
                color: 'white', fontSize: '1.2rem', fontWeight: 800,
                boxShadow: '0 10px 25px rgba(255, 71, 87, 0.3)',
                cursor: 'pointer'
              }}
            >
              {t['join_now']}
            </button>

            <button
              onClick={() => router.push('/login')}
              style={{
                width: '100%', padding: '16px', borderRadius: '100px',
                border: '2px solid rgba(255,255,255,0.4)',
                background: 'transparent',
                color: 'white', fontSize: '1rem', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t['login']}
            </button>

          </div>

          {/* Social Logins */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', marginBottom: '30px' }}>
            <SocialButton icon="G" label="Google" color="white" textColor="#333" onClick={() => alert("Google Login")} />
            <SocialButton icon="" label="Apple" color="white" textColor="#333" onClick={() => alert("Apple Login")} />
            <SocialButton icon="📞" label="Phone" color="white" textColor="#333" onClick={() => alert("Phone Login")} />
          </div>

          {/* Scroll Indicator */}
          <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            {t['discover_more']}
          </div>
        </div>
      </div>

      {/* MARKETING SCROLL SECTION */}
      <div style={{ padding: '60px 20px 100px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>

        {/* Section 1: Authenticity */}
        <div style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '15px' }}>
            {t['authentic_title']}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            {t['authentic_text']}
          </p>
        </div>

        {/* Section 2: Compatibility */}
        <div style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '15px' }}>
            {t['match_title']}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            {t['match_text']}
          </p>
        </div>

        {/* Section 3: Social Proof */}
        <div style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌍</div>
          <h2 className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '15px' }}>
            {t['community_title']}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            {t['community_text']}
          </p>
        </div>

        {/* Bottom CTA */}
        <div style={{ margin: '40px 0' }}>
          <button
            onClick={() => router.push('/signup')}
            style={{
              padding: '20px 40px', borderRadius: '100px', border: 'none',
              background: 'linear-gradient(to right, #ff6b6b, #ff4757)',
              color: 'white', fontSize: '1.3rem', fontWeight: 800,
              boxShadow: '0 15px 35px rgba(255, 71, 87, 0.4)',
              cursor: 'pointer'
            }}
          >
            {t['join_now']}
          </button>
        </div>

        {/* Legal Footer */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '40px', marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.8rem', color: '#999', flexWrap: 'wrap' }}>
            <Link href="/legal/mentions-legales" style={{ textDecoration: 'none', color: '#999' }}>{t['legal_mentions']}</Link>
            <Link href="/legal/cgu" style={{ textDecoration: 'none', color: '#999' }}>{t['terms_conditions']}</Link>
            <Link href="/legal/confidentialite" style={{ textDecoration: 'none', color: '#999' }}>{t['privacy_policy']}</Link>
            <Link href="/legal/securite" style={{ textDecoration: 'none', color: '#999' }}>{t['security']}</Link>
            <Link href="/legal/aide" style={{ textDecoration: 'none', color: '#999' }}>{t['help']}</Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#ccc' }}>
            © 2026 Fast Match. {t['rights_reserved']}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}

const SocialButton = ({ icon, label, color, textColor, onClick }: any) => (
  <button
    onClick={onClick}
    style={{
      width: '50px', height: '50px', borderRadius: '50%', border: 'none',
      background: color, color: textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.4rem', cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s'
    }}
    title={label}
  >
    {icon}
  </button>
);
