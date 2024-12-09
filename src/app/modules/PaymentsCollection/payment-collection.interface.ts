export interface IPaymentPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  userId: string;
  totalPrice: number;
  products: any;
}
