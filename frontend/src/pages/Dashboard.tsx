import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const equipmentUsageData = [
  { name: 'Jan', usage: 65 },
  { name: 'Fev', usage: 59 },
  { name: 'Mar', usage: 80 },
  { name: 'Abr', usage: 81 },
  { name: 'Mai', usage: 56 },
  { name: 'Jun', usage: 55 },
];

const projectStatusData = [
  { name: 'Em Andamento', value: 8 },
  { name: 'Concluídos', value: 15 },
  { name: 'Atrasados', value: 3 },
  { name: 'Planejados', value: 5 },
];

const maintenanceData = [
  { name: 'Câmeras', pendentes: 2, realizadas: 5 },
  { name: 'Lentes', pendentes: 1, realizadas: 3 },
  { name: 'Tripés', pendentes: 0, realizadas: 4 },
  { name: 'Iluminação', pendentes: 3, realizadas: 2 },
];

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Estatísticas Rápidas */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Equipamentos Ativos
              </Typography>
              <Typography variant="h4">42</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Projetos Ativos
              </Typography>
              <Typography variant="h4">8</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Manutenções Pendentes
              </Typography>
              <Typography variant="h4">6</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Reservas Hoje
              </Typography>
              <Typography variant="h4">12</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Uso de Equipamentos */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Uso de Equipamentos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equipmentUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  name="Taxa de Utilização (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status dos Projetos */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status dos Projetos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Manutenções */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Manutenções por Categoria
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pendentes" fill="#ff9800" name="Manutenções Pendentes" />
                <Bar dataKey="realizadas" fill="#4caf50" name="Manutenções Realizadas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 