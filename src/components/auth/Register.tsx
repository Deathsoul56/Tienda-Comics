import { useState } from 'react';
import { Button } from '../common';
import { navigationService } from '../../application/services/NavigationService';
import { authService } from '../../infrastructure/api/AuthService';
import '../../App.css';

interface RegisterProps {
    onLogin: (user: any, token: string) => void;
}

export default function Register({ onLogin }: RegisterProps) {
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validatePassword = (password: string) => {
        if (password.length < 8) return "La contraseña debe tener más de 8 caracteres.";
        if (!/\d/.test(password)) return "La contraseña debe contener al menos un número.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "La contraseña debe contener al menos un carácter especial.";
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (formData.email !== formData.confirmEmail) {
            setError('Los correos electrónicos no coinciden.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                user_name: formData.user_name,
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name
            });

            // Auto login after registration
            onLogin(response.user, response.token);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '8px', color: 'white' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Crear Cuenta</h2>
            {error && <div style={{ backgroundColor: '#ff6b6b', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Apellido</label>
                        <input name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre de Usuario</label>
                    <input name="user_name" value={formData.user_name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Correo Electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Correo</label>
                    <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.2rem' }}>Min. 8 caracteres, 1 número, 1 símbolo especial</div>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Contraseña</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#333', color: 'white' }} />
                </div>

                <Button disabled={loading} style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#aaa' }}>¿Ya tienes cuenta? </span>
                <button
                    onClick={() => navigationService.navigateTo('login')}
                    style={{ background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Inicia sesión aquí
                </button>
            </div>
        </div>
    );
}
