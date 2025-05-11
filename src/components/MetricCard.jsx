import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { Info } from 'lucide-react';


const MetricCard = ({ title, value, subtitle, icon, color, tooltipText, trend, trendValue }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        width: '275px',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {title}
            {tooltipText && (
              <Tooltip title={tooltipText} arrow>
                <Box component="span" sx={{ display: 'inline-flex', cursor: 'help' }}>
                  <Info size={16} />
                </Box>
              </Tooltip>
            )}
          </Typography>
          {icon && (
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: '50%', 
                bgcolor: `${color}.light`, 
                color: `${color}.main`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {value}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        
        {trend && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mt: 1,
            color: trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary'
          }}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;