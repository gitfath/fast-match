"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AnalyticsPage() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ display: 'flex', background: '#f0f2f5', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>
            <AdminSidebar />
            <main style={{
                flex: 1,
                marginLeft: isMobile ? 0 : '260px',
                padding: isMobile ? '20px' : '40px',
                width: isMobile ? '100%' : 'auto'
            }}>
                <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '20px' }}>Analytique Avancée</h1>
                <div style={{ background: 'white', padding: isMobile ? '30px 15px' : '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📈</div>
                    <p style={{ color: '#888', fontSize: isMobile ? '1rem' : '1.2rem' }}>Statistiques détaillées de rétention, conversion et croissance.</p>
                </div>
            </main>
        </div>
    );
}
