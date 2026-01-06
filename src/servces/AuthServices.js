// frontend/src/services/authservices.js
import api from './api';

export const isAuthenticated = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return !!token;
};

export const getUserInfo = () => {
    const userStr = localStorage.getItem('user_info') || sessionStorage.getItem('user_info');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAdmin = () => {
    const user = getUserInfo();
    return user && (user.is_admin || user.is_staff || user.is_superuser || user.role === 'admin');
};

export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');

        if (refreshToken) {
            await api.post('/auth/logout/', { refresh: refreshToken });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    }
};

export const getUserDisplayName = () => {
    const user = getUserInfo();
    if (!user) return '';

    if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
        return user.first_name;
    } else {
        return user.username;
    }
};