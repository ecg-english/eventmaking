export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  userId: string;
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
}

export type TaskType = 
  | 'proposal'      // 企画書作成
  | 'flyer'         // フライヤー作成
  | 'community'     // コミュニティアプリ投稿
  | 'instagram'     // Instagram投稿
  | 'line'          // 公式LINE予約投稿
  | 'print'         // フライヤー印刷・店舗張り出し
  | 'meetup'        // Meetup投稿
  | 'story'         // ストーリー投稿
  | 'story-repost'  // ストーリー再投稿
  | 'execution'     // 実施・反省会
  | 'custom';       // カスタムタスク

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface EventProposal {
  id: string;
  eventId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialPost {
  id: string;
  eventId: string;
  platform: 'instagram' | 'line' | 'community' | 'meetup' | 'story';
  content: string;
  scheduledDate: string;
  posted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTemplate {
  taskType: TaskType;
  title: string;
  description: string;
  daysBeforeEvent: number;
  priority: 'low' | 'medium' | 'high';
} 