import prisma from "../../../shared/prisma";

interface MonthlyData {
  [month: string]: number;
}

const getAllOverviewData = async () => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const totalUsers = await transactionClient.user.count();
    const totalShops = await transactionClient.shop.count();
    const totalProducts = await transactionClient.product.count();
    const totalOrders = await transactionClient.payment.count();

    // Get monthly sales data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await transactionClient.paymentProduct.groupBy({
      by: ["paymentId"],
      where: {
        payment: {
          paymentDate: {
            gte: sixMonthsAgo,
          },
          status: "COMPLETED",
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        paymentId: "asc",
      },
    });

    // Transform the data into monthly totals
    const salesByMonth = await transactionClient.payment.findMany({
      where: {
        paymentDate: {
          gte: sixMonthsAgo,
        },
        status: "COMPLETED",
      },
      select: {
        paymentDate: true,
        id: true,
      },
    });

    const monthlyData: MonthlyData = {};
    salesByMonth.forEach((payment) => {
      const month = payment.paymentDate.toLocaleString("default", {
        month: "short",
      });
      const quantity =
        monthlySales.find((sale) => sale.paymentId === payment.id)?._sum
          .quantity || 0;

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += quantity;
    });

    const salesData = Object.entries(monthlyData).map(([month, total]) => ({
      month,
      sales: total,
    }));

    const recentProducts = await transactionClient.product.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(salesData);

    return {
      totalUsers,
      totalShops,
      totalProducts,
      totalOrders,
      recentProducts,
      salesData,
    };
  });

  return result;
};

const getVendorOverviewData = async (vendorId: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const shop = await transactionClient.shop.findUnique({
      where: { vendorId },
    });

    if (!shop) throw new Error("Shop not found");

    const totalProducts = await transactionClient.product.count({
      where: { shopId: shop.id },
    });

    const totalOrders = await transactionClient.paymentProduct.count({
      where: {
        product: { shopId: shop.id },
        payment: { status: "COMPLETED" },
      },
    });

    const totalReviews = await transactionClient.review.count({
      where: {
        product: { shopId: shop.id },
      },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await transactionClient.paymentProduct.groupBy({
      by: ["paymentId"],
      where: {
        product: { shopId: shop.id },
        payment: {
          paymentDate: { gte: sixMonthsAgo },
          status: "COMPLETED",
        },
      },
      _sum: { quantity: true },
      orderBy: { paymentId: "asc" },
    });

    const salesByMonth = await transactionClient.payment.findMany({
      where: {
        paymentDate: { gte: sixMonthsAgo },
        status: "COMPLETED",
        products: { some: { product: { shopId: shop.id } } },
      },
      select: { paymentDate: true, id: true },
    });

    const monthlyData: MonthlyData = {};
    salesByMonth.forEach((payment) => {
      const month = payment.paymentDate.toLocaleString("default", {
        month: "short",
      });
      const quantity =
        monthlySales.find((sale) => sale.paymentId === payment.id)?._sum
          .quantity || 0;
      monthlyData[month] = (monthlyData[month] || 0) + quantity;
    });

    const salesData = Object.entries(monthlyData).map(([month, sales]) => ({
      month,
      sales,
    }));

    const recentProducts = await transactionClient.product.findMany({
      where: { shopId: shop.id },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return {
      totalProducts,
      totalOrders,
      totalReviews,
      recentProducts,
      salesData,
    };
  });

  return result;
};

export const DashboardOverviewServices = {
  getAllOverviewData,
  getVendorOverviewData,
};
