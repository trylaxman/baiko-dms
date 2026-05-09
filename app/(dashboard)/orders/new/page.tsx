import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateOrderForm } from "@/components/orders/create-order-form";

async function createOrder(formData: FormData) {
  "use server";

  const distributorId = String(formData.get("distributorId") || "");
  const shippingAmount = Number(formData.get("shippingAmount") || 0);
  const paidAmount = Number(formData.get("paidAmount") || 0);

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
  });

  const orderItems = [];

  let subtotal = 0;
  let gstAmount = 0;

  for (const product of products) {
    const cartons = Number(formData.get(`cartons_${product.id}`) || 0);

    if (cartons > 0) {
      const pieces = cartons * product.cartonQty;
      const total = pieces * product.distributorPrice;
      const gst = (total * product.gstPercent) / 100;

      subtotal += total;
      gstAmount += gst;

      orderItems.push({
        productId: product.id,
        cartons,
        pieces,
        unitPrice: product.distributorPrice,
        total,
      });
    }
  }

  if (!distributorId || orderItems.length === 0) {
    throw new Error("Please select distributor and at least one product.");
  }

  const totalAmount = subtotal + gstAmount + shippingAmount;

  const orderNumber = `BAIKO-${Date.now()}`;

  await prisma.order.create({
    data: {
      orderNumber,
      distributorId,
      subtotal,
      gstAmount,
      shippingAmount,
      totalAmount,
      paidAmount,
      items: {
        create: orderItems,
      },
    },
  });

  redirect("/orders");
}

export default async function NewOrderPage() {
  const distributors = await prisma.distributor.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      firmName: "asc",
    },
  });

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
        <p className="mt-1 text-gray-500">
          Create distributor order with live carton and GST calculation.
        </p>
      </div>

      <CreateOrderForm
        distributors={distributors}
        products={products}
        createOrderAction={createOrder}
      />
    </div>
  );
}