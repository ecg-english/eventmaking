import express from 'express';
import { EventService } from '../services/eventService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const eventService = new EventService();

// 全ルートに認証を適用
router.use(authenticateToken);

// イベント一覧取得
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const events = await eventService.getEventsByUserId(req.userId!);
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// イベント詳細取得
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    // ユーザーの所有権チェック
    if (event.userId !== req.userId) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }
    
    res.json(event);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// イベント作成
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, eventDate } = req.body;
    
    if (!title || !eventDate) {
      return res.status(400).json({ error: 'タイトルとイベント日時は必須です' });
    }
    
    const event = await eventService.createEvent(title, description, eventDate, req.userId!);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// イベント更新
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    // ユーザーの所有権チェック
    if (event.userId !== req.userId) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }
    
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
    res.json(updatedEvent);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// イベント削除
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    // ユーザーの所有権チェック
    if (event.userId !== req.userId) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }
    
    await eventService.deleteEvent(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// イベントのタスク一覧取得
router.get('/:id/tasks', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    // ユーザーの所有権チェック
    if (event.userId !== req.userId) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }
    
    const tasks = await eventService.getEventTasks(req.params.id);
    res.json(tasks);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// タスク作成
router.post('/:id/tasks', async (req: AuthenticatedRequest, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    // ユーザーの所有権チェック
    if (event.userId !== req.userId) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }
    
    const { title, description, dueDate, taskType, priority } = req.body;
    
    if (!title || !dueDate || !taskType) {
      return res.status(400).json({ error: 'タイトル、期限、タスクタイプは必須です' });
    }
    
    const task = await eventService.createTask(req.params.id, {
      title,
      description,
      dueDate,
      taskType,
      priority
    });
    
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// タスク更新
router.put('/tasks/:taskId', async (req: AuthenticatedRequest, res) => {
  try {
    const task = await eventService.updateTask(req.params.taskId, req.body);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// タスク削除
router.delete('/tasks/:taskId', async (req: AuthenticatedRequest, res) => {
  try {
    await eventService.deleteTask(req.params.taskId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 