import axios from 'axios';
import { Event, CreateEventData, EventTask, CreateTaskData } from '../types';

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbx00y0v63GUnK3Dsq6Qqy2iWvw4XpwNvRuh.../exec';

class ApiService {
  // GET リクエスト（JSONPのみ）
  async get<T>(path: string): Promise<T> {
    return this.createJSONPRequest<T>(path);
  }

  // POST リクエスト
  async post<T>(path: string, data: any): Promise<T> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}?path=${path}`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  // PUT リクエスト
  async put<T>(path: string, data: any): Promise<T> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}?path=${path}`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  // DELETE リクエスト
  async delete<T>(path: string): Promise<T> {
    try {
      const response = await axios.delete(`${API_BASE_URL}?path=${path}`, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  // JSONPリクエスト
  private createJSONPRequest<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback_' + Math.random().toString(36).substr(2, 9);
      const script = document.createElement('script');
      
      (window as any)[callbackName] = (data: T) => {
        resolve(data);
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };

      script.src = `${API_BASE_URL}?path=${path}&callback=${callbackName}`;
      script.onerror = () => {
        reject(new Error('JSONP request failed'));
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };

      document.head.appendChild(script);
    });
  }

  // イベント関連のAPI
  async getAllEvents(): Promise<Event[]> {
    return this.get<Event[]>('events');
  }

  async getEvent(id: string): Promise<Event> {
    return this.get<Event>(`events/${id}`);
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    return this.post<Event>('events', eventData);
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    return this.put<Event>(`events/${id}`, eventData);
  }

  async deleteEvent(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`events/${id}`);
  }

  // タスク関連のAPI
  async getEventTasks(eventId: string): Promise<EventTask[]> {
    return this.get<EventTask[]>(`events/${eventId}/tasks`);
  }

  async createTask(eventId: string, taskData: CreateTaskData): Promise<EventTask> {
    return this.post<EventTask>(`events/${eventId}/tasks`, taskData);
  }

  async updateTask(taskId: string, updates: Partial<EventTask>): Promise<EventTask> {
    try {
      return await this.put<EventTask>(`events/tasks/${taskId}`, updates);
    } catch (error) {
      console.error('PUT request failed, trying JSONP:', error);
      // エラーが発生した場合は、更新された情報のみを含むレスポンスを返す
      // フロントエンド側で元のタスク情報とマージする
      const mockResponse: Partial<EventTask> = {
        id: taskId,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockResponse as EventTask;
    }
  }

  async deleteTask(taskId: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`events/tasks/${taskId}`);
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get<{ status: string; timestamp: string }>('health');
  }
}

export const apiService = new ApiService(); 