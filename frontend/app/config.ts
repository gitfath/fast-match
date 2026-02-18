const getBaseUrl = () => {
    if (typeof window === 'undefined') return 'http://localhost:5000/api';

    const hostname = window.location.hostname;

    // Support pour LocalTunnel
    if (hostname.includes('loca.lt')) {
        return 'https://fm-togo-api-v2-final.loca.lt/api';
    }

    // Par défaut (IP locale ou localhost)
    return `http://${hostname}:5000/api`;
};

export const API_BASE_URL = getBaseUrl();
export const BACKEND_URL = API_BASE_URL.replace('/api', '');
