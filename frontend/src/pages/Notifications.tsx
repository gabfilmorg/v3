import React from 'react';
import { Box, Typography } from '@mui/material';

const Notifications: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notificações
      </Typography>
      <Typography variant="body1">
        Esta página está em desenvolvimento. Aqui você poderá visualizar e gerenciar suas notificações.
      </Typography>
    </Box>
  );
};

export default Notifications; 