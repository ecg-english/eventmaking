// イベント管理システム GASバックエンド
// メインエントリーポイント

// 環境変数
const JWT_SECRET = PropertiesService.getScriptProperties().getProperty('JWT_SECRET') || 'eventmaking-secret-key-2024-a1b2c3d4e5f6g7h8i9j0';
const CORS_ORIGIN = PropertiesService.getScriptProperties().getProperty('CORS_ORIGIN') || 'https://ecg-english.github.io';

/**
 * GET リクエストのハンドラー
 */
function doGet(e) {
  return handleRequest(e, 'GET');
}

/**
 * POST リクエストのハンドラー
 */
function doPost(e) {
  return handleRequest(e, 'POST');
}

/**
 * PUT リクエストのハンドラー
 */
function doPut(e) {
  return handleRequest(e, 'PUT');
}

/**
 * DELETE リクエストのハンドラー
 */
function doDelete(e) {
  return handleRequest(e, 'DELETE');
}

/**
 * リクエストのメインハンドラー
 */
function handleRequest(e, method) {
  try {
    const path = e.parameter.path || '';
    const pathParts = path.split('/').filter(part => part !== '');

    let response;

    // ルーティング
    if (path === 'health') {
      response = { status: 'OK', timestamp: new Date().toISOString() };
    } else if (pathParts[0] === 'events') {
      response = handleEventRequest(pathParts, method, e);
    } else {
      response = { 
        message: 'イベント管理システム API',
        version: '1.0.0',
        endpoints: {
          events: '/events',
          health: '/health'
        }
      };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error handling request:', error);
    return ContentService.createTextOutput(JSON.stringify({ 
      error: 'サーバー内部エラーが発生しました',
      details: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * イベント関連のリクエストを処理
 */
function handleEventRequest(pathParts, method, e) {
  const eventService = new EventService();
  
  if (method === 'GET' && pathParts.length === 1) {
    return eventService.getAllEvents();
  } else if (method === 'GET' && pathParts.length === 2) {
    return eventService.getEventById(pathParts[1]);
  } else if (method === 'POST' && pathParts.length === 1) {
    const data = JSON.parse(e.postData.contents);
    return eventService.createEvent(data.title, data.description, data.eventDate);
  } else if (method === 'PUT' && pathParts.length === 2) {
    const data = JSON.parse(e.postData.contents);
    return eventService.updateEvent(pathParts[1], data);
  } else if (method === 'DELETE' && pathParts.length === 2) {
    return eventService.deleteEvent(pathParts[1]);
  } else if (method === 'GET' && pathParts.length === 3 && pathParts[2] === 'tasks') {
    return eventService.getEventTasks(pathParts[1]);
  } else if (method === 'POST' && pathParts.length === 3 && pathParts[2] === 'tasks') {
    const data = JSON.parse(e.postData.contents);
    return eventService.createTask(pathParts[1], data);
  } else if (method === 'PUT' && pathParts.length === 3 && pathParts[1] === 'tasks') {
    const data = JSON.parse(e.postData.contents);
    return eventService.updateTask(pathParts[2], data);
  } else if (method === 'DELETE' && pathParts.length === 3 && pathParts[1] === 'tasks') {
    return eventService.deleteTask(pathParts[2]);
  }
  
  throw new Error('イベントエンドポイントが見つかりません');
}

/**
 * テスト用関数
 */
function testAPI() {
  console.log('GAS API テスト開始');
  
  // ヘルスチェック
  const healthResponse = doGet({ parameter: { path: 'health' } });
  console.log('Health check:', healthResponse.getContent());
  
  // イベント一覧取得テスト
  const eventsResponse = doGet({ parameter: { path: 'events' } });
  console.log('Events list:', eventsResponse.getContent());
  
  console.log('GAS API テスト完了');
} 