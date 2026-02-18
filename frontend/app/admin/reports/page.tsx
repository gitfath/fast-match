"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../../components/AdminSidebar';

export default function ReportManagement() {
    const router = useRouter();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        fetchReports();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchReports = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/reports`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setReports(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (reportId: string, status: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Modération des Signalements</h1>
                    <p style={{ color: '#888', margin: '5px 0 0' }}>{reports.length} signalements en attente de traitement</p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8f9fc', fontSize: '0.85rem', color: '#888' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Signalé</th>
                                <th style={{ padding: '20px' }}>Motif / Urgence</th>
                                <th style={{ padding: '20px' }}>Signaleur</th>
                                <th style={{ padding: '20px' }}>Statut</th>
                                <th style={{ padding: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Chargement...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Aucun signalement en attente</td></tr>
                            ) : reports.map(report => (
                                <tr key={report.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 700 }}>{report.reported?.profile?.name || 'Utilisateur'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>ID: {report.reportedId}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 600, color: '#e74c3c' }}>{report.reason}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Urg: {report.urgency || 'MEDIUM'}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{report.reporter?.profile?.name || 'Inconnu'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(report.createdAt).toLocaleString('fr-FR')}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                                            background: report.status === 'PENDING' ? '#fff3cd' : report.status === 'RESOLVED' ? '#d1fae5' : '#f1f2f6',
                                            color: report.status === 'PENDING' ? '#856404' : report.status === 'RESOLVED' ? '#065f46' : '#636e72'
                                        }}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => router.push(`/admin/users/${report.reportedId}`)}
                                                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                                            >
                                                👁️ Profil
                                            </button>
                                            {report.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(report.id, 'RESOLVED')}
                                                        style={{ padding: '6px 12px', borderRadius: '6px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        ✅ Résoudre
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(report.id, 'DISMISSED')}
                                                        style={{ padding: '6px 12px', borderRadius: '6px', background: '#f1f2f6', color: '#636e72', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Ignorer
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
