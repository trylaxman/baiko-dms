import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DeletePaymentButton } from "@/components/payments/delete-payment-button";
import { OrderStatusForm } from "@/components/orders/order-status-form";
import { revalidatePath } from "next/cache";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

async function deletePayment(paymentId: string) {
    "use server";

    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
    });

    if (!payment) {
        throw new Error("Payment not found.");
    }

    await prisma.payment.delete({
        where: {
            id: paymentId,
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
    revalidatePath(`/orders/${payment.orderId}`);
}

async function updateOrderStatus(formData: FormData) {
    "use server";

    const orderId = String(formData.get("orderId") || "");
    const status = String(formData.get("status") || "PENDING");

    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");
}

export default async function OrderDetailsPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            distributor: true,
            items: {
                include: {
                    product: true,
                },
            },
            payments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!order) {
        return notFound();
    }

    const outstanding = order.totalAmount - order.paidAmount;

    return (
        <div>
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {order.orderNumber}
                    </h1>

                    <p className="mt-1 text-gray-500">Order Details</p>
                </div>

                <OrderStatusForm
                    orderId={order.id}
                    currentStatus={order.status}
                    updateStatusAction={updateOrderStatus}
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Subtotal" value={`₹${order.subtotal.toFixed(2)}`} />

                <StatCard label="GST" value={`₹${order.gstAmount.toFixed(2)}`} />

                <StatCard label="Total" value={`₹${order.totalAmount.toFixed(2)}`} />

                <StatCard
                    label="Outstanding"
                    value={`₹${outstanding.toFixed(2)}`}
                    danger
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
                <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Ordered Products
                        </h2>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-5 py-4">Product</th>
                                <th className="px-5 py-4">Cartons</th>
                                <th className="px-5 py-4">Pieces</th>
                                <th className="px-5 py-4">Unit Price</th>
                                <th className="px-5 py-4">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900">
                                            {item.product.name}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {item.product.sku}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4">{item.cartons}</td>

                                    <td className="px-5 py-4">{item.pieces}</td>

                                    <td className="px-5 py-4">₹{item.unitPrice}</td>

                                    <td className="px-5 py-4 font-medium">
                                        ₹{item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Distributor
                        </h2>

                        <div className="space-y-4">
                            <Info label="Firm" value={order.distributor.firmName} />
                            <Info label="Contact" value={order.distributor.contactName} />
                            <Info label="Phone" value={order.distributor.phone} />
                            <Info label="City" value={order.distributor.city} />
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Payment Summary
                        </h2>

                        <div className="space-y-4">
                            <Info
                                label="Shipping"
                                value={`₹${order.shippingAmount.toFixed(2)}`}
                            />

                            <Info label="Paid" value={`₹${order.paidAmount.toFixed(2)}`} />

                            <Info
                                label="Outstanding"
                                value={`₹${outstanding.toFixed(2)}`}
                                danger
                            />

                            <Info
                                label="Created"
                                value={new Date(order.createdAt).toLocaleDateString()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Payment History
                    </h2>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Amount</th>
                            <th className="px-5 py-4">Mode</th>
                            <th className="px-5 py-4">Reference</th>
                            <th className="px-5 py-4">Notes</th>
                            <th className="px-5 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.payments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-gray-500"
                                >
                                    No payments recorded yet.
                                </td>
                            </tr>
                        ) : (
                            order.payments.map((payment) => (
                                <tr key={payment.id} className="border-t">
                                    <td className="px-5 py-4">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-green-900">
                                        ₹{payment.amount.toFixed(2)}
                                    </td>

                                    <td className="px-5 py-4">{payment.paymentMode}</td>

                                    <td className="px-5 py-4">
                                        {payment.referenceNo || "-"}
                                    </td>

                                    <td className="px-5 py-4">{payment.notes || "-"}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/payments/history/${payment.id}/edit`}
                                                className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                Edit
                                            </Link>

                                            <DeletePaymentButton
                                                action={deletePayment.bind(null, payment.id)}
                                            />
                                        </div>
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
    danger,
}: {
    label: string;
    value: string;
    danger?: boolean;
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>

            <h2
                className={`mt-3 text-3xl font-bold ${danger ? "text-red-600" : "text-green-900"
                    }`}
            >
                {value}
            </h2>
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