import axios from 'axios';
import { 
  Event, 
  EventTask, 
  CreateEventData,
  CreateTaskData 
} from '../types';

// GASの新しいデプロイURL
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxL3sOEbygjVpiDLtRYJS8NHvNUi74D0X7DV6MiXn1jbBrUnmn1aKzZNnjAIILnMuBC/exec';

class ApiService {
  // イベント関連
  async getEvents(): Promise<Event[]> {
    const response = await axios.get(`${API_BASE_URL}?path=events`);
    return response.data;
  }

  async getEvent(id: string): Promise<Event> {
    const response = await axios.get(`${API_BASE_URL}?path=events/${id}`);
    return response.data;
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
    await axios.delete(`${API_BASE_URL}?path=events/${id}`);
  }

  // タスク関連
  async getEventTasks(eventId: string): Promise<EventTask[]> {
    const response = await axios.get(`${API_BASE_URL}?path=events/${eventId}/tasks`);
    return response.data;
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
    await axios.delete(`${API_BASE_URL}?path=events/tasks/${taskId}`);
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await axios.get(`${API_BASE_URL}?path=health`);
    return response.data;
  }
}

export const apiService = new ApiService(); 