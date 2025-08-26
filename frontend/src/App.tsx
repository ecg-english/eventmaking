import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppBar } from './components/Layout/AppBar';
import { EventList } from './components/Events/EventList';
import { EventForm } from './components/Events/EventForm';
import { EventDetail } from './components/Events/EventDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '"Hiragino Sans"',
      '"Hiragino Kaku Gothic ProN"',
      '"Yu Gothic"',
      '"Meiryo"',
      'sans-serif',
    ].join(','),
  },
});



const AppContent: React.FC = () => {
  return (
    <div className="App">
      <AppBar />
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/events/new" element={<EventForm />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/edit" element={<EventForm isEdit={true} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App; 