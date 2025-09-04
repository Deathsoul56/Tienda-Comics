import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  className = '',
  style = {},
  disabled,
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '6px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    ...style
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#646cff',
      color: '#fff',
      ':hover': {
        backgroundColor: '#535bf2'
      }
    },
    secondary: {
      backgroundColor: '#222',
      color: '#fff',
      border: '1px solid #646cff'
    },
    danger: {
      backgroundColor: '#ff6b6b',
      color: '#fff'
    }
  };

  const sizeStyles = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const finalStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size]
  };

  return (
    <button
      className={`btn-modern ${className}`}
      style={finalStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span style={{ 
          animation: 'spin 1s linear infinite',
          display: 'inline-block'
        }}>
          ⟳
        </span>
      )}
      {children}
    </button>
  );
};