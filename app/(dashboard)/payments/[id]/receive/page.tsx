import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function receivePayment(orderId: string, formData: FormData) {
    "use server";

    const amountReceived = Number(
        formData.get("amountReceived") || 0
    );

    const paymentMode = String(
        formData.get("paymentMode") || "BANK"
    );

    const referenceNo = String(
        formData.get("referenceNo") || ""
    );

    const notes = String(
        formData.get("notes") || ""
    );

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) {
        throw new Error("Order not found.");
    }

    const newPaidAmount =
        order.paidAmount + amountReceived;

    await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            paidAmount: newPaidAmount,

            payments: {
                create: {
                    amount: amountReceived,
                    paymentMode,
                    referenceNo,
                    notes,
                },
            },
        },
    });

    redirect(`/orders/${orderId}`);
}

export default async function ReceivePaymentPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            distributor: true,
        },
    });

    if (!order) {
        return notFound();
    }

    const outstanding = order.totalAmount - order.paidAmount;

    const receivePaymentWithId = receivePayment.bind(null, order.id);

    return (
        <div className="mx-auto max-w-xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Receive Payment</h1>
                <p className="mt-1 text-gray-500">
                    Update payment received against this distributor order.
                </p>
            </div>

            <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    <Info label="Order No." value={order.orderNumber} />
                    <Info label="Distributor" value={order.distributor.firmName} />
                    <Info label="Total Amount" value={`₹${order.totalAmount.toFixed(2)}`} />
                    <Info label="Already Paid" value={`₹${order.paidAmount.toFixed(2)}`} />
                    <Info label="Outstanding" value={`₹${outstanding.toFixed(2)}`} danger />
                </div>
            </div>

            <form
                action={receivePaymentWithId}
                className="rounded-2xl border bg-white p-6 shadow-sm"
            >
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount Received
                </label>

                <input
                    name="amountReceived"
                    type="number"
                    min={1}
                    max={outstanding}
                    step="0.01"
                    required
                    placeholder="Enter received amount"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
                />

                <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Payment Mode
                    </label>

                    <select
                        name="paymentMode"
                        required
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
                        placeholder="Optional notes"
                        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <a
                        href="/payments"
                        className="rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </a>

                    <button
                        type="submit"
                        className="rounded-xl bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
                    >
                        Save Payment
                    </button>
                </div>
            </form>
        </div>
    );
}

function Info({
    label,
    value,
    danger,
}: {
    label: string;
    value: string;
    danger?: boolean;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>

            <p
                className={`mt-1 text-lg font-medium ${danger ? "text-red-600" : "text-gray-900"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}