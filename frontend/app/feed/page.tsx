"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';
import TopHeader from '../../components/TopHeader';
import MatchModal from '../../components/MatchModal';
import ProfileCard from '../../components/ProfileCard';
import { API_BASE_URL, BACKEND_URL } from '../config';
import { translations } from '../../utils/translations';

export default function Feed() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<any>(null);
    const [matchData, setMatchData] = useState<{ name: string, myImage: string, matchImage: string, matchId: string } | null>(null);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
        fetchProfiles();
        fetchMe();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const getPhotoUrl = (photo: any) => {
        if (!photo) return '';
        let url = typeof photo === 'string' ? photo : photo.url;
        if (!url) return '';

        // Fix stale absolute URLs
        if (url.includes('/uploads/')) {
            const fileName = url.split('/uploads/')[1];
            return `${BACKEND_URL}/uploads/${fileName}`;
        }

        if (url.startsWith('http')) return url;
        if (url.startsWith('uploads')) return `${BACKEND_URL}/${url}`;
        return url;
    };

    const fetchMe = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMe(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProfiles = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/matches/recommendations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfiles(data);
            }
        } catch (err) {
            console.error("Backend unreachable", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = async () => {
        // Re-fetch and shuffle (retry mode: include passed profiles)
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/matches/recommendations?retry=true`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Shuffle logic
                const shuffled = data.sort(() => Math.random() - 0.5);
                setProfiles(shuffled);
                setCurrentIndex(0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (liked: boolean) => {
        if (swipeDirection) return;

        const direction = liked ? 'right' : 'left';
        setSwipeDirection(direction);

        const profile = profiles[currentIndex];
        if (!profile) return;

        setTimeout(async () => {
            setSwipeDirection(null);
            setCurrentIndex(prev => prev + 1);
            setShowProfileDetails(false); // Close details if open

            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/matches/swipe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ toUserId: profile.userId, liked })
                });
                const data = await res.json();
                if (data.match) {
                    setMatchData({
                        name: profile.name,
                        myImage: getPhotoUrl(me?.photos?.[0]),
                        matchImage: getPhotoUrl(profile.photos?.[0]),
                        matchId: data.matchId
                    });
                }
            } catch (err) {
                console.log(t['swipe_recorded_local']);
            }
        }, 300); // Faster swipe
    };

    const activeProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    if (loading) return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="animate-pulse">🔥</div>
        </main>
    );

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', overflow: 'hidden', paddingTop: '60px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <TopHeader />

            {matchData && (
                <MatchModal
                    userName={matchData.name}
                    myImage={matchData.myImage}
                    matchImage={matchData.matchImage}
                    matchId={matchData.matchId}
                    onClose={() => setMatchData(null)}
                />
            )}

            {/* Profile Details Modal */}
            {showProfileDetails && activeProfile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
                    <ProfileCard
                        profile={activeProfile}
                        mode="full"
                        onClose={() => setShowProfileDetails(false)}
                        onLike={() => handleSwipe(true)}
                        onPass={() => handleSwipe(false)}
                        onSuperLike={() => alert(t['super_like_alert'])}
                    />
                </div>
            )}

            {/* Swipe Deck Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0 80px' }}>
                {!activeProfile ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2>{t['no_more_profiles']}</h2>
                        <button className="btn btn-primary" onClick={handleRestart}>{t['restart_random']}</button>
                    </div>
                ) : (
                    <div style={{ position: 'relative', width: '90%', maxWidth: '400px', height: '100%', maxHeight: '600px' }}>
                        {/* Background Card */}
                        {nextProfile && (
                            <div style={{
                                position: 'absolute', inset: 0, transform: 'scale(0.95) translateY(10px)',
                                opacity: 0.5, zIndex: 0, borderRadius: '20px', overflow: 'hidden'
                            }}>
                                <ProfileCard profile={nextProfile} mode="card" />
                            </div>
                        )}

                        {/* Foregound Card */}
                        <div style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            transform: swipeDirection === 'left' ? 'translateX(-120%) rotate(-20deg)' :
                                swipeDirection === 'right' ? 'translateX(120%) rotate(20deg)' : 'none',
                            transition: 'transform 0.3s ease-in-out',
                            cursor: 'grab'
                        }}>
                            <ProfileCard
                                profile={activeProfile}
                                mode="card"
                                onClose={() => setShowProfileDetails(true)}
                            />

                            {/* Swipe Labels */}
                            {swipeDirection === 'left' && (
                                <div style={{ position: 'absolute', top: 40, right: 40, border: '4px solid #ff4444', color: '#ff4444', padding: '5px 10px', fontSize: '2rem', fontWeight: 900, borderRadius: '8px', transform: 'rotate(15deg)' }}>
                                    {t['nope']}
                                </div>
                            )}
                            {swipeDirection === 'right' && (
                                <div style={{ position: 'absolute', top: 40, left: 40, border: '4px solid #00e676', color: '#00e676', padding: '5px 10px', fontSize: '2rem', fontWeight: 900, borderRadius: '8px', transform: 'rotate(-15deg)' }}>
                                    {t['like']}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom Actions (Only visible if not detailed view) */}
                {activeProfile && !showProfileDetails && (
                    <div style={{
                        display: 'flex', gap: '20px', marginTop: '20px',
                        position: 'absolute', bottom: 90, zIndex: 20,
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                        <button onClick={() => handleSwipe(false)} style={{
                            width: '60px', height: '60px', borderRadius: '50%', background: 'white',
                            border: '1px solid #ddd', fontSize: '1.5rem', color: '#ff4444',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer'
                        }}>✕</button>

                        <button onClick={() => alert(t['super_like_alert'])} style={{
                            width: '50px', height: '50px', borderRadius: '50%', background: 'white',
                            border: '1px solid #ddd', fontSize: '1.2rem', color: '#448aff',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer', marginTop: '5px'
                        }}>⭐</button>

                        <button onClick={() => handleSwipe(true)} style={{
                            width: '60px', height: '60px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff6b6b, #ff4757)', border: 'none',
                            fontSize: '1.8rem', color: 'white',
                            boxShadow: '0 5px 20px rgba(255, 71, 87, 0.4)', cursor: 'pointer'
                        }}>♥</button>
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
