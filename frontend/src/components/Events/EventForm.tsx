import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Event, STATUS_LABELS } from '../../types';
import { apiService } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { ja } from 'date-fns/locale';

interface EventFormProps {
  isEdit?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: new Date(),
    status: 'planning' as Event['status']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const loadEvent = useCallback(async () => {
    try {
      const event = await apiService.getEvent(id!);
      setFormData({
        title: event.title,
        description: event.description || '',
        eventDate: new Date(event.eventDate),
        status: event.status
      });
    } catch (error) {
      console.error('Failed to load event:', error);
      setError('イベントの読み込みに失敗しました');
    } finally {
      setLoadingData(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit && id) {
      loadEvent();
    }
  }, [isEdit, id, loadEvent]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        eventDate: formData.eventDate.toISOString(),
        ...(isEdit && { status: formData.status })
      };

      if (isEdit && id) {
        await apiService.updateEvent(id, eventData);
      } else {
        await apiService.createEvent(eventData);
      }

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || `イベントの${isEdit ? '更新' : '作成'}に失敗しました`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Container maxWidth="md">
        <Box mt={4} mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            戻る
          </Button>

          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {isEdit ? 'イベント編集' : '新しいイベント作成'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="イベントタイトル"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                margin="normal"
                disabled={loading}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="説明"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                margin="normal"
                disabled={loading}
                helperText="イベントの詳細や目的を記載してください"
              />

              <Box mt={2} mb={2}>
                <DateTimePicker
                  label="イベント日時"
                  value={formData.eventDate}
                  onChange={(date) => handleChange('eventDate', date)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Box>

              {isEdit && (
                <TextField
                  select
                  fullWidth
                  label="ステータス"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  margin="normal"
                  disabled={loading}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Box mt={4} display="flex" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {loading 
                    ? `${isEdit ? '更新' : '作成'}中...` 
                    : `${isEdit ? '更新' : '作成'}`
                  }
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  キャンセル
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}; 