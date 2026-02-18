"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';
import { faqData, FAQCategory, FAQItem } from './faqData';
import { translations } from '../../utils/translations';
import { useRouter } from 'next/navigation';

export default function Assistant() {
    const router = useRouter();
    // Determine view state: 'categories' | 'category' | 'answer'
    const [view, setView] = useState<'categories' | 'category' | 'answer'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
    const [selectedItem, setSelectedItem] = useState<FAQItem | null>(null);
    const [language, setLanguage] = useState('Français');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const t = translations[language] || translations['Français'];
    // Default to French data if specific language data is missing/incomplete
    const currentFaqData = faqData[language as keyof typeof faqData] || faqData['Français'];

    const handleCategoryClick = (category: FAQCategory) => {
        setSelectedCategory(category);
        setView('category');
    };

    const handleQuestionClick = (item: FAQItem) => {
        setSelectedItem(item);
        setView('answer');
    };

    const handleBack = () => {
        if (view === 'answer') {
            setView('category');
            setSelectedItem(null);
        } else if (view === 'category') {
            setView('categories');
            setSelectedCategory(null);
        } else {
            router.push('/');
        }
    };

    return (
        <main style={{
            background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
            minHeight: '100vh',
            padding: '1rem 1rem 100px',
            direction: language === 'العربية' ? 'rtl' : 'ltr'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', marginBottom: '20px',
                    background: 'white', padding: '15px', borderRadius: '20px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                    <button onClick={handleBack} style={{
                        background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
                        [language === 'العربية' ? 'marginLeft' : 'marginRight']: '15px',
                        transform: language === 'العربية' ? 'rotate(180deg)' : 'none'
                    }}>
                        ⬅️
                    </button>

                    <div style={{ flex: 1 }}>
                        <h1 className="font-heading" style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>
                            {view === 'categories' && t['help_center_title']}
                            {view === 'category' && selectedCategory?.title}
                            {view === 'answer' && t['assistant_title']}
                        </h1>
                    </div>

                    <div style={{ fontSize: '2rem' }}>🤖</div>
                </div>

                {/* VIEW 1: Categories Grid */}
                {view === 'categories' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {currentFaqData?.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                                    transition: 'transform 0.2s',
                                    gap: '10px'
                                }}
                            >
                                <div style={{ fontSize: '2.5rem' }}>{cat.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#333' }}>{cat.title}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VIEW 2: Questions List */}
                {view === 'category' && selectedCategory && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedCategory.items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleQuestionClick(item)}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '18px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}
                            >
                                <span style={{ fontWeight: 600, color: '#333', fontSize: '0.95rem' }}>{item.question}</span>
                                <span style={{ color: '#ccc', transform: language === 'العربية' ? 'rotate(180deg)' : 'none' }}>👉</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* VIEW 3: Detailed Answer */}
                {view === 'answer' && selectedItem && (
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '30px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <h2 className="font-heading" style={{
                            fontSize: '1.3rem',
                            marginBottom: '20px',
                            color: 'var(--primary)',
                            lineHeight: '1.4'
                        }}>
                            {selectedItem.question}
                        </h2>

                        <div style={{
                            fontSize: '1.05rem',
                            color: '#555',
                            lineHeight: '1.7',
                            whiteSpace: 'pre-line'
                        }}>
                            {selectedItem.answer}
                        </div>

                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: '#999', marginBottom: '15px' }}>{t['did_this_help']}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                <button style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>👍 {t['yes']}</button>
                                <button onClick={() => window.location.href = 'mailto:support@fastmatch.tg'} style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>👎 {t['no_contact']}</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <BottomNav />
        </main>
    );
}
