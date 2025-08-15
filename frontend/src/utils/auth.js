export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getRole = () => {
    return localStorage.getItem('role') || '';
};

export const isAdmin = () => {
    return getRole() === 'ADMIN';
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}; 