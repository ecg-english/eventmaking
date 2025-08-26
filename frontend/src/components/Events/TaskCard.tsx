import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  Launch as LaunchIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { EventTask, TASK_TYPE_LABELS, PRIORITY_LABELS } from '../../types';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: EventTask;
  urgency: {
    type: 'overdue' | 'urgent' | 'upcoming' | 'normal';
    days: number;
  };
  onToggle: (taskId: string, completed: boolean) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  getPriorityColor: (priority: 'low' | 'medium' | 'high') => any;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  urgency,
  onToggle,
  onUpdateNotes,
  getPriorityColor
}) => {
  const [notes, setNotes] = useState(task.notes || '');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notes);
  };

  const getExternalLink = (taskType: string) => {
    switch (taskType) {
      case 'community':
        return 'https://ecg-english.github.io/language-community';
      case 'instagram':
      case 'story':
      case 'story-repost':
        return 'https://www.instagram.com/english_ecg';
      default:
        return null;
    }
  };

  const hasNotes = task.taskType === 'preparation' || task.taskType === 'execution';
  const externalLink = getExternalLink(task.taskType);

  return (
    <Card 
      sx={{ 
        opacity: task.completed ? 0.6 : 1,
        border: urgency.type === 'overdue' ? '2px solid #f44336' : 
               urgency.type === 'urgent' ? '2px solid #ff9800' : 'none',
        backgroundColor: task.completed ? '#f5f5f5' : 'white',
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={task.completed}
                onChange={(e) => onToggle(task.id, e.target.checked)}
                color="primary"
              />
            }
            label=""
            sx={{ m: 0 }}
          />
          
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  flex: 1,
                  color: task.completed ? 'text.secondary' : 'text.primary',
                  fontWeight: task.completed ? 'normal' : 'medium'
                }}
              >
                {task.title}
              </Typography>
              
              <Chip
                label={TASK_TYPE_LABELS[task.taskType]}
                size="small"
                variant="outlined"
                sx={{ 
                  opacity: task.completed ? 0.7 : 1,
                  backgroundColor: task.completed ? 'rgba(0,0,0,0.04)' : 'transparent'
                }}
              />
              
              <Chip
                label={PRIORITY_LABELS[task.priority]}
                size="small"
                color={getPriorityColor(task.priority)}
                sx={{ 
                  opacity: task.completed ? 0.7 : 1,
                  backgroundColor: task.completed ? 'rgba(0,0,0,0.04)' : undefined
                }}
              />
            </Box>
            
            {task.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                paragraph
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                {task.description}
              </Typography>
            )}
            
            <Box display="flex" alignItems="center" gap={1} mb={externalLink || hasNotes ? 2 : 0}>
              {urgency.type === 'overdue' && !task.completed && (
                <WarningIcon color="error" fontSize="small" />
              )}
              {urgency.type === 'urgent' && !task.completed && (
                <WarningIcon color="warning" fontSize="small" />
              )}
              
              <Typography 
                variant="body2" 
                color={
                  task.completed ? 'text.secondary' :
                  urgency.type === 'overdue' ? 'error' :
                  urgency.type === 'urgent' ? 'warning.main' :
                  'text.secondary'
                }
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                期限: {task.dueDate ? format(parseISO(task.dueDate), 'MM月dd日 HH:mm', { locale: ja }) : '未設定'}
                {!task.completed && urgency.type === 'overdue' && ` (${urgency.days}日過ぎています)`}
                {!task.completed && urgency.type === 'urgent' && urgency.days === 0 && ' (今日が期限)'} 
                {!task.completed && urgency.type === 'urgent' && urgency.days === 1 && ' (明日が期限)'}
                {!task.completed && urgency.type === 'upcoming' && ` (あと${urgency.days}日)`}
                {task.completed && ' (完了)'}
              </Typography>
            </Box>

            {/* 外部リンクボタン */}
            {externalLink && (
              <Box mb={hasNotes ? 1 : 0}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LaunchIcon />}
                  onClick={() => window.open(externalLink, '_blank')}
                  sx={{ opacity: task.completed ? 0.7 : 1 }}
                >
                  {task.taskType === 'community' ? 'コミュニティアプリを開く' : 'Instagramを開く'}
                </Button>
              </Box>
            )}

            {/* メモ機能（アコーディオン） */}
            {hasNotes && (
              <Accordion 
                expanded={isNotesExpanded} 
                onChange={(_, expanded) => setIsNotesExpanded(expanded)}
                sx={{ 
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  '&:before': { display: 'none' },
                  opacity: task.completed ? 0.7 : 1
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2">
                    {task.taskType === 'preparation' ? '準備物メモ' : '反省会メモ'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      placeholder={
                        task.taskType === 'preparation' 
                          ? '必要な準備物をメモしてください...' 
                          : '反省会の内容をメモしてください...'
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveNotes}
                        disabled={notes === (task.notes || '')}
                      >
                        保存
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}; 