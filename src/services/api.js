import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//public api
export const publicApi = {
    getForumCategory: () => apiClient.get(`/forum-categories`),
    getForum: (category) =>
    apiClient.get('/forum', {
        params: {
            category
        }
    }),
    getForumDetail: (id) => apiClient.get(`/forum/${id}`),
}

// Auth API calls
export const authAPI = {
    register: (data) => apiClient.post('/register', data),
    login: (data) => apiClient.post('/login', data),
};

// Users API calls
export const usersAPI = {
    getUserDetail: (id) => apiClient.get(`/users/${id}`),

    // ai
    getAiSessions: () => apiClient.get('/ai'),
    getAiSessionDetail: (id) => apiClient.get(`/ai/${id}`),
    sendAiChat: (data) => apiClient.post('/ai/chat', data),
    deleteAiSession: (id) => apiClient.delete(`/ai/${id}/delete`)
};

export default apiClient;