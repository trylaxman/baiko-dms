import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            distributor: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="mt-1 text-gray-500">
                        Manage distributor orders and dispatch status
                    </p>
                </div>

                <Link
                    href="/orders/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                    <Plus size={18} />
                    Create Order
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-5 py-4">Order No.</th>
                            <th className="px-5 py-4">Distributor</th>
                            <th className="px-5 py-4">Items</th>
                            <th className="px-5 py-4">Total</th>
                            <th className="px-5 py-4">Paid</th>
                            <th className="px-5 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                                    No orders created yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-5 py-4 font-medium text-green-900">
                                        <Link href={`/orders/${order.id}`}>
                                            {order.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">{order.distributor.firmName}</td>
                                    <td className="px-5 py-4">{order.items.length}</td>
                                    <td className="px-5 py-4">₹{order.totalAmount.toFixed(2)}</td>
                                    <td className="px-5 py-4">₹{order.paidAmount.toFixed(2)}</td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                            {order.status}
                                        </span>
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