import React from 'react';
import { Badge } from './Badge';

export function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  badgeVariant = 'primary',
  breadcrumbs, // [{ label: 'Farmer', to: '/farmer' }, { label: 'Crop ML' }]
  actions,
  className = '',
}) {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header-content">
        {breadcrumbs && (
          <nav className="page-breadcrumbs">
            {breadcrumbs.map((bc, idx) => (
              <span key={idx} className="breadcrumb-item">
                {bc.to ? <a href={bc.to}>{bc.label}</a> : <span>{bc.label}</span>}
                {idx < breadcrumbs.length - 1 && <span className="breadcrumb-sep">/</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="page-header-title-row">
          {icon && <div className="page-header-icon">{icon}</div>}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">{title}</h1>
              {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
            </div>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

export default PageHeader;
