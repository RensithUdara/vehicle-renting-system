import api from './axios';

export const authAPI = {
    // Register new user
    register: async (userData) => {
        return await api.post('/register', userData);
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        if (response.success && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        }
    },

    // Get current user
    getCurrentUser: async () => {
        return await api.get('/me');
    },

    // Update user profile
    updateProfile: async (profileData) => {
        return await api.put('/profile', profileData);
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    // Get current user from localStorage
    getCurrentUserFromStorage: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};
