import axios from 'axios';
import { 
  Event, 
  EventTask, 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse,
  CreateEventData,
  CreateTaskData 
} from '../types';

// 本番環境では環境変数から、開発環境ではデフォルト値を使用
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.herokuapp.com/api'
    : 'http://localhost:5001/api'
  );

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // リクエストインターセプター - トークンを自動付与
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // レスポンスインターセプター - 401エラーでトークンクリア
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // 認証関連
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, credentials);
    const authData = response.data;
    this.setToken(authData.token);
    return authData;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const authData = response.data;
    this.setToken(authData.token);
    return authData;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data;
  }

  async updateProfile(updates: { name?: string; email?: string }): Promise<User> {
    const response = await axios.put(`${API_BASE_URL}/auth/me`, updates);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await axios.put(`${API_BASE_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  logout() {
    this.clearToken();
    window.location.href = '/login';
  }

  // イベント関連
  async getEvents(): Promise<Event[]> {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  }

  async getEvent(id: string): Promise<Event> {
    const response = await axios.get(`${API_BASE_URL}/events/${id}`);
    return response.data;
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await axios.post(`${API_BASE_URL}/events`, eventData);
    return response.data;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const response = await axios.put(`${API_BASE_URL}/events/${id}`, updates);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/events/${id}`);
  }

  // タスク関連
  async getEventTasks(eventId: string): Promise<EventTask[]> {
    const response = await axios.get(`${API_BASE_URL}/events/${eventId}/tasks`);
    return response.data;
  }

  async createTask(eventId: string, taskData: CreateTaskData): Promise<EventTask> {
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/tasks`, taskData);
    return response.data;
  }

  async updateTask(taskId: string, updates: Partial<EventTask>): Promise<EventTask> {
    const response = await axios.put(`${API_BASE_URL}/events/tasks/${taskId}`, updates);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/events/tasks/${taskId}`);
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
}

export const apiService = new ApiService(); 