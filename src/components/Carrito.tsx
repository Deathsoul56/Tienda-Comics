
import React from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

interface CarritoProps {
  items: CartItem[];
  onRemove?: (id: number) => void;
  onCheckout?: () => void;
  onChangeQuantity?: (id: number, newQuantity: number) => void;
}

const Carrito: React.FC<CarritoProps> = ({ items, onRemove, onCheckout, onChangeQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#181818', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5em', margin: '2rem 0 2rem 0', letterSpacing: '0.05em', color: '#fff', fontWeight: 'bold' }}>CARRO DE COMPRAS</h1>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#bbb', fontSize: '1.2em' }}>El carrito está vacío.</div>
      ) : (
        <div style={{ width: '100%', maxWidth: '1800px', margin: '0 auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #646cff 0%, #6c63ff 100%)', color: '#fff', fontWeight: 'bold', fontSize: '1.1em' }}>
                <th style={{ textAlign: 'left', padding: '0.7em 0.5em', borderRadius: '12px 0 0 0' }}>PRODUCTO</th>
                <th style={{ textAlign: 'right', padding: '0.7em 0.5em' }}>PRECIO</th>
                <th style={{ textAlign: 'center', padding: '0.7em 0.5em' }}>CANT.</th>
                <th style={{ textAlign: 'right', padding: '0.7em 0.5em', borderRadius: '0 12px 0 0' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #333', background: '#222' }}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '1.2em', padding: '1em 0.5em' }}>
                    <button onClick={() => onRemove && onRemove(item.id)} style={{ background: 'none', border: 'none', color: '#bbb', fontSize: '1.2em', cursor: 'pointer', marginRight: '0.5em' }} title="Eliminar">✖</button>
                    <img src={item.image} alt={item.title} style={{ width: 70, borderRadius: 8, boxShadow: '0 2px 8px #0003' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#fff' }}>{item.title}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#646cff', fontSize: '1.1em', padding: '1em 0.5em' }}>${item.price.toFixed(3)}</td>
                  <td style={{ textAlign: 'center', padding: '1em 0.5em' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #646cff', borderRadius: 24, padding: '0.2em 0.7em', background: '#181818' }}>
                      <button onClick={() => onChangeQuantity && onChangeQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ background: 'none', border: 'none', color: '#646cff', fontSize: '1.2em', cursor: 'pointer', marginRight: '0.5em' }}>-</button>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1em', minWidth: 24, textAlign: 'center', color: '#fff' }}>{item.quantity}</span>
                      <button onClick={() => onChangeQuantity && onChangeQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#646cff', fontSize: '1.2em', cursor: 'pointer', marginLeft: '0.5em' }}>+</button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#fff', fontSize: '1.1em', padding: '1em 0.5em' }}>${(item.price * item.quantity).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 0 && (
            <div style={{ textAlign: 'right', marginTop: '2em', fontSize: '1.3em', fontWeight: 'bold', color: '#646cff' }}>
              Total: ${total.toFixed(3)}
            </div>
          )}
          {items.length > 0 && (
            <button onClick={onCheckout} className="btn-modern" style={{ marginTop: '2em', float: 'right', fontSize: '1.1em', padding: '0.7em 2em', background: 'linear-gradient(90deg, #646cff 0%, #6c63ff 100%)', color: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px #0003' }}>Finalizar compra</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Carrito;
