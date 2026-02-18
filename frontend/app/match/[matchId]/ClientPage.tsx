"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL, BACKEND_URL } from '../../config';



export default function MatchDetail() {
    const { matchId } = useParams();
    const router = useRouter();
    const [match, setMatch] = useState<any>(null);
    const [myProfile, setMyProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const getPhotoUrl = (photo: any) => {
        if (!photo) return 'https://via.placeholder.com/150';
        let url = typeof photo === 'string' ? photo : photo.url;
        if (!url) return 'https://via.placeholder.com/150';

        // Fix stale absolute URLs
        if (url.includes('/uploads/')) {
            const fileName = url.split('/uploads/')[1];
            return `${BACKEND_URL}/uploads/${fileName}`;
        }

        if (url.startsWith('http')) return url;
        if (url.startsWith('uploads')) return `${BACKEND_URL}/${url}`;
        return url;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch my profile
                const myRes = await fetch(`${API_BASE_URL}/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (myRes.ok) {
                    const myData = await myRes.json();
                    setMyProfile(myData);
                    console.log('My profile:', myData);
                }

                // Fetch matches to find this specific match
                const matchRes = await fetch(`${API_BASE_URL}/chat/matches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (matchRes.ok) {
                    const matches = await matchRes.json();
                    console.log('All matches:', matches);
                    const currentMatch = matches.find((m: any) => m.id === matchId);
                    if (currentMatch) {
                        console.log('Current match:', currentMatch);
                        console.log('Partner profile:', currentMatch.users[0]?.profile);
                        console.log('Partner photos:', currentMatch.users[0]?.profile?.photos);
                        setMatch(currentMatch);
                    } else {
                        console.error('Match not found with ID:', matchId);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [matchId]);

    if (loading) {
        return (
            <main className="hero-section" style={{ background: 'var(--background)' }}>
                <div style={{ transform: 'scale(1.5)', marginBottom: '1rem' }}>💕</div>
                <h1 className="font-heading">Chargement...</h1>
            </main>
        );
    }

    if (!match) {
        return (
            <main className="hero-section" style={{ background: 'var(--background)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                <h1 className="font-heading">Match introuvable</h1>
                <button className="btn btn-primary" onClick={() => router.back()} style={{ marginTop: '2rem' }}>
                    Retour
                </button>
            </main>
        );
    }

    const partner = match.users[0];
    const partnerProfile = partner?.profile;

    // Calculate common interests
    const myInterests = myProfile?.interests?.map((i: any) => i.name) || [];
    const partnerInterests = partnerProfile?.interests?.map((i: any) => i.name) || [];
    const commonInterests = myInterests.filter((interest: string) => partnerInterests.includes(interest));

    return (
        <main style={{ background: 'transparent', minHeight: '100vh', padding: '1rem', paddingBottom: '120px' }}>
            {/* Photo Viewer Modal */}
            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                >
                    <img
                        src={selectedPhoto}
                        alt="Photo agrandie"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '12px'
                        }}
                    />
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '1.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            width: '40px',
                            height: '40px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                        }}
                    >
                        ←
                    </button>
                    <h1 className="font-heading" style={{ fontSize: '1.8rem', margin: 0 }}>Votre Match 💕</h1>
                </div>

                {/* Partner Profile Card */}
                <div className="premium-card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        overflow: 'hidden',
                        border: '4px solid white',
                        boxShadow: '0 10px 25px rgba(255,107,53,0.15)'
                    }}>
                        {partnerProfile?.photos?.[0] ? (
                            <img
                                src={getPhotoUrl(partnerProfile.photos[0])}
                                alt={partnerProfile.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            partnerProfile?.gender === 'Femme' ? '👩' : '👨'
                        )}
                    </div>

                    <h2 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                        {partnerProfile?.name || partnerProfile?.pseudo || 'Utilisateur'}, {partnerProfile?.age || '--'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        📍 {partnerProfile?.location || partnerProfile?.city || 'Togo'}
                    </p>
                    {partnerProfile?.profession && (
                        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                            💼 {partnerProfile.profession}
                        </p>
                    )}
                </div>

                {/* Common Interests */}
                {commonInterests.length > 0 && (
                    <div className="premium-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                            🎯 Points Communs ({commonInterests.length})
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {commonInterests.map((interest: string, idx: number) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: 'var(--gradient-primary)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '100px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 12px rgba(255,107,53,0.2)'
                                    }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Partner's Photos */}
                {partnerProfile?.photos && partnerProfile.photos.length > 0 && (
                    <div className="premium-card" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                            📸 Photos ({partnerProfile.photos.length})
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.5rem'
                        }}>
                            {partnerProfile.photos.map((photo: any, idx: number) => {
                                const photoUrl = getPhotoUrl(photo);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedPhoto(photoUrl)}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'var(--gradient-secondary)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img
                                            src={getPhotoUrl(photo)}
                                            alt={`Photo ${idx + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* About */}
                {partnerProfile?.bio && (
                    <div className="premium-card" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>
                            À propos
                        </h3>
                        <p style={{ color: 'var(--text-main)', opacity: 0.8, lineHeight: '1.6' }}>
                            {partnerProfile.bio}
                        </p>
                    </div>
                )}

                {/* All Interests */}
                {partnerProfile?.interests && partnerProfile.interests.length > 0 && (
                    <div className="premium-card" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="font-heading" style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>
                            Centres d'intérêt
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {partnerProfile.interests.map((interest: any, idx: number) => {
                                const isCommon = commonInterests.includes(interest.name);
                                return (
                                    <span
                                        key={idx}
                                        style={{
                                            background: isCommon ? 'var(--gradient-primary)' : 'white',
                                            color: isCommon ? 'white' : 'var(--text-main)',
                                            border: isCommon ? 'none' : '1px solid #E9ECEF',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '100px',
                                            fontSize: '0.85rem',
                                            fontWeight: isCommon ? 700 : 500
                                        }}
                                    >
                                        {interest.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <Link
                        href={`/chat/${matchId}`}
                        className="btn btn-primary"
                        style={{
                            flex: 1,
                            padding: '1.2rem',
                            fontSize: '1rem',
                            textDecoration: 'none',
                            textAlign: 'center'
                        }}
                    >
                        💬 Envoyer un message
                    </Link>
                </div>
            </div>
        </main>
    );
}
