import { TaskTemplate } from '../types';

export const DEFAULT_TASK_TEMPLATES: TaskTemplate[] = [
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