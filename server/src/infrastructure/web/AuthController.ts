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
            const { email, password } = req.body;
            const result = await this.authUseCase.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
