import { PrismaClient } from '@prisma/client';
import express, { NextFunction } from 'express'
import { Router, Request, Response } from 'express';

import { config } from 'dotenv';
import { login, register } from './routes/auth/auth';
import { verifyLogin } from './middlewares/auth';
import { getAccountInfo, updateAccount } from './routes/account/account';
import { createCategory, getCategory, getCategorySelect } from './routes/category/category';
import { createProduct } from './routes/products/products';

config();

const cors = require('cors');

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const prisma = new PrismaClient();

const app = express();

const route = Router();

// Configuração do CORS
const corsOptions = {
  origin: process.env.ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(express.json());

app.use(cors(corsOptions));

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' })
});

// Auth
route.get('/login',(req: Request, res: Response) => login(req, res));
route.post('/register',(req: Request, res: Response) => register(req, res));

// Account
route.get('/account', verifyLogin, (req: Request, res: Response) => getAccountInfo(req, res));
route.put('/account', verifyLogin, (req: Request, res: Response) => updateAccount(req, res));

// Categorys
route.get('/category',verifyLogin, (req: Request, res: Response) => getCategory(req, res));
route.post('/category',verifyLogin, (req: Request, res: Response) => createCategory(req, res));
route.get('/category/select',verifyLogin, (req: Request, res: Response) => getCategorySelect(req, res));

// Products
route.post('/product',verifyLogin, (req: Request, res: Response) => createProduct(req, res));

app.use(route)

app.listen(8000, () => 'server running on port 8000')