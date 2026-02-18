"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../config';
import { WithdrawModal } from '../../components/WithdrawModal';
import { translations } from '../../utils/translations';

interface Wallet {
    balanceFCFA: number;
    balancePoints: number;
}

interface Transaction {
    id: string;
    amount: number;
    currency: string;
    type: string;
    description: string;
    status: string;
    createdAt: string;
}

export default function WalletScreen() {
    const router = useRouter();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [language, setLanguage] = useState('Français');

    const fetchWalletData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
        const t = translations[savedLang || 'Français'] || translations['Français'];

        try {
            // Check Profile for Premium
            const profileRes = await fetch(`${API_BASE_URL}/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (profileRes.ok) {
                const profile = await profileRes.json();
                if (!profile.isPremium) {
                    alert(t['wallet_premium_only']);
                    router.push('/premium');
                    return;
                }
            }

            const [walletRes, transRes] = await Promise.all([
                fetch(`${API_BASE_URL}/monetization/balance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/monetization/transactions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (walletRes.ok) setWallet(await walletRes.json());
            if (transRes.ok) setTransactions(await transRes.json());
        } catch (error) {
            console.error('Failed to fetch wallet data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [router]);

    const t = translations[language] || translations['Français'];
    const isRtl = language === 'العربية';

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>{t['loading']}</div>;

    return (
        <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '20px', direction: isRtl ? 'rtl' : 'ltr' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', [isRtl ? 'marginLeft' : 'marginRight']: '15px' }}>{isRtl ? '→' : '←'}</button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{t['wallet_title']}</h1>
                <button style={{ [isRtl ? 'marginRight' : 'marginLeft']: 'auto', background: 'none', border: 'none', fontSize: '1.2rem' }}>⚙️</button>
            </header>

            <div style={{
                background: 'var(--gradient-primary)',
                borderRadius: '24px',
                padding: '30px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(255,107,53,0.3)',
                marginBottom: '30px'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>{t['available_balance']}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, margin: '5px 0', direction: 'ltr' }}>
                    {wallet?.balanceFCFA.toLocaleString()} FCFA
                </div>
                <div style={{ fontSize: '1.1rem', background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '100px', display: 'inline-block', direction: 'ltr' }}>
                    {wallet?.balancePoints} {t['points']}
                </div>
            </div>

            <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px', textAlign: isRtl ? 'right' : 'left' }}>{t['recent_earnings']}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {transactions.slice(0, 3).map((tx: Transaction) => (
                        <div key={tx.id} style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            flexDirection: isRtl ? 'row-reverse' : 'row'
                        }}>
                            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{tx.description}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{ fontWeight: 700, color: tx.amount > 0 ? '#4CAF50' : '#F44336', direction: 'ltr' }}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>{t['no_recent_transactions']}</div>}
                </div>
            </section>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                    onClick={() => setShowWithdraw(true)}
                    style={{
                        padding: '18px',
                        borderRadius: '16px',
                        border: 'none',
                        background: '#0F172A',
                        color: 'white',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                    {t['withdraw_to_mobile_money']}
                </button>
                <button style={{
                    padding: '18px',
                    borderRadius: '16px',
                    border: '2px solid #EEE',
                    background: 'white',
                    color: '#333',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}>
                    {t['use_points']}
                </button>
                <button
                    onClick={() => router.push('/wallet/history')}
                    style={{
                        padding: '15px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                    }}>
                    {t['full_history']} {isRtl ? '<' : '>'}
                </button>
                <button
                    onClick={() => router.push('/wallet/earn')}
                    style={{
                        padding: '18px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'var(--secondary)',
                        color: 'white',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginTop: '10px'
                    }}>
                    {t['earn_coins']}
                </button>
            </div>

            {showWithdraw && wallet && (
                <WithdrawModal
                    balance={wallet.balanceFCFA}
                    onClose={() => setShowWithdraw(false)}
                    onSuccess={() => {
                        setShowWithdraw(false);
                        fetchWalletData();
                        alert(t['withdraw_success']);
                    }}
                />
            )}
        </main>
    );
}
