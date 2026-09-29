import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend, // { value: '+12%', isPositive: true, label: 'vs last month' }
  variant = 'default', // 'default' | 'primary' | 'gold' | 'success' | 'warning'
  onClick,
  className = '',
}) {
  return (
    <Card
      className={`stat-card stat-card-${variant} ${onClick ? 'cursor-pointer hover:border-primary transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <div className="stat-card-icon-wrap">{icon}</div>}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-footer">
        {trend && (
          <Badge
            variant={trend.isPositive ? 'success' : 'danger'}
            size="sm"
            className="mr-2"
          >
            {trend.value}
          </Badge>
        )}
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>
    </Card>
  );
}

export default StatCard;
