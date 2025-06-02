import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
  Eye, // Added Eye for views
  MousePointer, // Added MousePointer for clicks
  Repeat, // Added Repeat for conversions
  BarChart, // Added BarChart for totalAds (changed from generic)
  PieChart, // Added PieChart for distribution/summary (generic)
  CreditCard, // Used for one revenue type
  Wallet, // Used for another revenue type
  Banknote, // Used for the third revenue type
  LineChart, // Another option for totalAds or general analytics
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
  totalAds: <LineChart size={32} color='#7c2d12' />, // Updated icon for totalAds
  views: <Eye size={32} color='#7c2d12' />, // Icon for views
  clicks: <MousePointer size={32} color='#7c2d12' />, // Icon for clicks
  conversions: <Repeat size={32} color='#7c2d12' />, // Icon for conversions
  conversionRevenue: <CreditCard size={32} color='#7c2d12' />, // Updated icon for conversion revenue
  clicksRevenue: <Wallet size={32} color='#7c2d12' />, // Updated icon for clicks revenue
  viewsRevenue: <Banknote size={32} color='#7c2d12' />, // Updated icon for views revenue
};

const KpiCard = ({ label, value, percentageChange = 0, type = 'orders' }) => {
  const isPositive = percentageChange >= 0;
  const { t } = useTranslation();
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
          {Number(value) % 1 === 0
            ? Number(value)
            : Number(value).toFixed(2)}{' '}
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
          {Math.abs(Number(percentageChange)).toFixed(2)}% {t('analytics.comparedToLastMonth')}
        </Typography>
      </Box>
    </Card>
  );
};

export default KpiCard;
