"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const payment_utils_1 = require("./payment.utils");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const confirmationService = (transactionId, paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let result;
    let message = "";
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        result = yield prisma_1.default.payment.update({
            where: { id: paymentId },
            data: {
                status: client_1.PaymentStatus.COMPLETED
            }
        });
        const paymentProducts = yield prisma_1.default.paymentProduct.findMany({
            where: {
                paymentId,
            },
            select: {
                productId: true,
                quantity: true,
            }
        });
        const updateProducts = paymentProducts.map((product) => prisma_1.default.product.update({
            where: {
                id: product.productId,
            },
            data: {
                inventoryCount: {
                    decrement: product.quantity,
                },
            },
        }));
        // Execute all updates in parallel
        yield Promise.all(updateProducts);
        message = "Successfully Paid!!!";
        return `
      <html>
        <script>
          window.location.href = 'https://shop-sagaa.netlify.app/checkout/success';
        </script>
      </html>
    `;
    }
    else {
        message = "Payment Failed!!!";
    }
});
exports.PaymentServices = {
    confirmationService,
};
