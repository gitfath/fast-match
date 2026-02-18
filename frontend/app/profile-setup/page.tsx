"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, BACKEND_URL } from '../config';
import { PROFILE_OPTIONS } from '../config/profileOptions';
import BackButton from '../../components/BackButton';
import { translations } from '../../utils/translations';

export default function ProfileSetup() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const [photos, setPhotos] = useState<string[]>(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [language, setLanguage] = useState('Français');

    const getImageUrl = (url: string) => {
        if (!url) return '';
        // Fix for localhost URLs when accessed remotely
        if (url.includes('localhost:5000')) {
            // Extract path part (e.g. /uploads/...)
            const parts = url.split('localhost:5000');
            if (parts.length > 1) {
                return `${BACKEND_URL}${parts[1]}`;
            }
        }
        if (url.startsWith('http')) return url;
        // Handle partial URLs or relative paths
        if (url.startsWith('/uploads')) {
            return `${BACKEND_URL}${url}`;
        }
        return url;
    };

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [bio, setBio] = useState('');
    const [profession, setProfession] = useState('');
    const [jobStatus, setJobStatus] = useState('Salarié(e)');
    const [educationLevel, setEducationLevel] = useState('Universitaire');
    const [city, setCity] = useState('Lomé');
    const [neighborhood, setNeighborhood] = useState('');
    const [interests, setInterests] = useState<string[]>([]);

    // Preferences
    const [preferences, setPreferences] = useState({
        minAge: 18,
        maxAge: 50,
        gender: 'Tout',
        distance: 50,
        relationshipGoal: 'Sérieuse'
    });

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const fetchInitial = async () => {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');

            try {
                const res = await fetch(`${API_BASE_URL}/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    // Populate if existing data
                    if (data.photos) {
                        const p = Array(6).fill('');
                        data.photos.forEach((photo: any, i: number) => {
                            if (i < 6) p[i] = photo.url;
                        });
                        setPhotos(p);
                    }
                    if (data.bio) setBio(data.bio);
                    if (data.profession) setProfession(data.profession);
                    if (data.interests) setInterests(data.interests.map((i: any) => i.name));
                    if (data.preferences) {
                        setPreferences(prev => ({ ...prev, ...data.preferences }));
                    }
                }
            } catch (err) {
                console.log("No profile yet");
            } finally {
                setFetching(false);
            }
        };
        fetchInitial();
    }, [router]);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const fData = new FormData();
            fData.append('photo', file);
            try {
                const res = await fetch(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: fData
                });
                if (res.ok) {
                    const d = await res.json();
                    const newPhotos = [...photos];
                    newPhotos[index] = d.url;
                    setPhotos(newPhotos);
                }
            } catch (err) {
                alert(t['upload_error'] || "Erreur upload");
            }
        }
    };

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            if (interests.length < 5) {
                setInterests([...interests, interest]);
            }
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Filter empty photos
        const validPhotos = photos.filter(p => p !== '');

        const payload = {
            photos: validPhotos,
            name,
            birthDate: birthDate ? new Date(birthDate).toISOString() : null,
            bio,
            profession,
            jobStatus,
            educationLevel,
            interests,
            preferences,
            city,
            neighborhood
        };

        try {
            const res = await fetch(`${API_BASE_URL}/profiles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/feed');
            } else {
                alert("Erreur lors de la sauvegarde");
            }
        } catch (err) {
            alert("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{t['loading']}</div>;

    const progress = (step / totalSteps) * 100;

    return (
        <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', direction: isRtl ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <BackButton />
                <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s' }}></div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '40px' }}>{step}/{totalSteps}</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', maxWidth: '500px', margin: '0 auto', width: '100%' }}>

                {/* STEP 1: PHOTOS */}
                {step === 1 && (
                    <div className="animate-slide-up">
                        <h2 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t['add_photos_title']}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t['add_photos_desc']}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {photos.map((url, idx) => (
                                <div key={idx} style={{
                                    aspectRatio: '2/3',
                                    background: '#f0f0f0',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '2px dashed #ccc'
                                }}>
                                    {url ? (
                                        <>
                                            <img src={getImageUrl(url)} alt={`Photo ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                onClick={() => {
                                                    const newPhotos = [...photos];
                                                    newPhotos[idx] = '';
                                                    setPhotos(newPhotos);
                                                }}
                                                style={{ position: 'absolute', top: 5, [isRtl ? 'left' : 'right']: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                                            >✕</button>
                                        </>
                                    ) : (
                                        <label style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '2rem', color: '#ccc' }}>+</span>
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, idx)} />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: BIO & INFO */}
                {step === 2 && (
                    <div className="animate-slide-up">
                        <h2 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t['about_you_title']}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t['about_you_desc']}</p>

                        <label className="label">{t['fullname_label']}</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="Ex: Jean Koffi"
                            style={{ marginBottom: '1.5rem', textAlign: isRtl ? 'right' : 'left' }}
                        />

                        <label className="label">{t['dob_label']}</label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="input-field"
                            style={{ marginBottom: '1.5rem', textAlign: isRtl ? 'right' : 'left' }}
                        />

                        <label className="label">{t['bio_label']}</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="input-field"
                            rows={4}
                            placeholder="..."
                            style={{ marginBottom: '1.5rem', resize: 'none', textAlign: isRtl ? 'right' : 'left' }}
                        />

                        <label className="label">{t['profession_label']}</label>
                        <input
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="input-field"
                            placeholder="..."
                            style={{ marginBottom: '1.5rem', textAlign: isRtl ? 'right' : 'left' }}
                        />

                        <label className="label">{t['city_label']}</label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="input-field"
                            style={{ marginBottom: '1.5rem', appearance: 'auto', textAlign: isRtl ? 'right' : 'left' }}
                        >
                            {PROFILE_OPTIONS.CITY.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <label className="label">{t['neighborhood_label']}</label>
                        <input
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            className="input-field"
                            placeholder="..."
                            style={{ marginBottom: '1.5rem', textAlign: isRtl ? 'right' : 'left' }}
                        />

                        <label className="label">{t['job_status_label']}</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {PROFILE_OPTIONS.JOB_STATUS.map(stat => (
                                <button
                                    key={stat}
                                    onClick={() => setJobStatus(stat)}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        borderRadius: '20px',
                                        border: jobStatus === stat ? '2px solid var(--primary)' : '1px solid #ddd',
                                        background: jobStatus === stat ? 'var(--accent-light)' : 'white',
                                        color: jobStatus === stat ? 'var(--primary)' : '#555',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {stat}
                                </button>
                            ))}
                        </div>

                        <label className="label">{t['interests_label']}</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {PROFILE_OPTIONS.INTERESTS.slice(0, 15).map(int => (
                                <button
                                    key={int}
                                    onClick={() => toggleInterest(int)}
                                    style={{
                                        padding: '0.5rem 0.8rem',
                                        borderRadius: '20px',
                                        border: interests.includes(int) ? '2px solid var(--primary)' : '1px solid #ddd',
                                        background: interests.includes(int) ? 'var(--accent-light)' : 'white',
                                        color: interests.includes(int) ? 'var(--primary)' : '#555',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {int}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: PREFERENCES */}
                {step === 3 && (
                    <div className="animate-slide-up">
                        <h2 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t['criteria_title']}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t['criteria_desc']}</p>

                        <label className="label">{t['gender_preference_label']}</label>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            {['Homme', 'Femme', 'Tout'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setPreferences({ ...preferences, gender: g })}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: preferences.gender === g ? '2px solid var(--primary)' : '1px solid #ddd',
                                        background: preferences.gender === g ? 'var(--accent-light)' : 'white',
                                        color: preferences.gender === g ? 'var(--primary)' : '#555',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {g === 'Homme' ? t['male'] : g === 'Femme' ? t['female'] : g === 'Tout' ? (language === 'English' ? 'All' : 'Tout') : g}
                                </button>
                            ))}
                        </div>

                        <label className="label">{t['age_range_label']} ({preferences.minAge} - {preferences.maxAge} {t['years']})</label>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={preferences.minAge}
                                onChange={(e) => setPreferences({ ...preferences, minAge: parseInt(e.target.value) })}
                                className="input-field"
                                style={{ width: '80px', textAlign: isRtl ? 'right' : 'left' }}
                            />
                            <span>{t['to']}</span>
                            <input
                                type="number"
                                value={preferences.maxAge}
                                onChange={(e) => setPreferences({ ...preferences, maxAge: parseInt(e.target.value) })}
                                className="input-field"
                                style={{ width: '80px', textAlign: isRtl ? 'right' : 'left' }}
                            />
                        </div>

                        <label className="label">{t['max_distance_label']} ({preferences.distance} km)</label>
                        <input
                            type="range"
                            min="1" max="100"
                            value={preferences.distance}
                            onChange={(e) => setPreferences({ ...preferences, distance: parseInt(e.target.value) })}
                            style={{ width: '100%', marginBottom: '1.5rem' }}
                        />

                        <label className="label">{t['intention_label']}</label>
                        <select
                            value={preferences.relationshipGoal}
                            onChange={(e) => setPreferences({ ...preferences, relationshipGoal: e.target.value })}
                            className="input-field"
                            style={{ appearance: 'auto', textAlign: isRtl ? 'right' : 'left' }}
                        >
                            {PROFILE_OPTIONS.RELATIONSHIP_GOAL.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div style={{ padding: '1.5rem', background: 'white', borderTop: '1px solid #eee' }}>
                <button
                    onClick={step < totalSteps ? handleNext : handleSubmit}
                    disabled={loading || (step === 1 && photos.filter(p => p !== '').length < 2)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
                >
                    {step < totalSteps ? t['continue_btn'] : (loading ? t['creating_btn'] : t['finish_btn'])}
                </button>
            </div>
        </main>
    );
}
