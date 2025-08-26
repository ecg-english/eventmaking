export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
}

export interface EventTask {
  id: string;
  eventId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  taskType: TaskType;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string; // メモ機能用
}

export type TaskType = 
  | 'proposal'      // 企画書作成
  | 'flyer'         // フライヤー作成
  | 'print'         // フライヤー印刷・店舗張り出し
  | 'community'     // コミュニティアプリ投稿
  | 'instagram'     // Instagram投稿
  | 'line'          // 公式LINE予約投稿
  | 'meetup'        // Meetup投稿
  | 'story'         // ストーリー投稿
  | 'preparation'   // イベント準備物確認・買い出し
  | 'story-repost'  // ストーリー再投稿（前日）
  | 'reminder'      // 予約者へのリマインド
  | 'execution'     // 実施・反省会
  | 'custom';       // カスタムタスク

export interface CreateEventData {
  title: string;
  description: string;
  eventDate: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  taskType: TaskType;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  proposal: '企画書作成',
  flyer: 'フライヤー作成',
  print: 'フライヤー印刷・店舗張り出し',
  community: 'コミュニティアプリ投稿',
  instagram: 'Instagram投稿',
  line: '公式LINE予約投稿',
  meetup: 'Meetup投稿',
  story: 'ストーリー投稿',
  preparation: 'イベント準備物確認・買い出し',
  'story-repost': 'ストーリー投稿（前日）',
  reminder: '予約者へのリマインド',
  execution: 'イベント実施・反省会',
  custom: 'カスタムタスク'
};

export const PRIORITY_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: '低',
  medium: '中',
  high: '高'
};

export const STATUS_LABELS: Record<Event['status'], string> = {
  planning: '企画中',
  'in-progress': '進行中',
  completed: '完了',
  cancelled: 'キャンセル'
}; 