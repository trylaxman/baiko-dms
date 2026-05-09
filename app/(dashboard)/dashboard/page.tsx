import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    const [
        totalDistributors,
        activeCities,
        orders,
    ] = await Promise.all([
        prisma.distributor.count(),
        prisma.distributor.findMany({
            select: {
                city: true,
            },
            distinct: ["city"],
            where: {
                status: "ACTIVE",
            },
        }),
        prisma.order.findMany({
            select: {
                totalAmount: true,
                paidAmount: true,
                createdAt: true,
            },
        }),
    ]);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySales = orders
        .filter((order) => {
            const orderDate = new Date(order.createdAt);

            return (
                orderDate.getMonth() === currentMonth &&
                orderDate.getFullYear() === currentYear
            );
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);

    const outstanding = orders.reduce(
        (sum, order) => sum + (order.totalAmount - order.paidAmount),
        0
    );

    const stats = [
        {
            label: "Total Distributors",
            value: totalDistributors.toString(),
        },
        {
            label: "Active Cities",
            value: activeCities.length.toString(),
        },
        {
            label: "Monthly Sales",
            value: `₹${monthlySales.toFixed(0)}`,
        },
        {
            label: "Outstanding",
            value: `₹${outstanding.toFixed(0)}`,
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-500">
                    Baiko distributor operations overview
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border bg-white p-6 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{item.label}</p>

                        <h2
                            className={`mt-3 text-3xl font-bold ${item.label === "Outstanding"
                                    ? "text-red-600"
                                    : "text-green-900"
                                }`}
                        >
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}