/**
 * データベースサービス（Google Sheets使用）
 */
class DatabaseService {
  
  constructor() {
    this.spreadsheet = this.getOrCreateSpreadsheet();
    this.usersSheet = this.getOrCreateSheet('users');
    this.eventsSheet = this.getOrCreateSheet('events');
    this.tasksSheet = this.getOrCreateSheet('tasks');
  }
  
  /**
   * スプレッドシートの取得または作成
   */
  getOrCreateSpreadsheet() {
    const scriptProperties = PropertiesService.getScriptProperties();
    let spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
    
    if (!spreadsheetId) {
      const spreadsheet = SpreadsheetApp.create('イベント管理システム データベース');
      spreadsheetId = spreadsheet.getId();
      scriptProperties.setProperty('SPREADSHEET_ID', spreadsheetId);
    }
    
    return SpreadsheetApp.openById(spreadsheetId);
  }
  
  /**
   * シートの取得または作成
   */
  getOrCreateSheet(sheetName) {
    let sheet = this.spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = this.spreadsheet.insertSheet(sheetName);
      
      // ヘッダー行を設定
      if (sheetName === 'users') {
        sheet.getRange(1, 1, 1, 5).setValues([['id', 'email', 'name', 'password', 'createdAt']]);
      } else if (sheetName === 'events') {
        sheet.getRange(1, 1, 1, 8).setValues([['id', 'title', 'description', 'eventDate', 'createdAt', 'updatedAt', 'status', 'userId']]);
      } else if (sheetName === 'tasks') {
        sheet.getRange(1, 1, 1, 10).setValues([['id', 'eventId', 'title', 'description', 'dueDate', 'completed', 'taskType', 'createdAt', 'updatedAt', 'priority']]);
      }
      
      // ヘッダー行を固定
      sheet.setFrozenRows(1);
    }
    
    return sheet;
  }
  
  // ===== ユーザー関連 =====
  
  /**
   * ユーザー作成
   */
  createUser(user) {
    const row = [
      user.id,
      user.email,
      user.name,
      user.password,
      user.createdAt
    ];
    
    this.usersSheet.appendRow(row);
  }
  
  /**
   * ユーザー取得（ID指定）
   */
  getUserById(userId) {
    const data = this.usersSheet.getDataRange().getValues();
    const headers = data[0];
    const userRow = data.find(row => row[0] === userId);
    
    if (!userRow) return null;
    
    return {
      id: userRow[0],
      email: userRow[1],
      name: userRow[2],
      password: userRow[3],
      createdAt: userRow[4]
    };
  }
  
  /**
   * ユーザー取得（メールアドレス指定）
   */
  getUserByEmail(email) {
    const data = this.usersSheet.getDataRange().getValues();
    const headers = data[0];
    const userRow = data.find(row => row[1] === email);
    
    if (!userRow) return null;
    
    return {
      id: userRow[0],
      email: userRow[1],
      name: userRow[2],
      password: userRow[3],
      createdAt: userRow[4]
    };
  }
  
  /**
   * ユーザー更新
   */
  updateUser(userId, updates) {
    const data = this.usersSheet.getDataRange().getValues();
    const userRowIndex = data.findIndex(row => row[0] === userId);
    
    if (userRowIndex === -1) {
      throw new Error('ユーザーが見つかりません');
    }
    
    const userRow = data[userRowIndex];
    const updatedRow = [...userRow];
    
    if (updates.name) updatedRow[2] = updates.name;
    if (updates.email) updatedRow[1] = updates.email;
    if (updates.password) updatedRow[3] = updates.password;
    
    this.usersSheet.getRange(userRowIndex + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
    
    return {
      id: updatedRow[0],
      email: updatedRow[1],
      name: updatedRow[2],
      password: updatedRow[3],
      createdAt: updatedRow[4]
    };
  }
  
  // ===== イベント関連 =====
  
  /**
   * イベント作成
   */
  createEvent(event) {
    const row = [
      event.id,
      event.title,
      event.description,
      event.eventDate,
      event.createdAt,
      event.updatedAt,
      event.status,
      event.userId
    ];
    
    this.eventsSheet.appendRow(row);
  }
  
  /**
   * イベント取得（ID指定）
   */
  getEventById(eventId) {
    const data = this.eventsSheet.getDataRange().getValues();
    const eventRow = data.find(row => row[0] === eventId);
    
    if (!eventRow) return null;
    
    return {
      id: eventRow[0],
      title: eventRow[1],
      description: eventRow[2],
      eventDate: eventRow[3],
      createdAt: eventRow[4],
      updatedAt: eventRow[5],
      status: eventRow[6],
      userId: eventRow[7]
    };
  }
  
  /**
   * ユーザーのイベント一覧取得
   */
  getEventsByUserId(userId) {
    const data = this.eventsSheet.getDataRange().getValues();
    const headers = data[0];
    const userEvents = data.filter(row => row[7] === userId);
    
    return userEvents.map(row => ({
      id: row[0],
      title: row[1],
      description: row[2],
      eventDate: row[3],
      createdAt: row[4],
      updatedAt: row[5],
      status: row[6],
      userId: row[7]
    }));
  }
  
  /**
   * イベント更新
   */
  updateEvent(eventId, updatedEvent) {
    const data = this.eventsSheet.getDataRange().getValues();
    const eventRowIndex = data.findIndex(row => row[0] === eventId);
    
    if (eventRowIndex === -1) {
      throw new Error('イベントが見つかりません');
    }
    
    const row = [
      updatedEvent.id,
      updatedEvent.title,
      updatedEvent.description,
      updatedEvent.eventDate,
      updatedEvent.createdAt,
      updatedEvent.updatedAt,
      updatedEvent.status,
      updatedEvent.userId
    ];
    
    this.eventsSheet.getRange(eventRowIndex + 1, 1, 1, row.length).setValues([row]);
    return updatedEvent;
  }
  
  /**
   * イベント削除
   */
  deleteEvent(eventId) {
    const data = this.eventsSheet.getDataRange().getValues();
    const eventRowIndex = data.findIndex(row => row[0] === eventId);
    
    if (eventRowIndex === -1) {
      throw new Error('イベントが見つかりません');
    }
    
    this.eventsSheet.deleteRow(eventRowIndex + 1);
    
    // 関連するタスクも削除
    this.deleteTasksByEventId(eventId);
  }
  
  // ===== タスク関連 =====
  
  /**
   * タスク作成
   */
  createTask(task) {
    const row = [
      task.id,
      task.eventId,
      task.title,
      task.description,
      task.dueDate,
      task.completed,
      task.taskType,
      task.createdAt,
      task.updatedAt,
      task.priority
    ];
    
    this.tasksSheet.appendRow(row);
  }
  
  /**
   * タスク取得（ID指定）
   */
  getTaskById(taskId) {
    const data = this.tasksSheet.getDataRange().getValues();
    const taskRow = data.find(row => row[0] === taskId);
    
    if (!taskRow) return null;
    
    return {
      id: taskRow[0],
      eventId: taskRow[1],
      title: taskRow[2],
      description: taskRow[3],
      dueDate: taskRow[4],
      completed: taskRow[5],
      taskType: taskRow[6],
      createdAt: taskRow[7],
      updatedAt: taskRow[8],
      priority: taskRow[9]
    };
  }
  
  /**
   * イベントのタスク一覧取得
   */
  getEventTasks(eventId) {
    const data = this.tasksSheet.getDataRange().getValues();
    const headers = data[0];
    const eventTasks = data.filter(row => row[1] === eventId);
    
    return eventTasks.map(row => ({
      id: row[0],
      eventId: row[1],
      title: row[2],
      description: row[3],
      dueDate: row[4],
      completed: row[5],
      taskType: row[6],
      createdAt: row[7],
      updatedAt: row[8],
      priority: row[9]
    }));
  }
  
  /**
   * タスク更新
   */
  updateTask(taskId, updatedTask) {
    const data = this.tasksSheet.getDataRange().getValues();
    const taskRowIndex = data.findIndex(row => row[0] === taskId);
    
    if (taskRowIndex === -1) {
      throw new Error('タスクが見つかりません');
    }
    
    const row = [
      updatedTask.id,
      updatedTask.eventId,
      updatedTask.title,
      updatedTask.description,
      updatedTask.dueDate,
      updatedTask.completed,
      updatedTask.taskType,
      updatedTask.createdAt,
      updatedTask.updatedAt,
      updatedTask.priority
    ];
    
    this.tasksSheet.getRange(taskRowIndex + 1, 1, 1, row.length).setValues([row]);
    return updatedTask;
  }
  
  /**
   * タスク削除
   */
  deleteTask(taskId) {
    const data = this.tasksSheet.getDataRange().getValues();
    const taskRowIndex = data.findIndex(row => row[0] === taskId);
    
    if (taskRowIndex === -1) {
      throw new Error('タスクが見つかりません');
    }
    
    this.tasksSheet.deleteRow(taskRowIndex + 1);
  }
  
  /**
   * イベントに関連するタスクを削除
   */
  deleteTasksByEventId(eventId) {
    const data = this.tasksSheet.getDataRange().getValues();
    const taskRowsToDelete = data
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row[1] === eventId)
      .sort((a, b) => b.index - a.index); // 下から削除（インデックスがずれないように）
    
    taskRowsToDelete.forEach(({ index }) => {
      this.tasksSheet.deleteRow(index + 1);
    });
  }
} 