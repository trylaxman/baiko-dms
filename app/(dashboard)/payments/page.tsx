import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PaymentsPage() {
    const orders = await prisma.order.findMany({
        include: {
            distributor: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const totalOutstanding = orders.reduce(
        (sum, order) => sum + (order.totalAmount - order.paidAmount),
        0
    );

    const totalPaid = orders.reduce(
        (sum, order) => sum + order.paidAmount,
        0
    );

    const totalBusiness = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="mt-1 text-gray-500">
                    Track distributor payments and outstanding balances.
                </p>
            </div>

            <div className="mb-8 grid gap-5 md:grid-cols-3">
                <StatCard label="Total Business" value={`₹${totalBusiness.toFixed(2)}`} />
                <StatCard label="Total Paid" value={`₹${totalPaid.toFixed(2)}`} />
                <StatCard
                    label="Outstanding"
                    value={`₹${totalOutstanding.toFixed(2)}`}
                    danger
                />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-5 py-4">Order No.</th>
                            <th className="px-5 py-4">Distributor</th>
                            <th className="px-5 py-4">Total</th>
                            <th className="px-5 py-4">Paid</th>
                            <th className="px-5 py-4">Outstanding</th>
                            <th className="px-5 py-4">Payment Status</th>
                            <th className="px-5 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-10 text-center text-gray-500"
                                >
                                    No payment records found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const outstanding = order.totalAmount - order.paidAmount;

                                const paymentStatus =
                                    outstanding <= 0
                                        ? "PAID"
                                        : order.paidAmount > 0
                                            ? "PARTIAL"
                                            : "UNPAID";

                                return (
                                    <tr key={order.id} className="border-t">
                                        <td className="px-5 py-4 font-medium text-green-900">
                                            <Link href={`/orders/${order.id}`}>
                                                {order.orderNumber}
                                            </Link>
                                        </td>

                                        <td className="px-5 py-4">
                                            {order.distributor.firmName}
                                        </td>

                                        <td className="px-5 py-4">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4">
                                            ₹{order.paidAmount.toFixed(2)}
                                        </td>

                                        <td
                                            className={`px-5 py-4 font-medium ${outstanding > 0 ? "text-red-600" : "text-green-900"
                                                }`}
                                        >
                                            ₹{outstanding.toFixed(2)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${paymentStatus === "PAID"
                                                        ? "bg-green-100 text-green-800"
                                                        : paymentStatus === "PARTIAL"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Link
                                                href={`/payments/${order.id}/receive`}
                                                className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                Receive Payment
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
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