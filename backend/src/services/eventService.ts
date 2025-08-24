import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/connection';
import { Event, EventTask, EventProposal } from '../types';
import { DEFAULT_TASK_TEMPLATES } from '../utils/taskTemplates';
import { addDays, format } from 'date-fns';

export class EventService {
  
  async createEvent(title: string, description: string, eventDate: string, userId: string): Promise<Event> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO events (id, title, description, event_date, created_at, updated_at, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await database.run(sql, [id, title, description, eventDate, now, now, userId]);
    
    // デフォルトタスクを自動生成
    await this.createDefaultTasks(id, new Date(eventDate));
    
    return this.getEventById(id);
  }

  async getEventById(id: string): Promise<Event> {
    const sql = 'SELECT * FROM events WHERE id = ?';
    const row = await database.get(sql, [id]);
    
    if (!row) {
      throw new Error('イベントが見つかりません');
    }
    
    return this.mapDbRowToEvent(row);
  }

  async getEventsByUserId(userId: string): Promise<Event[]> {
    const sql = 'SELECT * FROM events WHERE user_id = ? ORDER BY event_date ASC';
    const rows = await database.all(sql, [userId]);
    
    return rows.map(this.mapDbRowToEvent);
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const updateFields = [];
    const values = [];
    
    if (updates.title) {
      updateFields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description) {
      updateFields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.eventDate) {
      updateFields.push('event_date = ?');
      values.push(updates.eventDate);
    }
    if (updates.status) {
      updateFields.push('status = ?');
      values.push(updates.status);
    }
    
    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    const sql = `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`;
    await database.run(sql, values);
    
    return this.getEventById(id);
  }

  async deleteEvent(id: string): Promise<void> {
    const sql = 'DELETE FROM events WHERE id = ?';
    await database.run(sql, [id]);
  }

  async getEventTasks(eventId: string): Promise<EventTask[]> {
    const sql = 'SELECT * FROM event_tasks WHERE event_id = ? ORDER BY due_date ASC';
    const rows = await database.all(sql, [eventId]);
    
    return rows.map(this.mapDbRowToTask);
  }

  async createTask(eventId: string, task: Partial<EventTask>): Promise<EventTask> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO event_tasks (id, event_id, title, description, due_date, task_type, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await database.run(sql, [
      id, 
      eventId, 
      task.title, 
      task.description, 
      task.dueDate, 
      task.taskType, 
      task.priority || 'medium',
      now, 
      now
    ]);
    
    return this.getTaskById(id);
  }

  async updateTask(id: string, updates: Partial<EventTask>): Promise<EventTask> {
    const updateFields = [];
    const values = [];
    
    if (updates.title) {
      updateFields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description) {
      updateFields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.dueDate) {
      updateFields.push('due_date = ?');
      values.push(updates.dueDate);
    }
    if (typeof updates.completed === 'boolean') {
      updateFields.push('completed = ?');
      values.push(updates.completed);
    }
    if (updates.priority) {
      updateFields.push('priority = ?');
      values.push(updates.priority);
    }
    
    updateFields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    const sql = `UPDATE event_tasks SET ${updateFields.join(', ')} WHERE id = ?`;
    await database.run(sql, values);
    
    return this.getTaskById(id);
  }

  async deleteTask(id: string): Promise<void> {
    const sql = 'DELETE FROM event_tasks WHERE id = ?';
    await database.run(sql, [id]);
  }

  private async getTaskById(id: string): Promise<EventTask> {
    const sql = 'SELECT * FROM event_tasks WHERE id = ?';
    const row = await database.get(sql, [id]);
    
    if (!row) {
      throw new Error('タスクが見つかりません');
    }
    
    return this.mapDbRowToTask(row);
  }

  private async createDefaultTasks(eventId: string, eventDate: Date): Promise<void> {
    for (const template of DEFAULT_TASK_TEMPLATES) {
      const dueDate = addDays(eventDate, -template.daysBeforeEvent);
      
      await this.createTask(eventId, {
        title: template.title,
        description: template.description,
        dueDate: dueDate.toISOString(),
        taskType: template.taskType,
        priority: template.priority
      });
    }
  }

  private mapDbRowToEvent(row: any): Event {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      eventDate: row.event_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      status: row.status,
      userId: row.user_id
    };
  }

  private mapDbRowToTask(row: any): EventTask {
    return {
      id: row.id,
      eventId: row.event_id,
      title: row.title,
      description: row.description,
      dueDate: row.due_date,
      completed: Boolean(row.completed),
      taskType: row.task_type,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      priority: row.priority
    };
  }
} 