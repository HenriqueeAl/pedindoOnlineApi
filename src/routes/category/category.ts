import { Request, Response } from "express";
import { prisma } from "../../server";

interface CreateCategoryInterface {
    name: string;
}

export const getCategory = async (req: Request, res: Response) => {
    try {
        const accoutnWithCategorys = await prisma.accounts.findUnique({
            where: {
                id: req.user.id
            },
            include: {
                category: true
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

        const formattedAccount = formatAccount(accoutnWithCategorys);

        res.status(200).send({ message: 'Categoria listada com sucesso.', account: formattedAccount});
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Erro ao atulizar informações da conta.' });
    }
}

export const createCategory = async (req: Request, res: Response) => {
    const body: CreateCategoryInterface = req.body

    try {
        const category = await prisma.category.create({
            data: {
                name: body.name,
                account: req.user.id
            } 
        })

        res.status(200).send({ message: 'Categoria criada com sucesso.', category: category});
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Erro ao atulizar informações da conta.' });
    }
}