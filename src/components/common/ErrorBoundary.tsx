import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>
            ¡Oops! Algo salió mal
          </h2>
          <p style={{ marginBottom: '1rem', color: '#ccc' }}>
            Ha ocurrido un error inesperado. Por favor, recarga la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Recargar página
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#ff6b6b' }}>
                Detalles del error (desarrollo)
              </summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                padding: '1rem', 
                backgroundColor: '#2a2a2a', 
                borderRadius: '4px',
                fontSize: '0.8rem',
                overflow: 'auto'
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}