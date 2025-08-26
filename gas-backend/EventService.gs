/**
 * イベント管理サービス
 */
class EventService {
  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * 全イベントを取得
   */
  getAllEvents() {
    return this.db.getAllEvents();
  }

  /**
   * 指定されたIDのイベントを取得
   */
  getEventById(eventId) {
    return this.db.getEventById(eventId);
  }

  /**
   * 新しいイベントを作成
   */
  createEvent(title, description, eventDate) {
    const event = {
      id: this.generateId(),
      title: title,
      description: description || '',
      eventDate: eventDate,
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.createEvent(event);
    
    // デフォルトタスクを自動生成
    this.createDefaultTasks(event.id);
    
    return event;
  }

  /**
   * イベントを更新
   */
  updateEvent(eventId, updates) {
    const event = this.db.getEventById(eventId);
    if (!event) {
      throw new Error('イベントが見つかりません');
    }

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.db.updateEvent(eventId, updatedEvent);
    return updatedEvent;
  }

  /**
   * イベントを削除
   */
  deleteEvent(eventId) {
    const event = this.db.getEventById(eventId);
    if (!event) {
      throw new Error('イベントが見つかりません');
    }

    this.db.deleteEvent(eventId);
    return { message: 'イベントが削除されました' };
  }

  /**
   * イベントのタスクを取得
   */
  getEventTasks(eventId) {
    return this.db.getEventTasks(eventId);
  }

  /**
   * タスクを作成
   */
  createTask(eventId, taskData) {
    const task = {
      id: this.generateId(),
      eventId: eventId,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate,
      completed: false,
      taskType: taskData.taskType || 'custom',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.createTask(task);
    return task;
  }

  /**
   * タスクを更新
   */
  updateTask(taskId, updates) {
    const task = this.db.getTaskById(taskId);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.db.updateTask(taskId, updatedTask);
    return updatedTask;
  }

  /**
   * タスクを削除
   */
  deleteTask(taskId) {
    const task = this.db.getTaskById(taskId);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }

    this.db.deleteTask(taskId);
    return { message: 'タスクが削除されました' };
  }

  /**
   * デフォルトタスクを自動生成
   */
  createDefaultTasks(eventId) {
    const defaultTasks = [
      {
        title: '企画書作成',
        description: 'イベントの企画書を作成する',
        taskType: 'proposal',
        priority: 'high',
        daysBeforeEvent: 30
      },
      {
        title: 'フライヤー作成',
        description: 'イベントのフライヤーを作成する',
        taskType: 'flyer',
        priority: 'medium',
        daysBeforeEvent: 30
      },
      {
        title: 'SNS投稿',
        description: 'イベントのSNS投稿を行う',
        taskType: 'instagram',
        priority: 'medium',
        daysBeforeEvent: 7
      }
    ];

    defaultTasks.forEach(taskTemplate => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + taskTemplate.daysBeforeEvent);
      
      this.createTask(eventId, {
        title: taskTemplate.title,
        description: taskTemplate.description,
        dueDate: dueDate.toISOString(),
        taskType: taskTemplate.taskType,
        priority: taskTemplate.priority
      });
    });
  }

  /**
   * IDを生成
   */
  generateId() {
    return Utilities.getUuid();
  }
} 