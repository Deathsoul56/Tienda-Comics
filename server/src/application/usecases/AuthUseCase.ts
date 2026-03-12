import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthUseCase {
    constructor(private userRepository: UserRepository) { }

    async register(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<{ user: User; token: string }> {
        const existingUserEmail = await this.userRepository.findByEmail(userData.email);
        if (existingUserEmail) {
            throw new Error('Email already registered');
        }

        const existingUserName = await this.userRepository.findByUsername(userData.user_name);
        if (existingUserName) {
            throw new Error('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(userData.password_hash, 10);
        const newUser = await this.userRepository.create({
            ...userData,
            password_hash: hashedPassword
        });

        const token = this.generateToken(newUser);
        return { user: newUser, token };
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email not found');
        }

        // Si la contraseña comienza con "hashed_", es desde el insert original sin hashear por la app
        // entonces la comparamos directamente en texto plano. En un sistema real habria que hacerles 
        // un rehash o pedir que reseteen su contraseña.
        let isPasswordValid = false;
        if (user.password_hash.startsWith('hashed_')) {
             isPasswordValid = password === user.password_hash; // Caso test insertado por SQL dummy
        } else {
             isPasswordValid = await bcrypt.compare(password, user.password_hash);
        }

        if (!isPasswordValid) {
            throw new Error('Incorrect password');
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    async changeUsername(email: string, newUsername: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const existingUserName = await this.userRepository.findByUsername(newUsername);
        if (existingUserName && existingUserName.user_id !== user.user_id) {
            throw new Error('Username already taken');
        }

        const updatedUser = await this.userRepository.update(user.user_id, { user_name: newUsername });
        if (!updatedUser) {
            throw new Error('Failed to update username');
        }
        return updatedUser;
    }

    private generateToken(user: User): string {
        return jwt.sign(
            { userId: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'default_secret_key',
            { expiresIn: '24h' }
        );
    }

    // --- ENDPOINT SOLO PARA TESTING ---
    // No usar en producción. Elimina un usuario por su email.
    async deleteTestUser(email: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return await this.userRepository.delete(user.user_id);
    }
}
