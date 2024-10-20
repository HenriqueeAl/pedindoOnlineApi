import { Request, Response } from "express";
import { AccountInterface, LoginAccountInterface, RegisterAccountInterface } from "../../interfaces/interfaces";
import { prisma } from "../../server";
import { ParsedQs } from 'qs';

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password: string) {
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error('Erro ao gerar o hash da senha', err);
  }
}

async function comparePasswords(password: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (err) {
      console.error('Erro ao comparar senhas', err);
    }
}

function generateToken(user: AccountInterface) {
    const payload = {
      id: user.id,
      username: user.name,
    };
  
    const token = jwt.sign(payload, process.env.JWTTOKEN, { expiresIn: '24h' });
  
    return token;
  }


export const login = async(req: Request, res: Response) => {
    const { user, password } = req.query as ParsedQs;

    const account = await prisma.accounts.findFirst({
        where: {
            email: user as string
        }
    })

    if(account) {
        const validPassword = await comparePasswords(password as string, account.password);

        if(validPassword) res.status(200).send({status: true, message: 'Logado com sucesso!', jwt: generateToken(account)});

        res.status(400).send({message: 'Credenciais incorretas.'});
    } else {
        res.status(400).send({message: 'Credenciais incorretas.'});
    }

}

export const register = async (req: Request, res: Response) => {
    const body: RegisterAccountInterface = req.body;

    const passwordHash: string | undefined = await hashPassword(body.password);

    const hasEmail = await prisma.accounts.findFirst({where: {email: body.email}})

    const hasPhone = await prisma.accounts.findFirst({where: {phone: Number(body.phone)}})

    if (hasEmail) {
        res.status(400).send({message: 'Email já cadastradado.'});
        return;
    }

    if (hasPhone) {
        res.status(400).send({message: 'Telefone já cadastradado.'});
        return;
    }

    if (passwordHash) {
        const newAccount = await prisma.accounts.create({
            data: {
                name: body.name,
                email: body.email,
                phone: Number(body.phone),
                password: passwordHash,
                establishment_name: body.name
            }
        })

        res.status(201).send({status: true, message: 'Conta criada com sucesso!', jwt: generateToken(newAccount)});
    }

}