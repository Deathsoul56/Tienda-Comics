import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = '#646cff',
  text
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56
  };

  const spinnerSize = sizeMap[size];

  const spinnerStyles = {
    display: 'inline-block',
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `3px solid transparent`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div style={spinnerStyles} />
      {text && (
        <p style={{ 
          color: '#ccc',
          margin: 0,
          fontSize: '0.9rem'
        }}>
          {text}
        </p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};