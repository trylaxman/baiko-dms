import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function updatePayment(paymentId: string, formData: FormData) {
  "use server";

  const amount = Number(formData.get("amount") || 0);
  const paymentMode = String(formData.get("paymentMode") || "BANK");
  const referenceNo = String(formData.get("referenceNo") || "");
  const notes = String(formData.get("notes") || "");

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      amount,
      paymentMode,
      referenceNo,
      notes,
    },
  });

  const allPayments = await prisma.payment.findMany({
    where: {
      orderId: payment.orderId,
    },
  });

  const newPaidAmount = allPayments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  await prisma.order.update({
    where: {
      id: payment.orderId,
    },
    data: {
      paidAmount: newPaidAmount,
    },
  });

  redirect(`/orders/${payment.orderId}`);
}

export default async function EditPaymentPage({ params }: Props) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    return notFound();
  }

  const updatePaymentWithId = updatePayment.bind(null, payment.id);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Payment</h1>
        <p className="mt-1 text-gray-500">
          Update received payment for order {payment.order.orderNumber}.
        </p>
      </div>

      <form
        action={updatePaymentWithId}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Amount
        </label>

        <input
          name="amount"
          type="number"
          min={1}
          step="0.01"
          required
          defaultValue={payment.amount}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
        />

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Payment Mode
          </label>

          <select
            name="paymentMode"
            required
            defaultValue={payment.paymentMode}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
          >
            <option value="BANK">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Reference Number
          </label>

          <input
            name="referenceNo"
            defaultValue={payment.referenceNo || ""}
            placeholder="UTR / Transaction ID / Cheque No"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes
          </label>

          <textarea
            name="notes"
            rows={3}
            defaultValue={payment.notes || ""}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <a
            href={`/orders/${payment.orderId}`}
            className="rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="rounded-xl bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Update Payment
          </button>
        </div>
      </form>
    </div>
  );
}