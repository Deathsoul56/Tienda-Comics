import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

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

  // Estado para el dashboard de ventas mensuales
  const [mensuales, setMensuales] = useState<ventas_mensuales[]>([]);
  const [loadingMensuales, setLoadingMensuales] = useState(true);
  const [errorMensuales, setErrorMensuales] = useState<string | null>(null);

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

    // Cargar ventas mensuales
    fetch(`${apiUrl}/ventas-mensuales`)
      .then(res => res.json())
      .then(data => {
        setMensuales(data);
        setLoadingMensuales(false);
      })
      .catch(() => {
        setErrorMensuales("No se pudieron cargar las ventas mensuales");
        setLoadingMensuales(false);
      });
  }, []);

  // Formatear el mes para mostrarlo como "2024-03"
  const formattedMensuales = mensuales.map((item) => ({
    ...item,
    label: `${item.Year}-${item.Month.toString().padStart(2, "0")}`,
  }));

  if (loading || loadingMensuales) return <div>Cargando ventas...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (errorMensuales) return <div style={{ color: 'red' }}>{errorMensuales}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '2rem', fontSize: '2.5em', textAlign: 'center', letterSpacing: '0.05em', fontWeight: 'bold' }}>Ventas de la tienda</h2>
      {/* Dashboard de ventas mensuales */}
      <div style={{ background: '#222', borderRadius: '18px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 24px #0005' }}>
        <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '2em', textAlign: 'center', letterSpacing: '0.03em', fontWeight: 'bold' }}>Dashboard Ventas Mensuales</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={formattedMensuales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="TotalSales" stroke="#8884d8" name="Ventas ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Tabla de ventas individuales */}
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

type ventas_mensuales = {
  Year: number;
  Month: number;
  TotalSales: number;
  TotalOrders: number;
};

const ventas_tienda: React.FC = () => {
  const [data, setData] = useState<ventas_mensuales[]>([]);

  useEffect(() => {
    fetch("/api/ventas-mensuales")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // Opcional: Formatear el mes para mostrarlo como "2024-03"
  const formattedData = data.map((item) => ({
    ...item,
    label: `${item.Year}-${item.Month.toString().padStart(2, "0")}`,
  }));

  return (
    <div>
      <h2>Ventas Mensuales</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="TotalSales" stroke="#8884d8" name="Ventas ($)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VentasTienda;
export { ventas_tienda };