import type { User } from '../../domain/entities';

const API_URL = 'http://localhost:4000/auth';

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Inicio de sesión fallido');
        }

        return response.json();
    },

    async register(userData: any): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registro fallido');
        }

        return response.json();
    }
};
