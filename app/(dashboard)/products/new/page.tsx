import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "");
  const sku = String(formData.get("sku") || "");
  const category = String(formData.get("category") || "");
  const description = String(formData.get("description") || "");

  const mrp = Number(formData.get("mrp") || 0);
  const distributorPrice = Number(formData.get("distributorPrice") || 0);
  const gstPercent = Number(formData.get("gstPercent") || 18);
  const cartonQty = Number(formData.get("cartonQty") || 0);
  const moqCartons = Number(formData.get("moqCartons") || 0);
  const weightInGram = Number(formData.get("weightInGram") || 0);

  await prisma.product.create({
    data: {
      name,
      sku,
      category,
      description,
      mrp,
      distributorPrice,
      gstPercent,
      cartonQty,
      moqCartons,
      weightInGram,
    },
  });

  redirect("/products");
}

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
        <p className="mt-1 text-gray-500">
          Add Baiko product details, carton quantity and distributor pricing.
        </p>
      </div>

      <form
        action={createProduct}
        className="rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              required
              placeholder="Baiko Bamboo Facial Tissue Box"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              name="sku"
              required
              placeholder="BAIKO-FACIAL-100"
              className="w-full rounded-xl border px-4 py-3 uppercase outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            >
              <option value="">Select category</option>
              <option value="Facial Tissue">Facial Tissue</option>
              <option value="Napkin Tissue">Napkin Tissue</option>
              <option value="Toilet Roll">Toilet Roll</option>
              <option value="Kitchen Towel">Kitchen Towel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              MRP
            </label>
            <input
              name="mrp"
              required
              type="number"
              min={0}
              step="0.01"
              placeholder="125"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Distributor Price
            </label>
            <input
              name="distributorPrice"
              required
              type="number"
              min={0}
              step="0.01"
              placeholder="42"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              GST %
            </label>
            <input
              name="gstPercent"
              required
              type="number"
              min={0}
              step="0.01"
              defaultValue={18}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Carton Qty
            </label>
            <input
              name="cartonQty"
              required
              type="number"
              min={1}
              placeholder="42"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              MOQ Cartons
            </label>
            <input
              name="moqCartons"
              required
              type="number"
              min={1}
              placeholder="5"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Weight Per Unit / Gram
            </label>
            <input
              name="weightInGram"
              type="number"
              min={0}
              step="0.01"
              placeholder="170"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Short product description"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-900"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <a
            href="/products"
            className="rounded-xl border px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="rounded-xl bg-green-900 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}