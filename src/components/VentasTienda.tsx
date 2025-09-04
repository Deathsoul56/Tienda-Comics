import React, { useEffect, useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, LabelList } from "recharts";
import type { Comic } from "../domain/entities";

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

  // Estado para la lista de cómics (para mapear ID a nombre)
  const [comics, setComics] = useState<Comic[]>([]);

  // Filtros de año y mes (checkboxes)
  const [filtroAnios, setFiltroAnios] = useState<string[]>([]);
  const [filtroMeses, setFiltroMeses] = useState<string[]>([]);
  
  // Estado para mostrar/ocultar el panel de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

    // Cargar lista de cómics para el mapeo de nombres
    fetch(`${apiUrl}/comics`)
      .then(res => res.json())
      .then(data => setComics(data));
  }, []);

  // Formatear el mes para mostrarlo como "2024-03"
  const formattedMensuales = mensuales.map((item) => ({
    ...item,
    label: `${item.Year}-${item.Month.toString().padStart(2, "0")}`,
  }));

  // --- NUEVO: Top cómics vendidos y top usuarios ---
  // Filtrar ventas según años y meses seleccionados
  const ventasFiltradas = useMemo(() => {
    if (filtroAnios.length === 0 && filtroMeses.length === 0) return ventas;
    return ventas.filter(v => {
      const fecha = new Date(v.order_date);
      const anio = fecha.getFullYear().toString();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      if (filtroAnios.length > 0 && !filtroAnios.includes(anio)) return false;
      if (filtroMeses.length > 0 && !filtroMeses.includes(mes)) return false;
      return true;
    });
  }, [ventas, filtroAnios, filtroMeses]);

  // Procesar los items para obtener el top de cómics vendidos y top usuarios SOLO de las ventas filtradas
  const comicSales: Record<string, number> = {};
  const userSales: Record<string, number> = {};
  ventasFiltradas.forEach(v => {
    // Contar ventas por usuario
    userSales[v.user_name] = (userSales[v.user_name] || 0) + 1;
    // Contar ventas por cómic
    try {
      const items = JSON.parse(v.items);
      items.forEach((item: { comic_id: number; quantity: number }) => {
        comicSales[item.comic_id] = (comicSales[item.comic_id] || 0) + item.quantity;
      });
    } catch {}
  });
  // Top 10 cómics vendidos (con nombre)
  const topComics = Object.entries(comicSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([comic_id, cantidad]) => {
      const comic = comics.find(c => String(c.comic_id) === String(comic_id));
      return { nombre: comic ? comic.title : comic_id, cantidad };
    });
  // Top 10 usuarios por cantidad de compras
  const topUsers = Object.entries(userSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([user_name, cantidad]) => ({ user_name, cantidad }));

  // --- NUEVO: Gráfico de cantidad de ventas mensuales ---
  const monthlyOrderCounts = formattedMensuales.map(item => ({
    label: item.label,
    TotalOrders: item.TotalOrders,
  }));

  // Obtener años y meses únicos de los datos mensuales
  const aniosDisponibles = useMemo(() => {
    const set = new Set(mensuales.map(m => m.Year));
    return Array.from(set).sort();
  }, [mensuales]);
  const mesesDisponibles = useMemo(() => {
    if (filtroAnios.length === 0) return [];
    const set = new Set(mensuales.filter(m => filtroAnios.includes(String(m.Year))).map(m => m.Month));
    return Array.from(set).sort((a, b) => a - b);
  }, [mensuales, filtroAnios]);

  // Nombres de los meses
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Handlers para checkboxes
  const handleCheckAnio = (anio: string) => {
    setFiltroAnios(prev => prev.includes(anio) ? prev.filter(a => a !== anio) : [...prev, anio]);
    setFiltroMeses([]); // Limpiar meses al cambiar años
  };
  const handleCheckMes = (mes: string) => {
    setFiltroMeses(prev => prev.includes(mes) ? prev.filter(m => m !== mes) : [...prev, mes]);
  };

  // Filtrar datos según años y meses seleccionados
  const mensualesFiltrados = useMemo(() => {
    return formattedMensuales.filter(m => {
      const [anio, mes] = m.label.split("-");
      if (filtroAnios.length > 0 && !filtroAnios.includes(anio)) return false;
      if (filtroMeses.length > 0 && !filtroMeses.includes(mes)) return false;
      return true;
    });
  }, [formattedMensuales, filtroAnios, filtroMeses]);
  const monthlyOrderCountsFiltrados = useMemo(() => {
    return monthlyOrderCounts.filter(m => {
      const [anio, mes] = m.label.split("-");
      if (filtroAnios.length > 0 && !filtroAnios.includes(anio)) return false;
      if (filtroMeses.length > 0 && !filtroMeses.includes(mes)) return false;
      return true;
    });
  }, [monthlyOrderCounts, filtroAnios, filtroMeses]);

  if (loading || loadingMensuales) return <div>Cargando ventas...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (errorMensuales) return <div style={{ color: 'red' }}>{errorMensuales}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '2rem auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '2rem', fontSize: '2.5em', textAlign: 'center', letterSpacing: '0.05em', fontWeight: 'bold' }}>Dashboard de Ventas</h2>
      {/* Dashboard de ventas mensuales */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        {/* Cuadro flotante de filtros FIJO que sigue el scroll */}
        <div style={{ 
          position: 'fixed', 
          left: mostrarFiltros ? '1rem' : '-240px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: 220, 
          background: 'rgba(35, 35, 74, 0.95)', 
          borderRadius: 12, 
          boxShadow: '0 6px 32px rgba(0,0,0,0.4)', 
          padding: '1.5rem 1rem', 
          zIndex: 1000, 
          color: '#fff', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 108, 255, 0.3)',
          maxHeight: '70vh',
          overflowY: 'auto',
          transition: 'left 0.3s ease-in-out'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.8rem',
            borderBottom: '1px solid rgba(100, 108, 255, 0.3)',
            paddingBottom: '0.4rem'
          }}>
            <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🎛️ Filtros</span>
            <button
              onClick={() => setMostrarFiltros(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(100, 108, 255, 0.5)',
                color: '#646cff',
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              −
            </button>
          </div>
          
          <div style={{ marginBottom: '0.8em' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, gap: 6 }}>
              <span style={{ fontSize: '0.9em' }}>Año:</span>
              <button type="button" onClick={() => { setFiltroAnios([]); setFiltroMeses([]); }} style={{ marginLeft: 'auto', background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '1px 8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75em' }}>🧹 Limpiar</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {aniosDisponibles.map(anio => (
                <label key={anio} style={{ display: 'flex', alignItems: 'center', marginBottom: 2, cursor: 'pointer', fontWeight: 'normal', paddingLeft: 4 }}>
                  <input
                    type="checkbox"
                    checked={filtroAnios.includes(String(anio))}
                    onChange={() => handleCheckAnio(String(anio))}
                    style={{ marginRight: 8 }}
                  />
                  {anio}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, gap: 6 }}>
              <span style={{ fontSize: '0.9em' }}>Mes:</span>
              <button type="button" onClick={() => setFiltroMeses([])} disabled={filtroAnios.length === 0} style={{ marginLeft: 'auto', background: '#444', color: '#fff', border: 'none', borderRadius: 4, padding: '1px 8px', fontWeight: 'bold', cursor: filtroAnios.length === 0 ? 'not-allowed' : 'pointer', fontSize: '0.75em', opacity: filtroAnios.length === 0 ? 0.5 : 1 }}>🧹 Limpiar</button>
            </div>
            {mesesDisponibles.length === 0 && <div style={{ color: '#aaa', fontSize: '0.95em' }}>Selecciona al menos un año</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {mesesDisponibles.map(mes => (
                <label key={mes} style={{ display: 'flex', alignItems: 'center', marginBottom: 2, cursor: filtroAnios.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'normal', opacity: filtroAnios.length === 0 ? 0.5 : 1, paddingLeft: 4 }}>
                  <input
                    type="checkbox"
                    checked={filtroMeses.includes(mes.toString().padStart(2, '0'))}
                    onChange={() => handleCheckMes(mes.toString().padStart(2, '0'))}
                    disabled={filtroAnios.length === 0}
                    style={{ marginRight: 8 }}
                  />
                  {nombresMeses[Number(mes) - 1]}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Botón tab que queda visible cuando el panel está oculto */}
        {!mostrarFiltros && (
          <div 
            onClick={() => setMostrarFiltros(true)}
            style={{
              position: 'fixed',
              left: '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '80px',
              background: 'rgba(35, 35, 74, 0.9)',
              borderRadius: '0 12px 12px 0',
              border: '1px solid rgba(100, 108, 255, 0.3)',
              borderLeft: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
              boxShadow: '2px 0 12px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(35, 35, 74, 0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(0px)';
            }}
          >
            <div style={{
              color: '#646cff',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transform: 'rotate(-90deg)',
              userSelect: 'none'
            }}>
              🎛️ Filtros
            </div>
          </div>
        )}
        <div style={{ background: '#222', borderRadius: '32px', padding: '3.5rem', marginBottom: '3rem', boxShadow: '0 8px 48px #0007', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '2.5rem', fontSize: '2.3em', textAlign: 'center', letterSpacing: '0.03em', fontWeight: 'bold' }}>Ventas Mensuales</h3>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: 500, maxWidth: 600 }}>
              <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '1.3em' }}>Monto por Ventas ($)</h4>
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={mensualesFiltrados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="TotalSales" stroke="#8884d8" name="Ventas ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 500, maxWidth: 600 }}>
              <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '1.3em' }}>Cantidad de Ventas (#)</h4>
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={monthlyOrderCountsFiltrados}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="TotalOrders" stroke="#ff69b4" name="Cantidad de Ventas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* NUEVO: Top cómics vendidos y top usuarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3rem', justifyContent: 'center', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ background: '#222', borderRadius: '32px', padding: '3rem', boxShadow: '0 8px 48px #0007', marginBottom: '2rem' }}>
          <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '1.3em' }}>Top 10 Cómics Vendidos</h4>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topComics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={220} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#ff69b4" name="Cantidad Vendida">
                <LabelList dataKey="cantidad" position="right" style={{ fill: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#222', borderRadius: '32px', padding: '3rem', boxShadow: '0 8px 48px #0007' }}>
          <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '1.3em' }}>Top 10 Usuarios por Compras</h4>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topUsers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="user_name" type="category" width={220} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#00e676" name="Compras">
                <LabelList dataKey="cantidad" position="right" style={{ fill: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
};

type ventas_mensuales = {
  Year: number;
  Month: number;
  TotalSales: number;
  TotalOrders: number;
};

export default VentasTienda;