import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import {
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const AppBar: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <MuiAppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={handleHomeClick}
        >
          <EventIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            イベント管理システム
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </MuiAppBar>
  );
}; 