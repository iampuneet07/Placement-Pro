import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{description}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
