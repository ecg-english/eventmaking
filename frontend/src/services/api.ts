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

// 本番環境ではGASのURL、開発環境ではローカルサーバーを使用
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://script.google.com/macros/s/AKfycbwK28csyuvdqHrqmh-nnCB9MyLOo77Ig-vGS4GeAZnM9RtwNObYTV9Nk3rHmidYJddD/exec/api'
    : 'http://localhost:5001/api'
  );

class ApiService {
  constructor() {
    // 認証なしのシンプルなAPIサービス
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