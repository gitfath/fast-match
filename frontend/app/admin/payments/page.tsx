"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../../components/AdminSidebar';

export default function PaymentsManagement() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const token = localStorage.getItem('token');
        fetch(`${API_BASE_URL}/admin/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            });
    }, []);

    const totalRevenue = transactions
        .filter(t => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.amount, 0);

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
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <div>
                        <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Gestion Financière</h1>
                        <p style={{ color: '#888' }}>Historique complet des transactions et revenus.</p>
                    </div>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>CA Global</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{totalRevenue.toLocaleString()} F CFA</div>
                    </div>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <SummaryItem title="MTN Money" value={transactions.filter(t => t.provider === 'TMONEY').length} amount={transactions.filter(t => t.provider === 'TMONEY' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0)} />
                    <SummaryItem title="Moov Money" value={transactions.filter(t => t.provider === 'MOOV').length} amount={transactions.filter(t => t.provider === 'MOOV' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0)} />
                    <SummaryItem title="Stripe / Carte" value={transactions.filter(t => t.provider === 'STRIPE').length} amount={transactions.filter(t => t.provider === 'STRIPE' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0)} />
                </div>

                <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0 }}>Toutes les Transactions</h3>
                        <button style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Exporter CSV</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8f9fc', fontSize: '0.85rem', color: '#888' }}>
                            <tr>
                                <th style={{ padding: '20px' }}>Utilisateur</th>
                                <th style={{ padding: '20px' }}>Produit</th>
                                <th style={{ padding: '20px' }}>Montant</th>
                                <th style={{ padding: '20px' }}>Méthode</th>
                                <th style={{ padding: '20px' }}>Statut</th>
                                <th style={{ padding: '20px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Chargement...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Aucune transaction enregistrée</td></tr>
                            ) : transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 600 }}>{t.user?.profile?.name || 'Inconnu'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{t.user?.email || t.user?.phone}</div>
                                    </td>
                                    <td style={{ padding: '20px' }}>{t.description || 'Achat'}</td>
                                    <td style={{ padding: '20px', fontWeight: 700 }}>{t.amount} F</td>
                                    <td style={{ padding: '20px' }}>{t.provider}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                                            background: t.status === 'COMPLETED' ? '#d1fae5' : t.status === 'FAILED' ? '#fee2e2' : '#fef3c7',
                                            color: t.status === 'COMPLETED' ? '#065f46' : t.status === 'FAILED' ? '#991b1b' : '#92400e'
                                        }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', color: '#888' }}>{new Date(t.createdAt).toLocaleString('fr-FR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

const SummaryItem = ({ title, value, amount }: any) => (
    <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>{title}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{amount.toLocaleString()} F</div>
        <div style={{ fontSize: '0.75rem', color: '#2ecc71' }}>{value} transactions réussies</div>
    </div>
);
