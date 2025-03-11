import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? 32 : 8,
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App; 