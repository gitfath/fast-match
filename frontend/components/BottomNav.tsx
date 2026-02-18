"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations } from '../utils/translations';
import { useState, useEffect } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];

    const navItems = [
        { label: t['nav_home'], href: '/', icon: '🏠' },
        { label: t['nav_swipe'], href: '/feed', icon: '🔥' },
        { label: t['nav_discover'], href: '/discover', icon: '🌍' },
        { label: t['nav_chat'], href: '/chat', icon: '💬' },
        { label: t['nav_profile'], href: '/profile', icon: '👤' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: '24px',
            width: '92%',
            maxWidth: '440px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '100px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            zIndex: 1000,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            padding: isActive ? '10px 18px' : '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            borderRadius: '100px',
                            background: isActive ? 'var(--gradient-primary)' : 'transparent',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            boxShadow: isActive ? '0 8px 20px var(--primary-glow)' : 'none'
                        }}
                    >
                        <span style={{
                            fontSize: '1.4rem',
                            transform: isActive ? 'scale(1)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            opacity: isActive ? 1 : 0.6
                        }}>
                            {item.icon}
                        </span>
                        {isActive && (
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: 'white',
                                letterSpacing: '-0.01em'
                            }}>
                                {item.label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
