"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from './BackButton';
import { translations } from '../utils/translations';

export default function TopHeader() {
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            zIndex: 100,
            boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
            flexDirection: isRtl ? 'row-reverse' : 'row'
        }}>
            {/* Bouton Retour */}
            <BackButton />

            {/* Logo Central */}
            <span className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff4757' }}>
                Fast Match
            </span>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                {/* Profile Quick Link */}
                <Link href="/profile" style={{ textDecoration: 'none', fontSize: '1.4rem' }} title={t['tooltip_profile']}>
                    👤
                </Link>

                {/* Wallet */}
                <Link href="/wallet" style={{ textDecoration: 'none', fontSize: '1.4rem' }} title={t['tooltip_wallet']}>
                    💰
                </Link>

                {/* Assistance */}
                <Link href="/assistant" style={{ textDecoration: 'none', fontSize: '1.4rem' }} title={t['tooltip_assistant']}>
                    🤖
                </Link>

                {/* Paramètres */}
                <Link href="/settings" style={{ textDecoration: 'none', fontSize: '1.4rem' }} title={t['tooltip_settings']}>
                    ⚙️
                </Link>
            </div>
        </header>
    );
}
