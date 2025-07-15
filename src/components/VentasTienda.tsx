import React, { useEffect, useState } from "react";

interface Venta {
  order_id: number;
  user_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: string;
}

const VentasTienda: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/ventas`)
      .then(res => res.json())
      .then(data => {
        setVentas(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar las ventas");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando ventas...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '2rem', fontSize: '2.5em', textAlign: 'center', letterSpacing: '0.05em', fontWeight: 'bold' }}>Ventas de la tienda</h2>
      <table style={{ width: '100%', background: '#222', color: '#fff', borderRadius: '18px', boxShadow: '0 4px 24px #0005', borderCollapse: 'collapse', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'linear-gradient(90deg, #646cff 0%, #6c63ff 100%)', color: '#fff' }}>
            <th style={{ padding: '1em', borderRadius: '18px 0 0 0', fontSize: '1.1em', textAlign: 'center', letterSpacing: '0.03em' }}>ID</th>
            <th style={{ padding: '1em', fontSize: '1.1em', textAlign: 'center' }}>Usuario</th>
            <th style={{ padding: '1em', fontSize: '1.1em', textAlign: 'center' }}>Fecha</th>
            <th style={{ padding: '1em', fontSize: '1.1em', textAlign: 'center' }}>Total</th>
            <th style={{ padding: '1em', fontSize: '1.1em', textAlign: 'center' }}>Estado</th>
            <th style={{ padding: '1em', borderRadius: '0 18px 0 0', fontSize: '1.1em', textAlign: 'center' }}>Items</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.order_id} style={{ borderBottom: '1px solid #333', background: '#222' }}>
              <td style={{ padding: '1em', textAlign: 'center', fontWeight: 'bold', color: '#bbb' }}>{v.order_id}</td>
              <td style={{ padding: '1em', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{v.user_name}</td>
              <td style={{ padding: '1em', textAlign: 'center', color: '#bbb' }}>{new Date(v.order_date).toLocaleString()}</td>
              <td style={{ padding: '1em', textAlign: 'center', fontWeight: 'bold', color: '#646cff', fontSize: '1.1em' }}>${v.total_amount.toFixed(2)}</td>
              <td style={{ padding: '1em', textAlign: 'center', color: v.status === 'Completado' ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>{v.status}</td>
              <td style={{ padding: '1em', textAlign: 'center', color: '#bbb' }}>{v.items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasTienda;
