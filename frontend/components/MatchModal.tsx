"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface MatchModalProps {
    userName: string;
    myImage: string;
    matchImage: string;
    matchId: string;
    onClose: () => void;
}

export default function MatchModal({ userName, myImage, matchImage, matchId, onClose }: MatchModalProps) {
    const router = useRouter();

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            textAlign: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>
            <div style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#ff4757', // Primary color
                textTransform: 'uppercase',
                marginBottom: '1rem'
            }}>🎉 Nouveau Match !</div>

            <h1 className="font-heading" style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                color: '#333',
                marginBottom: '1rem',
                lineHeight: 1
            }}>Félicitations !</h1>

            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '300px' }}>
                Vous et <strong>{userName}</strong> avez matché ! C'est le début de quelque chose de nouveau.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem', position: 'relative' }}>
                {/* My Photo */}
                <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    border: '6px solid white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    background: '#eee',
                    transform: 'translateX(15px) rotate(-8deg)',
                    zIndex: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <img src={myImage || 'https://via.placeholder.com/150'} alt="me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Match Photo */}
                <div style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    border: '6px solid white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    background: '#eee',
                    transform: 'translateX(-15px) rotate(8deg)',
                    zIndex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <img src={matchImage || 'https://via.placeholder.com/150'} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Heart Icon Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    fontSize: '2.5rem',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
                    zIndex: 3
                }}>
                    💖
                </div>
            </div>

            <button
                onClick={() => router.push(`/chat/${matchId}`)}
                className="btn btn-primary"
                style={{
                    width: '100%', maxWidth: '320px',
                    padding: '18px', borderRadius: '100px',
                    fontSize: '1.1rem', fontWeight: 700,
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #ff6b6b, #ff4757)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(255, 71, 87, 0.4)'
                }}
            >
                Envoyer un message
            </button>

            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#999',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '10px'
                }}
            >
                Continuer à swiper
            </button>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
