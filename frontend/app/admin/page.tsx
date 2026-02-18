"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!token || userRole !== 'ADMIN') {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/admin/activity`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const statsData = await statsRes.json();
                const activityData = await activityRes.json();

                setStats(statsData);
                setActivity(activityData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
        return () => window.removeEventListener('resize', checkMobile);
    }, [router]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>Chargement de l'administration...</div>;

    return (
        <div style={{ display: 'flex', background: '#f0f2f5', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
            <AdminSidebar />

            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '260px',
                padding: isMobile ? '20px' : '40px',
                width: isMobile ? '100%' : 'auto'
            }}>
                <header style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '15px',
                    marginBottom: '40px'
                }}>
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Aperçu Général</h1>
                    <div style={{ background: 'white', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                        📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* KPI Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <KPICard title="Utilisateurs" value={format(stats?.users?.total)} subValue="+12%" subTitle="vs mois dernier" icon="👥" color="#4e73df" />
                    <KPICard title="CA Jour" value={`${format(stats?.revenue?.today)} F`} subValue="+8%" subTitle="vs hier" icon="💰" color="#1cc88a" />
                    <KPICard title="Signalements" value={stats?.reports?.pending} subValue="-5%" subTitle="vs hier" icon="🚩" color="#e74a3b" />
                    <KPICard title="En Attente" value="28" subValue="+3" subTitle="nouveaux" icon="⚠️" color="#f6c23e" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px' }}>
                    {/* Activity Chart Area (Placeholder for actual chart) */}
                    <Section title="Activité Récente (7 derniers jours)">
                        <div style={{ height: isMobile ? '200px' : '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px' }}>
                            {stats?.activityProgress?.map((day: any, i: number) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                    <div style={{ width: '30%', background: 'var(--primary)', height: `${Math.min(day.inscriptions * 10, isMobile ? 150 : 200)}px`, borderRadius: '4px 4px 0 0' }}></div>
                                    <span style={{ fontSize: '0.6rem', color: '#888' }}>{isMobile ? day.date.split('-')[2] : day.date.split('-').slice(1).reverse().join('/')}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '0 20px 20px', display: 'flex', gap: '20px', fontSize: '0.8rem', color: '#555' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                Nouveaux inscrits
                            </div>
                        </div>
                    </Section>

                    {/* Pending Reports */}
                    <Section title="🚨 Signalements Urgents">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {activity?.reports?.length > 0 ? (
                                activity.reports.map((report: any) => (
                                    <div key={report.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{report.reason}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>par {report.reported?.profile?.name || 'Inconnu'}</div>
                                        </div>
                                        <button
                                            onClick={() => router.push('/admin/reports')}
                                            style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                        >
                                            Gérer
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Aucun signalement urgent</p>
                            )}
                            <button
                                onClick={() => router.push('/admin/reports')}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'center', marginTop: '10px' }}
                            >
                                Voir tous les signalements →
                            </button>
                        </div>
                    </Section>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <Section title="💰 Dernières Transactions">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fc', textAlign: 'left', fontSize: '0.85rem', color: '#888' }}>
                                        <th style={{ padding: '15px' }}>Méthode</th>
                                        <th style={{ padding: '15px' }}>Montant</th>
                                        <th style={{ padding: '15px' }}>Utilisateur</th>
                                        <th style={{ padding: '15px' }}>Statut</th>
                                        <th style={{ padding: '15px' }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity?.payments?.map((payment: any) => (
                                        <tr key={payment.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                                            <td style={{ padding: '15px' }}>{payment.provider}</td>
                                            <td style={{ padding: '15px', fontWeight: 700 }}>{payment.amount} F</td>
                                            <td style={{ padding: '15px' }}>{payment.user?.profile?.name}</td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem',
                                                    background: payment.status === 'COMPLETED' ? '#d1fae5' : payment.status === 'FAILED' ? '#fee2e2' : '#fef3c7',
                                                    color: payment.status === 'COMPLETED' ? '#065f46' : payment.status === 'FAILED' ? '#991b1b' : '#92400e'
                                                }}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', color: '#888' }}>{new Date(payment.createdAt).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={() => router.push('/admin/payments')}
                                style={{ display: 'block', width: '100%', padding: '15px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, textAlign: 'center', cursor: 'pointer' }}
                            >
                                Voir toutes les transactions →
                            </button>
                        </div>
                    </Section>
                </div>
            </main>
        </div>
    );
}

const KPICard = ({ title, value, subValue, subTitle, icon, color }: any) => (
    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `6px solid ${color}` }}>
        <div>
            <div style={{ color: color, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2d3436' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                <span style={{ color: subValue.startsWith('+') ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>{subValue}</span>
                <span style={{ color: '#b2bec3', marginLeft: '5px' }}>{subTitle}</span>
            </div>
        </div>
        <div style={{ fontSize: '2.5rem', opacity: 0.1 }}>{icon}</div>
    </div>
);

const Section = ({ title, children }: any) => (
    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '15px 24px', borderBottom: '1px solid #f0f2f5', background: '#fff' }}>
            <h2 className="font-heading" style={{ margin: 0, fontSize: '1.1rem', color: '#2d3436' }}>{title}</h2>
        </div>
        <div style={{ padding: '20px' }}>
            {children}
        </div>
    </div>
);

const format = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
};
