import { Request, Response } from 'express';
import { AuthUseCase } from '../../application/usecases/AuthUseCase';

export class AuthController {
    constructor(private authUseCase: AuthUseCase) { }

    async register(req: Request, res: Response) {
        try {
            const { user_name, email, password, first_name, last_name } = req.body;
            const result = await this.authUseCase.register({
                user_name,
                email,
                password_hash: password,
                first_name,
                last_name
            });
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            console.log("LOGIN REQUEST BODY:", req.body);
            const { email, password } = req.body;
            console.log(`Email provided: [${email}]`);
            const result = await this.authUseCase.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async changeUsername(req: Request, res: Response) {
        try {
            const { email, new_username } = req.body;
            if (!email || !new_username) {
                res.status(400).json({ error: 'Email and new_username are required' });
                return;
            }
            const result = await this.authUseCase.changeUsername(email, new_username);
            res.json({ message: 'Username updated successfully', user: result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // --- ENDPOINT SOLO PARA TESTING ---
    // No usar en la página de producción.
    async deleteTestUser(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }
            await this.authUseCase.deleteTestUser(email);
            res.json({ message: 'User deleted successfully (Test only)' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
