import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  const totalCartonsSold = product.orderItems.reduce(
    (sum, item) => sum + item.cartons,
    0
  );

  const totalPiecesSold = product.orderItems.reduce(
    (sum, item) => sum + item.pieces,
    0
  );

  const totalSales = product.orderItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const distributorMarginAmount =
    product.mrp - product.distributorPrice;

  const distributorMarginPercent =
    product.mrp > 0
      ? (distributorMarginAmount / product.mrp) * 100
      : 0;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-1 text-gray-500">
            SKU: {product.sku}
          </p>
        </div>

        <Link
          href={`/products/${product.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          <Pencil size={18} />
          Edit Product
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRP" value={`₹${product.mrp.toFixed(2)}`} />

        <StatCard
          label="Distributor Price"
          value={`₹${product.distributorPrice.toFixed(2)}`}
        />

        <StatCard
          label="Carton Qty"
          value={product.cartonQty.toString()}
        />

        <StatCard
          label="MOQ Cartons"
          value={product.moqCartons.toString()}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Product Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Info label="Category" value={product.category} />

            <Info label="GST %" value={`${product.gstPercent}%`} />

            <Info
              label="Weight / Unit"
              value={
                product.weightInGram
                  ? `${product.weightInGram}g`
                  : "-"
              }
            />

            <Info label="Status" value={product.status} />

            <Info
              label="Distributor Margin"
              value={`₹${distributorMarginAmount.toFixed(
                2
              )} (${distributorMarginPercent.toFixed(1)}%)`}
            />

            <Info
              label="Created"
              value={new Date(product.createdAt).toLocaleDateString()}
            />

            <div className="md:col-span-2">
              <Info
                label="Description"
                value={product.description || "-"}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <StatCard
            label="Total Orders"
            value={product.orderItems.length.toString()}
          />

          <StatCard
            label="Cartons Sold"
            value={totalCartonsSold.toString()}
          />

          <StatCard
            label="Pieces Sold"
            value={totalPiecesSold.toString()}
          />

          <StatCard
            label="Product Sales"
            value={`₹${totalSales.toFixed(2)}`}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Order History
          </h2>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-5 py-4">Order No.</th>
              <th className="px-5 py-4">Cartons</th>
              <th className="px-5 py-4">Pieces</th>
              <th className="px-5 py-4">Unit Price</th>
              <th className="px-5 py-4">Total</th>
            </tr>
          </thead>

          <tbody>
            {product.orderItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No orders found for this product.
                </td>
              </tr>
            ) : (
              product.orderItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-5 py-4 font-medium text-green-900">
                    <Link href={`/orders/${item.order.id}`}>
                      {item.order.orderNumber}
                    </Link>
                  </td>

                  <td className="px-5 py-4">{item.cartons}</td>

                  <td className="px-5 py-4">{item.pieces}</td>

                  <td className="px-5 py-4">₹{item.unitPrice}</td>

                  <td className="px-5 py-4 font-medium">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>

      <h2 className="mt-3 text-3xl font-bold text-green-900">
        {value}
      </h2>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-lg font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}