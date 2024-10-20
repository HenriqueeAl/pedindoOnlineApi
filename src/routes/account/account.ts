import { Request, Response } from "express";
import { prisma } from "../../server";

interface updateAccountInterface {
    establishmentName: string;
}

export const getAccountInfo = async(req: Request, res: Response) => {
    try {
        const account = await prisma.accounts.findUnique({
            where: {
                id: req.user.id
            }
        });

        const formatAccount = (acc: any) => {
            if (!acc) return null;
            return Object.fromEntries(
                Object.entries(acc).map(([key, value]) => 
                    typeof value === 'bigint' ? [key, value.toString()] : [key, value]
                )
            );
        };

        const formattedAccount = formatAccount(account);

        res.status(200).send({ message: 'Conta.', account: formattedAccount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao buscar informações da conta.' });
    }
}

export const updateAccount = async (req: Request, res: Response) => {
    const body: updateAccountInterface = req.body

    try {
        const account = await prisma.accounts.update({
            where: {
                id: req.user.id
            },
            data: {
                establishment_name: body.establishmentName
            }
        })
        
        const formatAccount = (acc: any) => {
            if (!acc) return null;
            return Object.fromEntries(
                Object.entries(acc).map(([key, value]) => 
                    typeof value === 'bigint' ? [key, value.toString()] : [key, value]
                )
            );
        };

        const formattedAccount = formatAccount(account);

        res.status(200).send({ message: 'Conta.', account: formattedAccount });
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Erro ao atulizar informações da conta.' });
    }
}