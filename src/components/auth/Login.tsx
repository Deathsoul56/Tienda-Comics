import { useState } from 'react';
import { Button } from '../common';
import { navigationService } from '../../application/services/NavigationService';
import { authService } from '../../infrastructure/api/AuthService';
import '../../App.css'; // Reuse app styles

interface LoginProps {
    onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            onLogin(response.user, response.token);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '8px', color: 'white' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Iniciar Sesión</h2>
            {error && <div style={{ backgroundColor: '#ff6b6b', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }}
                    />
                </div>
                <Button
                    disabled={loading}
                    style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                >
                    {loading ? 'Cargando...' : 'Ingresar'}
                </Button>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#aaa' }}>¿No tienes cuenta? </span>
                <button
                    onClick={() => navigationService.navigateTo('register')}
                    style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Regístrate aquí
                </button>
            </div>
        </div>
    );
}
