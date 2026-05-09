import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Products
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage Baiko products & pricing
                    </p>
                </div>

                <Link
                    href="/products/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-green-900 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">SKU</th>
                            <th className="px-5 py-4">MRP</th>
                            <th className="px-5 py-4">Distributor</th>
                            <th className="px-5 py-4">MOQ</th>
                            <th className="px-5 py-4">Carton Qty</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-10 text-center text-gray-500"
                                >
                                    No products added yet.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-5 py-4 font-medium text-green-900">
                                        <Link href={`/products/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </td>

                                    <td className="px-5 py-4">
                                        {product.sku}
                                    </td>

                                    <td className="px-5 py-4">
                                        ₹{product.mrp}
                                    </td>

                                    <td className="px-5 py-4">
                                        ₹{product.distributorPrice}
                                    </td>

                                    <td className="px-5 py-4">
                                        {product.moqCartons}
                                    </td>

                                    <td className="px-5 py-4">
                                        {product.cartonQty}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            href={`/products/${product.id}/edit`}
                                            className="rounded-lg border px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            Edit
                                        </Link>
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