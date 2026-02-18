"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';
import { API_BASE_URL, BACKEND_URL } from '../../config';
import { translations } from '../../../utils/translations';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });



export default function ChatDetail() {
    const { matchId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [partner, setPartner] = useState<any>(null);
    const [myUserId, setMyUserId] = useState<string | null>(
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null
    );
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msgToDelete, setMsgToDelete] = useState<string | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [language, setLanguage] = useState('Français');
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleLongPressStart = (msgId: string) => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        longPressTimer.current = setTimeout(() => setMsgToDelete(msgId), 600);
    };

    const handleLongPressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const confirmDelete = async () => {
        if (!msgToDelete) return;
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_BASE_URL}/chat/messages/${msgToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(prev => prev.filter(m => m.id !== msgToDelete));
            socketRef.current?.emit('delete_message', { matchId, messageId: msgToDelete });
            setMsgToDelete(null);
        } catch (e) {
            console.error(e);
        }
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeoutRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const getPhotoUrl = (photo: any) => {
        if (!photo) return '';
        let url = typeof photo === 'string' ? photo : photo.url;
        if (!url) return '';

        if (url.includes('/uploads/')) {
            const relativePath = url.substring(url.indexOf('/uploads/'));
            const cleanBackend = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
            return `${cleanBackend}${relativePath}`;
        }

        if (url.startsWith('http')) return url;

        const cleanBackendUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
        const cleanPath = url.startsWith('/') ? url : `/${url}`;

        return `${cleanBackendUrl}${cleanPath}`;
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isRecording]);

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');

        if (!token) {
            router.push('/login');
            return;
        }

        if (storedUserId) {
            setMyUserId(storedUserId);
        }

        const fetchMe = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMyUserId(data.userId);
                    localStorage.setItem('userId', data.userId);
                }
            } catch (err) { console.error(err); }
        };

        const fetchMatchData = async () => {
            try {
                const resMatch = await fetch(`${API_BASE_URL}/chat/matches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resMatch.ok) {
                    const matches = await resMatch.json();
                    const currentMatch = matches.find((m: any) => m.id === matchId);
                    if (currentMatch) {
                        setPartner(currentMatch.users[0]);
                    }
                }

                const resMsgs = await fetch(`${API_BASE_URL}/chat/messages/${matchId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resMsgs.ok) {
                    const data = await resMsgs.json();
                    setMessages(data);
                    socketRef.current?.emit('mark_as_read', { matchId, userId: storedUserId });
                }
            } catch (err) { console.error(err); }
        };

        if (!storedUserId) {
            fetchMe();
        }
        fetchMatchData();

        const socketUrl = API_BASE_URL.replace('/api', '');
        socketRef.current = io(socketUrl);

        socketRef.current.on('connect', () => {
            socketRef.current?.emit('join_room', matchId);
        });

        socketRef.current.on('receive_message', (message) => {
            const currentId = localStorage.getItem('userId');
            if (message.senderId && currentId && String(message.senderId) === String(currentId)) return;
            setMessages((prev) => [...prev, message]);
            socketRef.current?.emit('mark_as_read', { matchId, userId: currentId });
        });

        socketRef.current.on('messages_read', (data) => {
            const currentId = localStorage.getItem('userId');
            if (data.userId && currentId && String(data.userId) !== String(currentId)) {
                setMessages((prev) => prev.map(m =>
                    String(m.senderId) === String(currentId) ? { ...m, status: 'READ' } : m
                ));
            }
        });

        socketRef.current.on('partner_typing', () => setIsTyping(true));
        socketRef.current.on('partner_stop_typing', () => setIsTyping(false));

        socketRef.current.on('message_deleted', (data: any) => {
            const id = data.id || data.messageId;
            setMessages(prev => prev.filter(m => m.id !== id));
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [matchId, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);

        if (!socketRef.current || !myUserId) return;

        socketRef.current.emit('typing_start', { matchId, userId: myUserId });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit('typing_stop', { matchId, userId: myUserId });
        }, 1500);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !myUserId) return;

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const token = localStorage.getItem('token');
            const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (uploadRes.ok) {
                const data = await uploadRes.json();
                const imageUrl = data.url;

                const tempId = Date.now().toString();
                const tempMsg = {
                    id: tempId,
                    content: imageUrl,
                    senderId: myUserId,
                    status: 'PENDING',
                    type: 'image',
                    createdAt: new Date().toISOString(),
                    matchId
                };
                setMessages(prev => [...prev, tempMsg]);

                const saveRes = await fetch(`${API_BASE_URL}/chat/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ matchId, content: imageUrl, type: 'image' })
                });

                if (saveRes.ok) {
                    const savedMsg = await saveRes.json();
                    setMessages(prev => prev.map(m => m.id === tempId ? { ...savedMsg, status: 'SENT' } : m));
                    socketRef.current?.emit('send_message', savedMsg);
                }
            }
        } catch (error) {
            console.error('Image upload failed', error);
        }
    };

    const startRecording = async () => {
        if (!window.isSecureContext) {
            alert(`Le microphone nécessite HTTPS. Vérifiez votre connexion.`);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await sendAudioMessage(audioBlob);
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Impossible d'accéder au microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioMessage = async (audioBlob: Blob) => {
        if (!myUserId) return;
        const formData = new FormData();
        formData.append('photo', audioBlob, 'voice-message.webm');

        try {
            const token = localStorage.getItem('token');
            const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (uploadRes.ok) {
                const data = await uploadRes.json();
                const audioUrl = data.url;

                const tempId = Date.now().toString();
                const tempMsg = {
                    id: tempId,
                    content: audioUrl,
                    senderId: myUserId,
                    status: 'PENDING',
                    type: 'audio',
                    createdAt: new Date().toISOString(),
                    matchId
                };
                setMessages(prev => [...prev, tempMsg]);

                const saveRes = await fetch(`${API_BASE_URL}/chat/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ matchId, content: audioUrl, type: 'audio' })
                });

                if (saveRes.ok) {
                    const savedMsg = await saveRes.json();
                    setMessages(prev => prev.map(m => m.id === tempId ? { ...savedMsg, status: 'SENT' } : m));
                    socketRef.current?.emit('send_message', savedMsg);
                }
            }
        } catch (error) {
            console.error('Audio upload failed', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !myUserId) return;

        const token = localStorage.getItem('token');
        const content = input;
        setInput('');

        const tempId = Date.now().toString();
        const tempMsg = {
            id: tempId,
            content,
            senderId: myUserId,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            matchId
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await fetch(`${API_BASE_URL}/chat/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ matchId, content })
            });

            if (res.ok) {
                const savedMsg = await res.json();
                setMessages(prev => prev.map(m => m.id === tempId ? { ...savedMsg, status: 'SENT' } : m));
                socketRef.current?.emit('send_message', savedMsg);
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    return (
        <main style={{ background: 'transparent', height: '100vh', display: 'flex', flexDirection: 'column', direction: isRtl ? 'rtl' : 'ltr' }}>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '75px',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(15px)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1rem',
                zIndex: 100,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                paddingTop: 'env(safe-area-inset-top)',
                flexDirection: isRtl ? 'row-reverse' : 'row'
            }}>
                <button
                    onClick={() => router.back()}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', transform: isRtl ? 'scaleX(-1)' : 'none' }}
                >
                    ←
                </button>
                <div
                    onClick={() => router.push(`/match/${matchId}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', [isRtl ? 'marginRight' : 'marginLeft']: '5px', cursor: 'pointer', flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-start' : 'flex-start' }}
                >
                    <div style={{
                        width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {partner?.profile?.photos?.[0] ? (
                            <img
                                src={getPhotoUrl(partner.profile.photos[0])}
                                alt={partner.profile.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFullScreenImage(getPhotoUrl(partner.profile.photos[0]));
                                }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                                {partner?.profile?.gender === 'Femme' ? '👩' : '👨'}
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{partner?.profile?.name || '...'}</h2>
                        <span style={{ fontSize: '0.7rem', color: '#4CC9F0', fontWeight: 600 }}>{t['online_status']}</span>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/places')}
                    style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '8px 12px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>
                    {t['places']} 🍽️
                </button>
            </header>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '100px 1rem 120px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'rgba(0,0,0,0.05)'
            }}>
                {messages.map((msg, idx) => {
                    const myId = typeof window !== 'undefined' ? localStorage.getItem('userId') : myUserId;
                    const isMe = msg.senderId && myId && String(msg.senderId).trim() === String(myId).trim();
                    const kentePattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2364748b' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10zM0 20h10v10H0V20zm10 30h10v10H10V30zM20 0h10v10H20V0zm10 10h10v10H30V10zM20 20h10v10H20V20zm10 30h10v10H30V30z'/%3E%3C/g%3E%3C/svg%3E")`;
                    const isImage = msg.type === 'image' || (msg.content && (msg.content.startsWith('http') || msg.content.startsWith('uploads/')) && (msg.content.match(/\.(jpeg|jpg|gif|png)$/) != null || msg.content.includes('uploads')));
                    const isAudio = msg.type === 'audio' || (msg.content && (msg.content.endsWith('.webm') || msg.content.endsWith('.mp3') || msg.content.endsWith('.wav')));

                    // In RTL, if it's me, I'm on Left (wait, usually 'me' is on right in LTR). 
                    // LTR: Me -> Right, Partner -> Left.
                    // RTL: Me -> Left, Partner -> Right.
                    // justifyContent: isMe ? 'flex-end' : 'flex-start' handles this automatically if direction is RTL?
                    // if direction is RTL, flex-start is Right, flex-end is Left.
                    // So isMe (flex-end) -> Left. Correct.
                    // Partner (flex-start) -> Right. Correct.

                    return (
                        <div
                            key={msg.id || idx}
                            onMouseDown={() => handleLongPressStart(msg.id)}
                            onMouseUp={handleLongPressEnd}
                            onTouchStart={() => handleLongPressStart(msg.id)}
                            onTouchEnd={handleLongPressEnd}
                            onMouseLeave={handleLongPressEnd}
                            style={{
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                                marginBottom: '0.8rem',
                                width: '100%',
                                padding: '0 10px',
                                userSelect: 'none'
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '75%',
                                    borderRadius: '1.2rem',
                                    padding: isImage ? '4px' : '0.85rem 1rem',
                                    background: isMe
                                        ? 'linear-gradient(135deg, #FF6B35 0%, #4CC9F0 100%)'
                                        : '#F1F5F9',
                                    backgroundImage: isMe ? 'linear-gradient(135deg, #FF6B35 0%, #4CC9F0 100%)' : kentePattern,
                                    color: isMe ? '#ffffff' : '#0F172A',
                                    // BORDER RADIUS FLIPPING FOR RTL ??
                                    // LTR: Me (Right) -> BottomRight sharp. Partner (Left) -> BottomLeft sharp.
                                    // RTL: Me (Left) -> BottomLeft sharp. Partner (Right) -> BottomRight sharp.
                                    // borderBottomRightRadius: isMe ? '4px' : '1.2rem',
                                    // borderBottomLeftRadius: isMe ? '1.2rem' : '4px',

                                    borderBottomRightRadius: isMe ? (isRtl ? '1.2rem' : '4px') : (isRtl ? '4px' : '1.2rem'),
                                    borderBottomLeftRadius: isMe ? (isRtl ? '4px' : '1.2rem') : (isRtl ? '1.2rem' : '4px'),

                                    boxShadow: isMe ? '0 4px 15px rgba(255,107,53,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    textAlign: isRtl ? 'right' : 'left'
                                }}
                            >
                                {isImage ? (
                                    <img
                                        src={getPhotoUrl(msg.content)}
                                        alt="Shared"
                                        style={{ borderRadius: '1rem', maxWidth: '100%', display: 'block', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFullScreenImage(getPhotoUrl(msg.content));
                                        }}
                                    />
                                ) : isAudio ? (
                                    <audio
                                        controls
                                        src={getPhotoUrl(msg.content)}
                                        style={{ maxWidth: '100%' }}
                                    />
                                ) : (
                                    <p style={{ fontSize: '0.96rem', margin: 0, lineHeight: '1.5', wordBreak: 'break-word', fontWeight: 500 }}>
                                        {msg.content}
                                    </p>
                                )}

                                <div style={{
                                    fontSize: '0.65rem',
                                    marginTop: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    alignSelf: 'flex-end',
                                    opacity: 0.9,
                                    color: isMe || isImage ? 'rgba(255,255,255,0.9)' : '#64748B',
                                    textShadow: isImage ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                                    padding: isImage ? '0 4px 4px 0' : '0',
                                    flexDirection: isRtl ? 'row-reverse' : 'row'
                                }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                                    {isMe && (
                                        <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                            {msg.status === 'PENDING' && '🕒'}
                                            {msg.status === 'SENT' && '✓'}
                                            {msg.status === 'DELIVERED' && '✓✓'}
                                            {msg.status === 'READ' && (
                                                <span style={{ color: '#00E5FF', fontWeight: 'bold' }}>✓✓</span>
                                            )}
                                            {(!msg.status || (msg.status !== 'PENDING' && msg.status !== 'SENT' && msg.status !== 'DELIVERED' && msg.status !== 'READ')) && '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div style={{ padding: '0 20px', fontSize: '0.8rem', color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '5px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                        <span>{partner?.profile?.name} {t['is_typing']}</span>
                        <span className="dot-flashing"></span>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <form
                onSubmit={sendMessage}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '0.8rem 1rem 2rem',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    gap: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.5)',
                    zIndex: 100,
                    maxWidth: '600px',
                    margin: '0 auto',
                    alignItems: 'center',
                    flexDirection: isRtl ? 'row-reverse' : 'row'
                }}
            >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        {showEmojiPicker && (
                            <div style={{ position: 'absolute', bottom: '50px', [isRtl ? 'right' : 'left']: '0', zIndex: 1001 }}>
                                <EmojiPicker onEmojiClick={(e) => setInput(prev => prev + e.emoji)} width={300} height={400} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}
                        >
                            😊
                        </button>
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '5px' }}>📷</button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
                    <button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '5px',
                            color: isRecording ? 'red' : 'inherit',
                            transform: isRecording ? 'scale(1.2)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isRecording ? '⏹️' : '🎤'}
                    </button>
                </div>

                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder={isRecording ? t['recording_placeholder'] : t['message_placeholder']}
                        disabled={isRecording}
                        style={{
                            width: '100%',
                            padding: '0.8rem 1.2rem',
                            borderRadius: '25px',
                            border: '1px solid rgba(0,0,0,0.1)',
                            background: isRecording ? '#ffebee' : 'white',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02) inset',
                            color: 'var(--text-main)',
                            textAlign: isRtl ? 'right' : 'left'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
                        flexShrink: 0,
                        transition: 'transform 0.1s',
                        transform: isRtl ? 'rotate(180deg)' : 'none'
                    }}
                >
                    ✈️
                </button>
            </form>

            {msgToDelete && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    direction: isRtl ? 'rtl' : 'ltr'
                }} onClick={() => setMsgToDelete(null)}>
                    <div style={{
                        background: 'white', padding: '20px', borderRadius: '15px',
                        textAlign: 'center', minWidth: '250px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 15px', color: '#333' }}>{t['delete_message_confirm']}</h3>
                        <p style={{ margin: '0 0 20px', color: '#666', fontSize: '0.9rem' }}>{t['delete_irreversible']}</p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => setMsgToDelete(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ccc', background: 'white', cursor: 'pointer', fontWeight: 600 }}>{t['cancel']}</button>
                            <button onClick={confirmDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ff4757', color: 'white', cursor: 'pointer', fontWeight: 600 }}>{t['delete']}</button>
                        </div>
                    </div>
                </div>
            )}

            {fullScreenImage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.95)', zIndex: 3000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }} onClick={() => setFullScreenImage(null)}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={fullScreenImage} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
                        <button
                            onClick={() => setFullScreenImage(null)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                                fontSize: '2rem', cursor: 'pointer', borderRadius: '50%',
                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
