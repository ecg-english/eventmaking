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
    // デバッグ用ログ
    console.log('CORS_ORIGIN:', CORS_ORIGIN);
    console.log('Request method:', method);
    console.log('Request headers:', e.headers);
    
    // CORSヘッダーを設定
    const headers = {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // OPTIONSリクエスト（プリフライト）の処理
    if (method === 'OPTIONS') {
      const response = ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
      
      response.addHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
      response.addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.addHeader('Content-Type', 'application/json');
      
      return response;
    }

    const path = e.parameter.path || '';
    const pathParts = path.split('/').filter(part => part !== '');

    let response;

    // ルーティング
    if (path === 'health') {
      response = { status: 'OK', timestamp: new Date().toISOString() };
    } else if (pathParts[0] === 'auth') {
      response = handleAuthRequest(pathParts, method, e);
    } else if (pathParts[0] === 'events') {
      response = handleEventRequest(pathParts, method, e);
    } else {
      response = { 
        message: 'イベント管理システム API',
        version: '1.0.0',
        endpoints: {
          auth: '/auth',
          events: '/events',
          health: '/health'
        }
      };
    }

    const responseOutput = ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
    responseOutput.addHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    responseOutput.addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseOutput.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseOutput.addHeader('Content-Type', 'application/json');
    
    return responseOutput;

  } catch (error) {
    console.error('Error handling request:', error);
    const response = ContentService.createTextOutput(JSON.stringify({ 
      error: 'サーバー内部エラーが発生しました',
      details: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
    
    response.addHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    response.addHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.addHeader('Content-Type', 'application/json');
    
    return response;
  }
}

/**
 * 認証関連のリクエストを処理
 */
function handleAuthRequest(pathParts, method, e) {
  const authService = new AuthService();
  
  if (method === 'POST' && pathParts[1] === 'register') {
    const data = JSON.parse(e.postData.contents);
    return authService.register(data.email, data.name, data.password);
  } else if (method === 'POST' && pathParts[1] === 'login') {
    const data = JSON.parse(e.postData.contents);
    return authService.login(data.email, data.password);
  } else if (method === 'GET' && pathParts[1] === 'me') {
    const token = getAuthToken(e);
    return authService.getCurrentUser(token);
  } else if (method === 'PUT' && pathParts[1] === 'me') {
    const token = getAuthToken(e);
    const data = JSON.parse(e.postData.contents);
    return authService.updateUser(token, data);
  } else if (method === 'PUT' && pathParts[1] === 'change-password') {
    const token = getAuthToken(e);
    const data = JSON.parse(e.postData.contents);
    return authService.changePassword(token, data.currentPassword, data.newPassword);
  }
  
  throw new Error('認証エンドポイントが見つかりません');
}

/**
 * イベント関連のリクエストを処理
 */
function handleEventRequest(pathParts, method, e) {
  const eventService = new EventService();
  const token = getAuthToken(e);
  const userId = new AuthService().verifyToken(token).userId;
  
  if (method === 'GET' && pathParts.length === 1) {
    return eventService.getEventsByUserId(userId);
  } else if (method === 'GET' && pathParts.length === 2) {
    return eventService.getEventById(pathParts[1], userId);
  } else if (method === 'POST' && pathParts.length === 1) {
    const data = JSON.parse(e.postData.contents);
    return eventService.createEvent(data.title, data.description, data.eventDate, userId);
  } else if (method === 'PUT' && pathParts.length === 2) {
    const data = JSON.parse(e.postData.contents);
    return eventService.updateEvent(pathParts[1], data, userId);
  } else if (method === 'DELETE' && pathParts.length === 2) {
    return eventService.deleteEvent(pathParts[1], userId);
  } else if (method === 'GET' && pathParts.length === 3 && pathParts[2] === 'tasks') {
    return eventService.getEventTasks(pathParts[1], userId);
  } else if (method === 'POST' && pathParts.length === 3 && pathParts[2] === 'tasks') {
    const data = JSON.parse(e.postData.contents);
    return eventService.createTask(pathParts[1], data, userId);
  } else if (method === 'PUT' && pathParts.length === 3 && pathParts[1] === 'tasks') {
    const data = JSON.parse(e.postData.contents);
    return eventService.updateTask(pathParts[2], data, userId);
  } else if (method === 'DELETE' && pathParts.length === 3 && pathParts[1] === 'tasks') {
    return eventService.deleteTask(pathParts[2], userId);
  }
  
  throw new Error('イベントエンドポイントが見つかりません');
}

/**
 * リクエストから認証トークンを取得
 */
function getAuthToken(e) {
  const authHeader = e.headers?.Authorization || e.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('アクセストークンが必要です');
  }
  return authHeader.substring(7);
}

/**
 * テスト用関数
 */
function testAPI() {
  console.log('GAS API テスト開始');
  
  // ヘルスチェック
  const healthResponse = doGet({ parameter: { path: 'health' } });
  console.log('Health check:', healthResponse.getContent());
  
  // CORS設定テスト
  console.log('CORS_ORIGIN value:', CORS_ORIGIN);
  
  // ユーザー登録テスト
  const registerData = {
    email: 'test@example.com',
    name: 'テストユーザー',
    password: 'password123'
  };
  
  const registerResponse = doPost({
    parameter: { path: 'auth/register' },
    postData: { contents: JSON.stringify(registerData) }
  });
  
  console.log('Register response:', registerResponse.getContent());
} 