/**
 * データベースサービス（Google Sheets使用）
 */
class DatabaseService {
  constructor() {
    this.spreadsheetId = this.getOrCreateSpreadsheet();
    this.spreadsheet = SpreadsheetApp.openById(this.spreadsheetId);
  }

  /**
   * スプレッドシートの取得または作成
   */
  getOrCreateSpreadsheet() {
    const scriptProperties = PropertiesService.getScriptProperties();
    let spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID');
    
    if (!spreadsheetId) {
      const spreadsheet = SpreadsheetApp.create('EventManagementDB');
      spreadsheetId = spreadsheet.getId();
      scriptProperties.setProperty('SPREADSHEET_ID', spreadsheetId);
    }
    
    return spreadsheetId;
  }

  /**
   * シートを取得または作成
   */
  getOrCreateSheet(sheetName) {
    let sheet = this.spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = this.spreadsheet.insertSheet(sheetName);
      this.initializeSheet(sheet, sheetName);
    }
    return sheet;
  }

  /**
   * シートを初期化
   */
  initializeSheet(sheet, sheetName) {
    if (sheetName === 'events') {
      sheet.getRange('A1:G1').setValues([['id', 'title', 'description', 'eventDate', 'status', 'createdAt', 'updatedAt']]);
    } else if (sheetName === 'tasks') {
      sheet.getRange('A1:J1').setValues([['id', 'eventId', 'title', 'description', 'dueDate', 'completed', 'taskType', 'priority', 'createdAt', 'updatedAt']]);
    }
  }

  /**
   * 全イベントを取得
   */
  getAllEvents() {
    const sheet = this.getOrCreateSheet('events');
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return [];
    }

    const events = [];
    // 1行目がヘッダーかどうかをチェック
    const startRow = (data[0][0] === 'id') ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      // 空行をスキップ
      if (!row[0] || row[0] === '') continue;
      
      events.push({
        id: row[0],
        title: row[1] || '',
        description: row[2] || '',
        eventDate: row[3] || '',
        status: row[4] || 'planning',
        createdAt: row[5] || new Date().toISOString(),
        updatedAt: row[6] || new Date().toISOString()
      });
    }
    
    return events;
  }

  /**
   * 指定されたIDのイベントを取得
   */
  getEventById(eventId) {
    const sheet = this.getOrCreateSheet('events');
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return null;
    }

    // 1行目がヘッダーかどうかをチェック
    const startRow = (data[0][0] === 'id') ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      if (row[0] === eventId) {
        return {
          id: row[0],
          title: row[1] || '',
          description: row[2] || '',
          eventDate: row[3] || '',
          status: row[4] || 'planning',
          createdAt: row[5] || new Date().toISOString(),
          updatedAt: row[6] || new Date().toISOString()
        };
      }
    }
    
    return null;
  }

  /**
   * イベントを作成
   */
  createEvent(event) {
    const sheet = this.getOrCreateSheet('events');
    sheet.appendRow([
      event.id,
      event.title,
      event.description,
      event.eventDate,
      event.status,
      event.createdAt,
      event.updatedAt
    ]);
  }

  /**
   * イベントを更新
   */
  updateEvent(eventId, event) {
    const sheet = this.getOrCreateSheet('events');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === eventId) {
        sheet.getRange(i + 1, 1, 1, 7).setValues([[
          event.id,
          event.title,
          event.description,
          event.eventDate,
          event.status,
          event.createdAt,
          event.updatedAt
        ]]);
        break;
      }
    }
  }

  /**
   * イベントを削除
   */
  deleteEvent(eventId) {
    const sheet = this.getOrCreateSheet('events');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === eventId) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  }

  /**
   * イベントのタスクを取得
   */
  getEventTasks(eventId) {
    const sheet = this.getOrCreateSheet('tasks');
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return [];
    }

    const tasks = [];
    // 1行目がヘッダーかどうかをチェック
    const startRow = (data[0][0] === 'id') ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      // 空行をスキップ
      if (!row[0] || row[0] === '') continue;
      
      if (row[1] === eventId) {
        tasks.push({
          id: row[0],
          eventId: row[1],
          title: row[2] || '',
          description: row[3] || '',
          dueDate: row[4] || '',
          completed: row[5] || false,
          taskType: row[6] || 'custom',
          priority: row[7] || 'medium',
          createdAt: row[8] || new Date().toISOString(),
          updatedAt: row[9] || new Date().toISOString()
        });
      }
    }
    
    return tasks;
  }

  /**
   * 指定されたIDのタスクを取得
   */
  getTaskById(taskId) {
    const sheet = this.getOrCreateSheet('tasks');
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return null;
    }

    // 1行目がヘッダーかどうかをチェック
    const startRow = (data[0][0] === 'id') ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      if (row[0] === taskId) {
        return {
          id: row[0],
          eventId: row[1],
          title: row[2] || '',
          description: row[3] || '',
          dueDate: row[4] || '',
          completed: row[5] || false,
          taskType: row[6] || 'custom',
          priority: row[7] || 'medium',
          createdAt: row[8] || new Date().toISOString(),
          updatedAt: row[9] || new Date().toISOString()
        };
      }
    }
    
    return null;
  }

  /**
   * タスクを作成
   */
  createTask(task) {
    const sheet = this.getOrCreateSheet('tasks');
    sheet.appendRow([
      task.id,
      task.eventId,
      task.title,
      task.description,
      task.dueDate,
      task.completed,
      task.taskType,
      task.priority,
      task.createdAt,
      task.updatedAt
    ]);
  }

  /**
   * タスクを更新
   */
  updateTask(taskId, task) {
    const sheet = this.getOrCreateSheet('tasks');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === taskId) {
        sheet.getRange(i + 1, 1, 1, 10).setValues([[
          task.id,
          task.eventId,
          task.title,
          task.description,
          task.dueDate,
          task.completed,
          task.taskType,
          task.priority,
          task.createdAt,
          task.updatedAt
        ]]);
        break;
      }
    }
  }

  /**
   * タスクを削除
   */
  deleteTask(taskId) {
    const sheet = this.getOrCreateSheet('tasks');
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[0] === taskId) {
        sheet.deleteRow(i + 1);
        break;
      }
    }
  }
} 