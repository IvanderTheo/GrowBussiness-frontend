import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

//private client
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Public client
const publicClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
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
    getForumCategory: () => publicClient.get(`/forum-categories`),
    getForum: (category) =>
    publicClient.get('/forum', {
        params: {
            category
        }
    }),
    getForumDetail: (id) => publicClient.get(`/forum/${id}`),
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
    deleteAiSession: (id) => apiClient.delete(`/ai/${id}/delete`),

    //forum
    postForum:(data)=> apiClient.post('/forum',data),
    postComment:(data)=>apiClient.post('forum-comment',data),

    // schedule
    getSchedule:() => apiClient.get('/schedule'),
    postSchedule:(data) => apiClient.post('/schedule',data),
    putSchedule:(data)=>apiClient.put('/schedule-update',data),
    deleteSchedule:(data)=>apiClient.delete('/schedule-delete',data),

    //product-modeling
    getProductCategories: () => apiClient.get('/product-categories'),
    postProductVariables:(data) =>apiClient.post('/product-modeling',data),
    postProductFixedCosts:(data) => apiClient.post('product-fixed-costs',data),
    postCogsCalculator: (data) => apiClient.post('/count-hpp',data),
};

export default apiClient;