"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config';
import AdminSidebar from '../../../components/AdminSidebar';

export default function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Tous');
    const [filterRole, setFilterRole] = useState('Tous');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 991);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const token = localStorage.getItem('token');
        fetchUsers();

        return () => window.removeEventListener('resize', checkMobile);
    }, [filterStatus, filterRole]);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/admin/users?`;
        if (filterStatus !== 'Tous') url += `status=${filterStatus}&`;
        if (filterRole !== 'Tous') url += `role=${filterRole}&`;
        if (searchTerm) url += `search=${searchTerm}&`;

        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        fetchUsers();
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Supprimer définitivement cet utilisateur ?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Utilisateur supprimé avec succès.");
                setUsers(users.filter(u => u.id !== userId));
            } else {
                const data = await res.json();
                alert("Erreur lors de la suppression : " + (data.message || "Erreur inconnue"));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau lors de la suppression.");
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
                <header style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    <h1 className="font-heading" style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', margin: 0 }}>Gestion des Utilisateurs</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '10px 20px', borderRadius: '10px', background: 'white', border: '1px solid #ddd', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📤 Exporter
                        </button>
                    </div>
                </header>

                <div style={{ background: 'white', padding: isMobile ? '15px' : '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: isMobile ? '100%' : '300px', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email, pseudo, téléphone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.95rem' }}
                            />
                            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0', minWidth: '150px' }}
                        >
                            <option value="Tous">Tous les statuts</option>
                            <option value="Actif">Actif</option>
                            <option value="Suspendu">Suspendu</option>
                            <option value="Banni">Banni</option>
                        </select>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0', minWidth: '150px' }}
                        >
                            <option value="Tous">Tous les rôles</option>
                            <option value="MEMBER">Membres (MEMBER)</option>
                            <option value="PARTNER">Partenaires (PARTNER)</option>
                            <option value="ADMIN">Admins (ADMIN)</option>
                        </select>

                        <button
                            type="submit"
                            style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Filtrer
                        </button>
                    </form>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8f9fc', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr>
                                <th style={{ padding: '18px 24px' }}>Utilisateur</th>
                                <th style={{ padding: '18px 24px' }}>Date Inscription</th>
                                <th style={{ padding: '18px 24px' }}>Statut</th>
                                <th style={{ padding: '18px 24px' }}>Premium</th>
                                <th style={{ padding: '18px 24px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Chargement des utilisateurs...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Aucun utilisateur trouvé</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '18px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), #ff7675)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                                                {(user.profile?.name || user.business?.name || '?')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#2d3436' }}>
                                                    {user.profile?.name || user.business?.name || 'Inconnu'}
                                                    {user.profile?.verified && <span style={{ marginLeft: '5px', color: '#0984e3' }}>✅</span>}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#b2bec3' }}>{user.email || user.phone}</div>
                                                {user.profile?.pseudo && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>@{user.profile.pseudo}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: '#636e72' }}>
                                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                                            background: user.profile?.accountStatus === 'Actif' ? '#d1fae5' : user.profile?.accountStatus === 'Banni' ? '#fee2e2' : '#fef3c7',
                                            color: user.profile?.accountStatus === 'Actif' ? '#065f46' : user.profile?.accountStatus === 'Banni' ? '#991b1b' : '#92400e'
                                        }}>
                                            {user.profile?.accountStatus || 'Actif'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '18px 24px' }}>
                                        {user.profile?.isPremium ? (
                                            <span style={{ fontSize: '1.2rem' }} title="Premium">💎</span>
                                        ) : (
                                            <span style={{ color: '#dfe6e9' }}>—</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '18px 24px' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => router.push(`/admin/users/${user.id}`)}
                                                style={{ background: '#f1f2f6', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#2d3436' }}
                                                title="Voir profil"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                style={{ background: 'rgba(231, 76, 60, 0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#e74c3c' }}
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Placeholder */}
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#888', fontSize: '0.85rem' }}>
                        <div>Affichage de {users.length} utilisateurs</div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button disabled style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd', background: '#f8f9fa' }}>Précédent</button>
                            <button style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ddd', background: 'white' }}>Suivant</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
