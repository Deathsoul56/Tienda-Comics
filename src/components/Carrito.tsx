
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
    <div className="carrito-container" style={{width: '100%', maxWidth: '1400px', margin: '3rem auto 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h1 className="carrito-title">CARRO DE COMPRAS</h1>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#bbb', fontSize: '1.2em' }}>El carrito está vacío.</div>
      ) : (
        <div className="carrito-table-wrapper">
          <table className="carrito-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>PRECIO</th>
                <th>CANT.</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="carrito-producto">
                    <button className="carrito-remove-btn" onClick={() => onRemove && onRemove(item.id)} title="Eliminar">✖</button>
                    <img className="carrito-img" src={item.image} alt={item.title} />
                    <span className="carrito-title-producto">{item.title}</span>
                  </td>
                  <td className="carrito-precio">${item.price.toFixed(2)}</td>
                  <td className="carrito-cantidad">
                    <div className="carrito-cantidad-control">
                      <button className="carrito-cantidad-btn" onClick={() => onChangeQuantity && onChangeQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                      <span className="carrito-cantidad-num">{item.quantity}</span>
                      <button className="carrito-cantidad-btn" onClick={() => onChangeQuantity && onChangeQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td className="carrito-total">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 0 && (
            <div className="carrito-total-final">
              Total: ${total.toFixed(2)}
            </div>
          )}
          {items.length > 0 && (
            <button onClick={onCheckout} className="carrito-btn-checkout">Finalizar compra</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Carrito;
