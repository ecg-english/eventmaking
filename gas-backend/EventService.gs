/**
 * イベントサービス
 */
class EventService {
  
  constructor() {
    this.db = new DatabaseService();
    this.taskTemplates = this.getDefaultTaskTemplates();
  }
  
  /**
   * イベント作成
   */
  createEvent(title, description, eventDate, userId) {
    const eventId = this.generateId();
    const now = new Date().toISOString();
    
    const event = {
      id: eventId,
      title: title,
      description: description || '',
      eventDate: eventDate,
      createdAt: now,
      updatedAt: now,
      status: 'planning',
      userId: userId
    };
    
    this.db.createEvent(event);
    
    // デフォルトタスクを自動生成
    this.createDefaultTasks(eventId, new Date(eventDate));
    
    return this.getEventById(eventId, userId);
  }
  
  /**
   * イベント取得（ID指定）
   */
  getEventById(eventId, userId) {
    const event = this.db.getEventById(eventId);
    if (!event) {
      throw new Error('イベントが見つかりません');
    }
    
    // ユーザーの所有権チェック
    if (event.userId !== userId) {
      throw new Error('アクセス権限がありません');
    }
    
    return event;
  }
  
  /**
   * ユーザーのイベント一覧取得
   */
  getEventsByUserId(userId) {
    return this.db.getEventsByUserId(userId);
  }
  
  /**
   * イベント更新
   */
  updateEvent(eventId, updates, userId) {
    const event = this.getEventById(eventId, userId);
    
    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.db.updateEvent(eventId, updatedEvent);
    return updatedEvent;
  }
  
  /**
   * イベント削除
   */
  deleteEvent(eventId, userId) {
    const event = this.getEventById(eventId, userId);
    this.db.deleteEvent(eventId);
    return { message: 'イベントが削除されました' };
  }
  
  /**
   * イベントのタスク一覧取得
   */
  getEventTasks(eventId, userId) {
    const event = this.getEventById(eventId, userId);
    return this.db.getEventTasks(eventId);
  }
  
  /**
   * タスク作成
   */
  createTask(eventId, taskData, userId) {
    const event = this.getEventById(eventId, userId);
    
    const taskId = this.generateId();
    const now = new Date().toISOString();
    
    const task = {
      id: taskId,
      eventId: eventId,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate,
      completed: false,
      taskType: taskData.taskType,
      createdAt: now,
      updatedAt: now,
      priority: taskData.priority || 'medium'
    };
    
    this.db.createTask(task);
    return task;
  }
  
  /**
   * タスク更新
   */
  updateTask(taskId, updates, userId) {
    const task = this.db.getTaskById(taskId);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }
    
    // イベントの所有権チェック
    const event = this.getEventById(task.eventId, userId);
    
    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.db.updateTask(taskId, updatedTask);
    return updatedTask;
  }
  
  /**
   * タスク削除
   */
  deleteTask(taskId, userId) {
    const task = this.db.getTaskById(taskId);
    if (!task) {
      throw new Error('タスクが見つかりません');
    }
    
    // イベントの所有権チェック
    const event = this.getEventById(task.eventId, userId);
    
    this.db.deleteTask(taskId);
    return { message: 'タスクが削除されました' };
  }
  
  /**
   * デフォルトタスクを自動生成
   */
  createDefaultTasks(eventId, eventDate) {
    for (const template of this.taskTemplates) {
      const dueDate = new Date(eventDate);
      dueDate.setDate(dueDate.getDate() - template.daysBeforeEvent);
      
      this.createTask(eventId, {
        title: template.title,
        description: template.description,
        dueDate: dueDate.toISOString(),
        taskType: template.taskType,
        priority: template.priority
      }, this.db.getEventById(eventId).userId);
    }
  }
  
  /**
   * デフォルトタスクテンプレート
   */
  getDefaultTaskTemplates() {
    return [
      {
        taskType: 'proposal',
        title: '企画書作成',
        description: 'イベントの詳細な企画書を作成する',
        daysBeforeEvent: 30,
        priority: 'high'
      },
      {
        taskType: 'flyer',
        title: 'フライヤー作成',
        description: 'イベント告知用のフライヤーをデザイン・作成する',
        daysBeforeEvent: 30,
        priority: 'high'
      },
      {
        taskType: 'community',
        title: 'コミュニティアプリ投稿',
        description: 'コミュニティアプリにイベント情報を投稿する',
        daysBeforeEvent: 30,
        priority: 'medium'
      },
      {
        taskType: 'instagram',
        title: 'Instagram投稿',
        description: 'Instagramにイベント告知を投稿する',
        daysBeforeEvent: 30,
        priority: 'medium'
      },
      {
        taskType: 'line',
        title: '公式LINE予約投稿',
        description: '公式LINEでイベント予約受付を開始する',
        daysBeforeEvent: 30,
        priority: 'medium'
      },
      {
        taskType: 'print',
        title: 'フライヤー印刷・店舗張り出し',
        description: 'フライヤーを印刷し、店舗に張り出す',
        daysBeforeEvent: 30,
        priority: 'medium'
      },
      {
        taskType: 'meetup',
        title: 'Meetup投稿',
        description: 'Meetupにイベント情報を投稿する',
        daysBeforeEvent: 7,
        priority: 'medium'
      },
      {
        taskType: 'story',
        title: 'ストーリー投稿',
        description: 'SNSストーリーでイベントを告知する',
        daysBeforeEvent: 7,
        priority: 'low'
      },
      {
        taskType: 'story-repost',
        title: 'ストーリー再投稿',
        description: 'イベント前日にストーリーで再度告知する',
        daysBeforeEvent: 1,
        priority: 'low'
      },
      {
        taskType: 'execution',
        title: '実施・反省会',
        description: 'イベント実施と終了後の反省会を行う',
        daysBeforeEvent: 0,
        priority: 'high'
      }
    ];
  }
  
  /**
   * ID生成
   */
  generateId() {
    return Utilities.getUuid();
  }
} 