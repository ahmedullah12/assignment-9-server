interface ICreateShop {
    name: string;
    description: string;
}

interface IUpdateShop {
    name?: string;
    description?: string;
    logoUrl?: string;
}