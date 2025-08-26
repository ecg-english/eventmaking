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
        description: 'イベントタイトル、イベント内容、イベント日程と開始時間~終了時間、参加費（ビジター料金とメンバー料金）、開催場所を記入してください。',
        taskType: 'proposal',
        priority: 'high',
        daysBeforeEvent: 30
      },
      {
        title: 'フライヤー作成',
        description: 'イベントのフライヤーを作成する',
        taskType: 'flyer',
        priority: 'high',
        daysBeforeEvent: 30
      },
      {
        title: 'フライヤー印刷と店舗張り出し',
        description: 'フライヤーを印刷し、店舗に張り出す',
        taskType: 'print',
        priority: 'medium',
        daysBeforeEvent: 30
      },
      {
        title: 'コミュニティアプリ投稿',
        description: 'コミュニティアプリにイベント情報を投稿する',
        taskType: 'community',
        priority: 'medium',
        daysBeforeEvent: 30
      },
      {
        title: 'Instagram投稿',
        description: 'Instagramにイベント告知を投稿する',
        taskType: 'instagram',
        priority: 'medium',
        daysBeforeEvent: 30
      },
      {
        title: '公式LINE予約投稿',
        description: '公式LINEでイベント予約受付を開始する',
        taskType: 'line',
        priority: 'medium',
        daysBeforeEvent: 30
      },
      {
        title: 'Meetup投稿',
        description: 'Meetupにイベント情報を投稿する',
        taskType: 'meetup',
        priority: 'medium',
        daysBeforeEvent: 7
      },
      {
        title: 'ストーリー投稿',
        description: 'SNSストーリーでイベントを告知する',
        taskType: 'story',
        priority: 'low',
        daysBeforeEvent: 7
      },
      {
        title: 'イベント準備物確認・買い出し',
        description: 'イベントに必要な準備物を確認し、買い出しを行う',
        taskType: 'preparation',
        priority: 'high',
        daysBeforeEvent: 3
      },
      {
        title: 'ストーリー投稿（前日）',
        description: 'イベント前日にストーリーで再度告知する',
        taskType: 'story-repost',
        priority: 'medium',
        daysBeforeEvent: 1
      },
      {
        title: '予約者へのリマインド',
        description: 'イベント前日に予約者へリマインドを送信する',
        taskType: 'reminder',
        priority: 'high',
        daysBeforeEvent: 1
      },
      {
        title: 'イベント実施・反省会',
        description: 'イベント実施と終了後の反省会を行う',
        taskType: 'execution',
        priority: 'high',
        daysBeforeEvent: 0
      }
    ];

    // イベントの日付を取得
    const event = this.db.getEventById(eventId);
    const eventDate = new Date(event.eventDate);

    defaultTasks.forEach(taskTemplate => {
      const dueDate = new Date(eventDate);
      dueDate.setDate(dueDate.getDate() - taskTemplate.daysBeforeEvent);
      
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