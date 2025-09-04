import React from "react";
import type { CartItem } from '../domain/entities';
import { Button } from './common';

interface CarritoProps {
  items: CartItem[];
  onRemove?: (id: number) => void;
  onCheckout?: () => Promise<void>;
  onChangeQuantity?: (id: number, newQuantity: number) => void;
}

const Carrito: React.FC<CarritoProps> = ({ items, onRemove, onCheckout, onChangeQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '0 1rem',
    boxSizing: 'border-box'
  };

  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#fff',
    marginBottom: '2rem',
    fontWeight: 'bold'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#bbb',
    fontSize: '1.2rem',
    padding: '4rem 2rem',
    background: '#1a1a1a',
    borderRadius: '12px',
    border: '1px solid #333'
  };

  const tableContainerStyle: React.CSSProperties = {
    background: '#1a1a1a',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #333',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    overflowX: 'auto'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    minWidth: '1195px',
    borderCollapse: 'collapse' as const,
    marginBottom: '1rem'
  };

  const headerRowStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #646cff 0%, #6c63ff 100%)',
    color: '#fff'
  };

  const headerCellStyle: React.CSSProperties = {
    padding: '1rem',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    fontSize: '1rem'
  };

  const rowStyle: React.CSSProperties = {
    borderBottom: '1px solid #333',
    transition: 'background-color 0.2s ease'
  };

  const cellStyle: React.CSSProperties = {
    padding: '1rem',
    verticalAlign: 'middle' as const
  };

  const productCellStyle: React.CSSProperties = {
    ...cellStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '50%'
  };

  const removeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#ff6b6b',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'all 0.2s ease'
  };

  const imageStyle: React.CSSProperties = {
    width: '60px',
    height: '80px',
    objectFit: 'cover' as const,
    borderRadius: '6px',
    border: '1px solid #333'
  };

  const titleProductStyle: React.CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    flex: '1',
    minWidth: '300px',
    maxWidth: '500px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const priceStyle: React.CSSProperties = {
    ...cellStyle,
    color: '#646cff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    textAlign: 'center' as const,
    width: '15%'
  };

  const quantityControlStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#2a2a2a',
    borderRadius: '8px',
    padding: '0.5rem',
    border: '1px solid #646cff'
  };

  const quantityButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#646cff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    minWidth: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const quantityNumberStyle: React.CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center' as const
  };

  const totalStyle: React.CSSProperties = {
    ...cellStyle,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right' as const,
    fontSize: '1.1rem',
    width: '15%'
  };

  const summaryStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '2px solid #333'
  };

  const totalFinalStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#646cff'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Carrito de Compras</h1>
      
      {items.length === 0 ? (
        <div style={emptyStateStyle}>
          <p>Tu carrito está vacío</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.7 }}>
            ¡Agrega algunos cómics para comenzar tu colección!
          </p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
                <th style={{ ...headerCellStyle, borderRadius: '8px 0 0 0', width: '50%' }}>Producto</th>
                <th style={{ ...headerCellStyle, width: '15%', textAlign: 'center' }}>Precio</th>
                <th style={{ ...headerCellStyle, width: '20%', textAlign: 'center' }}>Cantidad</th>
                <th style={{ ...headerCellStyle, borderRadius: '0 8px 0 0', width: '15%', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr 
                  key={item.id} 
                  style={{
                    ...rowStyle,
                    background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';
                  }}
                >
                  <td style={productCellStyle}>
                    <button
                      style={removeButtonStyle}
                      onClick={() => onRemove && onRemove(item.id)}
                      title="Eliminar producto"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff6b6b';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#ff6b6b';
                      }}
                    >
                      ✕
                    </button>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={imageStyle}
                    />
                    <span style={titleProductStyle}>{item.title}</span>
                  </td>
                  
                  <td style={priceStyle}>
                    ${item.price.toFixed(2)}
                  </td>
                  
                  <td style={{ ...cellStyle, textAlign: 'center', width: '20%' }}>
                    <div style={quantityControlStyle}>
                      <button
                        style={quantityButtonStyle}
                        onClick={() => onChangeQuantity && onChangeQuantity(item.id, Math.max(1, item.quantity - 1))}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#646cff';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#646cff';
                        }}
                      >
                        −
                      </button>
                      <span style={quantityNumberStyle}>{item.quantity}</span>
                      <button
                        style={quantityButtonStyle}
                        onClick={() => onChangeQuantity && onChangeQuantity(item.id, item.quantity + 1)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#646cff';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#646cff';
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  
                  <td style={totalStyle}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={summaryStyle}>
            <div style={totalFinalStyle}>
              Total: ${total.toFixed(2)}
            </div>
            
            <Button
              variant="primary"
              size="large"
              onClick={async () => {
                if (onCheckout) {
                  try {
                    await onCheckout();
                  } catch (error) {
                    console.error('Error during checkout:', error);
                  }
                }
              }}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              💳 Finalizar Compra ({items.length} {items.length === 1 ? 'item' : 'items'})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;