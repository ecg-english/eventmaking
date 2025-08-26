import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Fab,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Event, STATUS_LABELS } from '../../types';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventList = await apiService.getAllEvents();
      setEvents(eventList);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('このイベントを削除してもよろしいですか？')) {
      try {
        await apiService.deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('イベントの削除に失敗しました');
      }
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

  if (loading) {
    return (
      <Container>
        <Box mt={4}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
            イベントを読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          イベント一覧
        </Typography>

        {events.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                まだイベントが登録されていません
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                新しいイベントを作成して、企画から実施まで効率的に管理しましょう
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/events/new')}
              >
                最初のイベントを作成
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h2" noWrap sx={{ flex: 1, mr: 1 }}>
                        {event.title}
                      </Typography>
                      <Chip
                        label={STATUS_LABELS[event.status]}
                        color={getStatusColor(event.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {format(parseISO(event.eventDate), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                    </Typography>
                    
                    {event.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...` 
                          : event.description
                        }
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      詳細
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                    >
                      編集
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      削除
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/events/new')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}; 