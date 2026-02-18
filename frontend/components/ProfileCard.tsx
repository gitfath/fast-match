import React, { useState } from 'react';
import { BACKEND_URL } from '../app/config';

interface ProfileCardProps {
    profile: any;
    mode: 'card' | 'full'; // 'card' pour le deck, 'full' pour la vue détaillée
    onClose?: () => void;
    onLike?: () => void;
    onPass?: () => void;
    onSuperLike?: () => void;
}

export default function ProfileCard({ profile, mode, onClose, onLike, onPass, onSuperLike }: ProfileCardProps) {
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const photos = profile.photos && profile.photos.length > 0
        ? profile.photos.map((p: any) => {
            let url = typeof p === 'string' ? p : p.url;
            if (!url) return '';

            // Fix stale absolute URLs (e.g. from localhost on a mobile device)
            if (url.includes('/uploads/')) {
                const fileName = url.split('/uploads/')[1];
                return `${BACKEND_URL}/uploads/${fileName}`;
            }

            if (url.startsWith('http')) return url;
            if (url.startsWith('uploads')) return `${BACKEND_URL}/${url.startsWith('/') ? '' : '/'}${url}`;
            if (url.startsWith('/')) return `${BACKEND_URL}${url}`;
            return `${BACKEND_URL}/${url}`;
        }).filter((url: string) => url !== '')
        : ['https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=500'];

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhoto < photos.length - 1) setCurrentPhoto(prev => prev + 1);
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentPhoto > 0) setCurrentPhoto(prev => prev - 1);
    };

    const renderInterests = () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {profile.interests?.map((i: any) => (
                <span key={i.id || i.name || i} style={{
                    backdropFilter: 'blur(5px)',
                    border: '1px solid',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    background: mode === 'card' ? 'rgba(0,0,0,0.3)' : 'white',
                    color: mode === 'card' ? 'white' : 'var(--text-main)',
                    borderColor: mode === 'card' ? 'rgba(255,255,255,0.3)' : '#ddd',
                }}>
                    {typeof i === 'string' ? i : i.name}
                </span>
            ))}
        </div>
    );

    const containerStyle: React.CSSProperties = mode === 'card' ? {
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'black',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
    } : {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'white',
        zIndex: 1000,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <div className={`profile-card ${mode}`} style={containerStyle} onClick={(e) => e.stopPropagation()}>
            {/* Photo Carousel Area */}
            <div style={{
                position: 'relative',
                height: mode === 'card' ? '100%' : '50vh',
                width: '100%'
            }}>
                <img
                    src={photos[currentPhoto]}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Photo Navigation Tabs */}
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', gap: '5px', zIndex: 10 }}>
                    {photos.map((_: any, idx: number) => (
                        <div key={idx} style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            background: idx === currentPhoto ? 'white' : 'rgba(255,255,255,0.5)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}></div>
                    ))}
                </div>

                {/* Touch Areas for Navigation */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                    <div style={{ flex: 1 }} onClick={prevPhoto}></div>
                    <div style={{ flex: 1 }} onClick={nextPhoto}></div>
                </div>

                {/* Back Button (Full Mode) */}
                {mode === 'full' && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: 20, right: 20,
                            background: 'white', border: 'none', borderRadius: '50%',
                            width: '40px', height: '40px', fontSize: '1.2rem',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 20
                        }}
                    >
                        ✕
                    </button>
                )}

                {/* Overlay Info (Card Mode Only) */}
                {mode === 'card' && (
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        padding: '80px 20px 20px', pointerEvents: 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '2rem', fontWeight: 800 }}>{profile.name}</h2>
                            <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 400 }}>{profile.age}</span>
                        </div>
                        <p style={{ color: '#eee', margin: '5px 0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            📍 {profile.city || 'Togo'} • {profile.profession || 'Membre'}
                        </p>
                        {renderInterests()}

                        {/* Info Button trigger */}
                        <div style={{ position: 'absolute', right: 20, bottom: 90, pointerEvents: 'auto' }}>
                            <button
                                onClick={onClose} // Using onClose as "Open Details" in card context contextually passed
                                style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid white', background: 'transparent', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
                            >
                                i
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detailed Content (Full Mode Only) */}
            {mode === 'full' && (
                <div style={{ padding: '20px', background: 'white', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-main)' }}>{profile.name}, {profile.age}</h1>
                            <p style={{ color: 'var(--text-muted)' }}>{profile.profession} @ {profile.jobStatus}</p>
                        </div>
                        {profile.verified && <span style={{ fontSize: '1.5rem' }}>✅</span>}
                    </div>

                    <div style={{ height: '1px', background: '#eee', margin: '20px 0' }}></div>

                    <h3 className="section-title">À propos</h3>
                    <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '20px' }}>
                        {profile.bio || "Pas de bio renseignée."}
                    </p>

                    <h3 className="section-title">Centres d'intérêt</h3>
                    {renderInterests()}

                    <h3 className="section-title">Infos</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        <InfoItem icon="📏" label={profile.height || '--'} />
                        <InfoItem icon="🎓" label={profile.educationLevel || '--'} />
                        <InfoItem icon="🍷" label={profile.drinking || '--'} />
                        <InfoItem icon="🚬" label={profile.smoking || '--'} />
                    </div>

                    {/* Sticky Action Bar */}
                    <div style={{
                        position: 'sticky', bottom: 20, marginTop: '40px',
                        display: 'flex', justifyContent: 'center', gap: '20px'
                    }}>
                        <ActionButton type="nope" onClick={onPass} icon="✕" />
                        <ActionButton type="super" onClick={onSuperLike} icon="⭐" />
                        <ActionButton type="like" onClick={onLike} icon="❤️" />
                    </div>
                </div>
            )}

            <style jsx>{`
                .section-title { font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px; margin-top: 20px; }
            `}</style>
        </div>
    );
}

const InfoItem = ({ icon, label }: { icon: string, label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '10px' }}>
        <span>{icon}</span>
        <span style={{ fontSize: '0.9rem', color: '#333' }}>{label}</span>
    </div>
);

const ActionButton = ({ type, onClick, icon }: { type: string, onClick?: () => void, icon: string }) => {
    const colors: any = { nope: '#FF4444', super: '#448AFF', like: '#00E676' };
    const size = type === 'like' ? '70px' : type === 'super' ? '50px' : '60px';

    return (
        <button onClick={onClick} style={{
            width: size, height: size, borderRadius: '50%',
            border: `2px solid ${colors[type]}`, color: colors[type],
            background: 'white', fontSize: '1.5rem',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {icon}
        </button>
    );
};
