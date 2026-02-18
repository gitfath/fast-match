"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const menuItems = [
        { label: 'Dashboard', icon: '📊', path: '/admin' },
        { label: 'Utilisateurs', icon: '👥', path: '/admin/users' },
        { label: 'Modération', icon: '🚩', path: '/admin/moderation' },
        { label: 'Signalements', icon: '🚨', path: '/admin/reports' },
        { label: 'Sanctions', icon: '⚠️', path: '/admin/sanctions' },
        { label: 'Paiements', icon: '💰', path: '/admin/payments' },
        { label: 'Abonnements', icon: '💎', path: '/admin/subscriptions' },
        { label: 'Produits', icon: '🛒', path: '/admin/products' },
        { label: 'Partenaires', icon: '🏢', path: '/admin/businesses' },
        { label: 'Support', icon: '🎫', path: '/admin/support' },
        { label: 'Analytics', icon: '📈', path: '/admin/analytics' },
        { label: 'Paramètres', icon: '⚙️', path: '/admin/settings' },
    ];

    const sidebarStyle: React.CSSProperties = {
        width: '260px',
        background: '#1a1c23',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        left: isMobile && !isOpen ? '-260px' : 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        transition: 'left 0.3s ease'
    };

    return (
        <React.Fragment>
            {isMobile && (
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100,
                        width: '50px', height: '50px', background: 'var(--primary)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '1.5rem'
                    }}
                >
                    {isOpen ? '✕' : '👑'}
                </div>
            )}

            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
                />
            )}

            <aside style={sidebarStyle}>
                <div style={{ padding: '24px', borderBottom: '1px solid #2d2f39' }}>
                    <h1 className="font-heading" style={{ margin: 0, fontSize: '1.4rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>👑</span> ADMIN PANEL
                    </h1>
                </div>

                <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <div
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    if (isMobile) setIsOpen(false);
                                }}
                                style={{
                                    padding: '12px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    background: isActive ? 'rgba(255, 71, 87, 0.1)' : 'transparent',
                                    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                                    color: isActive ? 'var(--primary)' : '#9e9e9e',
                                    fontWeight: isActive ? 700 : 500,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.color = '#9e9e9e';
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        );
                    })}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #2d2f39' }}>
                    <div
                        onClick={() => {
                            localStorage.clear();
                            router.push('/');
                        }}
                        style={{
                            padding: '10px',
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#ff4444'
                        }}
                    >
                        Déconnexion
                    </div>
                </div>
            </aside>
        </React.Fragment>
    );
};

export default AdminSidebar;
