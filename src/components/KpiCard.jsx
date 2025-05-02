import { Card, CardContent, Box, Typography } from '@mui/material';
import {
  PackageOpen,
  Users,
  Store,
  Boxes,
  DollarSign,
  CheckCircle,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const iconMap = {
  orders: <PackageOpen size={32} color='#7c2d12' />,
  users: <Users size={32} color='#7c2d12' />,
  stores: <Store size={32} color='#7c2d12' />,
  products: <Boxes size={32} color='#7c2d12' />,
  income: <DollarSign size={32} color='#7c2d12' />,
  activeStores: <CheckCircle size={32} color='#7c2d12' />,
  approvedUsers: <ShieldCheck size={32} color='#7c2d12' />,
  newUsers: <UserPlus size={32} color='#7c2d12' />,
};



const KpiCard = ({ label, value, percentageChange = 0, type = 'orders' }) => {
  const isPositive = percentageChange >= 0;

  return (
    <Card
      sx={{
        width: 280,
        height: 150,
        borderRadius: 4,
        boxShadow: 6,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <Box sx={{ width: 32, height: 32 }}>{iconMap[type]}</Box>
      </Box>

      <Box>
        <Typography variant='subtitle2' color='text.secondary' fontWeight={500}>
          {label}
        </Typography>
        <Typography variant='h5' fontWeight={700} color='text.primary' mt={1}>
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: isPositive ? 'success.main' : 'error.main',
          mt: 1,
        }}
      >
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <Typography variant='caption' ml={1}>
          {Math.abs(percentageChange)}% Compared to last month
        </Typography>
      </Box>
    </Card>
  );
};

export default KpiCard;
