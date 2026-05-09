import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function DistributorsPage() {
    const distributors = await prisma.distributor.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Distributors</h1>
                    <p className="mt-1 text-gray-500">
                        Manage Baiko city-wise distributors
                    </p>
                </div>

                <Link
                    href="/distributors/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                    <Plus size={18} />
                    Add Distributor
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-5 py-4">Firm</th>
                            <th className="px-5 py-4">Contact</th>
                            <th className="px-5 py-4">Phone</th>
                            <th className="px-5 py-4">City</th>
                            <th className="px-5 py-4">State</th>
                            <th className="px-5 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {distributors.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-gray-500"
                                >
                                    No distributors added yet.
                                </td>
                            </tr>
                        ) : (
                            distributors.map((distributor) => (
                                <tr
                                    key={distributor.id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-5 py-4 font-medium text-green-900">
                                        <Link href={`/distributors/${distributor.id}`}>
                                            {distributor.firmName}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">{distributor.contactName}</td>
                                    <td className="px-5 py-4">{distributor.phone}</td>
                                    <td className="px-5 py-4">{distributor.city}</td>
                                    <td className="px-5 py-4">{distributor.state}</td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                            {distributor.status}
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