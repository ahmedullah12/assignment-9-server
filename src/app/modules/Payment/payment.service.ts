import { verifyPayment } from "./payment.utils";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const confirmationService = async (
  transactionId: string,
  paymentId: string
) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = "";

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    result = await prisma.payment.update({
      where: {id: paymentId},
      data: {
        status: PaymentStatus.COMPLETED
      }
    });

    const paymentProducts = await prisma.paymentProduct.findMany({
      where: {
        paymentId,
      },
      select: {
        productId: true,
        quantity: true,
      }
    })
    
    const updateProducts = paymentProducts.map((product) =>
      prisma.product.update({
        where: {
          id: product.productId,
        },
        data: {
          inventoryCount: {
            decrement: product.quantity,
          },
        },
      })
    );

    // Execute all updates in parallel
    await Promise.all(updateProducts);

    message = "Successfully Paid!!!";

    return `
      <html>
        <script>
          window.location.href = 'http://localhost:3000/checkout/success';
        </script>
      </html>
    `;
  } else {
    message = "Payment Failed!!!";
  }
};

export const PaymentServices = {
  confirmationService,
};
