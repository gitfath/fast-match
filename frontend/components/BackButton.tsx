"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BackButton({ color = 'var(--text-main)', style = {} }: { color?: string, style?: React.CSSProperties }) {
    const router = useRouter();
    const [isRtl, setIsRtl] = useState(false);

    useEffect(() => {
        const lang = localStorage.getItem('app_language');
        setIsRtl(lang === 'العربية');
    }, []);

    return (
        <button
            onClick={() => router.back()}
            style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                transform: isRtl ? 'scaleX(-1)' : 'none',
                ...style
            }}
            aria-label="Retour"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
