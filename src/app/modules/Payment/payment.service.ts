import { join } from "path";
import { readFileSync } from "fs";
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
    })
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

  // const filePath = join(__dirname, "../../../../public/confirmation.html");
  // let template = readFileSync(filePath, "utf-8");

  // template = template.replace("{{message}}", message);

  // return template;
};

export const PaymentServices = {
  confirmationService,
};
