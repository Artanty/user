import { Request, Response } from 'express';
import { UserModel, IUser } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserController {
  private model = new UserModel();

  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await UserModel.create({
        username,
        email,
        password_hash: hashedPassword
      });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email)
      const user = await UserModel.getByEmail(email);
      console.log(user)
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getProfile(req: Request, res: Response) {
    console.log(req.userId)
    try {
      const user = await UserModel.getById((req as any).userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' })
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}