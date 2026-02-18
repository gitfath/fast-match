"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../../components/AdminSidebar';

export default function BusinessManagement() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        fetchBusinesses();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchBusinesses = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/businesses`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBusinesses(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const toggleVerification = async (businessId: string, currentStatus: boolean) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/businesses/${businessId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ verified: !currentStatus })
            });
            if (res.ok) {
                setBusinesses(businesses.map(b => b.id === businessId ? { ...b, verified: !currentStatus } : b));
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
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Gestion des Partenaires</h1>
                    <p style={{ color: '#888' }}>Approuvez et gérez les établissements (Restaurants, Bars, Cinémas).</p>
                </header>

                <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8f9fc', fontSize: '0.85rem', color: '#888' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Établissement</th>
                                <th style={{ padding: '20px' }}>Type / Ville</th>
                                <th style={{ padding: '20px' }}>Propriétaire</th>
                                <th style={{ padding: '20px' }}>Statut</th>
                                <th style={{ padding: '20px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Chargement...</td></tr>
                            ) : businesses.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Aucun partenaire enregistré</td></tr>
                            ) : businesses.map(business => (
                                <tr key={business.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 700 }}>{business.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{business.address}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{business.type}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{business.city}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{business.owner?.email || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                                            background: business.verified ? '#d1fae5' : '#fee2e2',
                                            color: business.verified ? '#065f46' : '#991b1b'
                                        }}>
                                            {business.verified ? 'VÉRIFIÉ ✅' : 'NON VÉRIFIÉ ❌'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <button
                                            onClick={() => toggleVerification(business.id, business.verified)}
                                            style={{
                                                padding: '8px 15px', borderRadius: '8px',
                                                background: business.verified ? '#f1f2f6' : 'var(--primary)',
                                                color: business.verified ? '#444' : 'white',
                                                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
                                            }}
                                        >
                                            {business.verified ? 'Révoquer' : 'Approuver'}
                                        </button>
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
