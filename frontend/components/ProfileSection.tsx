"use client";
import React, { useState } from 'react';

interface ProfileSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function ProfileSection({ title, icon, children, defaultOpen = false }: ProfileSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="premium-card" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-main)'
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                    {title}
                </span>
                <span style={{
                    fontSize: '1.5rem',
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div style={{
                    padding: '0 1.2rem 1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}
