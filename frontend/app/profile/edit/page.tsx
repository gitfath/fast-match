"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../../../components/BottomNav';
import ProfileSection from '../../../components/ProfileSection';
import FormField from '../../../components/FormField';
import { API_BASE_URL } from '../../config';
import { PROFILE_OPTIONS } from '../../config/profileOptions';
import BackButton from '../../../components/BackButton';
import { translations } from '../../../utils/translations';

export default function EditProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [language, setLanguage] = useState('Français');
    const [formData, setFormData] = useState<any>({
        // Identité de base
        name: '',
        pseudo: '',
        age: '',
        gender: '',
        orientation: '',
        languages: [],

        // Localisation
        country: 'Togo',
        city: '',
        location: '',
        mobility: '',
        neighborhood: '',

        // Objectif de rencontre
        relationshipGoal: '',
        openToDistance: '',

        // Personnalité
        personalityType: '',
        temperament: '',
        humorImportance: '',

        // Centres d'intérêt
        interests: [],

        // Situation personnelle
        relationshipStatus: '',
        children: '',
        wantsChildren: '',

        // Études & Travail
        educationLevel: '',
        profession: '',
        jobStatus: '',

        // Religion & Valeurs
        religion: '',
        religiousPractice: '',
        values: [],

        // Apparence physique
        height: '',
        bodyType: '',
        style: '',

        // Habitudes
        smoking: '',
        drinking: '',
        sports: '',
        goingOut: '',

        // Confidentialité
        profileVisibility: 'Public',
        messageSettings: 'Matchs seulement',

        // Autres
        bio: '',
        contactInfo: '',
        photos: []
    });

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_BASE_URL}/profiles/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();

                    // Parse JSON fields
                    const languages = data.languages ? JSON.parse(data.languages) : [];
                    const values = data.values ? JSON.parse(data.values) : [];
                    const interests = data.interests?.map((i: any) => i.name) || [];
                    const photos = data.photos?.map((p: any) => p.url) || [];

                    setFormData({
                        ...data,
                        age: data.age?.toString() || '',
                        languages,
                        values,
                        interests,
                        photos
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const calculateCompleteness = () => {
        const fields = [
            'name', 'age', 'gender', 'city', 'bio', 'relationshipGoal',
            'personalityType', 'educationLevel', 'religion', 'height',
            'smoking', 'drinking'
        ];
        const filled = fields.filter(field => formData[field] && formData[field] !== '').length;
        const total = fields.length;
        return Math.round((filled / total) * 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const { id, userId, updatedAt, createdAt, verified, phoneVerified, idVerified, accountStatus, activityLevel, isPremium, isBoosted, ...updatableData } = formData;

            // Convert arrays to JSON strings for SQLite
            const dataToSend = {
                ...updatableData,
                age: parseInt(updatableData.age),
                languages: JSON.stringify(updatableData.languages || []),
                values: JSON.stringify(updatableData.values || [])
            };

            const res = await fetch(`${API_BASE_URL}/profiles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                alert(t['success_update'] || '✅ Profil mis à jour avec succès !');
                router.push('/profile');
            } else {
                const error = await res.json();
                alert(`${t['error_update']}: ${error.message || 'Error'}`);
            }
        } catch (err) {
            console.error(err);
            alert(t['error_server']);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <main className="hero-section" style={{ background: 'var(--background)' }}>
            <div style={{ transform: 'scale(1.5)', marginBottom: '1rem' }}>⚙️</div>
            <h1 className="font-heading">{t['loading_text']}</h1>
        </main>
    );

    const completeness = calculateCompleteness();

    return (
        <main style={{ background: 'var(--background)', minHeight: '100vh', padding: '1rem 1rem 120px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'sticky', top: 0, padding: '1rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, marginLeft: '-1rem', marginRight: '-1rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                    <BackButton />
                    <h1 className="font-heading" style={{ fontSize: '1.5rem', margin: 0 }}>{t['edit_profile_title']}</h1>
                </div>

                {/* Completeness Bar */}
                <div className="premium-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t['profile_completeness']}</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{completeness}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${completeness}%`,
                            height: '100%',
                            background: 'var(--gradient-primary)',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: isRtl ? 'right' : 'left' }}>
                        {t['completeness_desc']}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* 1️⃣ IDENTITÉ DE BASE */}
                    <ProfileSection title={t['section_identity']} icon="👤" defaultOpen={true}>
                        <FormField
                            label={t['label_fullname']}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <FormField
                            label={t['label_pseudo']}
                            name="pseudo"
                            value={formData.pseudo}
                            onChange={handleChange}
                            placeholder={t['placeholder_pseudo']}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormField
                                label={t['label_age']}
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />

                            <FormField
                                label={t['label_gender']}
                                name="gender"
                                type="select"
                                value={formData.gender}
                                onChange={handleChange}
                                options={PROFILE_OPTIONS.GENDER}
                                required
                            />
                        </div>

                        <FormField
                            label={t['label_orientation']}
                            name="orientation"
                            type="select"
                            value={formData.orientation}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.ORIENTATION}
                        />

                        <FormField
                            label={t['label_languages']}
                            name="languages"
                            type="multiselect"
                            value={formData.languages}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.LANGUAGES}
                        />
                    </ProfileSection>

                    {/* 2️⃣ LOCALISATION */}
                    <ProfileSection title={t['section_location']} icon="🌍">
                        <FormField
                            label={t['label_country']}
                            name="country"
                            type="select"
                            value={formData.country}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.COUNTRY}
                        />

                        <FormField
                            label={t['label_city']}
                            name="city"
                            type="select"
                            value={formData.city}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.CITY}
                        />

                        <FormField
                            label={t['label_neighborhood']}
                            name="neighborhood"
                            value={formData.neighborhood}
                            onChange={handleChange}
                            placeholder={t['placeholder_neighborhood']}
                        />

                        <FormField
                            label={t['label_mobility']}
                            name="mobility"
                            type="select"
                            value={formData.mobility}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.MOBILITY}
                            helpText={t['help_mobility']}
                        />
                    </ProfileSection>

                    {/* 3️⃣ OBJECTIF DE RENCONTRE */}
                    <ProfileSection title={t['section_goal']} icon="❤️">
                        <FormField
                            label={t['label_rel_goal']}
                            name="relationshipGoal"
                            type="select"
                            value={formData.relationshipGoal}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.RELATIONSHIP_GOAL}
                        />

                        <FormField
                            label={t['label_open_distance']}
                            name="openToDistance"
                            type="select"
                            value={formData.openToDistance}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.OPEN_TO_DISTANCE}
                            helpText={t['help_open_distance']}
                        />
                    </ProfileSection>

                    {/* 4️⃣ PERSONNALITÉ */}
                    <ProfileSection title={t['section_personality']} icon="🧠">
                        <FormField
                            label={t['label_personality']}
                            name="personalityType"
                            type="select"
                            value={formData.personalityType}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.PERSONALITY_TYPE}
                        />

                        <FormField
                            label={t['label_temperament']}
                            name="temperament"
                            type="select"
                            value={formData.temperament}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.TEMPERAMENT}
                        />

                        <FormField
                            label={t['label_humor']}
                            name="humorImportance"
                            type="select"
                            value={formData.humorImportance}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.HUMOR_IMPORTANCE}
                        />
                    </ProfileSection>

                    {/* 5️⃣ CENTRES D'INTÉRÊT */}
                    <ProfileSection title={t['section_interests']} icon="🎯">
                        <FormField
                            label={t['label_select_passions']}
                            name="interests"
                            type="multiselect"
                            value={formData.interests}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.INTERESTS}
                        />
                    </ProfileSection>

                    {/* 6️⃣ SITUATION PERSONNELLE */}
                    <ProfileSection title={t['section_status']} icon="👨‍👩‍👧‍👦">
                        <FormField
                            label={t['label_rel_status']}
                            name="relationshipStatus"
                            type="select"
                            value={formData.relationshipStatus}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.RELATIONSHIP_STATUS}
                        />

                        <FormField
                            label={t['label_children']}
                            name="children"
                            type="select"
                            value={formData.children}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.CHILDREN}
                        />

                        <FormField
                            label={t['label_wants_children']}
                            name="wantsChildren"
                            type="select"
                            value={formData.wantsChildren}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.WANTS_CHILDREN}
                        />
                    </ProfileSection>

                    {/* 7️⃣ ÉTUDES & TRAVAIL */}
                    <ProfileSection title={t['section_education']} icon="🎓">
                        <FormField
                            label={t['label_education']}
                            name="educationLevel"
                            type="select"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.EDUCATION_LEVEL}
                        />

                        <FormField
                            label={t['label_profession']}
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            placeholder={t['placeholder_profession']}
                        />

                        <FormField
                            label={t['label_job_status']}
                            name="jobStatus"
                            type="select"
                            value={formData.jobStatus}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.JOB_STATUS}
                        />
                    </ProfileSection>

                    {/* 8️⃣ RELIGION & VALEURS */}
                    <ProfileSection title={t['section_values']} icon="🙏">
                        <FormField
                            label={t['label_religion']}
                            name="religion"
                            type="select"
                            value={formData.religion}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.RELIGION}
                        />

                        <FormField
                            label={t['label_practice']}
                            name="religiousPractice"
                            type="select"
                            value={formData.religiousPractice}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.RELIGIOUS_PRACTICE}
                        />

                        <FormField
                            label={t['label_values']}
                            name="values"
                            type="multiselect"
                            value={formData.values}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.VALUES}
                        />
                    </ProfileSection>

                    {/* 9️⃣ APPARENCE PHYSIQUE */}
                    <ProfileSection title={t['section_appearance']} icon="💪">
                        <FormField
                            label={t['label_height']}
                            name="height"
                            type="select"
                            value={formData.height}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.HEIGHT}
                        />

                        <FormField
                            label={t['label_body_type']}
                            name="bodyType"
                            type="select"
                            value={formData.bodyType}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.BODY_TYPE}
                        />

                        <FormField
                            label={t['label_style']}
                            name="style"
                            type="select"
                            value={formData.style}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.STYLE}
                        />
                    </ProfileSection>

                    {/* 🔟 HABITUDES */}
                    <ProfileSection title={t['section_habits']} icon="🍷">
                        <FormField
                            label={t['label_smoking']}
                            name="smoking"
                            type="select"
                            value={formData.smoking}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.SMOKING}
                        />

                        <FormField
                            label={t['label_drinking']}
                            name="drinking"
                            type="select"
                            value={formData.drinking}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.DRINKING}
                        />

                        <FormField
                            label={t['label_sports']}
                            name="sports"
                            type="select"
                            value={formData.sports}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.SPORTS_FREQUENCY}
                        />

                        <FormField
                            label={t['label_going_out']}
                            name="goingOut"
                            type="select"
                            value={formData.goingOut}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.GOING_OUT}
                        />
                    </ProfileSection>

                    {/* 🔐 CONFIDENTIALITÉ */}
                    <ProfileSection title={t['section_privacy']} icon="🔒">
                        <FormField
                            label={t['label_visibility']}
                            name="profileVisibility"
                            type="select"
                            value={formData.profileVisibility}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.PROFILE_VISIBILITY}
                            helpText={t['help_visibility']}
                        />

                        <FormField
                            label={t['label_msg_settings']}
                            name="messageSettings"
                            type="select"
                            value={formData.messageSettings}
                            onChange={handleChange}
                            options={PROFILE_OPTIONS.MESSAGE_SETTINGS}
                            helpText={t['help_msg_settings']}
                        />
                    </ProfileSection>

                    {/* 🎯 PROFIL RECHERCHÉ (PREFERENCES) */}
                    <ProfileSection title={t['section_preferences']} icon="🎯">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t['label_min_age']}</label>
                                <input
                                    type="number"
                                    value={formData.preferences?.minAge || 18}
                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, minAge: parseInt(e.target.value) } })}
                                    className="input-field"
                                    style={{ padding: '0.8rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t['label_max_age']}</label>
                                <input
                                    type="number"
                                    value={formData.preferences?.maxAge || 50}
                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, maxAge: parseInt(e.target.value) } })}
                                    className="input-field"
                                    style={{ padding: '0.8rem' }}
                                />
                            </div>
                        </div>

                        <FormField
                            label={t['label_looking_for']}
                            name="pref_gender"
                            type="select"
                            value={formData.preferences?.gender || 'Tout'}
                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, gender: e.target.value } })}
                            options={['Tout', ...PROFILE_OPTIONS.GENDER]}
                        />

                        <FormField
                            label={t['label_max_dist']}
                            name="pref_distance"
                            type="select"
                            value={formData.preferences?.distance || 50}
                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, distance: parseInt(e.target.value) } })}
                            options={PROFILE_OPTIONS.DISTANCE.map((d: any) => ({ value: d.value.toString(), label: d.label })) as any}
                        />

                        <FormField
                            label={t['label_rel_goal']}
                            name="pref_relationshipGoal"
                            type="select"
                            value={formData.preferences?.relationshipGoal || 'Tout'}
                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, relationshipGoal: e.target.value } })}
                            options={['Tout', ...PROFILE_OPTIONS.RELATIONSHIP_GOAL]}
                        />

                        <FormField
                            label={t['label_religion']}
                            name="pref_religion"
                            type="select"
                            value={formData.preferences?.religion || 'Tout'}
                            onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, religion: e.target.value } })}
                            options={['Tout', ...PROFILE_OPTIONS.RELIGION]}
                        />
                    </ProfileSection>


                    {/* BIO & CONTACT */}
                    <ProfileSection title={t['section_bio']} icon="✍️">
                        <FormField
                            label={t['label_bio']}
                            name="bio"
                            type="textarea"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder={t['placeholder_bio']}
                            rows={5}
                        />

                        <FormField
                            label={t['label_contact']}
                            name="contactInfo"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            placeholder={t['placeholder_contact']}
                            helpText={t['help_contact']}
                        />
                    </ProfileSection>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1.3rem',
                            fontSize: '1.1rem',
                            marginTop: '1rem',
                            opacity: saving ? 0.7 : 1
                        }}
                    >
                        {saving ? t['btn_saving'] : t['btn_save']}
                    </button>
                </form>
            </div>
            <BottomNav />
        </main>
    );
}
