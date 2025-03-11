import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Dados de exemplo
const equipmentUsageData = [
  { month: 'Jan', cameras: 65, lentes: 40, tripés: 24, iluminação: 35 },
  { month: 'Fev', cameras: 59, lentes: 45, tripés: 28, iluminação: 30 },
  { month: 'Mar', cameras: 80, lentes: 52, tripés: 30, iluminação: 45 },
  { month: 'Abr', cameras: 81, lentes: 56, tripés: 35, iluminação: 48 },
  { month: 'Mai', cameras: 56, lentes: 45, tripés: 25, iluminação: 30 },
  { month: 'Jun', cameras: 55, lentes: 48, tripés: 28, iluminação: 32 },
];

const maintenanceCostData = [
  { month: 'Jan', preventiva: 1200, corretiva: 800 },
  { month: 'Fev', preventiva: 1500, corretiva: 600 },
  { month: 'Mar', preventiva: 1300, corretiva: 1200 },
  { month: 'Abr', preventiva: 1800, corretiva: 500 },
  { month: 'Mai', preventiva: 1400, corretiva: 900 },
  { month: 'Jun', preventiva: 1600, corretiva: 700 },
];

const equipmentStatusData = [
  { name: 'Disponível', value: 65, color: '#4caf50' },
  { name: 'Em Uso', value: 25, color: '#2196f3' },
  { name: 'Em Manutenção', value: 8, color: '#ff9800' },
  { name: 'Danificado', value: 2, color: '#f44336' },
];

const projectRevenueData = [
  { month: 'Jan', receita: 15000, custo: 8000 },
  { month: 'Fev', receita: 18000, custo: 9500 },
  { month: 'Mar', receita: 22000, custo: 11000 },
  { month: 'Abr', receita: 25000, custo: 12500 },
  { month: 'Mai', receita: 21000, custo: 10500 },
  { month: 'Jun', receita: 28000, custo: 14000 },
];

const equipmentCategoryData = [
  { name: 'Câmeras', quantidade: 42, valor: 120000 },
  { name: 'Lentes', quantidade: 65, valor: 95000 },
  { name: 'Tripés', quantidade: 28, valor: 35000 },
  { name: 'Iluminação', quantidade: 50, valor: 75000 },
  { name: 'Áudio', quantidade: 35, valor: 45000 },
  { name: 'Acessórios', quantidade: 120, valor: 30000 },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('6m');
  const [tabValue, setTabValue] = useState(0);

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as string);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Análise e Relatórios</Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="period-select-label">Período</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={period}
            label="Período"
            onChange={handlePeriodChange}
          >
            <MenuItem value="1m">Último Mês</MenuItem>
            <MenuItem value="3m">Últimos 3 Meses</MenuItem>
            <MenuItem value="6m">Últimos 6 Meses</MenuItem>
            <MenuItem value="1y">Último Ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab label="Visão Geral" />
          <Tab label="Equipamentos" />
          <Tab label="Projetos" />
          <Tab label="Financeiro" />
        </Tabs>
      </Box>

      {/* Visão Geral */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Cards de Métricas */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total de Equipamentos
                </Typography>
                <Typography variant="h4">340</Typography>
                <Typography variant="body2" color="textSecondary">
                  +5% em relação ao mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Taxa de Utilização
                </Typography>
                <Typography variant="h4">78%</Typography>
                <Typography variant="body2" color="textSecondary">
                  +12% em relação ao mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Projetos Ativos
                </Typography>
                <Typography variant="h4">12</Typography>
                <Typography variant="body2" color="textSecondary">
                  +2 em relação ao mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Custo de Manutenção
                </Typography>
                <Typography variant="h4">R$ 8.500</Typography>
                <Typography variant="body2" color="textSecondary">
                  -15% em relação ao mês anterior
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Uso de Equipamentos */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Uso de Equipamentos por Categoria
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={equipmentUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cameras" stroke="#8884d8" name="Câmeras" />
                  <Line type="monotone" dataKey="lentes" stroke="#82ca9d" name="Lentes" />
                  <Line type="monotone" dataKey="tripés" stroke="#ffc658" name="Tripés" />
                  <Line type="monotone" dataKey="iluminação" stroke="#ff8042" name="Iluminação" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Status dos Equipamentos */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Status dos Equipamentos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={equipmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {equipmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Custos de Manutenção */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Custos de Manutenção
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Bar dataKey="preventiva" name="Manutenção Preventiva" fill="#4caf50" />
                  <Bar dataKey="corretiva" name="Manutenção Corretiva" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Equipamentos */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Distribuição por Categoria */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distribuição por Categoria
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={equipmentCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" name="Quantidade" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Valor do Inventário por Categoria */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Valor do Inventário por Categoria
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={equipmentCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Bar dataKey="valor" name="Valor (R$)" fill="#9c27b0" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Idade dos Equipamentos */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Idade dos Equipamentos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: '< 1 ano', value: 25, color: '#4caf50' },
                      { name: '1-2 anos', value: 35, color: '#8bc34a' },
                      { name: '2-3 anos', value: 20, color: '#ffeb3b' },
                      { name: '3-5 anos', value: 15, color: '#ff9800' },
                      { name: '> 5 anos', value: 5, color: '#f44336' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: '< 1 ano', value: 25, color: '#4caf50' },
                      { name: '1-2 anos', value: 35, color: '#8bc34a' },
                      { name: '2-3 anos', value: 20, color: '#ffeb3b' },
                      { name: '3-5 anos', value: 15, color: '#ff9800' },
                      { name: '> 5 anos', value: 5, color: '#f44336' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Projetos */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Receita vs Custo */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Receita vs Custo por Projeto
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={projectRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Receita"
                  />
                  <Area
                    type="monotone"
                    dataKey="custo"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Custo"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Status dos Projetos */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Status dos Projetos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Em Andamento', value: 8, color: '#2196f3' },
                      { name: 'Concluídos', value: 15, color: '#4caf50' },
                      { name: 'Atrasados', value: 3, color: '#f44336' },
                      { name: 'Planejados', value: 5, color: '#ff9800' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Em Andamento', value: 8, color: '#2196f3' },
                      { name: 'Concluídos', value: 15, color: '#4caf50' },
                      { name: 'Atrasados', value: 3, color: '#f44336' },
                      { name: 'Planejados', value: 5, color: '#ff9800' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Duração Média dos Projetos */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Duração Média dos Projetos (Dias)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { categoria: 'Fotografia', duração: 3 },
                    { categoria: 'Vídeo Curto', duração: 5 },
                    { categoria: 'Documentário', duração: 15 },
                    { categoria: 'Filme', duração: 30 },
                    { categoria: 'Série', duração: 45 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="duração" name="Duração (Dias)" fill="#ff5722" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Financeiro */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Receita Mensal */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Receita vs Despesas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: 'Jan', receita: 25000, despesas: 18000 },
                    { month: 'Fev', receita: 28000, despesas: 19500 },
                    { month: 'Mar', receita: 32000, despesas: 22000 },
                    { month: 'Abr', receita: 35000, despesas: 23500 },
                    { month: 'Mai', receita: 31000, despesas: 21000 },
                    { month: 'Jun', receita: 38000, despesas: 25000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#4caf50"
                    name="Receita"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke="#f44336"
                    name="Despesas"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Distribuição de Despesas */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Distribuição de Despesas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Manutenção', value: 35, color: '#f44336' },
                      { name: 'Seguros', value: 15, color: '#2196f3' },
                      { name: 'Aquisições', value: 25, color: '#4caf50' },
                      { name: 'Pessoal', value: 20, color: '#ff9800' },
                      { name: 'Outros', value: 5, color: '#9c27b0' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Manutenção', value: 35, color: '#f44336' },
                      { name: 'Seguros', value: 15, color: '#2196f3' },
                      { name: 'Aquisições', value: 25, color: '#4caf50' },
                      { name: 'Pessoal', value: 20, color: '#ff9800' },
                      { name: 'Outros', value: 5, color: '#9c27b0' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* ROI por Categoria */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ROI por Categoria de Equipamento
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { categoria: 'Câmeras', roi: 185 },
                    { categoria: 'Lentes', roi: 210 },
                    { categoria: 'Tripés', roi: 150 },
                    { categoria: 'Iluminação', roi: 175 },
                    { categoria: 'Áudio', roi: 160 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="roi" name="ROI (%)" fill="#673ab7" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Analytics; 