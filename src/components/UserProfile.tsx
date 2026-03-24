import React, { useEffect, useState } from "react";
interface User {
  user_id: number;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface OrderItem {
  comic_id: number;
  title?: string;
  image?: string;
  price: number;
  quantity: number;
}

interface Order {
  order_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  items?: OrderItem[] | string;
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser?: (userData: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onUpdateUser }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user.user_name || "");
  const [updateError, setUpdateError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/ventas/user/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error cargando historial", err))
      .finally(() => setLoading(false));
  }, [user.user_id]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Group by month to show a chart
  const monthlyData = orders.reduce((acc: Record<string, { month: string; total: number }>, order) => {
    const d = new Date(order.order_date);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!acc[m]) acc[m] = { month: m, total: 0 };
    acc[m].total += order.total_amount;
    return acc;
  }, {});
  const chartData = Object.values(monthlyData).sort((a: { month: string }, b: { month: string }) => a.month.localeCompare(b.month));

  const [activeTab, setActiveTab] = useState<'datos' | 'compras'>('datos');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      setUpdateError("El nombre de usuario no puede estar vacío");
      return;
    }
    
    setIsUpdating(true);
    setUpdateError("");
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-username`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          new_username: newUsername.trim()
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el nombre de usuario");
      }
      
      if (onUpdateUser) {
        onUpdateUser({ ...user, user_name: newUsername.trim() });
      }
      setIsEditingUsername(false);
    } catch (err) {
      if (err instanceof Error) {
        setUpdateError(err.message);
      } else {
        setUpdateError(String(err));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "3rem auto", padding: "2rem", background: "#1a1a1a", borderRadius: 16, border: "1px solid #333", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "2px solid #646cff", paddingBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>Perfil de Usuario</h1>
        <button onClick={onLogout} style={{ padding: "0.5rem 1rem", borderRadius: 8, background: "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          🚪 Cerrar Sesión
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #444' }}>
        <button 
          onClick={() => setActiveTab('datos')}
          style={{ background: 'transparent', border: 'none', color: activeTab === 'datos' ? '#646cff' : '#aaa', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'datos' ? '2px solid #646cff' : 'none', padding: '0.5rem 1rem' }}
        >
          Datos y Estadísticas
        </button>
        <button 
          onClick={() => setActiveTab('compras')}
          style={{ background: 'transparent', border: 'none', color: activeTab === 'compras' ? '#646cff' : '#aaa', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', borderBottom: activeTab === 'compras' ? '2px solid #646cff' : 'none', padding: '0.5rem 1rem' }}
        >
          Historial de Compras
        </button>
      </div>

      {activeTab === 'datos' && (
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ flex: 1, minWidth: 280, background: "#222", padding: "1.5rem", borderRadius: 12, border: "1px solid #444" }}>
            <h3 style={{ marginTop: 0, color: "#646cff" }}>Datos Personales</h3>
            <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <strong>Usuario:</strong> 
              {isEditingUsername ? (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <input 
                    type="text" 
                    value={newUsername} 
                    onChange={e => setNewUsername(e.target.value)} 
                    style={{ padding: "0.4rem", borderRadius: 6, border: "1px solid #555", background: "#333", color: "#fff" }}
                  />
                  <button 
                    onClick={handleUpdateUsername} 
                    disabled={isUpdating}
                    style={{ padding: "0.4rem 0.8rem", borderRadius: 6, background: "#00e676", color: "#000", border: "none", cursor: isUpdating ? "not-allowed" : "pointer", fontWeight: "bold" }}
                  >
                    Guardar
                  </button>
                  <button 
                    onClick={() => { setIsEditingUsername(false); setNewUsername(user.user_name); setUpdateError(""); }}
                    style={{ padding: "0.4rem 0.8rem", borderRadius: 6, background: "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span>{user.user_name}</span>
                  <button 
                    onClick={() => setIsEditingUsername(true)}
                    style={{ padding: "0.3rem 0.6rem", borderRadius: 4, background: "#444", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    ✏️ Editar
                  </button>
                </div>
              )}
            </div>
            {updateError && <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginTop: "0.5rem" }}>{updateError}</p>}
          </div>
          <div style={{ flex: 1, minWidth: 280, background: "#222", padding: "1.5rem", borderRadius: 12, border: "1px solid #444", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h3 style={{ marginTop: 0, color: "#646cff" }}>Estadísticas de Compra</h3>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#00e676" }}>
              ${totalSpent.toFixed(2)}
            </div>
            <p style={{ color: "#aaa" }}>Total gastado en tienda</p>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff", marginTop: "1rem" }}>
              {orders.length} pedidos realizados
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compras' && (
        <div>
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Historial de Compras</h2>
          
          {loading ? (
            <p>Cargando historial...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: "#aaa" }}>Aún no has realizado ninguna compra.</p>
          ) : (
            <>
              {chartData.length > 1 && (
                <div style={{ height: 300, background: "#222", padding: "1rem", borderRadius: 12, marginBottom: "2rem" }}>
                  <h3 style={{ marginTop: 0, textAlign: "center", color: "#646cff" }}>Gastos Mensuales</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="month" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip wrapperStyle={{ background: "#333", border: "none" }} />
                      <Line type="monotone" dataKey="total" stroke="#00e676" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orders.map((order: Order) => (
                  <div key={order.order_id} style={{ background: "#222", borderRadius: 12, border: "1px solid #444", overflow: "hidden" }}>
                    <div 
                      onClick={() => setExpandedOrderId(expandedOrderId === order.order_id ? null : order.order_id)}
                      style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#2a2a2a"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Pedido #{order.order_id} {expandedOrderId === order.order_id ? '▼' : '▶'}</div>
                        <div style={{ color: "#aaa", fontSize: "0.9rem" }}>{new Date(order.order_date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#00e676", fontWeight: "bold", fontSize: "1.2rem" }}>${order.total_amount?.toFixed(2)}</div>
                        <div style={{ color: "#646cff", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold" }}>{order.status}</div>
                      </div>
                    </div>
                    
                    {expandedOrderId === order.order_id && order.items && (
                      <div style={{ padding: "1.5rem", borderTop: "1px solid #444", background: "#1a1a1a" }}>
                        <h4 style={{ margin: "0 0 1rem 0", color: "#fff" }}>Detalles de Compra:</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item: OrderItem, idx: number) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: idx === (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).length - 1 ? "none" : "1px solid #333", paddingBottom: "0.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                {item.image && (
                                  <img 
                                    src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') ? item.image : '/' + item.image)} 
                                    alt={item.title || 'Comic'} 
                                    style={{ width: 45, height: 65, objectFit: "cover", borderRadius: 4 }} 
                                  />
                                )}
                                <div>
                                  <div style={{ fontWeight: "bold", color: "#ddd" }}>{item.title || `Comic # ${item.comic_id}`}</div>
                                  <div style={{ fontSize: "0.85rem", color: "#bbb" }}>Cantidad: <span style={{ color: "#fff" }}>{item.quantity || 1}</span></div>
                                </div>
                              </div>
                              <div style={{ color: "#00e676", fontWeight: "bold" }}>
                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
