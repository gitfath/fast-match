"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL, BACKEND_URL } from '../../../config';
import AdminSidebar from '../../../../components/AdminSidebar';



export default function UserDetail() {
    const router = useRouter();
    const { userId } = useParams();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [sanctionModal, setSanctionModal] = useState(false);
    const [sanctionData, setSanctionData] = useState({ type: 'WARNING', reason: '', durationDays: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        fetchUserDetail();
        return () => window.removeEventListener('resize', checkMobile);
    }, [userId]);

    const fetchUserDetail = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUser(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSanction = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/sanction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sanctionData)
            });
            if (res.ok) {
                alert("Sanction appliquée");
                setSanctionModal(false);
                fetchUserDetail();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleVerification = async (currentStatus: boolean) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ verified: !currentStatus })
            });
            if (res.ok) {
                fetchUserDetail();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>Chargement...</div>;
    if (!user) return <div>Utilisateur non trouvé</div>;

    const profile = user.profile || user.business || {};

    return (
        <div style={{ display: 'flex', background: '#f0f2f5', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
            <AdminSidebar />

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '260px',
                padding: isMobile ? '20px' : '40px',
                width: isMobile ? '100%' : 'auto'
            }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <button onClick={() => router.back()} style={{ background: 'white', border: '1px solid #ddd', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer' }}>⇠ Retour</button>
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', margin: 0 }}>Profil : {profile.name}</h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '20px' : '30px' }}>
                    {/* Left Column - Essential Info */}
                    <div>
                        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 20px', overflow: 'hidden' }}>
                                {profile.photos?.[0] ? <img src={profile.photos[0].url.startsWith('http') ? profile.photos[0].url : (BACKEND_URL + profile.photos[0].url)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: '3rem', marginTop: '20px' }}>👤</div>}
                            </div>
                            <h2 style={{ fontSize: '1.4rem', margin: '0 0 5px' }}>{profile.name}</h2>
                            <p style={{ color: '#888', margin: '0 0 20px' }}>{user.email || user.phone}</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                                {user.role === 'ADMIN' && <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>ADMIN</span>}
                                {profile.verified && <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>VÉRIFIÉ ✅</span>}
                                {profile.isPremium && <span style={{ padding: '4px 8px', background: '#eff6ff', color: '#1e40af', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>PREMIUM 💎</span>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    onClick={() => setSanctionModal(true)}
                                    style={{ padding: '12px', borderRadius: '10px', background: '#e74c3c', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    ⚠️ Sanctionner
                                </button>
                                <button
                                    onClick={() => toggleVerification(profile.verified)}
                                    style={{ padding: '12px', borderRadius: '10px', background: profile.verified ? '#f1f2f6' : '#2ecc71', color: profile.verified ? '#333' : 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    {profile.verified ? 'Dévérifier' : '✅ Vérifier'}
                                </button>
                            </div>
                        </div>

                        <Section title="Informations de Base">
                            <InfoRow label="ID" value={user.id} />
                            <InfoRow label="Pseudo" value={profile.pseudo || '-'} />
                            <InfoRow label="Âge" value={profile.age || '-'} />
                            <InfoRow label="Inscription" value={new Date(user.createdAt).toLocaleDateString()} />
                            <InfoRow label="Localisation" value={`${profile.city || '-'}, ${profile.country || '-'}`} />
                            <InfoRow label="Statut" value={profile.accountStatus} />
                        </Section>
                    </div>

                    {/* Right Column - Stats & History */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <MiniStat title="Likes donnés" value={user.likesSent?.length || 0} />
                            <MiniStat title="Likes reçus" value={user.likesRec?.length || 0} />
                            <MiniStat title="Matchs" value={user.matches?.length || 0} />
                        </div>

                        <Section title="Paiements & Transactions">
                            {user.payments?.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: '#888' }}>
                                        <th style={{ padding: '10px' }}>Produit</th>
                                        <th style={{ padding: '10px' }}>Montant</th>
                                        <th style={{ padding: '10px' }}>Date</th>
                                        <th style={{ padding: '10px' }}>Statut</th>
                                    </tr>
                                    {user.payments.map((p: any) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '0.85rem' }}>
                                            <td style={{ padding: '10px' }}>{p.description || 'Paiement'}</td>
                                            <td style={{ padding: '10px', fontWeight: 700 }}>{p.amount} F</td>
                                            <td style={{ padding: '10px' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '10px' }}>{p.status}</td>
                                        </tr>
                                    ))}
                                </table>
                            ) : <p style={{ color: '#888', textAlign: 'center' }}>Aucune transaction trouvée</p>}
                        </Section>

                        <div style={{ marginTop: '30px' }}>
                            <Section title="Signalements & Sanctions">
                                <h4 style={{ fontSize: '0.9rem', color: '#e74c3c' }}>Signalements Reçus ({user.reportsRec?.length || 0})</h4>
                                {user.reportsRec?.map((r: any) => (
                                    <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', fontSize: '0.85rem' }}>
                                        <strong>{r.reason}</strong> le {new Date(r.createdAt).toLocaleDateString()}
                                    </div>
                                ))}

                                <h4 style={{ fontSize: '0.9rem', color: '#333', marginTop: '20px' }}>Historique des Sanctions ({user.sanctions?.length || 0})</h4>
                                {user.sanctions?.map((s: any) => (
                                    <div key={s.id} style={{ padding: '10px', borderBottom: '1px solid #f0f0f1', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 700 }}>{s.type}</span> - {s.reason} ({new Date(s.createdAt).toLocaleDateString()})
                                    </div>
                                ))}
                            </Section>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sanction Modal */}
            {sanctionModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '400px' }}>
                        <h3>Sanctionner {profile.name}</h3>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Type de sanction</label>
                        <select
                            value={sanctionData.type}
                            onChange={(e) => setSanctionData({ ...sanctionData, type: e.target.value })}
                            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="WARNING">Avertissement</option>
                            <option value="SUSPENSION">Suspension Temporaire</option>
                            <option value="BAN">Bannissement Définitif</option>
                        </select>
                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Motif</label>
                        <textarea
                            value={sanctionData.reason}
                            onChange={(e) => setSanctionData({ ...sanctionData, reason: e.target.value })}
                            style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
                            placeholder="Détaillez le motif..."
                        />
                        {sanctionData.type === 'SUSPENSION' && (
                            <>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Durée (jours)</label>
                                <input
                                    type="number"
                                    value={sanctionData.durationDays}
                                    onChange={(e) => setSanctionData({ ...sanctionData, durationDays: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                            </>
                        )}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setSanctionModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#f1f2f6', border: 'none', cursor: 'pointer' }}>Annuler</button>
                            <button onClick={handleSanction} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#e74c3c', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Appliquer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Section = ({ title, children }: any) => (
    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '30px' }}>
        <div style={{ padding: '15px 24px', borderBottom: '1px solid #f0f2f5', background: '#fff' }}>
            <h3 className="font-heading" style={{ margin: 0, fontSize: '1rem', color: '#2d3436' }}>{title}</h3>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
    </div>
);

const InfoRow = ({ label, value }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f9f9f9' }}>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', wordBreak: 'break-all', textAlign: 'right' }}>{value}</span>
    </div>
);

const MiniStat = ({ title, value }: any) => (
    <div style={{ background: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{value}</div>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
    </div>
);
