import axios from 'axios';
import { 
  Event, 
  EventTask, 
  CreateEventData,
  CreateTaskData 
} from '../types';

// GASのデプロイURL - 新しいデプロイURLに更新してください
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbx00y0v63GUnK3Dsq6Qqy2iWvw4XpwNvRuhu8nxvzE2Ll0cQOH4afSJ0BkRUBNIK0Ug/exec';

// CORSエラーを回避するため、JSONPアプローチを使用
const createJSONPRequest = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'jsonpCallback_' + Math.random().toString(36).substr(2, 9);
    
    (window as any)[callbackName] = (data: any) => {
      resolve(data);
      document.head.removeChild(script);
      delete (window as any)[callbackName];
    };
    
    script.src = `${url}&callback=${callbackName}`;
    script.onerror = () => {
      reject(new Error('JSONP request failed'));
      document.head.removeChild(script);
      delete (window as any)[callbackName];
    };
    
    document.head.appendChild(script);
  });
};

class ApiService {
  // イベント関連
  async getEvents(): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}?path=events`);
      return response.data;
    } catch (error) {
      console.error('GET request failed, trying JSONP:', error);
      return createJSONPRequest(`${API_BASE_URL}?path=events`);
    }
  }

  async getEvent(id: string): Promise<Event> {
    try {
      const response = await axios.get(`${API_BASE_URL}?path=events/${id}`);
      return response.data;
    } catch (error) {
      console.error('GET request failed, trying JSONP:', error);
      return createJSONPRequest(`${API_BASE_URL}?path=events/${id}`);
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    const response = await axios.post(
      `${API_BASE_URL}?path=events`,
      JSON.stringify(eventData),
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const response = await axios.put(
      `${API_BASE_URL}?path=events/${id}`,
      JSON.stringify(updates),
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}?path=events/${id}`, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // タスク関連
  async getEventTasks(eventId: string): Promise<EventTask[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}?path=events/${eventId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('GET request failed, trying JSONP:', error);
      return createJSONPRequest(`${API_BASE_URL}?path=events/${eventId}/tasks`);
    }
  }

  async createTask(eventId: string, taskData: CreateTaskData): Promise<EventTask> {
    const response = await axios.post(
      `${API_BASE_URL}?path=events/${eventId}/tasks`,
      JSON.stringify(taskData),
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  }

  async updateTask(taskId: string, updates: Partial<EventTask>): Promise<EventTask> {
    const response = await axios.put(
      `${API_BASE_URL}?path=events/tasks/${taskId}`,
      JSON.stringify(updates),
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}?path=events/tasks/${taskId}`, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}?path=health`);
      return response.data;
    } catch (error) {
      console.error('GET request failed, trying JSONP:', error);
      return createJSONPRequest(`${API_BASE_URL}?path=health`);
    }
  }
}

export const apiService = new ApiService(); 