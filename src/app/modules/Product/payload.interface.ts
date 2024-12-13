interface IProductPayload {
  name: string;
  price: number;
  inventoryCount: number;
  description: string;
  categories: string[];
  isFlashSale?: boolean;
  discount?: number;
}

interface IProductUpdate {
  name: string;
  price: number;
  inventoryCount: number;
  description: string;
  categories: string[];
  flashSalePrice?: number;
}
