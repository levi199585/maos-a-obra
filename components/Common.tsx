
import React from 'react';

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', type = 'button', disabled }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<{
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}> = ({ label, type = "text", value, onChange, placeholder, className = "", multiline }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    {multiline ? (
      <textarea
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'info' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};
