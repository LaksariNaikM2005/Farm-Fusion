import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon,
  title = 'No records found',
  description = 'There is currently no data to display for this section.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div className={`empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to fetch the latest agricultural data. Please check your network or try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`error-state ${className}`}>
      <div className="error-state-icon">⚠️</div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-desc">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading data...', size = 'md', className = '' }) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  }[size] || 'spinner-md';

  return (
    <div className={`loading-spinner-wrap ${className}`}>
      <div className={`spinner-circle ${sizeClass}`} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export function SkeletonLoader({ rows = 3, height = '20px', className = '' }) {
  return (
    <div className={`skeleton-wrap ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ height, width: i === rows - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
}
