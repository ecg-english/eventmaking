// イベント管理システム GASバックエンド
// メインエントリーポイント

// 環境変数
const JWT_SECRET = PropertiesService.getScriptProperties().getProperty('JWT_SECRET') || 'eventmaking-secret-key-2024-a1b2c3d4e5f6g7h8i9j0';
const CORS_ORIGIN = PropertiesService.getScriptProperties().getProperty('CORS_ORIGIN') || 'https://ecg-english.github.io';

/**
 * Google Apps Script メインエントリーポイント
 */

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function doPut(e) {
  return handleRequest(e, 'PUT');
}

function doDelete(e) {
  return handleRequest(e, 'DELETE');
}

function doOptions(e) {
  return handleRequest(e, 'OPTIONS');
}

function handleRequest(e, method) {
  try {
    console.log(`Request method: ${method}`);
    
    // CORSヘッダーを設定
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };

    // OPTIONSリクエスト（プリフライト）の処理
    if (method === 'OPTIONS') {
      const response = ContentService.createTextOutput('');
      response.setMimeType(ContentService.MimeType.TEXT);
      
      // ヘッダーを設定
      Object.keys(headers).forEach(key => {
        response.addHeader(key, headers[key]);
      });
      
      return response;
    }

    // パスパラメータを取得
    const path = e.parameter.path || '';
    console.log(`Request path: ${path}`);

    let result;
    const eventService = new EventService();

    // ルーティング
    if (path.startsWith('events')) {
      if (method === 'GET') {
        if (path === 'events') {
          result = eventService.getAllEvents();
        } else if (path.match(/^events\/(.+)$/)) {
          const eventId = path.split('/')[1];
          result = eventService.getEventById(eventId);
        } else if (path.match(/^events\/(.+)\/tasks$/)) {
          const eventId = path.split('/')[1];
          result = eventService.getEventTasks(eventId);
        }
      } else if (method === 'POST' && path === 'events') {
        const data = JSON.parse(e.postData.contents);
        result = eventService.createEvent(data.title, data.description, data.eventDate);
      } else if (method === 'PUT' && path.match(/^events\/(.+)$/)) {
        const eventId = path.split('/')[1];
        const data = JSON.parse(e.postData.contents);
        result = eventService.updateEvent(eventId, data);
      } else if (method === 'DELETE' && path.match(/^events\/(.+)$/)) {
        const eventId = path.split('/')[1];
        result = eventService.deleteEvent(eventId);
      } else if (method === 'POST' && path.match(/^events\/(.+)\/tasks$/)) {
        const eventId = path.split('/')[1];
        const data = JSON.parse(e.postData.contents);
        result = eventService.createTask(eventId, data);
      } else if (method === 'PUT' && path.match(/^events\/tasks\/(.+)$/)) {
        const taskId = path.split('/')[2];
        const data = JSON.parse(e.postData.contents);
        result = eventService.updateTask(taskId, data);
      } else if (method === 'DELETE' && path.match(/^events\/tasks\/(.+)$/)) {
        const taskId = path.split('/')[2];
        result = eventService.deleteTask(taskId);
      }
    } else if (path === 'health') {
      result = { status: 'ok', timestamp: new Date().toISOString() };
    }

    if (!result) {
      throw new Error(`Invalid path: ${path}`);
    }

    // JSONP対応
    const callback = e.parameter.callback;
    let response;
    
    if (callback && method === 'GET') {
      response = ContentService.createTextOutput(`${callback}(${JSON.stringify(result)})`);
      response.setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      response = ContentService.createTextOutput(JSON.stringify(result));
      response.setMimeType(ContentService.MimeType.JSON);
    }

    // CORSヘッダーを設定
    Object.keys(headers).forEach(key => {
      response.addHeader(key, headers[key]);
    });

    return response;

  } catch (error) {
    console.error('Error handling request:', error);
    
    const errorResponse = {
      error: error.message,
      timestamp: new Date().toISOString()
    };

    const response = ContentService.createTextOutput(JSON.stringify(errorResponse));
    response.setMimeType(ContentService.MimeType.JSON);
    
    // エラー時もCORSヘッダーを設定
    response.addHeader('Access-Control-Allow-Origin', '*');
    response.addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

// テスト用関数
function testAPI() {
  console.log('GAS API テスト開始');
  
  const testEvent = {
    parameter: {
      path: 'health'
    }
  };
  
  try {
    const result = handleRequest(testEvent, 'GET');
    console.log('テスト結果:', result.getContent());
  } catch (error) {
    console.error('テストエラー:', error);
  }
} 