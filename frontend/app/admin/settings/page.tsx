"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
    const router = useRouter();
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        // Placeholder for fetchConfig, assuming it will be defined elsewhere or in a subsequent instruction
        const fetchConfig = () => {
            // Simulate fetching data
            setTimeout(() => {
                setConfig({
                    appName: 'DatingApp Togo',
                    contactEmail: 'support@datingapp.tg',
                    minAge: 18,
                    freeSwipes: 50,
                    freeSuperLikes: 1,
                    maintenanceMode: false
                });
                setLoading(false);
            }, 500);
        };
        fetchConfig();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.5rem' }}>
                Chargement des paramètres...
            </div>
        );
    }

    if (!config) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.5rem', color: 'red' }}>
                Erreur lors du chargement des paramètres.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', background: '#f0f2f5', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
            <AdminSidebar />

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '260px',
                padding: isMobile ? '20px' : '40px',
                width: isMobile ? '100%' : 'auto'
            }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Configuration Système</h1>
                    <p style={{ color: '#888' }}>Paramètres généraux de l'application et seuils de modération.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                    <Section title="🌍 Application & Général">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Field label="Nom de l'application" value={config.appName} onChange={(v: string) => setConfig({ ...config, appName: v })} />
                            <Field label="Email de contact" value={config.contactEmail} onChange={(v: string) => setConfig({ ...config, contactEmail: v })} />
                            <Field label="Âge minimum" type="number" value={config.minAge} onChange={(v: number) => setConfig({ ...config, minAge: v })} />
                        </div>
                    </Section>

                    <Section title="📱 Limites & Gameplay (Gratuit)">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Field label="Swipes gratuits / jour" type="number" value={config.freeSwipes} onChange={(v: number) => setConfig({ ...config, freeSwipes: v })} />
                            <Field label="Super Likes gratuits / jour" type="number" value={config.freeSuperLikes} onChange={(v: number) => setConfig({ ...config, freeSuperLikes: v })} />
                        </div>
                    </Section>

                    <Section title="💰 Configuration Paiements">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <Toggle label="MTN Money Togo" active={true} />
                            <Toggle label="Moov Money Togo" active={true} />
                            <Toggle label="Stripe (Cartes)" active={false} />
                            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
                                Les clés d'API sont gérées via les variables d'environnement (.env).
                            </div>
                        </div>
                    </Section>

                    <Section title="⚠️ Maintenance & Sécurité">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Toggle
                                label="Mode Maintenance"
                                active={config.maintenanceMode}
                                onChange={(v: boolean) => setConfig({ ...config, maintenanceMode: v })}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#e74c3c' }}>
                                L'activation du mode maintenance rendra l'application inaccessible à tous les utilisateurs (sauf admins).
                            </p>
                            <button style={{ padding: '12px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </Section>
                </div>
            </main>
        </div>
    );
}

const Section = ({ title, children }: any) => (
    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '15px 24px', borderBottom: '1px solid #f0f2f5', background: '#fff' }}>
            <h3 className="font-heading" style={{ margin: 0, fontSize: '1rem', color: '#2d3436' }}>{title}</h3>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
    </div>
);

const Field = ({ label, value, onChange, type = "text" }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 600 }}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem' }}
        />
    </div>
);

const Toggle = ({ label, active, onChange }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</span>
        <div
            onClick={() => onChange && onChange(!active)}
            style={{
                width: '50px', height: '26px', borderRadius: '20px',
                background: active ? '#2ecc71' : '#ddd',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
            }}
        >
            <div style={{
                width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                position: 'absolute', top: '4px', left: active ? '28px' : '4px', transition: 'left 0.3s'
            }}></div>
        </div>
    </div>
);
