import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = XCircle;
        if (toast.type === 'warning') Icon = AlertTriangle;

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type || 'info'}`}
            onClick={() => removeToast(toast.id)}
          >
            <Icon
              size={18}
              color={
                toast.type === 'success'
                  ? 'var(--success)'
                  : toast.type === 'error'
                  ? 'var(--danger)'
                  : 'var(--warning)'
              }
            />
            <div style={{ flex: 1 }}>{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
