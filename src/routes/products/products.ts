import { Request, Response } from "express";
import { prisma } from "../../server";

interface CreateProductInterface {
    name: string;
    price: number;
    description: string;
    category: number;
}

// export const getCategory = async (req: Request, res: Response) => {
//     try {
//         const accoutnWithCategorys = await prisma.accounts.findUnique({
//             where: {
//                 id: req.user.id
//             },
//             include: {
//                 category: true
//             }
//         })

//         const formatAccount = (acc: any) => {
//             if (!acc) return null;
//             return Object.fromEntries(
//                 Object.entries(acc).map(([key, value]) => 
//                     typeof value === 'bigint' ? [key, value.toString()] : [key, value]
//                 )
//             );
//         };

//         const formattedAccount = formatAccount(accoutnWithCategorys);

//         res.status(200).send({ message: 'Categoria listada com sucesso.', account: formattedAccount});
//     } catch (error){
//         console.error(error);
//         res.status(500).send({ message: 'Erro ao atulizar informações da conta.' });
//     }
// }

export const createProduct = async (req: Request, res: Response) => {
    const body: CreateProductInterface = req.body

    try {
        const product = await prisma.product.create({
            data: {
                name: body.name,
                price: Number(body.price),
                category: body.category,
                description: body.description
            } 
        })

        res.status(200).send({ message: 'Categoria criada com sucesso.', product: product});
    } catch (error){
        console.error(error);
        res.status(500).send({ message: 'Erro ao atulizar informações da conta.' });
    }
}