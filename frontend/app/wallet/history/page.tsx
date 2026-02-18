"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import { translations } from '../../../utils/translations';

interface Transaction {
    id: string;
    amount: number;
    currency: string;
    type: string;
    description: string;
    status: string;
    reference: string;
    createdAt: string;
}

export default function TransactionHistoryScreen() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);

        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE_URL}/monetization/transactions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setTransactions(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    const getLocale = () => {
        switch (language) {
            case 'English': return 'en-US';
            case 'العربية': return 'ar-SA';
            default: return 'fr-FR';
        }
    };

    const groupedTransactions: Record<string, Transaction[]> = transactions.reduce((acc, tx) => {
        const date = new Date(tx.createdAt);
        const monthYear = date.toLocaleString(getLocale(), { month: 'long', year: 'numeric' });
        const key = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
        if (!acc[key]) acc[key] = [];
        acc[key].push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <main style={{ minHeight: '100vh', background: '#F8F9FA', padding: '20px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', [isRtl ? 'marginLeft' : 'marginRight']: '15px', transform: isRtl ? 'scaleX(-1)' : 'none' }}>←</button>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{t['history_title']}</h1>
                <button style={{ [isRtl ? 'marginRight' : 'marginLeft']: 'auto', background: 'white', border: '1px solid #EEE', borderRadius: '8px', padding: '5px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{t['filters']} ▼</button>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>{t['loading_text']}</div>
            ) : (
                <>
                    {Object.entries(groupedTransactions).map(([month, txs]) => (
                        <div key={month} style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', [isRtl ? 'paddingRight' : 'paddingLeft']: '5px', textAlign: isRtl ? 'right' : 'left' }}>
                                {month}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {txs.map(tx => (
                                    <div
                                        key={tx.id}
                                        onClick={() => alert(`${t['details']}: ${tx.reference}\n${t['status']}: ${tx.status}`)}
                                        style={{
                                            background: 'white',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                            cursor: 'pointer',
                                            flexDirection: isRtl ? 'row-reverse' : 'row'
                                        }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: tx.amount > 0 ? '#E8F5E9' : '#FFEBEE',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            {tx.amount > 0 ? '⬆️' : '⬇️'}
                                        </div>
                                        <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0F172A' }}>{tx.description}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', gap: '8px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                                                <span>{new Date(tx.createdAt).toLocaleDateString(getLocale())}</span>
                                                <span style={{ direction: 'ltr' }}>#{tx.reference?.split('-').pop()}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                                            <div style={{
                                                fontWeight: 800,
                                                fontSize: '1rem',
                                                color: tx.amount > 0 ? '#10B981' : '#EF4444',
                                                direction: 'ltr'
                                            }}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8' }}>{tx.currency}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748B' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📜</div>
                            <p>{t['no_transactions']}</p>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}
