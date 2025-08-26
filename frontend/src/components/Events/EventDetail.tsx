import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Event, EventTask, STATUS_LABELS } from '../../types';
import { apiService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO, isPast, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TaskCard } from './TaskCard';

export const EventDetail: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<EventTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const loadEventAndTasks = useCallback(async () => {
    try {
      const [eventData, tasksData] = await Promise.all([
        apiService.getEvent(id!),
        apiService.getEventTasks(id!)
      ]);
      setEvent(eventData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load event data:', error);
      setError('イベントデータの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadEventAndTasks();
    }
  }, [id, loadEventAndTasks]);

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, { completed });
      
      // 元のタスク情報を保持しながら更新
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,  // 元のタスク情報を保持
            ...updatedTask,  // 更新された情報で上書き
            completed: completed  // 完了状態を確実に更新
          };
        }
        return task;
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('タスクの更新に失敗しました');
    }
  };

  const handleUpdateNotes = async (taskId: string, notes: string) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, { notes });
      
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updatedTask,
            notes: notes
          };
        }
        return task;
      }));
    } catch (error) {
      console.error('Failed to update task notes:', error);
      alert('メモの更新に失敗しました');
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'planning':
        return 'default';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTaskUrgency = (dueDate: string): {
    type: 'overdue' | 'urgent' | 'upcoming' | 'normal';
    days: number;
  } => {
    try {
      // 日付が無効な場合はデフォルト値を返す
      if (!dueDate || dueDate === '') {
        return { type: 'normal', days: 0 };
      }
      
      const due = parseISO(dueDate);
      
      // 無効な日付の場合はデフォルト値を返す
      if (isNaN(due.getTime())) {
        return { type: 'normal', days: 0 };
      }
      
      const daysUntilDue = differenceInDays(due, new Date());
      
      if (isPast(due)) {
        return { type: 'overdue', days: Math.abs(daysUntilDue) };
      } else if (daysUntilDue <= 1) {
        return { type: 'urgent', days: daysUntilDue };
      } else if (daysUntilDue <= 7) {
        return { type: 'upcoming', days: daysUntilDue };
      }
      return { type: 'normal', days: daysUntilDue };
    } catch (error) {
      console.error('Error parsing due date:', dueDate, error);
      return { type: 'normal', days: 0 };
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (loading) {
    return (
      <Container>
        <Box mt={4}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
            イベントデータを読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error">{error || 'イベントが見つかりません'}</Alert>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            戻る
          </Button>
        </Box>
      </Container>
    );
  }

  const progress = calculateProgress();

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          戻る
        </Button>

        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="h4" component="h1">
              {event.title}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Chip
                label={STATUS_LABELS[event.status]}
                color={getStatusColor(event.status)}
              />
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                編集
              </Button>
            </Box>
          </Box>

          <Typography variant="h6" color="primary" gutterBottom>
            {format(parseISO(event.eventDate), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
          </Typography>

          {event.description && (
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
          )}

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              進捗状況: {progress}%
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary">
                {tasks.filter(task => task.completed).length} / {tasks.length} タスク完了
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="h5" gutterBottom>
          タスク一覧
        </Typography>

        {tasks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              タスクがありません
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tasks
              .sort((a, b) => {
                try {
                  const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                  const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                  return dateA - dateB;
                } catch (error) {
                  console.error('Error sorting tasks by date:', error);
                  return 0;
                }
              })
              .map((task) => {
                const urgency = getTaskUrgency(task.dueDate);
                return (
                  <Grid item xs={12} key={task.id}>
                    <TaskCard
                      task={task}
                      urgency={urgency}
                      onToggle={handleTaskToggle}
                      onUpdateNotes={handleUpdateNotes}
                      getPriorityColor={getPriorityColor}
                    />
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Box>
    </Container>
  );
}; 