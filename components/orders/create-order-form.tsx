"use client";

import { useMemo, useState } from "react";

type Distributor = {
  id: string;
  firmName: string;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  distributorPrice: number;
  gstPercent: number;
  cartonQty: number;
  moqCartons: number;
};

type Props = {
  distributors: Distributor[];
  products: Product[];
  createOrderAction: (formData: FormData) => void;
};

export function CreateOrderForm({
  distributors,
  products,
  createOrderAction,
}: Props) {
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >({});

  const [shippingAmount, setShippingAmount] = useState(0);

  const [paidAmount, setPaidAmount] = useState(0);

  function updateCartons(productId: string, cartons: number) {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: cartons,
    }));
  }

  const summary = useMemo(() => {
    let subtotal = 0;
    let gstAmount = 0;

    products.forEach((product) => {
      const cartons = selectedProducts[product.id] || 0;

      if (cartons <= 0) return;

      const pieces = cartons * product.cartonQty;

      const lineTotal = pieces * product.distributorPrice;

      const lineGst = (lineTotal * product.gstPercent) / 100;

      subtotal += lineTotal;
      gstAmount += lineGst;
    });

    const grandTotal = subtotal + gstAmount + shippingAmount;

    const outstanding = grandTotal - paidAmount;

    return {
      subtotal,
      gstAmount,
      grandTotal,
      outstanding,
    };
  }, [selectedProducts, products, shippingAmount, paidAmount]);

  return (
    <form
      action={createOrderAction}
      className="grid gap-6 xl:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Distributor
          </label>

          <select
            name="distributorId"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
          >
            <option value="">Select distributor</option>

            {distributors.map((distributor) => (
              <option key={distributor.id} value={distributor.id}>
                {distributor.firmName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Products
            </h2>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Carton Qty</th>
                <th className="px-5 py-4">MOQ</th>
                <th className="px-5 py-4">Cartons</th>
                <th className="px-5 py-4">Pieces</th>
                <th className="px-5 py-4">Line Total</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const cartons = selectedProducts[product.id] || 0;

                const pieces = cartons * product.cartonQty;

                const lineTotal =
                  pieces * product.distributorPrice;

                return (
                  <tr key={product.id} className="border-t">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.sku}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      ₹{product.distributorPrice}
                    </td>

                    <td className="px-5 py-4">
                      {product.cartonQty}
                    </td>

                    <td className="px-5 py-4">
                      {product.moqCartons}
                    </td>

                    <td className="px-5 py-4">
                      <input
                        name={`cartons_${product.id}`}
                        type="number"
                        min={0}
                        defaultValue={0}
                        onChange={(event) =>
                          updateCartons(
                            product.id,
                            Number(event.target.value || 0)
                          )
                        }
                        className="w-24 rounded-lg border px-3 py-2 outline-none focus:border-green-900"
                      />
                    </td>

                    <td className="px-5 py-4">
                      {pieces}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      ₹{lineTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Summary
        </h2>

        <div className="mt-5 space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-medium">
              ₹{summary.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              GST
            </span>

            <span className="font-medium">
              ₹{summary.gstAmount.toFixed(2)}
            </span>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Shipping Amount
            </label>

            <input
              name="shippingAmount"
              type="number"
              min={0}
              step="0.01"
              defaultValue={0}
              onChange={(event) =>
                setShippingAmount(
                  Number(event.target.value || 0)
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-500">
              Paid Amount
            </label>

            <input
              name="paidAmount"
              type="number"
              min={0}
              step="0.01"
              defaultValue={0}
              onChange={(event) =>
                setPaidAmount(
                  Number(event.target.value || 0)
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span className="text-green-900">
                ₹{summary.grandTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Outstanding
              </span>

              <span className="font-semibold text-red-600">
                ₹{summary.outstanding.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
        >
          Save Order
        </button>
      </div>
    </form>
  );
}