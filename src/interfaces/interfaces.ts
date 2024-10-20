export interface RegisterAccountInterface {
    name: string;
    email: string;
    phone: BigInt;
    password: string;
}

export interface LoginAccountInterface {
    user: string;
    password: string;
}

export interface AccountInterface {
    id: number;
    name: string;
    email: string;
    phone: BigInt;
    password: string;
    created_at: Date;
}