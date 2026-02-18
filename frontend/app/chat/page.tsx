"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import BottomNav from '../../components/BottomNav';
import { API_BASE_URL, BACKEND_URL } from '../config';
import TopHeader from '../../components/TopHeader';
import { translations } from '../../utils/translations';

export default function ChatList() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('Français');

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const token = localStorage.getItem('token');
        const myUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

        // Initialize socket
        socketRef.current = io(BACKEND_URL);

        fetch(`${API_BASE_URL}/chat/matches`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMatches(data);
                    // Join rooms for real-time updates
                    data.forEach((m: any) => {
                        socketRef.current?.emit('join_room', m.id);
                    });
                }
                setLoading(false);
            })
            .catch(err => console.error(err));

        // Listen for new messages
        socketRef.current?.on('receive_message', (newMessage: any) => {
            setMatches(prevMatches => {
                return prevMatches.map(m => {
                    if (m.id === newMessage.matchId) {
                        const isMyMessage = newMessage.senderId === myUserId;
                        const currentCount = m._count?.messages || 0;

                        // Only increment if not my message
                        const newCount = isMyMessage ? currentCount : currentCount + 1;

                        return {
                            ...m,
                            messages: [newMessage, ...(m.messages || [])],
                            _count: { ...m._count, messages: newCount }
                        };
                    }
                    return m;
                });
            });
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

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

    const newMatches = matches.filter(m => !m.messages || m.messages.length === 0);
    const conversations = matches
        .filter(m => m.messages && m.messages.length > 0)
        .sort((a, b) => {
            const timeA = new Date(a.messages[0].createdAt).getTime();
            const timeB = new Date(b.messages[0].createdAt).getTime();
            return timeB - timeA;
        });

    return (
        <main style={{
            background: 'transparent',
            minHeight: '100vh',
            padding: '80px 20px 100px',
            maxWidth: '600px',
            margin: '0 auto',
            direction: isRtl ? 'rtl' : 'ltr'
        }}>
            <TopHeader />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <h1 className="font-heading" style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-main)' }}>{t['messages_title']}</h1>
                <div style={{
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800
                }}>
                    {matches.length}
                </div>
            </div>

            {/* Section Nouveaux Matchs (Horizontal Scroll) */}
            {newMatches.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                        {t['new_matches']}
                    </h2>
                    <div style={{
                        display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px',
                        scrollbarWidth: 'none', msOverflowStyle: 'none'
                    }}>
                        {newMatches.map(match => {
                            const otherUser = match.users[0];
                            return (
                                <Link href={`/chat/${match.id}`} key={match.id} style={{ textDecoration: 'none', textAlign: 'center', minWidth: '75px' }}>
                                    <div style={{
                                        width: '75px', height: '75px', borderRadius: '50%', overflow: 'hidden',
                                        marginBottom: '8px', border: '3px solid var(--primary)', padding: '3px',
                                        background: 'white', boxShadow: '0 8px 16px rgba(255,107,53,0.2)'
                                    }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                            <img src={getPhotoUrl(otherUser?.profile?.photos?.[0])} alt={otherUser?.profile?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>{otherUser?.profile?.name?.split(' ')[0]}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {newMatches.length === 0 && conversations.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }} className="animate-pulse">🔥</div>
                    <h3 style={{ marginBottom: '10px' }}>{t['no_matches_yet']}</h3>
                    <p>{t['keep_swiping']}</p>
                    <Link href="/feed" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
                        {t['discover_profiles_btn']}
                    </Link>
                </div>
            )}

            {conversations.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                        {t['recent_messages']}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {conversations.map(match => {
                            const otherUser = match.users[0];
                            const lastMsg = match.messages[0];
                            const unreadCount = match._count?.messages || 0;

                            return (
                                <Link href={`/chat/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '15px',
                                        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
                                        padding: '12px 15px', borderRadius: '24px',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        transition: 'transform 0.2s ease',
                                        flexDirection: isRtl ? 'row-reverse' : 'row'
                                    }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid white' }}>
                                                <img src={getPhotoUrl(otherUser?.profile?.photos?.[0])} alt={otherUser?.profile?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            {unreadCount > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-2px',
                                                    right: '-2px',
                                                    background: '#ff3b30',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    minWidth: '20px',
                                                    height: '20px',
                                                    padding: '0 4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    border: '2px solid white',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}>
                                                    {unreadCount}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                                                <h3 style={{
                                                    margin: 0, fontSize: '1.05rem', fontWeight: 750, color: 'var(--text-main)'
                                                }}>{otherUser?.profile?.name}</h3>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                    {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                color: unreadCount > 0 ? 'var(--text-main)' : 'var(--text-muted)',
                                                fontWeight: unreadCount > 0 ? 700 : 500,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                textAlign: isRtl ? 'right' : 'left'
                                            }}>
                                                {/* Translate 'You: ' prefix */}
                                                {lastMsg.senderId === (typeof window !== 'undefined' ? localStorage.getItem('userId') : '') ? t['you_prefix'] : ''}
                                                {lastMsg.content}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <BottomNav />
        </main>
    );
}
