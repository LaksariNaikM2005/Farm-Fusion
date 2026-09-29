import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  highlight = false,
  glass = false,
  padding = 'normal', // 'none' | 'sm' | 'normal' | 'lg'
  onClick,
  ...props
}) {
  const paddingClass = {
    none: 'p-0',
    sm: 'card-p-sm',
    normal: '',
    lg: 'card-p-lg',
  }[padding] || '';

  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${highlight ? 'card-highlight' : ''} ${glass ? 'glass-card' : ''} ${paddingClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action, title, subtitle, icon }) {
  return (
    <div className={`card-header ${className}`}>
      <div className="card-header-main">
        {icon && <span className="card-header-icon">{icon}</span>}
        <div>
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="card-header-action">{action}</div>}
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

export default Card;
