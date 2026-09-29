import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'primary' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  dot = false,
  className = '',
}) {
  const variantMap = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    gold: 'badge-gold',
    primary: 'badge-primary',
    outline: 'badge-outline',
  };

  const sizeMap = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg',
  };

  return (
    <span className={`badge ${variantMap[variant] || 'badge-default'} ${sizeMap[size] || ''} ${className}`}>
      {dot && <span className="badge-dot" />}
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
